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
    
    // If integer ID was provided, look up the referral code first
    if (/^\d+$/.test(codeStr)) {
      const ref = db.prepare('SELECT code FROM referrals WHERE id = ?').get(codeOrId);
      if (ref) codeStr = ref.code;
    }

    return db.prepare(`
      SELECT 
        r.id as registration_id,
        r.registration_id as reg_display_id,
        r.created_at as registered_at,
        r.status as reg_status,
        s.first_name,
        s.last_name,
        s.email,
        s.phone,
        s.college,
        s.department,
        c.title as course_title,
        c.price,
        r.total_amount,
        r.paid_amount,
        r.balance_amount
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      JOIN courses c ON r.course_id = c.id
      WHERE LOWER(r.referral_code) = LOWER(?)
      ORDER BY r.created_at DESC
    `).all(codeStr);
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
