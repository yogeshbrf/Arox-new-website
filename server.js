require('dotenv').config();

const express = require('express');
const path = require('path');
const os = require('os');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const appConfig = require('./erp/config/app');
const { initDb, closeDb, getDb } = require('./erp/config/database');
const errorHandler = require('./erp/middleware/errorHandler');
const logger = require('./erp/utils/logger');
const settingsService = require('./erp/services/settingsService');

const app = express();
const PORT = process.env.PORT || appConfig.port || 3000;

app.set('trust proxy', 1);

// ----- EJS View Engine (for ERP Portals) -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'erp', 'views'));
app.use(expressLayouts);
app.set('layout', false);
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('view cache', process.env.NODE_ENV === 'production');

// ----- Core Middleware -----
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Prevent well-known 404s
app.get('/.well-known/*', (req, res) => res.status(204).end());

// ----- Static Assets (Served instantly with no DB dependency) -----
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
  lastModified: true
};

// Marketing Website Assets
app.use('/css', express.static(path.join(__dirname, 'css'), staticOptions));
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), staticOptions));
app.use('/js', express.static(path.join(__dirname, 'js'), staticOptions));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), staticOptions));
app.use('/images', express.static(path.join(__dirname, 'images'), staticOptions));
app.use('/images', express.static(path.join(__dirname, 'public', 'images'), staticOptions));
app.use('/images', express.static(path.join(__dirname, 'public', 'assets'), staticOptions));
app.use('/components', express.static(path.join(__dirname, 'components'), staticOptions));
app.use('/documents', express.static(path.join(__dirname, 'documents'), staticOptions));
app.use('/public', express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/syllabus', express.static(path.join(__dirname, 'public', 'syllabus'), staticOptions));
app.use('/syllabi', express.static(path.join(__dirname, 'syllabi'), staticOptions));
app.use('/service-video', express.static(path.join(__dirname, 'service-video'), staticOptions));
app.use('/service-video', express.static(path.join(__dirname, 'public', 'service-video'), staticOptions));

// ERP & Generator Static Assets
app.use('/erp-assets', express.static(path.join(__dirname, 'erp', 'public'), staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'erp', 'public', 'uploads'), staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'erp', 'uploads'), staticOptions));
app.use('/cert', express.static(path.join(__dirname, 'erp', 'cert'), staticOptions));
app.use('/attendance', express.static(path.join(__dirname, 'erp', 'attendance'), staticOptions));
app.use('/offerletter', express.static(path.join(__dirname, 'erp', 'offerletter'), staticOptions));
app.use('/project', express.static(path.join(__dirname, 'erp', 'project'), staticOptions));

// ==========================================
// Marketing Website Public HTML Pages
// ==========================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get(['/about', '/about.html'], (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get(['/services', '/services.html'], (req, res) => res.sendFile(path.join(__dirname, 'services.html')));
app.get(['/courses', '/courses.html', '/training', '/training.html'], (req, res) => res.sendFile(path.join(__dirname, 'training.html')));
app.get(['/contact', '/contact.html'], (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get(['/apply', '/apply.html'], (req, res) => res.sendFile(path.join(__dirname, 'apply.html')));
app.get(['/detail', '/detail.html', '/course/:slug', '/training/:slug', '/internship/:slug'], (req, res) => res.sendFile(path.join(__dirname, 'detail.html')));
app.get(['/internships', '/internships.html'], (req, res) => res.redirect('/training.html?tab=internship#hscrollSection'));
app.get('/footer.html', (req, res) => res.sendFile(path.join(__dirname, 'footer.html')));

// Auth & Navigation Pages
app.get(['/login', '/login.html'], (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get(['/signup', '/signup.html', '/register'], (req, res) => res.redirect('/login.html#register'));
app.get('/portal', (req, res) => res.redirect('/login'));

app.get('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.clearCookie('admin_token', { path: '/' });
  res.clearCookie('employee_token', { path: '/' });
  res.clearCookie('student_token', { path: '/' });
  res.redirect('/login');
});

app.get('/verify-certificate', (req, res) => res.redirect('/cert/index.html'));

// ==========================================
// Database Initialization Guard for ERP & APIs
// ==========================================
let isDbReady = false;
let dbInitPromise = null;

async function ensureDatabase() {
  if (isDbReady) return;
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
        await initDb();
        try {
          const { migrate } = require('./erp/database/migrate');
          migrate();
        } catch (mErr) {
          logger.warn('Migration notice:', mErr.message);
        }
        isDbReady = true;
      } catch (dbErr) {
        dbInitPromise = null;
        logger.error('Database initialization failed:', dbErr);
        throw dbErr;
      }
    })();
  }
  return dbInitPromise;
}

// Database middleware applied ONLY to ERP APIs and portal routes
app.use(['/api', '/admin', '/employee', '/student'], async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (err) {
    logger.error('Database connection error on ' + req.path + ':', err);
    res.status(500).json({
      error: 'Database service unavailable',
      message: err.message || 'SQLite initialization failed'
    });
  }
});

// Organization settings & view locals for ERP Views
app.use(['/admin', '/employee', '/student'], (req, res, next) => {
  try {
    res.locals.org = settingsService.getOrgSettings();
  } catch (e) {
    res.locals.org = appConfig.org;
  }
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  next();
});

// ==========================================
// ERP API Routes
// ==========================================
app.use('/api/auth', require('./erp/routes/api/auth'));
app.use('/api/courses', require('./erp/routes/api/courses'));
app.use('/api/registrations', require('./erp/routes/api/registrations'));
app.use('/api/payments', require('./erp/routes/api/payments'));
app.use('/api/student', require('./erp/routes/api/student'));
app.use('/api/employee', require('./erp/routes/api/employee'));
app.use('/api/sync', require('./erp/routes/api/sync'));
app.use('/api/referrals', require('./erp/routes/api/referrals'));
app.use('/api/reviews', require('./erp/routes/api/reviews'));
app.use('/api/call-reports', require('./erp/routes/api/callReports'));

// Generator API for students list & attendance
app.get('/api/students', (req, res) => {
  try {
    const db = getDb();
    const students = db.prepare(`
      SELECT 
        s.id as db_id,
        s.student_id as id,
        (s.first_name || ' ' || s.last_name) as name,
        s.department,
        s.college as collegeName,
        s.year_of_study as year,
        s.status as student_status,
        c.title as internship,
        c.trainer_name as trainerName
      FROM students s
      LEFT JOIN registrations r ON r.student_id = s.id
      LEFT JOIN courses c ON r.course_id = c.id
      ORDER BY s.first_name ASC
    `).all();

    const attendances = db.prepare(`
      SELECT student_id, date, status 
      FROM attendance
    `).all();

    const attendanceMap = {};
    attendances.forEach(a => {
      if (!attendanceMap[a.student_id]) {
        attendanceMap[a.student_id] = [];
      }
      attendanceMap[a.student_id].push({
        date: a.date,
        status: (a.status || 'present').toUpperCase()
      });
    });

    const formatted = students.map(s => ({
      id: s.id,
      name: s.name,
      department: s.department || 'N/A',
      collegeName: s.collegeName || 'N/A',
      year: s.year || 'Final Year',
      internship: s.internship || 'Internship Candidate',
      trainerName: s.trainerName || 'Arox Mentor',
      status: (s.student_status || 'active').toUpperCase(),
      attendances: attendanceMap[s.db_id] || []
    }));

    res.json(formatted);
  } catch (error) {
    logger.error('API /api/students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Certificate API
app.post('/api/certificates', (req, res) => {
  try {
    const { certId, studentName } = req.body;
    logger.info(`Certificate issued/saved: ${certId} for ${studentName}`);
    res.json({ success: true, message: 'Certificate recorded successfully', certId });
  } catch (error) {
    logger.error('API /api/certificates error:', error);
    res.status(500).json({ success: false, error: 'Failed to save certificate record' });
  }
});

// ==========================================
// ERP Web Portal Routes
// ==========================================
app.use('/admin', require('./erp/routes/web/admin'));
app.use('/employee', require('./erp/routes/web/employee'));
app.use('/student', require('./erp/routes/web/student'));

// 404 Handler
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

// ==========================================
// Server Startup (Local & Self-Hosted)
// ==========================================
function getLanAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

function startListening(port, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    const srv = app.listen(port, '0.0.0.0', () => {
      const lanIps = getLanAddresses();
      const networkUrl = lanIps.length > 0 ? `http://${lanIps[0]}:${port}` : `http://0.0.0.0:${port}`;
      console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║     🚀  AROX Unified Website & ERP Server Running        ║
  ║                                                          ║
  ║     Port:      ${port}                                      ║
  ║     Website:   http://localhost:${port}                      ║
  ║     Admin:     http://localhost:${port}/admin                ║
  ║     Employee:  http://localhost:${port}/employee             ║
  ║     Student:   http://localhost:${port}/student              ║
  ║     Network:   ${networkUrl}                      ║
  ║                                                          ║
  ║     Vercel Serverless Ready | 100% Integrated Platform   ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
      `);
      resolve(srv);
    });

    srv.on('error', (err) => {
      const nextPort = parseInt(port, 10) + 1;
      if (err.code === 'EADDRINUSE' && maxAttempts > 0) {
        logger.warn(`Port ${port} in use, trying ${nextPort}...`);
        startListening(nextPort, maxAttempts - 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

let runningServer = null;

if (require.main === module && !process.env.VERCEL) {
  (async () => {
    try {
      await ensureDatabase();
      runningServer = await startListening(PORT);
    } catch (err) {
      logger.error('Failed to start server:', err);
      process.exit(1);
    }
  })();
}

// Graceful shutdown
process.on('SIGINT', () => {
  if (runningServer) runningServer.close();
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (runningServer) runningServer.close();
  closeDb();
  process.exit(0);
});

module.exports = app;
