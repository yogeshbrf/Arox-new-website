const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication / login requests
 * Max 10 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 login requests per windowMs
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1',
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Rate limiter for attendance marking requests
 * Max 5 attempts per 1 minute per IP
 */
const attendanceLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attendance mark attempts. Please slow down.'
  }
});

module.exports = {
  loginLimiter,
  attendanceLimiter
};

