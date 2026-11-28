const { getDb } = require('../config/database');
const syncService = require('../services/syncService');
const logger = require('../utils/logger');

class Notification {
  static normalizeRole(role) {
    const r = String(role || '').toLowerCase().trim();
    if (r === 'super_admin' || r === 'admin') return 'admin';
    if (r === 'employee' || r === 'trainer' || r === 'staff') return 'employee';
    return r || 'student';
  }

  static isBlockedAction(eventType, opts = {}) {
    if (opts && opts.deleted === true) return true;
    const t = String(eventType || '').toLowerCase();
    return (
      t.includes(':deleted') ||
      t.endsWith('delete') ||
      t.includes('login') ||
      t.includes('logout')
    );
  }

  static createTargeted({
    recipientUserId = null,
    recipientRole = 'admin',
    actorUserId = null,
    actorName = null,
    eventType,
    title = '',
    message,
    targetUrl,
    deleted = false
  }) {
    try {
      if (!eventType || !message || !targetUrl) return null;
      if (this.isBlockedAction(eventType, { deleted })) return null;

      const normRole = this.normalizeRole(recipientRole);
      const recUserId = recipientUserId ? parseInt(recipientUserId, 10) : null;
      const actUserId = actorUserId ? parseInt(actorUserId, 10) : null;

      // Never push notification back to the person performing the action
      if (recUserId && actUserId && recUserId === actUserId) {
        return null;
      }

      const db = getDb();
      const res = db.prepare(`
        INSERT INTO notifications (
          recipient_user_id, recipient_role, actor_user_id, actor_name,
          event_type, title, message, target_url, is_read
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      `).run(
        recUserId || null,
        normRole,
        actUserId || null,
        actorName ? String(actorName).trim() : null,
        String(eventType).trim(),
        title ? String(title).trim() : null,
        String(message).trim(),
        String(targetUrl).trim()
      );

      const created = db.prepare('SELECT * FROM notifications WHERE id = ?').get(res.lastInsertRowid);
      if (created) {
        try {
          syncService.broadcast('notification:new', {
            notificationId: created.id,
            recipientUserId: created.recipient_user_id,
            recipientRole: created.recipient_role,
            eventType: created.event_type
          });
        } catch (e) {}
      }
      return created;
    } catch (err) {
      logger.warn('Notification createTargeted warning:', err.message);
      return null;
    }
  }

  static notifyAdmins(opts) {
    return this.createTargeted({
      ...opts,
      recipientUserId: null,
      recipientRole: 'admin'
    });
  }

  static notifyUsers(userIds = [], opts = {}) {
    const ids = [...new Set((Array.isArray(userIds) ? userIds : [userIds]).map(v => parseInt(v, 10)).filter(v => Number.isInteger(v) && v > 0))];
    return ids
      .map(uid => this.createTargeted({ ...opts, recipientUserId: uid }))
      .filter(Boolean);
  }

  static notifyStudentByDbId(studentDbId, opts = {}) {
    if (!studentDbId) return null;
    try {
      const db = getDb();
      const row = db.prepare('SELECT user_id FROM students WHERE id = ?').get(parseInt(studentDbId, 10));
      if (!row || !row.user_id) return null;
      return this.createTargeted({
        ...opts,
        recipientUserId: row.user_id,
        recipientRole: 'student'
      });
    } catch (err) {
      logger.warn('Notification notifyStudentByDbId warning:', err.message);
      return null;
    }
  }

  static notifyStudentsByCourse(courseId, opts = {}) {
    if (!courseId) return [];
    try {
      const db = getDb();
      const rows = db.prepare(`
        SELECT DISTINCT s.user_id
        FROM registrations r
        JOIN students s ON r.student_id = s.id
        WHERE r.course_id = ?
          AND r.status != 'cancelled'
          AND r.deleted_at IS NULL
          AND s.user_id IS NOT NULL
      `).all(parseInt(courseId, 10));
      const userIds = rows.map(r => r.user_id).filter(Boolean);
      return this.notifyUsers(userIds, { ...opts, recipientRole: 'student' });
    } catch (err) {
      logger.warn('Notification notifyStudentsByCourse warning:', err.message);
      return [];
    }
  }

  static getUnwatchedForUser(userId, role, limit = 30) {
    const db = getDb();
    const uid = parseInt(userId, 10);
    const normRole = this.normalizeRole(role);

    const rows = db.prepare(`
      SELECT n.*
      FROM notifications n
      LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
      WHERE (
        n.recipient_user_id = ?
        OR (n.recipient_user_id IS NULL AND n.recipient_role = ?)
      )
        AND (n.actor_user_id IS NULL OR n.actor_user_id != ?)
        AND COALESCE(n.is_read, 0) = 0
        AND nr.id IS NULL
      ORDER BY n.created_at DESC, n.id DESC
      LIMIT ?
    `).all(uid, uid, normRole, uid, limit);

    const countRow = db.prepare(`
      SELECT COUNT(*) as cnt
      FROM notifications n
      LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
      WHERE (
        n.recipient_user_id = ?
        OR (n.recipient_user_id IS NULL AND n.recipient_role = ?)
      )
        AND (n.actor_user_id IS NULL OR n.actor_user_id != ?)
        AND COALESCE(n.is_read, 0) = 0
        AND nr.id IS NULL
    `).get(uid, uid, normRole, uid);

    return {
      unreadCount: countRow ? Number(countRow.cnt || 0) : rows.length,
      notifications: rows
    };
  }

  static markWatched(notificationId, userId, role) {
    const db = getDb();
    const nid = parseInt(notificationId, 10);
    const uid = parseInt(userId, 10);
    const normRole = this.normalizeRole(role);

    const notif = db.prepare(`
      SELECT * FROM notifications
      WHERE id = ?
        AND (recipient_user_id = ? OR (recipient_user_id IS NULL AND recipient_role = ?))
    `).get(nid, uid, normRole);
    if (!notif) return false;

    db.prepare(`
      INSERT OR IGNORE INTO notification_reads (notification_id, user_id)
      VALUES (?, ?)
    `).run(nid, uid);

    if (notif.recipient_user_id && Number(notif.recipient_user_id) === uid) {
      db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(nid);
    }
    return true;
  }

  static markAllWatched(userId, role) {
    const db = getDb();
    const uid = parseInt(userId, 10);
    const normRole = this.normalizeRole(role);
    const { notifications } = this.getUnwatchedForUser(uid, normRole, 200);
    if (!notifications || notifications.length === 0) return 0;

    const insStmt = db.prepare('INSERT OR IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)');
    const updStmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND recipient_user_id = ?');

    const tx = db.transaction(() => {
      for (const n of notifications) {
        insStmt.run(n.id, uid);
        updStmt.run(n.id, uid);
      }
    });
    tx();
    return notifications.length;
  }
}

module.exports = Notification;
