const express = require('express');
const router = express.Router();
const path = require('path');
const pageController = require('../../controllers/pageController');
const { optionalAuth } = require('../../middleware/auth');

const rootDir = path.resolve(__dirname, '../../..');

// Root entry point:
// If authenticated, automatically redirects to respective dashboard.
// If not authenticated, renders the Apple-style Login/Signup portal.
router.get('/', optionalAuth, (req, res) => {
  if (req.user) {
    if (['admin', 'super_admin'].includes(req.user.role)) {
      return res.redirect('/admin/dashboard');
    }
    if (['employee', 'trainer', 'staff'].includes(req.user.role)) {
      return res.redirect('/employee/dashboard');
    }
    return res.redirect('/student/dashboard');
  }
  return pageController.login(req, res);
});

// Sample Internship Page (Direct route, sample page, and course aliases)
router.get(['/internships', '/internships.html', '/sample-internship', '/courses', '/courses.html', '/training'], (req, res) => {
  res.sendFile(path.join(rootDir, 'internships.html'));
});

// Certificate Verification Tool
router.get('/verify-certificate', (req, res) => res.redirect('/cert/index.html'));

// ERP Login & Signup Portal (supports both /login and /login.html)
router.get(['/login', '/login.html'], optionalAuth, pageController.login);
router.get(['/signup', '/signup.html'], optionalAuth, (req, res) => res.redirect('/login#register'));
router.get('/register', (req, res) => res.redirect('/signup'));

// Logout route: clears cookie session and immediately returns to login page
router.get('/logout', (req, res) => {
  const referer = req.headers.referer || '';
  if (referer.includes('/admin') || req.query.role === 'admin') {
    res.clearCookie('admin_token', { path: '/' });
  } else if (referer.includes('/employee') || req.query.role === 'employee') {
    res.clearCookie('employee_token', { path: '/' });
  } else if (referer.includes('/student') || req.query.role === 'student') {
    res.clearCookie('student_token', { path: '/' });
  } else {
    res.clearCookie('token', { path: '/' });
    res.clearCookie('admin_token', { path: '/' });
    res.clearCookie('employee_token', { path: '/' });
    res.clearCookie('student_token', { path: '/' });
  }
  res.redirect('/login');
});

// Other legacy website routes redirect to /internships
router.get(['/about', '/about.html', '/contact', '/contact.html', '/apply', '/apply.html', 
            '/services', '/services.html', '/course/:slug'], (req, res) => {
  res.redirect('/internships');
});

module.exports = router;
