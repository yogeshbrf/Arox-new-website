const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    const student = db.prepare('SELECT id, first_name, last_name FROM students WHERE user_id = ?').get(req.user.id);

    if (!student) {
      return res.render('student/attendance/index', {
        layout: 'layouts/student',
        title: 'Attendance | AROX ERP',
        pageTitle: 'Attendance & Schedule',
        currentPath: '/student/attendance',
        user: req.user,
        student: null,
        courses: [],
        serverToday: new Date().toISOString().split('T')[0]
      });
    }

    // Format server today YYYY-MM-DD
    const localNow = new Date();
    const year = localNow.getFullYear();
    const month = String(localNow.getMonth() + 1).padStart(2, '0');
    const day = String(localNow.getDate()).padStart(2, '0');
    const serverToday = `${year}-${month}-${day}`;

    // Fetch student's registered courses
    const registeredCourses = db.prepare(`
      SELECT 
        r.id as registration_id,
        r.status as reg_status,
        COALESCE(r.start_date, c.start_date) as start_date,
        COALESCE(r.end_date, c.end_date) as end_date,
        c.id as course_id,
        c.title as course_title,
        c.duration as course_duration,
        c.mode as course_mode,
        COALESCE(r.batch_name, c.batch_name) as batch_name
      FROM registrations r
      JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = ? AND r.deleted_at IS NULL
      ORDER BY r.created_at DESC
    `).all(student.id) || [];

    // For each course, get attendance list and compute statistics
    const coursesWithAttendance = registeredCourses.map(course => {
      const records = db.prepare(`
        SELECT id, date, status, check_in_time, check_out_time, method
        FROM attendance
        WHERE student_id = ? AND course_id = ?
        ORDER BY date ASC
      `).all(student.id, course.course_id) || [];

      const presentCount = records.filter(r => r.status === 'present').length;
      const totalRecorded = records.length;
      const percentage = totalRecorded > 0 ? Math.round((presentCount / totalRecorded) * 100) : 100;

      // Check if marked for today
      const todayRecord = records.find(r => r.date === serverToday);
      const isMarkedToday = !!todayRecord;

      // Check if serverToday is within start_date and end_date
      let canMarkToday = true;
      let dateRestrictionReason = '';

      if (course.start_date && serverToday < course.start_date) {
        canMarkToday = false;
        dateRestrictionReason = `Course starts on ${course.start_date}`;
      } else if (course.end_date && serverToday > course.end_date) {
        canMarkToday = false;
        dateRestrictionReason = `Course ended on ${course.end_date}`;
      }

      return {
        ...course,
        records,
        presentCount,
        totalRecorded,
        percentage,
        isMarkedToday,
        todayRecord,
        canMarkToday,
        dateRestrictionReason
      };
    });

    res.render('student/attendance/index', {
      layout: 'layouts/student',
      title: 'Attendance | AROX ERP',
      pageTitle: 'Attendance & Schedule',
      currentPath: '/student/attendance',
      user: req.user,
      student,
      courses: coursesWithAttendance,
      serverToday
    });
  } catch (error) {
    logger.error('Student Attendance index error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/student',
      title: 'Error - Student Portal',
      code: 500,
      message: 'Failed to load attendance records.',
      user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
    });
  }
};

