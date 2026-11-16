const { getDb } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Audit Logging Service
 * Records (who, role, what, old value, new value, timestamp) for every edit/insert/delete.
 */
function logAudit(req, {
  action,          // 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'MARK_ATTENDANCE' | 'ACKNOWLEDGE'
  module,          // 'payments' | 'students' | 'internships' | 'clients' | 'tasks' | 'call_reports' | 'referrals' | 'reviews' | 'attendance'
  entityType,      // 'payment' | 'student' | 'registration' | 'client' | etc.
  entityId,        // string or number
  oldValues = null, // object or null
  newValues = null  // object or null
}) {
  try {
    const db = getDb();
    const user = req && req.user ? req.user : null;
    const userId = user ? user.id : null;
    const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'System';
    const userRole = user ? user.role : 'system';
    const ipAddress = (req && req.headers && req.headers['x-forwarded-for']) || (req && req.socket && req.socket.remoteAddress) || '';

    const oldStr = oldValues ? (typeof oldValues === 'string' ? oldValues : JSON.stringify(oldValues)) : null;
    const newStr = newValues ? (typeof newValues === 'string' ? newValues : JSON.stringify(newValues)) : null;

    db.prepare(`
      INSERT INTO audit_logs (
        user_id, user_name, user_role, action, module, entity_type, entity_id,
        old_values, new_values, ip_address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      userId,
      userName,
      userRole,
      (action || 'UPDATE').toUpperCase(),
      module || 'general',
      entityType || 'record',
      entityId ? String(entityId) : null,
      oldStr,
      newStr,
      ipAddress
    );

    logger.info(`[AUDIT] ${userName} (${userRole}) performed ${action} on ${entityType} #${entityId || ''}`);
  } catch (err) {
    logger.warn(`Failed to record audit log: ${err.message}`);
  }
}

/**
 * Retrieve audit logs with optional filtering
 */
function getAuditLogs({ module, entityType, entityId, limit = 50 } = {}) {
  try {
    const db = getDb();
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (module) {
      query += ' AND module = ?';
      params.push(module);
    }
    if (entityType) {
      query += ' AND entity_type = ?';
      params.push(entityType);
    }
    if (entityId) {
      query += ' AND entity_id = ?';
      params.push(String(entityId));
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    return db.prepare(query).all(...params);
  } catch (err) {
    logger.warn(`Failed to fetch audit logs: ${err.message}`);
    return [];
  }
}

module.exports = { logAudit, getAuditLogs };
