const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const adminAttendanceController = require('../../controllers/admin/attendanceController');
const EmployeeProof = require('../../models/EmployeeProof');
const syncService = require('../../services/syncService');
const logger = require('../../utils/logger');

// Strictly Admin & Super Admin only
router.use(authenticate, roleGuard('admin', 'super_admin'));

// Attendance full control
router.get('/attendance', adminAttendanceController.list);
router.post('/attendance', adminAttendanceController.upsert);
router.post('/attendance/bulk', adminAttendanceController.bulkMark);
router.post('/attendance/full-100', adminAttendanceController.markFull100);
router.put('/attendance/:id', adminAttendanceController.updateById);
router.delete('/attendance/:id', adminAttendanceController.deleteById);

// Employee Work Proofs oversight & review
router.get('/proofs', (req, res) => {
  try {
    const proofs = EmployeeProof.getAll({
      employee_id: req.query.employee_id,
      category: req.query.category,
      status: req.query.status
    });
    res.json({ success: true, data: proofs });
  } catch (err) {
    logger.error('Admin proofs list error:', err);
    res.status(500).json({ success: false, message: 'Failed to load employee proofs.' });
  }
});

router.put('/proofs/:id/review', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, review_notes } = req.body;
    const validStatuses = ['submitted', 'approved', 'needs_revision', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid proof review status.' });
    }

    const existing = EmployeeProof.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Proof not found.' });
    }

    const updated = EmployeeProof.review(id, {
      status,
      reviewed_by: req.user.id,
      review_notes: review_notes ? String(review_notes).trim() : null
    });

    syncService.broadcast('proof:reviewed', {
      proofId: id,
      employeeId: existing.employee_id,
      status,
      message: `Admin marked work proof "${existing.title || existing.original_name}" as ${status}.`
    });

    res.json({ success: true, message: 'Proof status updated.', data: updated });
  } catch (err) {
    logger.error('Admin proof review error:', err);
    res.status(500).json({ success: false, message: 'Failed to update proof status.' });
  }
});

router.delete('/proofs/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const removed = EmployeeProof.deleteById(id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Proof not found.' });
    }
    if (removed.file_name) {
      const diskPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'proofs', removed.file_name);
      try { if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath); } catch (e) {}
    }
    res.json({ success: true, message: 'Proof deleted.' });
  } catch (err) {
    logger.error('Admin proof delete error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete proof.' });
  }
});

module.exports = router;
