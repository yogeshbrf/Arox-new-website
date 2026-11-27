const { getDb } = require('../config/database');
const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const paymentService = require('../services/paymentService');
const settingsService = require('../services/settingsService');
const QRCode = require('qrcode');
const { generatePaymentId, generateInvoiceNumber, calculateGST } = require('../utils/helpers');
const logger = require('../utils/logger');

const paymentController = {
  /**
   * GET /api/payments/config
   * Returns active UPI ID, payee name, and dynamic QR endpoint URL
   */
  getConfig(req, res) {
    try {
      const cfg = settingsService.getPaymentSettings();
      const upiId = cfg.upi_id || '6379000598@amazonpay';
      const upiName = cfg.upi_name || 'AROX Tech Pvt. Ltd.';
      const amount = parseFloat(req.query.amount) || 0;
      const note = (req.query.note || 'AROX Tech Course Fee').toString().slice(0, 60);
      let upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&cu=INR&tn=${encodeURIComponent(note)}`;
      if (amount > 0) upiUri += `&am=${amount.toFixed(2)}`;
      const qrUrl = `/api/payments/qr?${amount > 0 ? 'amount=' + encodeURIComponent(amount.toFixed(2)) + '&' : ''}note=${encodeURIComponent(note)}`;
      res.json({
        success: true,
        data: {
          ...cfg,
          upi_id: upiId,
          upi_name: upiName,
          upi_uri: upiUri,
          qr_url: qrUrl
        }
      });
    } catch (err) {
      logger.error('Payment config error:', err);
      res.status(500).json({ success: false, message: 'Failed to load payment configuration.' });
    }
  },

  /**
   * GET /api/payments/qr
   * Dynamically renders a crisp scannable UPI QR PNG for 6379000598@amazonpay
   */
  async generateQrPng(req, res) {
    try {
      const cfg = settingsService.getPaymentSettings();
      const upiId = cfg.upi_id || '6379000598@amazonpay';
      const upiName = cfg.upi_name || 'AROX Tech Pvt. Ltd.';
      const amount = parseFloat(req.query.amount) || 0;
      const note = (req.query.note || 'AROX Tech Fee Payment').toString().slice(0, 60);

      let upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&cu=INR&tn=${encodeURIComponent(note)}`;
      if (amount > 0) {
        upiUri += `&am=${amount.toFixed(2)}`;
      }

      const buffer = await QRCode.toBuffer(upiUri, {
        type: 'png',
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#0B1F3A',
          light: '#FFFFFF'
        }
      });

      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'no-cache, max-age=0');
      res.send(buffer);
    } catch (err) {
      logger.error('QR generation error:', err);
      res.status(500).json({ success: false, message: 'Failed to generate UPI QR.' });
    }
  },
  /**
   * POST /api/payments
   * Process a mock payment
   */
  async processPayment(req, res) {
    try {
      const { registration_id, amount, payment_method, payment_type } = req.body;

      if (!registration_id || !amount) {
        return res.status(400).json({ success: false, message: 'registration_id and amount are required.' });
      }

      // Get registration
      const registration = Registration.findByRegistrationId(registration_id);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      // Process mock payment
      const result = await paymentService.processPayment({
        amount,
        method: payment_method,
        studentId: registration.student_id,
        registrationId: registration.id
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }

      // Calculate GST breakdown
      const gstInfo = calculateGST(amount);

      // Save payment record
      const payment = Payment.create({
        payment_id: result.paymentId,
        registration_id: registration.id,
        student_id: registration.student_id,
        amount: gstInfo.baseAmount,
        gst_amount: gstInfo.gstAmount,
        total_amount: amount,
        payment_method,
        payment_type: payment_type || 'full',
        transaction_id: result.transactionId,
        status: 'completed',
        invoice_number: result.invoiceNumber,
        paid_at: new Date().toISOString()
      });

      // Update registration payment status
      const newPaidAmount = (registration.paid_amount || 0) + amount;
      const newBalance = Math.max(0, (registration.total_amount || 0) - newPaidAmount);
      Registration.updatePayment(registration.id, newPaidAmount, newBalance);

      if (newBalance <= 0) {
        Registration.updateStatus(registration.id, 'active');
      }

      res.json({
        success: true,
        message: 'Payment processed successfully! ✅',
        data: {
          paymentId: result.paymentId,
          transactionId: result.transactionId,
          invoiceNumber: result.invoiceNumber,
          amount,
          gst: gstInfo.gstAmount,
          status: 'completed'
        }
      });
    } catch (error) {
      logger.error('Payment error:', error);
      res.status(500).json({ success: false, message: 'Payment processing failed.' });
    }
  },

  /**
   * POST /api/payments/submit-proof
   * Student uploads payment screenshot and transaction ID for verification
   */
  async submitProof(req, res) {
    try {
      const { registration_id, amount, payment_method, transaction_id, proof_type, notes } = req.body;
      const db = getDb();

      if (!registration_id) {
        return res.status(400).json({ success: false, message: 'registration_id is required.' });
      }

      // Find registration by ID (number or registration_id string)
      let reg = null;
      if (!isNaN(registration_id) && Number.isInteger(Number(registration_id))) {
        reg = db.prepare('SELECT * FROM registrations WHERE id = ?').get(parseInt(registration_id, 10));
      }
      if (!reg) {
        reg = db.prepare('SELECT * FROM registrations WHERE registration_id = ?').get(String(registration_id));
      }

      if (!reg) {
        return res.status(404).json({ success: false, message: 'Registration record not found.' });
      }

      // If logged-in student submits proof, verify ownership of registration (IDOR protection)
      if (req.user && req.user.role === 'student') {
        const ownStudent = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
        if (!ownStudent || reg.student_id !== ownStudent.id) {
          return res.status(403).json({ success: false, message: 'Access denied. You can only submit proof for your own registration.' });
        }
      }

      const receiptPath = req.file ? `/uploads/receipts/${req.file.filename}` : null;
      const parsedAmount = parseFloat(amount) || reg.balance_amount || reg.total_amount || 0;
      const paymentId = generatePaymentId();
      const invoiceNumber = generateInvoiceNumber();
      const gstInfo = calculateGST(parsedAmount);

      // Create pending payment record
      db.prepare(`
        INSERT INTO payments (
          payment_id, registration_id, student_id, amount, gst_amount, total_amount,
          payment_method, payment_type, transaction_id, status, invoice_number, receipt_path, notes, created_at
        ) VALUES (
          @payment_id, @registration_id, @student_id, @amount, @gst_amount, @total_amount,
          @payment_method, @payment_type, @transaction_id, 'pending', @invoice_number, @receipt_path, @notes, CURRENT_TIMESTAMP
        )
      `).run({
        payment_id: paymentId,
        registration_id: reg.id,
        student_id: reg.student_id,
        amount: gstInfo.baseAmount,
        gst_amount: gstInfo.gstAmount,
        total_amount: parsedAmount,
        payment_method: payment_method || 'upi',
        payment_type: parsedAmount >= (reg.total_amount || 0) ? 'full' : 'advance',
        transaction_id: transaction_id || 'PENDING-VERIFICATION',
        invoice_number: invoiceNumber,
        receipt_path: receiptPath,
        notes: proof_type ? `[${proof_type}] ${notes || 'Submitted via Student Portal'}` : (notes || 'Submitted via Student Portal for Verification')
      });

      // Update registration notes to indicate pending verification
      try {
        db.prepare(`
          UPDATE registrations 
          SET notes = coalesce(notes || ' | ', '') || 'Payment proof submitted (UTR: ' || @utr || ')'
          WHERE id = @id
        `).run({ utr: transaction_id || 'N/A', id: reg.id });
      } catch (e) {
        logger.warn('Could not update registration notes:', e.message);
      }

      logger.info(`Payment proof submitted: ${paymentId} for registration ${reg.registration_id} by student ${reg.student_id}`);

      // Broadcast Triangular Sync event
      const syncService = require('../services/syncService');
      syncService.broadcast('payment:created', {
        paymentId,
        studentId: reg.student_id,
        amount: parsedAmount,
        message: `New payment proof of ₹${parsedAmount.toLocaleString('en-IN')} submitted by student.`
      });

      res.json({
        success: true,
        message: 'Payment screenshot submitted successfully! Our admin team will verify it shortly. ✅',
        data: {
          paymentId,
          transactionId: transaction_id,
          receiptPath,
          status: 'pending'
        }
      });
    } catch (error) {
      logger.error('Payment proof submission error:', error);
      res.status(500).json({ success: false, message: 'Failed to submit payment proof. ' + error.message });
    }
  },

  /**
   * PUT /api/payments/:id
   * Admin or Employee updates student payment details (amount, status, payment_method, notes)
   */
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { amount, status, payment_method, transaction_id, notes } = req.body;
      const db = getDb();
      const user = req.user;
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');

      let payment = null;
      if (!isNaN(id) && Number.isInteger(Number(id))) {
        payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(parseInt(id, 10));
      }
      if (!payment) {
        payment = db.prepare('SELECT * FROM payments WHERE payment_id = ?').get(String(id));
      }

      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment record not found.' });
      }

      const oldValues = { ...payment };
      const newAmount = amount !== undefined ? parseFloat(amount) : payment.total_amount;
      const newStatus = status || payment.status;
      const gstInfo = calculateGST(newAmount);

      const verifierName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Staff';
      const isVerified = (newStatus === 'completed' || newStatus === 'verified');

      const tx = db.transaction(() => {
        // Update payment record
        db.prepare(`
          UPDATE payments 
          SET total_amount = @total_amount,
              amount = @amount,
              gst_amount = @gst_amount,
              status = @status,
              payment_method = coalesce(@payment_method, payment_method),
              transaction_id = coalesce(@transaction_id, transaction_id),
              notes = coalesce(@notes, notes),
              verified_by = @verified_by,
              verified_by_name = @verified_by_name,
              verified_at = @verified_at,
              paid_at = @paid_at
          WHERE id = @id
        `).run({
          total_amount: newAmount,
          amount: gstInfo.baseAmount,
          gst_amount: gstInfo.gstAmount,
          status: newStatus,
          payment_method: payment_method || null,
          transaction_id: transaction_id || null,
          notes: notes || null,
          verified_by: isVerified ? (user ? user.id : null) : payment.verified_by,
          verified_by_name: isVerified ? verifierName : payment.verified_by_name,
          verified_at: isVerified ? (payment.verified_at || new Date().toISOString()) : null,
          paid_at: isVerified ? (payment.paid_at || new Date().toISOString()) : payment.paid_at,
          id: payment.id
        });

        // Synchronize Registration totals (compute sum of completed payments for this registration)
        const completedSum = db.prepare(`
          SELECT COALESCE(SUM(total_amount), 0) as total_paid 
          FROM payments 
          WHERE registration_id = ? AND status IN ('completed', 'verified')
        `).get(payment.registration_id);

        const reg = db.prepare('SELECT total_amount FROM registrations WHERE id = ?').get(payment.registration_id);
        if (reg) {
          const totalPaid = completedSum ? completedSum.total_paid : 0;
          const newBalance = Math.max(0, (reg.total_amount || 0) - totalPaid);
          const regStatus = (totalPaid > 0 && newBalance <= 0) ? 'confirmed' : 'pending';

          db.prepare(`
            UPDATE registrations 
            SET paid_amount = ?, balance_amount = ?, status = ?
            WHERE id = ?
          `).run(totalPaid, newBalance, regStatus, payment.registration_id);
        }
      });

      tx();

      // Log audit
      logAudit(req, {
        action: 'UPDATE_PAYMENT',
        module: 'payments',
        entityType: 'payment',
        entityId: payment.id,
        oldValues,
        newValues: { total_amount: newAmount, status: newStatus, verified_by_name: verifierName }
      });

      // Broadcast Triangular Sync event to Admin, Employee, and Student
      syncService.broadcast('payment:updated', {
        paymentId: payment.payment_id,
        studentId: payment.student_id,
        amount: newAmount,
        status: newStatus,
        verifiedBy: verifierName,
        message: `Payment #${payment.payment_id} updated: ₹${newAmount.toLocaleString('en-IN')} (${newStatus}) by ${verifierName}.`
      });

      res.json({
        success: true,
        message: 'Payment updated and synced successfully across all panels! ✅',
        data: {
          id: payment.id,
          paymentId: payment.payment_id,
          amount: newAmount,
          status: newStatus,
          verifiedBy: verifierName
        }
      });
    } catch (error) {
      logger.error('Payment update error:', error);
      res.status(500).json({ success: false, message: 'Failed to update payment: ' + error.message });
    }
  },

  /**
   * POST /api/payments/:id/verify
   * Admin or Employee approves or rejects a payment proof
   */
  async verifyPayment(req, res) {
    try {
      const { id } = req.params;
      const { status, admin_notes } = req.body; // status: 'completed' or 'failed'
      const db = getDb();
      const user = req.user;
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');

      if (!status || !['completed', 'failed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Valid status (completed or failed) is required.' });
      }

      let payment = null;
      if (!isNaN(id) && Number.isInteger(Number(id))) {
        payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(parseInt(id, 10));
      }
      if (!payment) {
        payment = db.prepare('SELECT * FROM payments WHERE payment_id = ?').get(String(id));
      }

      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment record not found.' });
      }

      const verifierName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Staff';
      const verifierId = user ? user.id : null;
      const oldValues = { ...payment };

      if (status === 'completed') {
        const tx = db.transaction(() => {
          // Approve payment
          db.prepare(`
            UPDATE payments 
            SET status = 'completed', 
                paid_at = CURRENT_TIMESTAMP, 
                verified_by = @verified_by,
                verified_by_name = @verified_by_name,
                verified_at = CURRENT_TIMESTAMP,
                notes = coalesce(notes || ' | ', '') || @admin_notes
            WHERE id = @id
          `).run({ 
            id: payment.id, 
            verified_by: verifierId,
            verified_by_name: verifierName,
            admin_notes: admin_notes ? `Verified by ${verifierName}: ${admin_notes}` : `Verified by ${verifierName}` 
          });

          // Update registration balances & status
          const reg = db.prepare('SELECT * FROM registrations WHERE id = ?').get(payment.registration_id);
          if (reg) {
            const completedSum = db.prepare(`
              SELECT COALESCE(SUM(total_amount), 0) as total_paid 
              FROM payments 
              WHERE registration_id = ? AND status IN ('completed', 'verified')
            `).get(payment.registration_id);

            const newPaid = completedSum ? completedSum.total_paid : (payment.total_amount || 0);
            const newBalance = Math.max(0, (reg.total_amount || 0) - newPaid);
            const newStatus = (reg.status === 'pending' || reg.status === 'confirmed') ? 'confirmed' : reg.status;

            db.prepare(`
              UPDATE registrations 
              SET paid_amount = @paid, balance_amount = @balance, status = @status
              WHERE id = @id
            `).run({ paid: newPaid, balance: newBalance, status: newStatus, id: reg.id });

            // Update course enrolled count
            try {
              db.prepare(`
                UPDATE courses 
                SET total_enrolled = (SELECT COUNT(*) FROM registrations WHERE course_id = @courseId AND status IN ('confirmed', 'active', 'completed'))
                WHERE id = @courseId
              `).run({ courseId: reg.course_id });
            } catch (e) {
              logger.warn('Could not update course enrollment count:', e.message);
            }
          }
        });

        tx();

        // Audit log
        logAudit(req, {
          action: 'VERIFY_PAYMENT',
          module: 'payments',
          entityType: 'payment',
          entityId: payment.id,
          oldValues,
          newValues: { status: 'completed', verified_by: verifierId, verified_by_name: verifierName }
        });

        // Triangular Sync broadcast
        syncService.broadcast('payment:verified', {
          paymentId: payment.payment_id,
          studentId: payment.student_id,
          amount: payment.total_amount,
          verifiedBy: verifierName,
          status: 'completed',
          message: `Payment of ₹${Number(payment.total_amount || 0).toLocaleString('en-IN')} verified by ${verifierName}.`
        });

        logger.info(`Payment ${payment.payment_id} approved by ${verifierName}.`);
        return res.json({ success: true, message: `Payment approved and verified by ${verifierName}! 🎉` });
      } else {
        // Reject payment
        db.prepare(`
          UPDATE payments 
          SET status = 'failed', 
              verified_by = @verified_by,
              verified_by_name = @verified_by_name,
              verified_at = CURRENT_TIMESTAMP,
              notes = coalesce(notes || ' | ', '') || @admin_notes
          WHERE id = @id
        `).run({ 
          id: payment.id, 
          verified_by: verifierId,
          verified_by_name: verifierName,
          admin_notes: admin_notes ? `Rejected by ${verifierName}: ${admin_notes}` : `Rejected by ${verifierName}` 
        });

        // Audit log
        logAudit(req, {
          action: 'REJECT_PAYMENT',
          module: 'payments',
          entityType: 'payment',
          entityId: payment.id,
          oldValues,
          newValues: { status: 'failed', verified_by_name: verifierName }
        });

        // Triangular Sync broadcast
        syncService.broadcast('payment:updated', {
          paymentId: payment.payment_id,
          studentId: payment.student_id,
          status: 'failed',
          verifiedBy: verifierName,
          message: `Payment #${payment.payment_id} marked as failed by ${verifierName}.`
        });

        logger.info(`Payment ${payment.payment_id} rejected by ${verifierName}.`);
        return res.json({ success: true, message: 'Payment rejected. Student will need to re-submit proof.' });
      }
    } catch (error) {
      logger.error('Payment verification error:', error);
      res.status(500).json({ success: false, message: 'Failed to verify payment: ' + error.message });
    }
  },

  /**
   * POST /api/payments/admin-record
   * Admin records a direct / offline / UPI payment on behalf of a student
   */
  async adminRecordPayment(req, res) {
    try {
      const { registration_id, amount, payment_method, transaction_id, status, notes } = req.body;
      const db = getDb();
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');

      const parsedAmount = parseFloat(amount);
      if (!registration_id || isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid registration and positive amount are required.' });
      }

      let reg = null;
      if (!isNaN(registration_id) && Number.isInteger(Number(registration_id))) {
        reg = db.prepare('SELECT * FROM registrations WHERE id = ?').get(parseInt(registration_id, 10));
      } else {
        reg = db.prepare('SELECT * FROM registrations WHERE registration_id = ?').get(String(registration_id));
      }
      if (!reg) {
        return res.status(404).json({ success: false, message: 'Registration record not found.' });
      }

      const finalStatus = ['completed', 'pending'].includes(status) ? status : 'completed';
      const verifierName = `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || req.user.email;
      const paymentId = generatePaymentId();
      const invoiceNumber = generateInvoiceNumber();
      const gstInfo = calculateGST(parsedAmount);
      const txnId = (transaction_id && String(transaction_id).trim()) || `UPI-${Date.now().toString().slice(-6)}`;

      const tx = db.transaction(() => {
        db.prepare(`
          INSERT INTO payments (
            payment_id, registration_id, student_id, amount, gst_amount, total_amount,
            payment_method, payment_type, transaction_id, status, invoice_number, notes,
            verified_by, verified_by_name, verified_at, paid_at, created_at
          ) VALUES (
            @payment_id, @registration_id, @student_id, @amount, @gst_amount, @total_amount,
            @payment_method, @payment_type, @transaction_id, @status, @invoice_number, @notes,
            @verified_by, @verified_by_name, CURRENT_TIMESTAMP,
            CASE WHEN @status = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END,
            CURRENT_TIMESTAMP
          )
        `).run({
          payment_id: paymentId,
          registration_id: reg.id,
          student_id: reg.student_id,
          amount: gstInfo.baseAmount,
          gst_amount: gstInfo.gstAmount,
          total_amount: parsedAmount,
          payment_method: payment_method || 'upi',
          payment_type: parsedAmount >= (reg.total_amount || 0) ? 'full' : 'partial',
          transaction_id: txnId,
          status: finalStatus,
          invoice_number: invoiceNumber,
          notes: notes || `Recorded by ${verifierName} (${settingsService.getPaymentSettings().upi_id})`,
          verified_by: finalStatus === 'completed' ? req.user.id : null,
          verified_by_name: finalStatus === 'completed' ? verifierName : null
        });

        const completedSum = db.prepare(`
          SELECT COALESCE(SUM(total_amount), 0) AS total_paid
          FROM payments WHERE registration_id = ? AND status IN ('completed', 'verified')
        `).get(reg.id);

        const totalPaid = completedSum ? completedSum.total_paid : 0;
        const newBalance = Math.max(0, (reg.total_amount || 0) - totalPaid);
        const regStatus = (totalPaid > 0 && newBalance <= 0) ? 'confirmed' : reg.status;

        db.prepare(`
          UPDATE registrations SET paid_amount = ?, balance_amount = ?, status = ? WHERE id = ?
        `).run(totalPaid, newBalance, regStatus, reg.id);
      });

      tx();

      logAudit(req, {
        action: 'ADMIN_RECORD_PAYMENT',
        module: 'payments',
        entityType: 'payment',
        entityId: paymentId,
        newValues: { registration_id: reg.id, amount: parsedAmount, status: finalStatus, payment_method: payment_method || 'upi' }
      });

      syncService.broadcast('payment:verified', {
        paymentId,
        studentId: reg.student_id,
        amount: parsedAmount,
        status: finalStatus,
        verifiedBy: verifierName,
        message: `Payment of ₹${parsedAmount.toLocaleString('en-IN')} (${finalStatus}) recorded by ${verifierName}.`
      });

      res.json({ success: true, message: 'Payment recorded and student ledger updated.', data: { paymentId, transactionId: txnId, status: finalStatus } });
    } catch (error) {
      logger.error('Admin record payment error:', error);
      res.status(500).json({ success: false, message: 'Failed to record payment: ' + error.message });
    }
  },

  /**
   * POST /api/payments/verify-coupon
   */
  verifyCoupon(req, res) {
    try {
      const { code, amount } = req.body;
      
      if (!code) {
        return res.status(400).json({ success: false, message: 'Coupon code is required.' });
      }

      const db = getDb();
      const result = paymentService.verifyCoupon(db, code, amount || 0);

      res.json({
        success: result.valid,
        message: result.message,
        data: result.valid ? result.coupon : null
      });
    } catch (error) {
      logger.error('Coupon verification error:', error);
      res.status(500).json({ success: false, message: 'Failed to verify coupon.' });
    }
  }
};

module.exports = paymentController;
