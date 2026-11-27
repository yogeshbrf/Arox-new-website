const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const appConfig = require('./config/app');
const { initDb, closeDb } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
app.set('trust proxy', 1);

// ----- View Engine -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', false);
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('view cache', true);

// ----- Core Middleware -----
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ----- Static Files (ERP Assets & Generators) with Live Refresh -----
const staticOptions = {
  maxAge: 0,
  etag: true,
  lastModified: true
};

app.use('/erp-assets', express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/public', express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticOptions));
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), staticOptions));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), staticOptions));
app.use('/images', express.static(path.join(__dirname, 'public', 'images'), staticOptions));
app.use('/images', express.static(path.join(__dirname, 'public', 'assets'), staticOptions));
app.use('/images', express.static(path.join(__dirname, '..', 'images'), staticOptions));
app.use(express.static(path.join(__dirname, 'public'), { redirect: false, ...staticOptions }));
app.use(express.static(path.join(__dirname, '..'), { redirect: false, ...staticOptions }));

// Well-known and devtools handler to prevent 404 console errors
app.get('/.well-known/*', (req, res) => res.status(204).end());

// Generator static folders (robust multi-path resolution)
const serveGeneratorFolder = (routePrefix, folderName) => {
  const candidatePaths = [
    path.join(__dirname, '..', folderName),
    path.join(__dirname, folderName),
    path.join(__dirname, '..', 'arox-' + folderName),
    path.join(__dirname, 'public', folderName)
  ];
  candidatePaths.forEach(p => {
    app.use(routePrefix, express.static(p));
  });
};

serveGeneratorFolder('/cert', 'cert');
serveGeneratorFolder('/attendance', 'attendance');
serveGeneratorFolder('/offerletter', 'offerletter');
serveGeneratorFolder('/project', 'project');

// Only serve specific static folders (assets, css, js, uploads) - website root html is completely removed


// ----- Make org config available to all views -----
const settingsService = require('./services/settingsService');
app.use((req, res, next) => {
  res.locals.erpIcon = require('./utils/erpIcons').getIcon;
  try {
    res.locals.org = settingsService.getOrgSettings();
    res.locals.paymentConfig = settingsService.getPaymentSettings();
  } catch (e) {
    res.locals.org = appConfig.org;
  }
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  next();
});

// ----- Routes -----
// API routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/courses', require('./routes/api/courses'));
app.use('/api/registrations', require('./routes/api/registrations'));
app.use('/api/payments', require('./routes/api/payments'));
app.use('/api/student', require('./routes/api/student'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/employee', require('./routes/api/employee'));
app.use('/api/sync', require('./routes/api/sync'));
app.use('/api/referrals', require('./routes/api/referrals'));
app.use('/api/reviews', require('./routes/api/reviews'));
app.use('/api/call-reports', require('./routes/api/callReports'));

// Standalone Generators API
app.get('/api/students', (req, res) => {
  try {
    const { getDb } = require('./config/database');
    const db = getDb();
    
    // Query students joined with registrations and courses
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

    // Query attendances for all students
    const attendances = db.prepare(`
      SELECT student_id, date, status 
      FROM attendance
    `).all();

    // Map attendances by student database ID
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

    // Format the result array
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
    console.error('API /api/students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Certificate API
app.post('/api/certificates', (req, res) => {
  try {
    const { certId, studentName, course, domain, startDate, endDate, totalDays, issueDate } = req.body;
    logger.info(`Certificate issued/saved: ${certId} for ${studentName}`);
    res.json({ success: true, message: 'Certificate recorded successfully', certId });
  } catch (error) {
    logger.error('API /api/certificates error:', error);
    res.status(500).json({ success: false, error: 'Failed to save certificate record' });
  }
});

// Web (page) routes
app.use('/admin', require('./routes/web/admin'));
app.use('/employee', require('./routes/web/employee'));
app.use('/student', require('./routes/web/student'));
app.use('/', require('./routes/web/auth'));

// ----- 404 Handler -----
app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.statusCode = 404;
  next(err);
});

// ----- Error Handling -----
app.use(errorHandler);

// ----- Start Server (async for sql.js init) -----
const PORT = appConfig.port || 3000;
let runningServer = null;

const os = require('os');

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
    const server = app.listen(port, '0.0.0.0', () => {
      const lanIps = getLanAddresses();
      const networkUrl = lanIps.length > 0 ? `http://${lanIps[0]}:${port}` : `http://0.0.0.0:${port}`;
      logger.info(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║     🚀  AROX ERP Server Running (Cross-System Ready)     ║
  ║                                                          ║
  ║     Port:      ${port}                                      ║
  ║     Local:     http://localhost:${port}                      ║
  ║     Network:   ${networkUrl}                      ║
  ║                                                          ║
  ║     All 3 panels (Admin, Employee, Student) can be       ║
  ║     accessed simultaneously on 1 machine or across LAN!  ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
      `);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && maxAttempts > 0) {
        logger.warn(`⚠️ Port ${port} is currently in use. Trying port ${port + 1}...`);
        startListening(port + 1, maxAttempts - 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function startServer() {
  try {
    // Initialize sql.js (async WASM loading)
    await initDb();
    logger.info('✅ Database initialized.');

    // Run migrations
    const { migrate } = require('./database/migrate');
    migrate();

    // Start listening with automatic port fallback
    runningServer = await startListening(PORT);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
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
