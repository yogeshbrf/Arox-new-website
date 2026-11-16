const logger = require('../../utils/logger');
const { getDb } = require('../../config/database');
const bcrypt = require('bcryptjs');
const syncService = require('../../services/syncService');
const { logAudit } = require('../../services/auditService');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    // Students list with registrations count
    const students = db.prepare(`
      SELECT 
        s.id, s.student_id, s.college AS college_name, s.degree, s.phone AS whatsapp_no,
        s.first_name, s.last_name, s.email, s.department, s.year_of_study, s.status, s.created_at,
        (SELECT COUNT(*) FROM registrations r WHERE r.student_id = s.id AND r.deleted_at IS NULL) as course_count
      FROM students s
      WHERE s.deleted_at IS NULL
      ORDER BY s.created_at DESC
    `).all();

    res.render('admin/students/index', {
      layout: 'layouts/admin',
      title: 'Students Directory | AROX ERP',
      pageTitle: 'Students',
      currentPath: '/admin/students',
      user: req.user,
      students
    });
  } catch (error) {
    logger.error('Students Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin', 
      code: 500,
      message: 'Failed to load students.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.show = (req, res) => {
  try {
    const db = getDb();
    const studentId = req.params.id;

    // Get student + user details
    const student = db.prepare(`
      SELECT 
        s.*, s.college AS college_name, s.phone AS whatsapp_no
      FROM students s
      WHERE s.id = ? AND s.deleted_at IS NULL
    `).get(studentId);

    if (!student) {
      return res.status(404).render('website/error', { 
        layout: 'layouts/admin', 
        code: 404,
        message: 'Student not found.',
        user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
      });
    }

    // Get their registrations with course details
    const registrations = db.prepare(`
      SELECT 
        r.*,
        c.title as course_title, c.category as course_type, c.batch_name
      FROM registrations r
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = ? AND r.deleted_at IS NULL
      ORDER BY r.created_at DESC
    `).all(studentId);

    res.render('admin/students/show', {
      layout: 'layouts/admin',
      title: `${student.first_name} ${student.last_name} | AROX ERP`,
      pageTitle: 'Student Profile',
      currentPath: '/admin/students',
      user: req.user,
      student,
      registrations
    });
  } catch (error) {
    logger.error('Student Details Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin', 
      code: 500,
      message: 'Failed to load student details.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, college, department, degree, year_of_study } = req.body;
    const db = getDb();

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    const existing = db.prepare('SELECT id FROM students WHERE email = ? AND deleted_at IS NULL').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Student with this email already exists.' });
    }

    const emailPrefix = email.includes('@') ? email.split('@')[0] : email;
    const defaultPassHash = await bcrypt.hash(emailPrefix, 10);
    const userRes = db.prepare(`
      INSERT INTO users (email, password_hash, role_id, first_name, last_name, phone, status, email_verified)
      VALUES (?, ?, 3, ?, ?, ?, 'active', 1)
    `).run(email, defaultPassHash, first_name, last_name, phone || null);

    const userId = userRes.lastInsertRowid;
    const studentIdStr = 'AT/STU/' + new Date().getFullYear() + '/' + Math.floor(1000 + Math.random() * 9000);

    const studentRes = db.prepare(`
      INSERT INTO students (
        user_id, student_id, first_name, last_name, email, phone,
        college, department, degree, year_of_study, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      userId, studentIdStr, first_name, last_name, email, phone || null,
      college || null, department || null, degree || null, year_of_study || null
    );

    const studentDbId = studentRes.lastInsertRowid;

    logAudit(req, {
      action: 'CREATE_STUDENT',
      module: 'students',
      entityType: 'student',
      entityId: studentDbId,
      newValues: { first_name, last_name, email, phone, college }
    });

    syncService.broadcast('student:created', {
      id: studentDbId,
      name: `${first_name} ${last_name}`,
      message: `New student ${first_name} ${last_name} enrolled.`
    });

    res.status(201).json({ success: true, message: 'Student created successfully.', id: studentDbId });
  } catch (error) {
    logger.error('Student Create Error:', error);
    res.status(500).json({ error: 'Failed to create student: ' + error.message });
  }
};

exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, college, department, degree, year_of_study, status } = req.body;
    const db = getDb();

    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    db.prepare(`
      UPDATE students SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        college = COALESCE(?, college),
        department = COALESCE(?, department),
        degree = COALESCE(?, degree),
        year_of_study = COALESCE(?, year_of_study),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      first_name || null, last_name || null, email || null, phone || null,
      college || null, department || null, degree || null, year_of_study || null,
      status || null, id
    );

    logAudit(req, {
      action: 'UPDATE_STUDENT',
      module: 'students',
      entityType: 'student',
      entityId: id,
      oldValues: student,
      newValues: req.body
    });

    syncService.broadcast('student:updated', {
      id,
      name: `${first_name || student.first_name} ${last_name || student.last_name}`,
      message: `Student details for #${student.student_id} updated.`
    });

    res.json({ success: true, message: 'Student profile updated successfully.' });
  } catch (error) {
    logger.error('Student Update Error:', error);
    res.status(500).json({ error: 'Failed to update student: ' + error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    // Non-destructive soft delete (Acceptance test #7)
    db.prepare('UPDATE students SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

    logAudit(req, {
      action: 'DELETE_STUDENT',
      module: 'students',
      entityType: 'student',
      entityId: id,
      oldValues: student
    });

    syncService.broadcast('student:deleted', {
      id,
      name: `${student.first_name} ${student.last_name}`,
      message: `Student #${student.student_id} removed.`
    });

    res.json({ success: true, message: 'Student deleted successfully without broken references.' });
  } catch (error) {
    logger.error('Student Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete student: ' + error.message });
  }
};
