const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');
const syncService = require('../../services/syncService');
const { logAudit } = require('../../services/auditService');

const VALID_STATUSES = ['present', 'absent', 'late', 'leave', 'holiday'];
const VALID_METHODS = ['manual', 'qr', 'online', 'offline', 'gps'];

function getTodayDateString() {
  const now = new Date();
  const ist = new Date(now.getTime() + (330 * 60 * 1000));
  return ist.toISOString().split('T')[0];
}

function getCurrentTimeString() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

const adminAttendanceController = {
  /**
   * GET /admin/attendance
   * Full attendance manager console with live roster, quick mark, edit, and bulk actions
   */
  renderPage(req, res) {
    try {
      const db = getDb();
      const filterDate = req.query.date !== undefined ? req.query.date : getTodayDateString();
      const filterCourseId = req.query.course_id ? parseInt(req.query.course_id, 10) : '';
      const filterStatus = req.query.status || '';
      const search = (req.query.search || '').trim();

      const courses = db.prepare(`
        SELECT id, title, mode, class_timing, class_available, trainer_available_today
        FROM courses
        ORDER BY title ASC
      `).all();

      // Roster of students + their enrolled courses (fallback to all students if no registration yet)
      const studentEnrollments = db.prepare(`
        SELECT s.id AS student_id, s.student_id AS student_code, s.first_name, s.last_name, s.email, s.phone,
               r.course_id, c.title AS course_title, c.mode AS course_mode, c.class_timing
        FROM students s
        JOIN registrations r ON r.student_id = s.id
        JOIN courses c ON r.course_id = c.id
        WHERE r.status IN ('pending', 'confirmed', 'active', 'completed')
        ORDER BY s.first_name ASC, c.title ASC
      `).all();

      const allStudents = db.prepare(`
        SELECT id, student_id AS student_code, first_name, last_name, email
        FROM students
        ORDER BY first_name ASC, last_name ASC
      `).all();

      let where = '1=1';
      const params = {};

      if (filterDate) {
        where += ' AND a.date = @date';
        params.date = filterDate;
      }
      if (filterCourseId) {
        where += ' AND a.course_id = @course_id';
        params.course_id = filterCourseId;
      }
      if (filterStatus && VALID_STATUSES.includes(filterStatus)) {
        where += ' AND a.status = @status';
        params.status = filterStatus;
      }
      if (search) {
        where += ' AND (s.first_name LIKE @q OR s.last_name LIKE @q OR s.student_id LIKE @q OR c.title LIKE @q)';
        params.q = `%${search}%`;
      }

      const records = db.prepare(`
        SELECT a.*,
          s.student_id AS student_code,
          TRIM(s.first_name || ' ' || COALESCE(s.last_name, '')) AS student_name,
          s.email AS student_email,
          c.title AS course_title,
          c.mode AS course_mode,
          COALESCE(NULLIF(TRIM(u.first_name || ' ' || COALESCE(u.last_name, '')), ''), u.email) AS marked_by_name
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN courses c ON a.course_id = c.id
        LEFT JOIN users u ON a.marked_by = u.id
        WHERE ${where}
        ORDER BY a.date DESC, a.id DESC
      `).all(params);

      // Summary counts for filtered date (or overall when date cleared)
      const summaryRow = db.prepare(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count,
          SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent_count,
          SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS late_count,
          SUM(CASE WHEN a.status = 'leave' THEN 1 ELSE 0 END) AS leave_count,
          SUM(CASE WHEN a.status = 'holiday' THEN 1 ELSE 0 END) AS holiday_count
        FROM attendance a
        ${filterDate ? 'WHERE a.date = @date' : ''}
      `).get(filterDate ? { date: filterDate } : {});

      res.render('admin/attendance/index', {
        title: 'Attendance Management - AROX Admin',
        pageTitle: 'Attendance Management',
        activePage: 'attendance',
        layout: 'layouts/admin',
        user: req.user,
        records,
        courses,
        studentEnrollments,
        allStudents,
        summary: {
          total: summaryRow?.total || 0,
          present: summaryRow?.present_count || 0,
          absent: summaryRow?.absent_count || 0,
          late: summaryRow?.late_count || 0,
          leave: summaryRow?.leave_count || 0,
          holiday: summaryRow?.holiday_count || 0
        },
        filters: {
          date: filterDate,
          course_id: filterCourseId,
          status: filterStatus,
          search
        },
        todayDate: getTodayDateString()
      });
    } catch (err) {
      logger.error('Admin attendance render error:', err);
      res.status(500).render('website/error', {
        layout: false,
        title: 'Error',
        code: 500,
        message: 'Failed to load attendance manager: ' + err.message,
        user: req.user
      });
    }
  },

  /**
   * GET /api/admin/attendance
   */
  list(req, res) {
    try {
      const db = getDb();
      let where = '1=1';
      const params = {};

      if (req.query.date) {
        where += ' AND a.date = @date';
        params.date = req.query.date;
      }
      if (req.query.course_id) {
        where += ' AND a.course_id = @course_id';
        params.course_id = parseInt(req.query.course_id, 10);
      }
      if (req.query.student_id) {
        where += ' AND a.student_id = @student_id';
        params.student_id = parseInt(req.query.student_id, 10);
      }
      if (req.query.status && VALID_STATUSES.includes(req.query.status)) {
        where += ' AND a.status = @status';
        params.status = req.query.status;
      }

      const records = db.prepare(`
        SELECT a.*,
          s.student_id AS student_code,
          TRIM(s.first_name || ' ' || COALESCE(s.last_name, '')) AS student_name,
          c.title AS course_title,
          c.mode AS course_mode
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN courses c ON a.course_id = c.id
        WHERE ${where}
        ORDER BY a.date DESC, a.id DESC
      `).all(params);

      res.json({ success: true, data: records });
    } catch (err) {
      logger.error('Admin attendance list error:', err);
      res.status(500).json({ success: false, message: 'Failed to load attendance records.' });
    }
  },

  /**
   * POST /api/admin/attendance
   * Create or update (override) attendance for any student/course/date
   */
  upsert(req, res) {
    try {
      const db = getDb();
      const studentId = parseInt(req.body.student_id, 10);
      const courseId = parseInt(req.body.course_id, 10);
      const date = (req.body.date || getTodayDateString()).trim();
      const status = (req.body.status || 'present').trim().toLowerCase();
      const method = VALID_METHODS.includes(req.body.method) ? req.body.method : 'manual';
      const checkInTime = req.body.check_in_time !== undefined
        ? req.body.check_in_time
        : (status === 'absent' || status === 'leave' || status === 'holiday' ? null : getCurrentTimeString());
      const checkOutTime = req.body.check_out_time || null;
      const remarks = req.body.remarks ? String(req.body.remarks).trim() : null;

      if (!studentId || !courseId) {
        return res.status(400).json({ success: false, message: 'Student and Course are required.' });
      }
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid attendance status.' });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ success: false, message: 'Date must be YYYY-MM-DD.' });
      }

      const student = db.prepare('SELECT id, first_name, last_name FROM students WHERE id = ?').get(studentId);
      const course = db.prepare('SELECT id, title FROM courses WHERE id = ?').get(courseId);
      if (!student || !course) {
        return res.status(404).json({ success: false, message: 'Student or course not found.' });
      }

      db.prepare(`
        INSERT INTO attendance (student_id, course_id, date, status, check_in_time, check_out_time, method, remarks, marked_by, updated_by_admin, updated_at)
        VALUES (@student_id, @course_id, @date, @status, @check_in_time, @check_out_time, @method, @remarks, @marked_by, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(student_id, course_id, date) DO UPDATE SET
          status = excluded.status,
          check_in_time = COALESCE(excluded.check_in_time, attendance.check_in_time),
          check_out_time = excluded.check_out_time,
          method = excluded.method,
          remarks = excluded.remarks,
          marked_by = excluded.marked_by,
          updated_by_admin = 1,
          updated_at = CURRENT_TIMESTAMP
      `).run({
        student_id: studentId,
        course_id: courseId,
        date,
        status,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        method,
        remarks,
        marked_by: req.user.id
      });

      const saved = db.prepare('SELECT * FROM attendance WHERE student_id = ? AND course_id = ? AND date = ?').get(studentId, courseId, date);

      logAudit(req, {
        action: 'ADMIN_UPSERT_ATTENDANCE',
        module: 'attendance',
        entityType: 'attendance',
        entityId: saved ? saved.id : null,
        newValues: { studentId, courseId, date, status, method, remarks }
      });

      syncService.broadcast('attendance:marked', {
        studentId,
        courseId,
        date,
        status,
        updatedByAdmin: true,
        message: `Admin marked ${student.first_name} (${course.title}) as ${status.toUpperCase()} for ${date}.`
      });

      res.json({ success: true, message: 'Attendance saved successfully.', data: saved });
    } catch (err) {
      logger.error('Admin attendance upsert error:', err);
      res.status(500).json({ success: false, message: 'Failed to save attendance: ' + err.message });
    }
  },

  /**
   * PUT /api/admin/attendance/:id
   */
  updateById(req, res) {
    try {
      const db = getDb();
      const id = parseInt(req.params.id, 10);
      const existing = db.prepare('SELECT * FROM attendance WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Attendance record not found.' });
      }

      const status = req.body.status ? String(req.body.status).trim().toLowerCase() : existing.status;
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid attendance status.' });
      }

      const method = req.body.method && VALID_METHODS.includes(req.body.method) ? req.body.method : existing.method;
      const date = req.body.date && /^\d{4}-\d{2}-\d{2}$/.test(req.body.date) ? req.body.date : existing.date;
      const checkInTime = req.body.check_in_time !== undefined ? req.body.check_in_time : existing.check_in_time;
      const checkOutTime = req.body.check_out_time !== undefined ? req.body.check_out_time : existing.check_out_time;
      const remarks = req.body.remarks !== undefined ? (req.body.remarks ? String(req.body.remarks).trim() : null) : existing.remarks;

      db.prepare(`
        UPDATE attendance
        SET date = @date, status = @status, method = @method, check_in_time = @check_in_time,
            check_out_time = @check_out_time, remarks = @remarks, marked_by = @marked_by,
            updated_by_admin = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `).run({
        id,
        date,
        status,
        method,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        remarks,
        marked_by: req.user.id
      });

      const updated = db.prepare('SELECT * FROM attendance WHERE id = ?').get(id);

      syncService.broadcast('attendance:marked', {
        studentId: existing.student_id,
        courseId: existing.course_id,
        date,
        status,
        updatedByAdmin: true,
        message: `Admin updated attendance #${id} to ${status.toUpperCase()}.`
      });

      res.json({ success: true, message: 'Attendance record updated.', data: updated });
    } catch (err) {
      logger.error('Admin attendance update error:', err);
      res.status(500).json({ success: false, message: 'Failed to update attendance: ' + err.message });
    }
  },

  /**
   * POST /api/admin/attendance/bulk
   * Bulk mark multiple students/courses at once
   */
  bulkMark(req, res) {
    try {
      const db = getDb();
      const date = (req.body.date || getTodayDateString()).trim();
      const status = (req.body.status || 'present').trim().toLowerCase();
      const method = VALID_METHODS.includes(req.body.method) ? req.body.method : 'manual';
      const remarks = req.body.remarks ? String(req.body.remarks).trim() : 'Bulk marked by Admin';
      const entries = Array.isArray(req.body.entries) ? req.body.entries : [];

      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid attendance status.' });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ success: false, message: 'Date must be YYYY-MM-DD.' });
      }
      if (entries.length === 0) {
        return res.status(400).json({ success: false, message: 'Select at least one student to mark.' });
      }

      const defaultTime = (status === 'absent' || status === 'leave' || status === 'holiday') ? null : getCurrentTimeString();
      const stmt = db.prepare(`
        INSERT INTO attendance (student_id, course_id, date, status, check_in_time, method, remarks, marked_by, updated_by_admin, updated_at)
        VALUES (@student_id, @course_id, @date, @status, @check_in_time, @method, @remarks, @marked_by, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(student_id, course_id, date) DO UPDATE SET
          status = excluded.status,
          check_in_time = COALESCE(excluded.check_in_time, attendance.check_in_time),
          method = excluded.method,
          remarks = excluded.remarks,
          marked_by = excluded.marked_by,
          updated_by_admin = 1,
          updated_at = CURRENT_TIMESTAMP
      `);

      let count = 0;
      const tx = db.transaction(() => {
        for (const item of entries) {
          const sid = parseInt(item.student_id, 10);
          const cid = parseInt(item.course_id, 10);
          if (!sid || !cid) continue;
          stmt.run({
            student_id: sid,
            course_id: cid,
            date,
            status,
            check_in_time: defaultTime,
            method,
            remarks,
            marked_by: req.user.id
          });
          count++;
        }
      });
      tx();

      syncService.broadcast('attendance:marked', {
        date,
        status,
        count,
        updatedByAdmin: true,
        message: `Admin bulk-marked ${count} attendance records as ${status.toUpperCase()} for ${date}.`
      });

      res.json({ success: true, message: `Updated attendance for ${count} enrollment(s).`, count });
    } catch (err) {
      logger.error('Admin bulk attendance error:', err);
      res.status(500).json({ success: false, message: 'Bulk attendance failed: ' + err.message });
    }
  },

  /**
   * DELETE /api/admin/attendance/:id
   */
  deleteById(req, res) {
    try {
      const db = getDb();
      const id = parseInt(req.params.id, 10);
      const existing = db.prepare('SELECT * FROM attendance WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Attendance record not found.' });
      }

      db.prepare('DELETE FROM attendance WHERE id = ?').run(id);
      syncService.broadcast('attendance:marked', {
        studentId: existing.student_id,
        courseId: existing.course_id,
        deleted: true,
        message: `Admin removed an attendance record for ${existing.date}.`
      });

      res.json({ success: true, message: 'Attendance record deleted.' });
    } catch (err) {
      logger.error('Admin attendance delete error:', err);
      res.status(500).json({ success: false, message: 'Failed to delete attendance.' });
    }
  }
};

module.exports = adminAttendanceController;
