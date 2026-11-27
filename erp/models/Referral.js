const { getDb } = require('../config/database');

class Referral {
  static findAll() {
    const db = getDb();
    // Fetch referrals with counts of actual referred registrations
    const rows = db.prepare(`
      SELECT 
        r.*,
        r.times_used as uses_count,
        (SELECT COUNT(*) FROM registrations reg WHERE LOWER(reg.referral_code) = LOWER(r.code)) as student_count
      FROM referrals r
      ORDER BY r.created_at DESC
    `).all();
    return rows;
  }

  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT r.*, r.times_used as uses_count FROM referrals r WHERE r.id = ?').get(id);
  }

  static findByCode(code) {
    if (!code) return null;
    const str = String(code).trim();
    const db = getDb();
    return db.prepare('SELECT r.*, r.times_used as uses_count FROM referrals r WHERE LOWER(r.code) = LOWER(?)').get(str);
  }

  static getReferredStudents(codeOrId) {
    if (!codeOrId) return [];
    const db = getDb();
    let codeStr = String(codeOrId).trim();
    let employeeId = null;
    
    // If integer ID was provided, look up the referral code & employee owner first
    if (/^\d+$/.test(codeStr)) {
      const ref = db.prepare('SELECT code, employee_id FROM referrals WHERE id = ?').get(codeOrId);
      if (ref) {
        codeStr = ref.code;
        employeeId = ref.employee_id || null;
      }
    }

    return db.prepare(`
      SELECT 
        r.id as registration_id,
        r.registration_id as reg_display_id,
        COALESCE(r.created_at, s.created_at) as registered_at,
        COALESCE(r.status, 'account_only') as reg_status,
        s.student_id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone,
        s.college,
        s.department,
        COALESCE(c.title, 'Account Registered (Not Enrolled Yet)') as course_title,
        COALESCE(c.price, 0) as price,
        COALESCE(r.total_amount, 0) as total_amount,
        COALESCE(r.paid_amount, 0) as paid_amount,
        COALESCE(r.balance_amount, 0) as balance_amount
      FROM students s
      LEFT JOIN registrations r ON r.id = (
        SELECT r2.id FROM registrations r2
        WHERE r2.student_id = s.id AND r2.status != 'cancelled'
        ORDER BY r2.created_at DESC, r2.id DESC
        LIMIT 1
      )
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE LOWER(COALESCE(r.referral_code, '')) = LOWER(?)
         OR LOWER(COALESCE(s.referral_code, '')) = LOWER(?)
         ${employeeId ? 'OR s.referred_by = ?' : ''}
      ORDER BY COALESCE(r.created_at, s.created_at) DESC
    `).all(...(employeeId ? [codeStr, codeStr, employeeId] : [codeStr, codeStr]));
  }

  static create(data) {
    const db = getDb();
    const code = String(data.code).trim().toUpperCase();
    const result = db.prepare(`
      INSERT INTO referrals (code, referrer_name, referrer_email, referrer_type, discount_percent, max_uses, times_used, employee_id, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1)
    `).run(
      code,
      data.referrer_name,
      data.referrer_email || null,
      data.referrer_type || (data.employee_id ? 'employee' : 'student'),
      data.discount_percent || 0,
      data.max_uses || 0,
      data.employee_id || null
    );
    return this.findById(result.lastInsertRowid);
  }

  static update(id, data) {
    const db = getDb();
    db.prepare(`
      UPDATE referrals
      SET referrer_name = COALESCE(?, referrer_name),
          referrer_email = COALESCE(?, referrer_email),
          discount_percent = COALESCE(?, discount_percent),
          max_uses = COALESCE(?, max_uses),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.referrer_name,
      data.referrer_email,
      data.discount_percent,
      data.max_uses,
      data.is_active,
      id
    );
    return this.findById(id);
  }

  static delete(id) {
    const db = getDb();
    return db.prepare('DELETE FROM referrals WHERE id = ?').run(id);
  }

  static incrementUses(code) {
    const db = getDb();
    const str = String(code).trim();
    return db.prepare('UPDATE referrals SET times_used = times_used + 1, updated_at = CURRENT_TIMESTAMP WHERE LOWER(code) = LOWER(?)').run(str);
  }
}

module.exports = Referral;
