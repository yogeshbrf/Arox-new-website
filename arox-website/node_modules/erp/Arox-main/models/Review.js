const { getDb } = require('../config/database');

class Review {
  static findAll({ status, user_type, user_id } = {}) {
    const db = getDb();
    let query = `
      SELECT 
        r.*,
        r.comment as review_text
      FROM reviews r 
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ' AND r.status = ?';
      params.push(status);
    }
    if (user_type && user_type !== 'all') {
      query += ' AND r.user_type = ?';
      params.push(user_type);
    }
    if (user_id) {
      query += ' AND r.user_id = ?';
      params.push(user_id);
    }

    query += ' ORDER BY r.created_at DESC';
    return db.prepare(query).all(...params);
  }

  static findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT 
        r.*,
        r.comment as review_text
      FROM reviews r
      WHERE r.id = ?
    `).get(id);
  }

  static findByUserAndCourse(userId, courseId) {
    const db = getDb();
    return db.prepare(`
      SELECT 
        r.*,
        r.comment as review_text
      FROM reviews r
      WHERE r.user_id = ? AND r.course_id = ?
    `).get(userId, courseId);
  }

  static create({ user_id, user_type, reviewer_name, reviewer_email, course_id = null, course_title = null, rating, title = null, comment, review_text }) {
    const db = getDb();
    const finalComment = (comment || review_text || '').trim();
    const result = db.prepare(`
      INSERT INTO reviews (
        user_id, user_type, reviewer_name, reviewer_email, course_id, course_title,
        rating, title, comment, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      user_id,
      user_type,
      reviewer_name,
      reviewer_email,
      course_id || null,
      course_title || null,
      Math.min(5, Math.max(1, Number(rating) || 5)),
      title || null,
      finalComment
    );
    return { id: result.lastInsertRowid, status: 'pending' };
  }

  static acknowledge(id, adminUser, replyText = null) {
    const db = getDb();
    const adminName = `${adminUser.first_name || ''} ${adminUser.last_name || ''}`.trim() || adminUser.email || 'Admin';
    if (replyText) {
      db.prepare(`
        UPDATE reviews 
        SET status = 'acknowledged',
            acknowledged_by = ?,
            acknowledged_by_name = ?,
            acknowledged_at = CURRENT_TIMESTAMP,
            admin_reply = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(adminUser.id, adminName, replyText, id);
    } else {
      db.prepare(`
        UPDATE reviews 
        SET status = 'acknowledged',
            acknowledged_by = ?,
            acknowledged_by_name = ?,
            acknowledged_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(adminUser.id, adminName, id);
    }
    return this.findById(id);
  }

  static reply(id, replyText, adminUser) {
    const db = getDb();
    const adminName = `${adminUser.first_name || ''} ${adminUser.last_name || ''}`.trim() || adminUser.email || 'Admin';
    db.prepare(`
      UPDATE reviews 
      SET admin_reply = ?,
          status = 'acknowledged',
          acknowledged_by = COALESCE(acknowledged_by, ?),
          acknowledged_by_name = COALESCE(acknowledged_by_name, ?),
          acknowledged_at = COALESCE(acknowledged_at, CURRENT_TIMESTAMP),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(replyText, adminUser.id, adminName, id);
    return this.findById(id);
  }

  static delete(id) {
    const db = getDb();
    return db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
  }
}

module.exports = Review;
