const express = require('express');
const router = express.Router();
const { Referral } = require('../../models');
const { authenticate, optionalAuth } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const syncService = require('../../services/syncService');
const { logAudit } = require('../../services/auditService');

/**
 * GET /api/referrals/validate/:code
 * Public/authenticated validation of a referral code during registration
 */
router.get('/validate/:code', optionalAuth, (req, res) => {
  try {
    const rawCode = (req.params.code || '').trim();
    if (!rawCode) {
      return res.json({ success: true, valid: false, message: 'Please enter a referral code.' });
    }
    const cleanCode = rawCode.toUpperCase();
    let ref = Referral.findByCode(cleanCode);
    if (!ref) {
      const { getDb } = require('../../config/database');
      const empUser = getDb().prepare(`
        SELECT id, first_name, last_name, email, referral_code, status
        FROM users WHERE UPPER(referral_code) = UPPER(?) AND deleted_at IS NULL
      `).get(cleanCode);
      if (empUser && empUser.status === 'active') {
        return res.json({
          success: true,
          valid: true,
          code: (empUser.referral_code || cleanCode).toUpperCase(),
          discountPercent: 5,
          referrerName: `${empUser.first_name || ''} ${empUser.last_name || ''}`.trim() || empUser.email,
          employeeId: empUser.id
        });
      }
    }
    if (!ref || !ref.is_active) {
      return res.json({ success: true, valid: false, message: `Referral code "${cleanCode}" is invalid or inactive.` });
    }
    if (ref.max_uses > 0 && ref.times_used >= ref.max_uses) {
      return res.json({ success: true, valid: false, message: `Referral code "${cleanCode}" has reached its maximum usage limit.` });
    }
    return res.json({
      success: true,
      valid: true,
      code: ref.code,
      discountPercent: ref.discount_percent || 0,
      referrerName: ref.referrer_name
    });
  } catch (err) {
    return res.json({ success: false, valid: false, message: 'Failed to validate referral code.' });
  }
});

// Admin-only endpoints below
router.use(authenticate);
router.use(roleGuard('admin', 'super_admin'));

/**
 * GET /api/referrals
 */
router.get('/', (req, res) => {
  try {
    const referrals = Referral.findAll();
    res.json({ success: true, data: referrals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/referrals/:id/students
 */
router.get('/:id/students', (req, res) => {
  try {
    const ref = Referral.findById(req.params.id);
    if (!ref) return res.status(404).json({ success: false, message: 'Referral not found.' });
    const students = Referral.getReferredStudents(ref.code);
    res.json({ success: true, code: ref.code, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/referrals
 */
router.post('/', (req, res) => {
  try {
    const { code, referrer_name, referrer_email, discount_percent, max_uses, is_active } = req.body;
    if (!code || !referrer_name) {
      return res.status(400).json({ success: false, message: 'Code and Referrer Name are required.' });
    }
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const existing = Referral.findByCode(cleanCode);
    if (existing) {
      return res.status(409).json({ success: false, message: `Referral code "${cleanCode}" already exists.` });
    }

    const created = Referral.create({
      code: cleanCode,
      referrer_name,
      referrer_email,
      discount_percent: discount_percent !== undefined ? parseFloat(discount_percent) : 0,
      max_uses: max_uses !== undefined ? parseInt(max_uses, 10) : 0,
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1
    });

    logAudit(req, {
      action: 'CREATE_REFERRAL',
      module: 'referrals',
      entityType: 'referral',
      entityId: created.id,
      newValues: created
    });

    syncService.broadcast('referral:created', {
      code: cleanCode,
      referrer_name,
      message: `New referral code ${cleanCode} created.`
    });

    res.status(201).json({ success: true, message: 'Referral code created successfully.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/referrals/:id
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = Referral.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Referral code not found.' });

    const updated = Referral.update(id, req.body);

    logAudit(req, {
      action: 'UPDATE_REFERRAL',
      module: 'referrals',
      entityType: 'referral',
      entityId: id,
      oldValues: existing,
      newValues: updated
    });

    syncService.broadcast('referral:updated', {
      id,
      code: updated.code,
      message: `Referral code ${updated.code} updated.`
    });

    res.json({ success: true, message: 'Referral updated successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/referrals/:id
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = Referral.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Referral code not found.' });

    Referral.delete(id);

    logAudit(req, {
      action: 'DELETE_REFERRAL',
      module: 'referrals',
      entityType: 'referral',
      entityId: id,
      oldValues: existing
    });

    syncService.broadcast('referral:deleted', {
      id,
      code: existing.code,
      message: `Referral code ${existing.code} deleted.`
    });

    res.json({ success: true, message: 'Referral deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

