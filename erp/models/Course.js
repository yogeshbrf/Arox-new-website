const { getDb } = require('../config/database');

class Course {
  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  }

  static findBySlug(slug) {
    const db = getDb();
    return db.prepare('SELECT * FROM courses WHERE slug = ?').get(slug);
  }

  static getAll({ category, mode, level, search, featured, active = true } = {}) {
    const db = getDb();
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    if (active) { query += ' AND is_active = 1'; }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (mode) { query += ' AND mode = ?'; params.push(mode); }
    if (level) { query += ' AND level = ?'; params.push(level); }
    if (featured) { query += ' AND is_featured = 1'; }
    if (search) {
      query += ' AND (title LIKE ? OR short_description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';
    return db.prepare(query).all(...params);
  }

  static getFeatured(limit = 3) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM courses 
      WHERE is_active = 1 AND is_featured = 1 
      ORDER BY sort_order ASC 
      LIMIT ?
    `).all(limit);
  }

  static incrementEnrollment(id) {
    const db = getDb();
    db.prepare('UPDATE courses SET total_enrolled = total_enrolled + 1 WHERE id = ?').run(id);
  }

  static getCount() {
    const db = getDb();
    return db.prepare('SELECT COUNT(*) as count FROM courses WHERE is_active = 1').get().count;
  }

  static create(data) {
    const db = getDb();
    
    const dbData = {
      title: data.title,
      slug: data.slug,
      category: data.type || 'training',
      mode: ['online', 'offline', 'hybrid'].includes(data.mode) ? data.mode : 'online',
      batch_name: data.batch_name,
      duration: data.duration || '8 Weeks',
      price: data.fee || 0,
      start_date: data.start_date,
      end_date: data.end_date,
      max_students: data.max_students || 50,
      description: data.description,
      trainer_name: data.trainer_name || null,
      class_timing: data.class_timing || null,
      class_available: data.class_available !== undefined ? (data.class_available ? 1 : 0) : 1,
      trainer_available_today: data.trainer_available_today !== undefined ? (data.trainer_available_today ? 1 : 0) : 1,
      trainer_status_note: data.trainer_status_note || null,
      classroom_location: data.classroom_location || null,
      is_active: (data.status === 'active' || data.status === '1' || data.status === 1) ? 1 : 0
    };

    const result = db.prepare(`
      INSERT INTO courses (
        title, slug, category, mode, batch_name, duration, price, start_date, end_date, max_students, description,
        trainer_name, class_timing, class_available, trainer_available_today, trainer_status_note, classroom_location, is_active
      ) VALUES (
        @title, @slug, @category, @mode, @batch_name, @duration, @price, @start_date, @end_date, @max_students, @description,
        @trainer_name, @class_timing, @class_available, @trainer_available_today, @trainer_status_note, @classroom_location, @is_active
      )
    `).run(dbData);

    return result.lastInsertRowid;
  }
}

module.exports = Course;
