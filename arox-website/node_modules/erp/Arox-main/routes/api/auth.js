const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { authenticate } = require('../../middleware/auth');
const { loginRules, validate } = require('../../middleware/validation');
const { loginLimiter } = require('../../middleware/rateLimiter');

// POST /api/auth/login (with rate limiting)
router.post('/login', loginLimiter, loginRules, validate, authController.login);

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.clearCookie('admin_token', { path: '/' });
  res.clearCookie('employee_token', { path: '/' });
  res.clearCookie('student_token', { path: '/' });
  // If form submission (not AJAX), redirect to home
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    return res.redirect('/');
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me (protected)
router.get('/me', authenticate, authController.me);

// POST /api/auth/change-password (protected - works for all panels)
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
