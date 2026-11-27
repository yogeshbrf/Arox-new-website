const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentController');
const upload = require('../../middleware/upload');

const { authenticate, optionalAuth } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');

// Public / Shared UPI QR & config endpoints (uses 6379000598@amazonpay from settingsService)
router.get('/qr', paymentController.generateQrPng);
router.get('/config', paymentController.getConfig);

// POST /api/payments/submit-proof - Student or Applicant uploads screenshot & transaction ID
router.post('/submit-proof', optionalAuth, upload.single('receipt'), paymentController.submitProof);

// Admin-only payment verification & overrides (Employees have Read-Only / Show Only access)
router.put('/:id', authenticate, roleGuard('admin', 'super_admin'), paymentController.updatePayment);
router.post('/:id/verify', authenticate, roleGuard('admin', 'super_admin'), paymentController.verifyPayment);
router.post('/admin-record', authenticate, roleGuard('admin', 'super_admin'), paymentController.adminRecordPayment);

// POST /api/payments - Process payment (Admin only)
router.post('/', authenticate, roleGuard('admin', 'super_admin'), paymentController.processPayment);

// POST /api/payments/verify-coupon - Verify coupon code
router.post('/verify-coupon', paymentController.verifyCoupon);

module.exports = router;
