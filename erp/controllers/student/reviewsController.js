const { getDb } = require('../../config/database');
const { Review } = require('../../models');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    const student = db.prepare('SELECT id, first_name, last_name FROM students WHERE user_id = ?').get(req.user.id);

    const userId = req.user.id;
    const myReviews = Review.findAll({ user_id: userId }) || [];

    // Get courses student is enrolled in
    let enrolledCourses = [];
    if (student) {
      enrolledCourses = db.prepare(`
        SELECT DISTINCT c.id, c.title, c.batch_name
        FROM registrations r
        JOIN courses c ON r.course_id = c.id
        WHERE r.student_id = ? AND r.deleted_at IS NULL
      `).all(student.id) || [];
    }

    // Courses already reviewed
    const reviewedCourseIds = myReviews.map(r => r.course_id).filter(Boolean);

    res.render('student/reviews/index', {
      layout: 'layouts/student',
      title: 'Reviews & Feedback | AROX ERP',
      pageTitle: 'Course Reviews & Rating',
      currentPath: '/student/reviews',
      user: req.user,
      student,
      myReviews,
      enrolledCourses,
      reviewedCourseIds
    });
  } catch (error) {
    logger.error('Student Reviews index error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/student',
      title: 'Error - Student Portal',
      code: 500,
      message: 'Failed to load reviews.',
      user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
    });
  }
};

