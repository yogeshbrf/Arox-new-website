const express = require('express');
const router = express.Router();
const { Review, Course } = require('../../models');
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const syncService = require('../../services/syncService');
const { logAudit } = require('../../services/auditService');

router.use(authenticate);

/**
 * GET /api/reviews
 * Admin sees all reviews; Employees see all reviews; Students see their own reviews
 */
router.get('/', (req, res) => {
  try {
    const { status, user_type } = req.query;
    let reviews;
    if (['admin', 'super_admin'].includes(req.user.role)) {
      reviews = Review.findAll({ status, user_type });
    } else if (req.user.role === 'employee' || req.user.role === 'staff' || req.user.role === 'trainer') {
      reviews = Review.findAll({ status, user_type });
    } else {
      reviews = Review.findAll({ user_id: req.user.id });
    }
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/reviews
 * Submit review (Student or Employee)
 */
router.post('/', (req, res) => {
  try {
    const { course_id, rating, title } = req.body;
    const comment = req.body.comment || req.body.review_text;
    const user = req.user;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment/review_text are required.' });
    }

    const userType = user.role === 'student' ? 'student' : 'employee';
    let courseTitle = null;

    if (course_id) {
      const course = Course.findById(course_id);
      if (course) {
        courseTitle = course.title;
      }

      // Check if student already submitted a review for this course
      if (userType === 'student') {
        const existing = Review.findByUserAndCourse(user.id, course_id);
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'You have already submitted a review for this course. Reviews are limited to one per course.'
          });
        }
      }
    }

    const reviewerName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

    const created = Review.create({
      user_id: user.id,
      user_type: userType,
      reviewer_name: reviewerName,
      reviewer_email: user.email,
      course_id: course_id || null,
      course_title: courseTitle,
      rating: parseInt(rating, 10),
      title: title || null,
      comment
    });

    logAudit(req, {
      action: 'SUBMIT_REVIEW',
      module: 'reviews',
      entityType: 'review',
      entityId: created.id,
      newValues: { reviewerName, rating, courseTitle, comment }
    });

    syncService.broadcast('review:created', {
      id: created.id,
      user_id: user.id,
      reviewer_name: reviewerName,
      rating,
      message: `New review submitted by ${reviewerName} (${rating}★).`
    });

    const Notification = require('../../models/Notification');
    Notification.notifyAdmins({
      actorUserId: user.id,
      actorName: reviewerName,
      eventType: 'review:created',
      title: 'New Review Submitted',
      message: `${reviewerName} submitted a ${rating}★ review.`,
      targetUrl: '/admin/reviews'
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully! Thank you for your feedback.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper for acknowledging review
const acknowledgeHandler = (req, res) => {
  try {
    const { id } = req.params;
    const replyText = req.body.admin_reply || req.body.reply || null;
    const review = Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    const updated = Review.acknowledge(id, req.user, replyText);

    logAudit(req, {
      action: 'ACKNOWLEDGE_REVIEW',
      module: 'reviews',
      entityType: 'review',
      entityId: id,
      oldValues: { status: review.status },
      newValues: { 
        status: 'acknowledged', 
        acknowledged_by_name: updated.acknowledged_by_name, 
        acknowledged_at: updated.acknowledged_at,
        admin_reply: updated.admin_reply
      }
    });

    syncService.broadcast('review:acknowledged', {
      id: review.id,
      userId: review.user_id,
      reviewerName: review.reviewer_name,
      acknowledgedByName: updated.acknowledged_by_name,
      adminReply: updated.admin_reply,
      status: 'acknowledged',
      message: `Review #${review.id} by ${review.reviewer_name} acknowledged by ${updated.acknowledged_by_name}.`
    });

    if (review.user_id) {
      const Notification = require('../../models/Notification');
      const targetRole = review.user_type === 'employee' ? 'employee' : 'student';
      Notification.createTargeted({
        recipientUserId: review.user_id,
        recipientRole: targetRole,
        actorUserId: req.user.id,
        actorName: updated.acknowledged_by_name || 'Admin',
        eventType: 'review:acknowledged',
        title: 'Review Acknowledged',
        message: `${updated.acknowledged_by_name || 'Admin'} acknowledged your review.`,
        targetUrl: targetRole === 'employee' ? '/employee/reviews' : '/student/reviews'
      });
    }

    res.json({ success: true, message: 'Review acknowledged successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST / PUT /api/reviews/:id/acknowledge
 * Admin acknowledges a review (Acceptance test #9)
 */
router.post('/:id/acknowledge', roleGuard('admin', 'super_admin'), acknowledgeHandler);
router.put('/:id/acknowledge', roleGuard('admin', 'super_admin'), acknowledgeHandler);

// Helper for replying to review
const replyHandler = (req, res) => {
  try {
    const { id } = req.params;
    const reply = req.body.reply || req.body.admin_reply;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text is required.' });
    }

    const review = Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    const updated = Review.reply(id, reply.trim(), req.user);

    logAudit(req, {
      action: 'REPLY_REVIEW',
      module: 'reviews',
      entityType: 'review',
      entityId: id,
      newValues: { admin_reply: reply.trim() }
    });

    syncService.broadcast('review:replied', {
      id: review.id,
      userId: review.user_id,
      reviewerName: review.reviewer_name,
      reply: reply.trim(),
      message: `Admin replied to review #${review.id} by ${review.reviewer_name}.`
    });

    if (review.user_id) {
      const Notification = require('../../models/Notification');
      const targetRole = review.user_type === 'employee' ? 'employee' : 'student';
      Notification.createTargeted({
        recipientUserId: review.user_id,
        recipientRole: targetRole,
        actorUserId: req.user.id,
        actorName: `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || 'Admin',
        eventType: 'review:replied',
        title: 'Reply to Your Review',
        message: `Admin replied to your review: "${reply.trim().slice(0, 70)}${reply.trim().length > 70 ? '...' : ''}"`,
        targetUrl: targetRole === 'employee' ? '/employee/reviews' : '/student/reviews'
      });
    }

    res.json({ success: true, message: 'Admin reply posted successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST / PUT /api/reviews/:id/reply
 * Admin replies to a review
 */
router.post('/:id/reply', roleGuard('admin', 'super_admin'), replyHandler);
router.put('/:id/reply', roleGuard('admin', 'super_admin'), replyHandler);

module.exports = router;
