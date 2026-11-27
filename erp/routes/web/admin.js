const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');

// Controllers
const dashboardController = require('../../controllers/admin/dashboardController');
const usersController = require('../../controllers/admin/usersController');
const studentsController = require('../../controllers/admin/studentsController');
const coursesController = require('../../controllers/admin/coursesController');
const registrationsController = require('../../controllers/admin/registrationsController');
const registrationController = require('../../controllers/registrationController');
const paymentsController = require('../../controllers/admin/paymentsController');
const adminAttendanceController = require('../../controllers/admin/attendanceController');
const crmController = require('../../controllers/admin/crmController');
const referralsController = require('../../controllers/admin/referralsController');
const reviewsController = require('../../controllers/admin/reviewsController');
const employeeController = require('../../controllers/employeeController');

// Apply auth and roleGuard to all admin routes
router.use(authenticate);
router.use(roleGuard('admin', 'super_admin'));

// Helper: load students list for generators
function loadStudentsList() {
  try {
    const { getDb } = require('../../config/database');
    const db = getDb();
    return db.prepare(`
      SELECT 
        s.id, s.student_id, s.first_name, s.last_name, s.email, s.college, s.department,
        r.batch_name, r.status as reg_status, c.title as course_title, c.start_date, c.end_date
      FROM students s
      LEFT JOIN registrations r ON r.student_id = s.id
      LEFT JOIN courses c ON r.course_id = c.id
      ORDER BY s.first_name ASC
    `).all();
  } catch (e) {
    console.error('loadStudentsList error:', e);
    return [];
  }
}

// --- Dashboard & Reports ---
router.get('/dashboard', dashboardController.overview);
router.get('/reports', crmController.reports);

// --- Students (Submenu) ---
router.get('/students', studentsController.index);
router.get('/students/:id', studentsController.show);
router.post('/students', studentsController.create);
router.put('/students/:id', studentsController.update);
router.post('/students/:id', studentsController.update);
router.delete('/students/:id', studentsController.delete);
router.get(['/internships', '/registrations'], registrationsController.internshipsIndex);

// --- Referrals ---
router.get('/referrals', referralsController.index);

// --- Reviews ---
router.get('/reviews', reviewsController.index);

// --- Courses ---
router.get('/courses', coursesController.index);
router.get('/courses/new', (req, res) => res.redirect('/admin/courses'));
router.get('/courses/:id/edit', (req, res) => res.redirect('/admin/courses'));
router.post('/courses', coursesController.create);
router.put('/courses/:id', coursesController.update);
router.put('/courses/:id/status', coursesController.updateStatus);
router.delete('/courses/:id', coursesController.delete);

// --- Registrations (Legacy view & details) ---
router.get('/registrations/:id', registrationsController.show);
router.put('/registrations/:id/status', registrationsController.updateStatus);
router.post('/registrations/:id/status', registrationsController.updateStatus);
router.put('/registrations/:id', registrationController.update);
router.post('/registrations/:id', registrationController.update);

// --- Payments ---
router.get('/payments', paymentsController.index);

// --- Live Attendance Management ---
router.get('/attendance', adminAttendanceController.renderPage);

// ============================================================
// GENERATORS - Individual Pages
// ============================================================

// Certificate Generator
router.get('/generators/certificate', (req, res) => {
  res.render('admin/generators/certificate', {
    layout: 'layouts/admin',
    pageTitle: 'Certificate Generator',
    user: req.user,
    students: loadStudentsList()
  });
});

// Offer Letter Generator
router.get(['/generators/offer-letter', '/generators/offerletter'], (req, res) => {
  res.render('admin/generators/offerletter', {
    layout: 'layouts/admin',
    pageTitle: 'Offer Letter Generator',
    user: req.user,
    students: loadStudentsList()
  });
});

// Attendance Generator
router.get('/generators/attendance', (req, res) => {
  res.render('admin/generators/attendance', {
    layout: 'layouts/admin',
    pageTitle: 'Attendance Generator',
    user: req.user,
    students: loadStudentsList()
  });
});

// Project Generator
router.get('/generators/project', (req, res) => {
  res.render('admin/generators/project', {
    layout: 'layouts/admin',
    pageTitle: 'Project Generator',
    user: req.user,
    students: loadStudentsList()
  });
});

// Legacy Document Hub redirect
router.get('/document-hub', (req, res) => {
  res.redirect('/admin/generators/certificate');
});

// ============================================
// EMPLOYEE & CRM (Admin Management)
// ============================================
router.get('/employees', usersController.employeesIndex);
router.post('/employees', roleGuard('admin', 'super_admin'), usersController.create);
router.put('/employees/:id', roleGuard('admin', 'super_admin'), usersController.update);
router.delete('/employees/:id', roleGuard('admin', 'super_admin'), usersController.delete);
router.get('/staff', (req, res) => res.redirect('/admin/employees'));

router.get('/clients', crmController.clients);
router.post('/clients', roleGuard('admin', 'super_admin'), employeeController.createClient);
router.put('/clients/:id', roleGuard('admin', 'super_admin'), employeeController.updateClient);
router.delete('/clients/:id', roleGuard('admin', 'super_admin'), employeeController.deleteClient);

router.get('/leads', crmController.leads);
router.get(['/follow-ups', '/followups'], crmController.followUps);

router.get('/tasks', crmController.tasks);
router.post('/tasks', roleGuard('admin', 'super_admin'), employeeController.createTask);
router.put('/tasks/:id', roleGuard('admin', 'super_admin'), employeeController.updateTask);
router.put('/tasks/:id/status', roleGuard('admin', 'super_admin'), employeeController.updateTaskStatus);
router.delete('/tasks/:id', roleGuard('admin', 'super_admin'), employeeController.deleteTask);
router.get('/performance', crmController.performance);
router.post('/performance/targets', crmController.setTarget);

// ============================================================
// SYSTEM & SETTINGS (Admin Only)
// ============================================================
router.get('/users', roleGuard('admin', 'super_admin'), usersController.index);
router.post('/users', roleGuard('admin', 'super_admin'), usersController.create);
router.put('/users/:id', roleGuard('admin', 'super_admin'), usersController.update);
router.put('/users/:id/status', roleGuard('admin', 'super_admin'), usersController.updateStatus);
router.delete('/users/:id', roleGuard('admin', 'super_admin'), usersController.delete);

router.get('/settings', roleGuard('admin', 'super_admin'), crmController.settings);
router.post('/settings/update', roleGuard('admin', 'super_admin'), crmController.updateSettings);
router.put('/settings/update', roleGuard('admin', 'super_admin'), crmController.updateSettings);
router.post('/settings', roleGuard('admin', 'super_admin'), crmController.updateSettings);
router.put('/settings', roleGuard('admin', 'super_admin'), crmController.updateSettings);

router.get('/profile', crmController.profile);
router.post('/profile', crmController.updateProfile);
router.put('/profile', crmController.updateProfile);

module.exports = router;
