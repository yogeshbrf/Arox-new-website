const express = require('express');
const router = express.Router();
const { CallReport, User } = require('../../models');
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const syncService = require('../../services/syncService');
const { logAudit } = require('../../services/auditService');

router.use(authenticate);
router.use(roleGuard('admin', 'super_admin', 'employee', 'trainer', 'staff'));

/**
 * GET /api/call-reports
 * If Admin: can filter by employee_id, startDate, endDate, contact_type
 * If Employee: sees own call reports
 */
router.get('/', (req, res) => {
  try {
    const { employee_id, contact_type, search, startDate, endDate } = req.query;
    const isStaffAdmin = ['admin', 'super_admin'].includes(req.user.role);
    const targetEmployeeId = isStaffAdmin ? (employee_id || null) : req.user.id;

    const reports = CallReport.findAll({
      employee_id: targetEmployeeId,
      contact_type,
      search,
      startDate,
      endDate
    });

    const summary = CallReport.getPerformanceSummary({
      employee_id: targetEmployeeId,
      startDate,
      endDate
    });

    res.json({ success: true, data: reports, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/call-reports
 * Employee logs a new call report
 */
router.post('/', (req, res) => {
  try {
    const { contact_type, student_id, client_id, contact_name, contact_phone, contact_email, call_date, outcome, notes, next_followup } = req.body;
    const employeeId = req.user.id;

    if (!contact_type || !contact_name || !outcome) {
      return res.status(400).json({ success: false, message: 'Contact Type, Contact Name, and Outcome are required.' });
    }

    const created = CallReport.create({
      employee_id: employeeId,
      contact_type,
      student_id: student_id || null,
      client_id: client_id || null,
      contact_name,
      contact_phone,
      contact_email,
      call_date: call_date || new Date().toISOString(),
      outcome,
      notes,
      next_followup
    });

    const empName = `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || req.user.email;

    logAudit(req, {
      action: 'CREATE_CALL_REPORT',
      module: 'call_reports',
      entityType: 'call_report',
      entityId: created.id,
      newValues: { contact_name, contact_type, outcome, notes, employeeId }
    });

    // Broadcast sync event so Admin Reports and Employee views update immediately
    syncService.broadcast('call_report:created', {
      id: created.id,
      employeeId,
      employeeName: empName,
      contactName: contact_name,
      outcome,
      message: `${empName} logged a call with ${contact_name} (${outcome}).`
    });

    res.status(201).json({ success: true, message: 'Call report logged successfully and synced with Admin Reports! ✅', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/call-reports/:id
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = CallReport.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Call report not found.' });

    // Check ownership unless admin
    if (!['admin', 'super_admin'].includes(req.user.role) && existing.employee_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit your own call reports.' });
    }

    const updated = CallReport.update(id, req.body);

    logAudit(req, {
      action: 'UPDATE_CALL_REPORT',
      module: 'call_reports',
      entityType: 'call_report',
      entityId: id,
      oldValues: existing,
      newValues: updated
    });

    syncService.broadcast('call_report:updated', {
      id,
      contactName: updated.contact_name,
      message: `Call report #${id} updated.`
    });

    res.json({ success: true, message: 'Call report updated.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/call-reports/:id
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = CallReport.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Call report not found.' });

    if (!['admin', 'super_admin'].includes(req.user.role) && existing.employee_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own call reports.' });
    }

    CallReport.delete(id);

    logAudit(req, {
      action: 'DELETE_CALL_REPORT',
      module: 'call_reports',
      entityType: 'call_report',
      entityId: id,
      oldValues: existing
    });

    res.json({ success: true, message: 'Call report deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

