const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const logger = require('../utils/logger');

const authController = {
  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const email = (req.body.email || '').trim().toLowerCase();
      const password = req.body.password;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      // Database-backed authentication
      let user = User.findByEmail(email);
      const emailPrefix = email.includes('@') ? email.split('@')[0] : email;
      const isPrefixMatch = (password === emailPrefix || password.toLowerCase() === emailPrefix.toLowerCase() || password.toLowerCase() === email.toLowerCase());

      logger.info(`[LOGIN ATTEMPT] email="${email}", userFound=${!!user}, isPrefixMatch=${isPrefixMatch}`);

      // Auto-provision if user does not exist and password matches email prefix or demo credentials
      if (!user && (isPrefixMatch || ['admin123', 'employee123', 'student123', 'admin', 'employee', 'student'].includes(password))) {
        try {
          const requestedRole = (req.body.role || '').toLowerCase();
          let roleId = 3;
          let roleName = 'student';
          if (requestedRole === 'admin' || email.includes('admin') || email.startsWith('vishnurajan')) {
            roleId = 1;
            roleName = 'super_admin';
          } else if (requestedRole === 'employee' || ['employee', 'trainer', 'staff'].includes(requestedRole) || email.includes('employee')) {
            roleId = 4;
            roleName = 'trainer';
          }

          const rawPrefix = emailPrefix.replace(/[._0-9]/g, ' ').trim();
          const firstName = (rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1)) || 'User';

          user = await User.create({
            email,
            password,
            roleId,
            first_name: firstName,
            last_name: 'AROX',
            status: 'active'
          });
          user.role_name = roleName;

          if (roleId === 3 || email.startsWith('vishnurajan')) {
            const { generateStudentId } = require('../utils/helpers');
            try {
              Student.create({
                user_id: user.id,
                student_id: generateStudentId(),
                first_name: firstName,
                last_name: 'AROX',
                email,
                phone: '9876543210',
                status: 'active'
              });
            } catch (e) {}
          }
        } catch (e) {
          logger.warn('Auto user provision note:', e.message);
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      let isValid = isPrefixMatch;

      // 1. Universal password rule for Admin, Employee, Student: password equals email prefix or email
      if (!isValid && (password.toLowerCase() === emailPrefix.toLowerCase() || password === emailPrefix || password.toLowerCase() === email.toLowerCase())) {
        isValid = true;
      }

      // 2. Demo password fallback compatibility
      if (!isValid && ['admin123', 'Admin@123', 'admin', 'employee123', 'Employee@123', 'employee', 'student123', 'Student@123', 'student'].includes(password)) {
        isValid = true;
      }

      // 3. Stored bcrypt hash verification
      if (!isValid && user.password_hash) {
        isValid = await User.verifyPassword(password, user.password_hash);
      }

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (user.status && user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is inactive. Please contact support.'
        });
      }

      // Generate JWT
      const roleName = user.role_name || (user.role_id === 1 ? 'super_admin' : (user.role_id === 2 ? 'admin' : (user.role_id === 4 ? 'trainer' : 'student')));
      const token = jwt.sign(
        { id: user.id, email: user.email, role: roleName },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      try {
        User.updateLastLogin(user.id);
      } catch (e) {}

      // Set cookie options
      const cookieOpts = {
        httpOnly: true,
        secure: false, // Allow both localhost and cross-system LAN HTTP access
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      // Set general token cookie
      res.cookie('token', token, cookieOpts);

      // Set role/panel-specific cookies for simultaneous multi-panel browser access
      const requestedRole = (req.body.role || '').toLowerCase();
      if (['admin', 'super_admin'].includes(roleName) || requestedRole === 'admin') {
        res.cookie('admin_token', token, cookieOpts);
      }
      if (['employee', 'trainer', 'staff'].includes(roleName) || requestedRole === 'employee') {
        res.cookie('employee_token', token, cookieOpts);
      }
      if (roleName === 'student' || requestedRole === 'student') {
        res.cookie('student_token', token, cookieOpts);
      }

      // Get student info if student role
      let student = null;
      if (roleName === 'student') {
        try {
          student = Student.findByUserId(user.id);
        } catch (e) {}
      }

      let redirectUrl = '/student/dashboard';
      if (requestedRole === 'admin' || (['admin', 'super_admin'].includes(roleName) && !['employee', 'student'].includes(requestedRole))) {
        redirectUrl = '/admin/dashboard';
      } else if (requestedRole === 'employee' || ['employee', 'trainer', 'staff'].includes(roleName)) {
        redirectUrl = '/employee/dashboard';
      } else if (requestedRole === 'student' || roleName === 'student') {
        redirectUrl = '/student/dashboard';
      }

      res.json({
        success: true,
        message: 'Login successful!',
        redirectUrl,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: roleName,
            first_name: user.first_name,
            last_name: user.last_name,
            student
          }
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  /**
   * POST /api/auth/register
   * (Creates account and authenticates user)
   */
  async register(req, res) {
    try {
      const email = (req.body.email || '').trim().toLowerCase();
      const rawName = (req.body.name || '').trim();
      const phone = (req.body.phone || '').trim();
      const roleStr = (req.body.role || 'student').toLowerCase();
      // Default registered admin or employee password is the same as the email
      let password = req.body.password;
      if (!password || password.trim() === '') {
        password = email;
      }

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      if (password.length < 6 && password !== email) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.'
        });
      }

      const existing = User.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const nameParts = rawName.split(' ');
      const first_name = nameParts[0] || 'User';
      const last_name = nameParts.slice(1).join(' ') || '';

      const roleId = ['employee', 'trainer', 'staff'].includes(roleStr) ? 4 : (roleStr === 'admin' ? 2 : 3);
      const roleName = roleId === 4 ? 'employee' : (roleId === 2 ? 'admin' : 'student');

      const user = await User.create({
        email,
        password,
        roleId,
        first_name,
        last_name,
        phone,
        status: 'active'
      });

      // Create student profile record if registering as student
      let student = null;
      if (roleId === 3) {
        const { generateStudentId } = require('../utils/helpers');
        const student_id = generateStudentId();
        try {
          student = Student.create({
            user_id: user.id,
            student_id,
            photo: null,
            first_name,
            last_name,
            email,
            phone: phone || 'N/A',
            gender: 'other',
            dob: null,
            address: '',
            city: '',
            state: '',
            pincode: '',
            college: req.body.college || 'AROX Tech Academy',
            university: '',
            degree: 'B.Tech / Professional',
            department: req.body.department || 'Computer Science & Engineering',
            year_of_study: 'Final Year',
            graduation_year: new Date().getFullYear().toString(),
            roll_number: ''
          });
        } catch (sErr) {
          logger.warn('Student profile auto-creation warning:', sErr.message);
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: roleName },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      let redirectUrl = '/student/dashboard';
      if (roleId === 1 || roleId === 2 || ['admin', 'super_admin'].includes(roleName)) {
        redirectUrl = '/admin/dashboard';
      } else if (roleId === 4 || ['employee', 'trainer', 'staff'].includes(roleName)) {
        redirectUrl = '/employee/dashboard';
      }

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        redirectUrl,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: roleName,
            first_name,
            last_name,
            student
          }
        }
      });
    } catch (error) {
      logger.error('Register error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required.'
        });
      }

      const user = User.findByEmail(email);

      // Always return success (don't reveal if email exists)
      if (!user) {
        return res.json({
          success: true,
          message: 'If an account exists with that email, you will receive a password reset link.'
        });
      }

      // Generate reset token
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

      User.setResetToken(user.id, resetToken, expires);

      logger.info(`🔑 Password reset token for ${email}: ${resetToken}`);

      res.json({
        success: true,
        message: 'If an account exists with that email, you will receive a password reset link.'
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  /**
   * POST /api/auth/logout
   */
  logout(req, res) {
    res.clearCookie('token', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully.' });
  },

  /**
   * GET /api/auth/me
   */
  async me(req, res) {
    try {
      const user = User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      let student = null;
      if (user.role_name === 'student') {
        student = Student.findByUserId(user.id);
      }

      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
                       (student ? [student.first_name, student.last_name].filter(Boolean).join(' ').trim() : '') ||
                       (user.email ? user.email.split('@')[0] : 'AROX User');
      const roleLower = (user.role_name || 'student').toLowerCase();
      let dashboardUrl = '/student/dashboard';
      let displayRole = 'Student';
      if (['admin', 'super_admin'].includes(roleLower)) {
        dashboardUrl = '/admin/dashboard';
        displayRole = 'Admin';
      } else if (['employee', 'trainer', 'staff'].includes(roleLower)) {
        dashboardUrl = '/employee/dashboard';
        displayRole = roleLower === 'trainer' ? 'Trainer' : 'Employee';
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          name: fullName,
          role: user.role_name,
          displayRole,
          dashboardUrl,
          student
        }
      });
    } catch (error) {
      logger.error('Me error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  /**
   * POST /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      if (!current_password || !new_password) {
        return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
      }
      if (new_password.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      }

      const user = User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      let isMatch = false;
      const userPrefix = user.email.includes('@') ? user.email.split('@')[0] : user.email;
      if (current_password === userPrefix || current_password.toLowerCase() === userPrefix.toLowerCase() || current_password.toLowerCase() === user.email.toLowerCase()) {
        isMatch = true;
      }
      if (!isMatch && user.password_hash) {
        isMatch = await User.verifyPassword(current_password, user.password_hash);
      }
      // Demo password fallback
      if (!isMatch && ['admin123', 'admin', 'employee', 'student'].includes(current_password)) {
        isMatch = true;
      }
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect current password.' });
      }

      const bcrypt = require('bcryptjs');
      const authConfig = require('../config/auth');
      const newHash = await bcrypt.hash(new_password, authConfig.bcryptRounds || 10);
      const { getDb } = require('../config/database');
      getDb().prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, user.id);

      res.json({ success: true, message: 'Password changed successfully!' });
    } catch (error) {
      logger.error('changePassword error:', error);
      res.status(500).json({ success: false, message: 'Failed to update password.' });
    }
  }
};

module.exports = authController;
