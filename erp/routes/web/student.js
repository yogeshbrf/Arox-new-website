const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');

// Controllers
const dashboardController = require('../../controllers/student/dashboardController');
const coursesController = require('../../controllers/student/coursesController');
const paymentsController = require('../../controllers/student/paymentsController');
const profileController = require('../../controllers/student/profileController');
const attendanceController = require('../../controllers/student/attendanceController');
const reviewsController = require('../../controllers/student/reviewsController');

// Secure all student routes
router.use(authenticate);
router.use(roleGuard('student', 'admin', 'super_admin'));

// 0. Overview Dashboard
router.get('/', (req, res) => res.redirect('/student/dashboard'));
router.get('/dashboard', dashboardController.index);

// 1. My Course
router.get('/courses', coursesController.index);
router.get('/courses/:id', coursesController.show);

// 2. Payment (Read-only for students)
router.get('/payments', paymentsController.index);

// 3. Attendance
router.get('/attendance', attendanceController.index);

// 4. Reviews & Rating
router.get('/reviews', reviewsController.index);

// 5. Settings & Profile
router.get('/settings', profileController.index);
router.get('/profile', (req, res) => res.redirect('/student/settings'));

// Documents & Certificates (redirect to courses where certs are accessed)
router.get('/documents', (req, res) => res.redirect('/student/courses'));
router.get('/certificates', (req, res) => res.redirect('/student/courses'));

module.exports = router;
