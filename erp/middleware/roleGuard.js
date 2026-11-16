/**
 * Role-based access guard middleware
 * Usage: roleGuard('admin', 'super_admin')
 */
function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      const isApi = req.path.startsWith('/api/') || (req.originalUrl && req.originalUrl.startsWith('/api/'));
      if (isApi) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }
      return res.redirect('/login');
    }

    if (!allowedRoles.includes(req.user.role)) {
      const isApi = req.path.startsWith('/api/') || (req.originalUrl && req.originalUrl.startsWith('/api/'));
      if (isApi) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Insufficient permissions to access this resource.'
        });
      }

      // Smooth web navigation: redirect to appropriate login tab instead of abrupt 403
      const fullPath = req.originalUrl || (req.baseUrl ? req.baseUrl + req.path : req.path) || '';
      let targetRole = 'student';
      if (fullPath.startsWith('/admin')) targetRole = 'admin';
      else if (fullPath.startsWith('/employee')) targetRole = 'employee';

      return res.redirect(`/login?role=${targetRole}`);
    }

    next();
  };
}

module.exports = roleGuard;
