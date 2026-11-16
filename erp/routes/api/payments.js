const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentController');
const upload = require('../../middleware/upload');

const { authenticate, optionalAuth } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');

// POST /api/payments/submit-proof - Student uploads screenshot & transaction ID
router.post('/submit-proof', optionalAuth, upload.single('receipt'), paymentController.submitProof);

// PUT /api/payments/:id - Admin or Employee updates student payment (RBAC: students blocked with 403)
router.put('/:id', authenticate, roleGuard('admin', 'super_admin', 'employee', 'trainer', 'staff'), paymentController.updatePayment);

// POST /api/payments/:id/verify - Admin or Employee verifies payment (RBAC: students blocked with 403)
router.post('/:id/verify', authenticate, roleGuard('admin', 'super_admin', 'employee', 'trainer', 'staff'), paymentController.verifyPayment);

// POST /api/payments - Process payment (legacy/direct)
router.post('/', paymentController.processPayment);

// POST /api/payments/verify-coupon - Verify coupon code
router.post('/verify-coupon', paymentController.verifyCoupon);

module.exports = router;
