const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const employeeController = require('../../controllers/employeeController');

// All employee routes require authentication and staff/trainer/employee or admin access
router.use(authenticate);
router.use(roleGuard('employee', 'trainer', 'staff', 'admin', 'super_admin'));

// 0. Overview & Dashboard
router.get('/', (req, res) => res.redirect('/employee/dashboard'));
router.get('/dashboard', employeeController.dashboard);

// 1. Leads (Internships, Clients, Sales Pipeline, Tasks)
router.get('/internships', employeeController.internships);
router.get('/clients', employeeController.clients);
router.get('/find-clients', (req, res) => res.redirect('/employee/clients'));
router.get('/leads', employeeController.leads);
router.get(['/follow-ups', '/followups'], employeeController.followUps);
router.get('/tasks', employeeController.tasks);
router.get('/performance', employeeController.performance);

// 2. Call Reports
router.get('/call-reports', employeeController.callReports);

// 3. Contacts
router.get('/contacts', employeeController.contacts);

// 4. Reviews & Rating
router.get('/reviews', employeeController.reviews);

// 5. Settings & Profile
router.get('/profile', employeeController.profile);
router.get('/settings', employeeController.settings);

// Student directory inquiry
router.get('/students', employeeController.students);

module.exports = router;
