const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { getDb } = require('../config/database');

/**
 * Safely verify JWT and retrieve fresh active user record
 */
function verifyAndGetUser(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, authConfig.secret);
    if (!decoded || !decoded.id) return null;

    const db = getDb();
    const user = db.prepare('SELECT id, email, role_id, status, first_name, last_name FROM users WHERE id = ?').get(decoded.id);
    if (!user || user.status !== 'active') return null;

    const role = db.prepare('SELECT name FROM roles WHERE id = ?').get(user.role_id);
    return {
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      role: role ? role.name : 'student',
      first_name: user.first_name || '',
      last_name: user.last_name || ''
    };
  } catch (e) {
    return null;
  }
}

/**
 * Extract token with panel-context awareness
 * Allows simultaneous sessions for Admin, Employee, and Student in the same browser.
 */
function extractContextualToken(req) {
  // 1. Direct Bearer header has top priority (API scripts & tests)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // 1b. Query parameter token (allows seamless cross-portal redirect with auth)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  if (!req.cookies) return null;

  // Use originalUrl to get the full mount path (/admin/dashboard, /employee/dashboard, etc.)
  const fullPath = req.originalUrl || (req.baseUrl ? req.baseUrl + req.path : req.path) || '';
  const referer = req.headers.referer || req.headers.referrer || '';
  const xRole = (req.headers['x-role'] || '').toLowerCase();

  // 2. Admin context
  if (fullPath.startsWith('/admin') || fullPath.startsWith('/api/admin') || referer.includes('/admin') || ['admin', 'super_admin'].includes(xRole)) {
    if (req.cookies.admin_token) return req.cookies.admin_token;
  }

  // 3. Employee context
  if (fullPath.startsWith('/employee') || fullPath.startsWith('/api/employee') || referer.includes('/employee') || ['employee', 'trainer', 'staff'].includes(xRole)) {
    if (req.cookies.employee_token) return req.cookies.employee_token;
  }

  // 4. Student context
  if (fullPath.startsWith('/student') || fullPath.startsWith('/api/student') || referer.includes('/student') || xRole === 'student') {
    if (req.cookies.student_token) return req.cookies.student_token;
  }

  // 5. Contextual fallbacks based on target path
  if (fullPath.startsWith('/admin')) {
    return req.cookies.admin_token || null;
  }
  if (fullPath.startsWith('/employee')) {
    return req.cookies.employee_token || null;
  }
  if (fullPath.startsWith('/student')) {
    return req.cookies.student_token || null;
  }

  // 6. General fallback for shared public endpoints
  return req.cookies.token || req.cookies.admin_token || req.cookies.employee_token || req.cookies.student_token || null;
}

/**
 * JWT Authentication Middleware
 */
function authenticate(req, res, next) {
  const token = extractContextualToken(req);
  const user = verifyAndGetUser(token);

  if (!user) {
    const isApi = req.path.startsWith('/api/') || (req.originalUrl && req.originalUrl.startsWith('/api/'));
    if (isApi) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    const fullPath = req.originalUrl || (req.baseUrl ? req.baseUrl + req.path : req.path) || '';
    let targetRole = 'student';
    if (fullPath.startsWith('/admin')) targetRole = 'admin';
    else if (fullPath.startsWith('/employee')) targetRole = 'employee';

    return res.redirect(`/login?role=${targetRole}`);
  }

  // If token came from query string, set cookies now so subsequent clicks on ERP remain logged in
  if (req.query && req.query.token && res && res.cookie) {
    const cookieOpts = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    };
    res.cookie('token', token, cookieOpts);
    const fullPath = req.originalUrl || (req.baseUrl ? req.baseUrl + req.path : req.path) || '';
    if (fullPath.startsWith('/admin')) res.cookie('admin_token', token, cookieOpts);
    if (fullPath.startsWith('/employee')) res.cookie('employee_token', token, cookieOpts);
    if (fullPath.startsWith('/student')) res.cookie('student_token', token, cookieOpts);
  }

  req.user = user;
  res.locals.user = user;
  next();
}

/**
 * Optional authentication - attaches user info if valid token found without blocking
 */
function optionalAuth(req, res, next) {
  const token = extractContextualToken(req);
  const user = verifyAndGetUser(token);

  if (user) {
    req.user = user;
    res.locals.user = user;
  }

  next();
}

module.exports = { authenticate, optionalAuth };
