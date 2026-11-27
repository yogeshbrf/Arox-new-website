const { getDb } = require('../config/database');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

class User {
  static findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ?
    `).get(id);
  }

  static findByEmail(email) {
    const db = getDb();
    return db.prepare(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE LOWER(TRIM(u.email)) = LOWER(TRIM(?))
    `).get(email);
  }

  static async create(data) {
    const db = getDb();
    const passwordHash = await bcrypt.hash(data.password, authConfig.bcryptRounds);
    
    let roleId = 3;
    if (data.roleId) {
      roleId = data.roleId;
    } else if (data.role) {
      const roleMap = {
        'super_admin': 1,
        'admin': 2,
        'student': 3,
        'staff': 4,
        'trainer': 4,
        'employee': 4
      };
      roleId = roleMap[data.role.toLowerCase()] || 3;
    }

    const first_name = data.first_name || '';
    const last_name = data.last_name || '';
    const phone = data.phone || '';
    const status = data.status || 'active';
    const email = data.email;
    let referralCode = data.referral_code ? String(data.referral_code).trim().toUpperCase() : null;

    const result = db.prepare(`
      INSERT INTO users (email, password_hash, role_id, status, first_name, last_name, phone, email_verified, referral_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).run(email, passwordHash, roleId, status, first_name, last_name, phone, referralCode);

    const newId = result.lastInsertRowid;
    if (roleId === 4) {
      referralCode = this.ensureEmployeeReferralCode(newId, first_name, last_name, email, referralCode);
    }

    return { id: newId, email, roleId, referral_code: referralCode };
  }

  static ensureEmployeeReferralCode(userId, firstName = '', lastName = '', email = '', preferredCode = null) {
    const db = getDb();
    let userRow = db.prepare('SELECT id, first_name, last_name, email, referral_code FROM users WHERE id = ?').get(userId);
    if (!userRow) return null;

    let code = (preferredCode || userRow.referral_code || '').trim().toUpperCase();
    if (!code) {
      const prefix = (firstName || userRow.first_name || 'EMP').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'EMP';
      code = `AROX-${prefix}${String(userId).padStart(2, '0')}`;
      let suffix = 1;
      while (
        db.prepare('SELECT id FROM users WHERE UPPER(referral_code) = UPPER(?) AND id != ?').get(code, userId) ||
        db.prepare('SELECT id FROM referrals WHERE LOWER(code) = LOWER(?) AND (employee_id IS NULL OR employee_id != ?)').get(code, userId)
      ) {
        code = `AROX-${prefix}${userId}${suffix++}`;
      }
    }

    db.prepare('UPDATE users SET referral_code = ? WHERE id = ?').run(code, userId);

    const fullName = `${firstName || userRow.first_name || ''} ${lastName || userRow.last_name || ''}`.trim() || (email || userRow.email);
    const existingRef = db.prepare('SELECT id, employee_id FROM referrals WHERE LOWER(code) = LOWER(?)').get(code);
    if (!existingRef) {
      db.prepare(`
        INSERT INTO referrals (code, referrer_name, referrer_email, referrer_type, discount_percent, max_uses, times_used, employee_id, is_active)
        VALUES (?, ?, ?, 'employee', 5, 0, 0, ?, 1)
      `).run(code, fullName, email || userRow.email || null, userId);
    } else if (!existingRef.employee_id) {
      db.prepare("UPDATE referrals SET employee_id = ?, referrer_type = 'employee', is_active = 1 WHERE id = ?").run(userId, existingRef.id);
    }
    return code;
  }

  static findAll() {
    const db = getDb();
    return db.prepare(`
      SELECT u.*, r.name as role, (u.status = 'active') as is_active 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `).all();
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static updateLastLogin(id) {
    const db = getDb();
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  }

  static updatePassword(id, passwordHash) {
    const db = getDb();
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(passwordHash, id);
  }

  static setResetToken(id, token, expires) {
    const db = getDb();
    db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?').run(token, expires, id);
  }

  static findByResetToken(token) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > CURRENT_TIMESTAMP').get(token);
  }

  static getAll({ page = 1, limit = 20, role, status, search } = {}) {
    const db = getDb();
    let query = `SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE 1=1`;
    const params = [];

    if (role) { query += ' AND r.name = ?'; params.push(role); }
    if (status) { query += ' AND u.status = ?'; params.push(status); }
    if (search) { query += ' AND u.email LIKE ?'; params.push(`%${search}%`); }

    const countQuery = query.replace('SELECT u.*, r.name as role_name', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQuery).get(...params).total;

    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const users = db.prepare(query).all(...params);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = User;
