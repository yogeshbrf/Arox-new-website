const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const Notification = require('../../models/Notification');

router.use(authenticate);

/**
 * GET /api/notifications
 * Returns unwatched notifications & unread count strictly scoped to req.user
 */
router.get('/', (req, res) => {
  try {
    const data = Notification.getUnwatchedForUser(req.user.id, req.user.role);
    res.json({
      success: true,
      unreadCount: data.unreadCount,
      notifications: data.notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load notifications.' });
  }
});

/**
 * POST /api/notifications/read-all
 * Marks all unwatched notifications for req.user as watched
 */
router.post('/read-all', (req, res) => {
  try {
    Notification.markAllWatched(req.user.id, req.user.role);
    res.json({ success: true, unreadCount: 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear notifications.' });
  }
});

/**
 * POST /api/notifications/:id/read
 * Marks a single notification as watched for req.user
 */
router.post('/:id/read', (req, res) => {
  try {
    const ok = Notification.markWatched(req.params.id, req.user.id, req.user.role);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    const { unreadCount } = Notification.getUnwatchedForUser(req.user.id, req.user.role, 1);
    res.json({ success: true, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark notification watched.' });
  }
});

module.exports = router;
