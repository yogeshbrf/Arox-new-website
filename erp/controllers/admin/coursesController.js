const logger = require('../../utils/logger');
const { getDb } = require('../../config/database');
const helpers = require('../../utils/helpers');
const syncService = require('../../services/syncService');
const { logAudit } = require('../../services/auditService');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    // Fetch courses with enrollment counts
    const courses = db.prepare(`
      SELECT 
        c.*,
        coalesce(c.price, 0) as fee,
        coalesce(c.category, 'training') as type,
        coalesce(c.category, 'training') as category,
        CASE WHEN c.is_active = 1 THEN 'active' ELSE 'draft' END as status,
        (SELECT COUNT(*) FROM registrations r WHERE r.course_id = c.id) as enrolled_count
      FROM courses c
      ORDER BY c.created_at DESC
    `).all() || [];

    res.render('admin/courses/index', {
      layout: 'layouts/admin',
      title: 'Courses & Internships | AROX ERP',
      pageTitle: 'Courses & Internships',
      user: req.user,
      courses
    });
  } catch (error) {
    logger.error('Courses Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin', 
      code: 500,
      message: 'Failed to load courses.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.create = (req, res) => {
  try {
    const { 
      title, type, mode, batch_name, duration, fee, 
      start_date, end_date, max_students, description, status,
      trainer_name, class_timing, class_available, trainer_available_today, trainer_status_note, classroom_location
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Course title is required.' });
    }

    const slug = helpers.slugify(title) + '-' + helpers.slugify(batch_name || 'batch-1') + '-' + Date.now().toString().slice(-4);

    const newId = require('../../models/Course').create({
      title,
      slug,
      type: type || 'training',
      mode: mode || 'online',
      batch_name,
      duration,
      fee: parseFloat(fee) || 0,
      start_date,
      end_date,
      max_students: parseInt(max_students) || 50,
      description,
      trainer_name,
      class_timing,
      class_available: class_available === undefined ? 1 : (class_available === true || class_available === '1' || class_available === 1 || class_available === 'true' ? 1 : 0),
      trainer_available_today: trainer_available_today === undefined ? 1 : (trainer_available_today === true || trainer_available_today === '1' || trainer_available_today === 1 || trainer_available_today === 'true' ? 1 : 0),
      trainer_status_note,
      classroom_location,
      status: status || 'draft'
    });

    syncService.broadcast('offline_class:updated', {
      courseId: newId,
      title,
      mode: mode || 'online',
      duration,
      classTiming: class_timing,
      message: `Course "${title}" created/scheduled.`
    });

    res.json({ success: true, message: 'Course created successfully', id: newId });
  } catch (error) {
    logger.error('Course Create Error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, type, mode, batch_name, duration, fee, 
      start_date, end_date, max_students, description, status,
      trainer_name, class_timing, class_available, trainer_available_today, trainer_status_note, classroom_location
    } = req.body;

    const db = getDb();
    const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isActive = status !== undefined
      ? ((status === 'active' || status === '1' || status === 1) ? 1 : 0)
      : existing.is_active;

    const parseBoolFlag = (val, fallback) => {
      if (val === undefined || val === null || val === '') return fallback;
      if (val === true || val === 1 || val === '1' || val === 'true' || val === 'on' || val === 'available') return 1;
      return 0;
    };

    const nextMode = (mode && ['online', 'offline', 'hybrid'].includes(String(mode).toLowerCase()))
      ? String(mode).toLowerCase()
      : existing.mode;
    const nextClassAvailable = parseBoolFlag(class_available, existing.class_available !== undefined && existing.class_available !== null ? existing.class_available : 1);
    const nextTrainerAvailable = parseBoolFlag(trainer_available_today, existing.trainer_available_today !== undefined && existing.trainer_available_today !== null ? existing.trainer_available_today : 1);

    db.prepare(`
      UPDATE courses SET
        title = COALESCE(@title, title),
        category = COALESCE(@category, category),
        mode = COALESCE(@mode, mode),
        batch_name = COALESCE(@batch_name, batch_name),
        duration = COALESCE(@duration, duration),
        price = COALESCE(@price, price),
        start_date = COALESCE(@start_date, start_date),
        end_date = COALESCE(@end_date, end_date),
        max_students = COALESCE(@max_students, max_students),
        description = COALESCE(@description, description),
        trainer_name = COALESCE(@trainer_name, trainer_name),
        class_timing = COALESCE(@class_timing, class_timing),
        class_available = @class_available,
        trainer_available_today = @trainer_available_today,
        trainer_status_note = COALESCE(@trainer_status_note, trainer_status_note),
        classroom_location = COALESCE(@classroom_location, classroom_location),
        is_active = @is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({
      id,
      title: title || null,
      category: type || null,
      mode: nextMode,
      batch_name: batch_name !== undefined ? (batch_name || null) : null,
      duration: duration !== undefined ? (duration || null) : null,
      price: (fee !== undefined && fee !== '') ? (parseFloat(fee) || 0) : null,
      start_date: start_date !== undefined ? (start_date || null) : null,
      end_date: end_date !== undefined ? (end_date || null) : null,
      max_students: (max_students !== undefined && max_students !== '') ? (parseInt(max_students, 10) || 50) : null,
      description: description !== undefined ? (description || null) : null,
      trainer_name: trainer_name !== undefined ? (trainer_name || null) : null,
      class_timing: class_timing !== undefined ? (class_timing || null) : null,
      class_available: nextClassAvailable,
      trainer_available_today: nextTrainerAvailable,
      trainer_status_note: trainer_status_note !== undefined ? (trainer_status_note || null) : null,
      classroom_location: classroom_location !== undefined ? (classroom_location || null) : null,
      is_active: isActive
    });

    const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);

    logAudit(req, {
      action: 'UPDATE_COURSE_AND_OFFLINE_SCHEDULE',
      module: 'courses',
      entityType: 'course',
      entityId: parseInt(id, 10),
      newValues: {
        mode: updated.mode,
        duration: updated.duration,
        class_timing: updated.class_timing,
        class_available: updated.class_available,
        trainer_available_today: updated.trainer_available_today,
        trainer_name: updated.trainer_name
      }
    });

    syncService.broadcast('offline_class:updated', {
      courseId: parseInt(id, 10),
      title: updated.title,
      mode: updated.mode,
      duration: updated.duration,
      classTiming: updated.class_timing,
      classAvailable: updated.class_available === 1,
      trainerAvailableToday: updated.trainer_available_today === 1,
      trainerName: updated.trainer_name,
      trainerStatusNote: updated.trainer_status_note,
      classroomLocation: updated.classroom_location,
      message: `${updated.title} schedule updated (${updated.duration}, ${updated.class_timing || 'Timing TBA'} — Class ${updated.class_available === 1 ? 'Available' : 'Unavailable'}, Trainer ${updated.trainer_available_today === 1 ? 'Available Today' : 'Unavailable Today'}).`
    });

    res.json({ success: true, message: 'Course & live class schedule updated and synced!', data: updated });
  } catch (error) {
    logger.error('Course Update Error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isActive = (status === 'active') ? 1 : 0;
    
    const db = getDb();
    db.prepare('UPDATE courses SET is_active = @is_active, updated_at = CURRENT_TIMESTAMP WHERE id = @id').run({ is_active: isActive, id });

    res.json({ success: true, message: 'Course status updated' });
  } catch (error) {
    logger.error('Course Status Update Error:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    // Check if course has registrations before deleting
    const regCount = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE course_id = ?').get(id);
    if (regCount && parseInt(regCount.count, 10) > 0) {
      return res.status(400).json({ error: 'Cannot delete course with existing registrations. Deactivate it instead.' });
    }
    
    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    logger.error('Course Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
