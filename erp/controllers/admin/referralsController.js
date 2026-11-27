const { Referral, User } = require('../../models');
const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    const referrals = Referral.findAll();

    // Build employee-wise referred students grouping (Employee + unique Referral Code + attributed students)
    const empUsers = db.prepare(`
      SELECT id, first_name, last_name, email, phone, designation, department, status, referral_code
      FROM users
      WHERE role_id = 4 AND deleted_at IS NULL
      ORDER BY first_name ASC, last_name ASC
    `).all();

    const employeeReferrals = empUsers.map(emp => {
      const refCode = emp.referral_code || User.ensureEmployeeReferralCode(
        emp.id, emp.first_name, emp.last_name, emp.email, null
      );

      const empCodesRows = db.prepare(`
        SELECT UPPER(TRIM(code)) as code FROM referrals WHERE employee_id = ?
      `).all(emp.id);
      const codeSet = new Set(empCodesRows.map(r => r.code).filter(Boolean));
      if (refCode) codeSet.add(String(refCode).trim().toUpperCase());
      const upperCodes = Array.from(codeSet);

      let students = [];
      if (upperCodes.length > 0) {
        const placeholders = upperCodes.map(() => '?').join(', ');
        students = db.prepare(`
          SELECT
            s.id,
            s.student_id,
            s.first_name,
            s.last_name,
            s.email,
            s.phone,
            s.college,
            s.department,
            COALESCE(NULLIF(r.referral_code, ''), NULLIF(s.referral_code, ''), ?) as applied_referral_code,
            s.created_at as account_created_at,
            r.registration_id,
            r.status as reg_status,
            r.mode as reg_mode,
            r.created_at as registered_at,
            c.title as course_title
          FROM students s
          LEFT JOIN registrations r ON r.id = (
            SELECT r2.id FROM registrations r2
            WHERE r2.student_id = s.id AND r2.status != 'cancelled'
            ORDER BY r2.created_at DESC, r2.id DESC
            LIMIT 1
          )
          LEFT JOIN courses c ON r.course_id = c.id
          WHERE s.referred_by = ?
             OR UPPER(TRIM(COALESCE(s.referral_code, ''))) IN (${placeholders})
             OR UPPER(TRIM(COALESCE(r.referral_code, ''))) IN (${placeholders})
          ORDER BY COALESCE(r.created_at, s.created_at) DESC
        `).all(refCode || '', emp.id, ...upperCodes, ...upperCodes);
      } else {
        students = db.prepare(`
          SELECT
            s.id,
            s.student_id,
            s.first_name,
            s.last_name,
            s.email,
            s.phone,
            s.college,
            s.department,
            COALESCE(NULLIF(r.referral_code, ''), s.referral_code) as applied_referral_code,
            s.created_at as account_created_at,
            r.registration_id,
            r.status as reg_status,
            r.mode as reg_mode,
            r.created_at as registered_at,
            c.title as course_title
          FROM students s
          LEFT JOIN registrations r ON r.id = (
            SELECT r2.id FROM registrations r2
            WHERE r2.student_id = s.id AND r2.status != 'cancelled'
            ORDER BY r2.created_at DESC, r2.id DESC
            LIMIT 1
          )
          LEFT JOIN courses c ON r.course_id = c.id
          WHERE s.referred_by = ?
          ORDER BY COALESCE(r.created_at, s.created_at) DESC
        `).all(emp.id);
      }

      return {
        employee: {
          ...emp,
          referral_code: refCode
        },
        referral_code: refCode,
        students
      };
    });

    res.render('admin/referrals/index', {
      layout: 'layouts/admin',
      title: 'Referral Management | AROX ERP',
      pageTitle: 'Referral Management',
      currentPath: '/admin/referrals',
      user: req.user,
      referrals,
      employeeReferrals
    });
  } catch (error) {
    logger.error('Admin Referrals Index Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/admin',
      title: 'Error - AROX ERP',
      code: 500,
      message: 'Failed to load referral management page.',
      user: req.user
    });
  }
};

