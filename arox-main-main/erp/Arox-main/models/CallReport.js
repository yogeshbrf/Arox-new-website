const { getDb } = require('../config/database');

class CallReport {
  static findAll({ employee_id, contact_type, search, startDate, endDate, client_id, student_id } = {}) {
    const db = getDb();
    let query = `
      SELECT 
        cr.*,
        u.first_name as employee_first_name,
        u.last_name as employee_last_name,
        (u.first_name || ' ' || u.last_name) as employee_name
      FROM call_reports cr
      JOIN users u ON cr.employee_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (employee_id) {
      query += ' AND cr.employee_id = ?';
      params.push(employee_id);
    }
    if (contact_type && contact_type !== 'all') {
      query += ' AND cr.contact_type = ?';
      params.push(contact_type);
    }
    if (client_id) {
      query += ' AND cr.client_id = ?';
      params.push(client_id);
    }
    if (student_id) {
      query += ' AND cr.student_id = ?';
      params.push(student_id);
    }
    if (startDate) {
      query += ' AND date(cr.call_date) >= date(?)';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date(cr.call_date) <= date(?)';
      params.push(endDate);
    }
    if (search) {
      query += ' AND (cr.contact_name LIKE ? OR cr.contact_phone LIKE ? OR cr.notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY cr.call_date DESC';
    return db.prepare(query).all(...params);
  }

  static findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT 
        cr.*,
        u.first_name as employee_first_name,
        u.last_name as employee_last_name,
        (u.first_name || ' ' || u.last_name) as employee_name
      FROM call_reports cr
      JOIN users u ON cr.employee_id = u.id
      WHERE cr.id = ?
    `).get(id);
  }

  static create({ employee_id, contact_type, student_id = null, client_id = null, contact_name, contact_phone, contact_email, call_date, outcome, notes, next_followup = null }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO call_reports (
        employee_id, contact_type, student_id, client_id,
        contact_name, contact_phone, contact_email,
        call_date, outcome, notes, next_followup,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      employee_id,
      contact_type,
      student_id,
      client_id,
      contact_name,
      contact_phone || null,
      contact_email || null,
      call_date || new Date().toISOString(),
      outcome,
      notes || null,
      next_followup || null
    );
    return { id: result.lastInsertRowid };
  }

  static update(id, data) {
    const db = getDb();
    db.prepare(`
      UPDATE call_reports 
      SET contact_type = COALESCE(?, contact_type),
          contact_name = COALESCE(?, contact_name),
          contact_phone = COALESCE(?, contact_phone),
          contact_email = COALESCE(?, contact_email),
          call_date = COALESCE(?, call_date),
          outcome = COALESCE(?, outcome),
          notes = COALESCE(?, notes),
          next_followup = COALESCE(?, next_followup),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.contact_type,
      data.contact_name,
      data.contact_phone,
      data.contact_email,
      data.call_date,
      data.outcome,
      data.notes,
      data.next_followup,
      id
    );
    return this.findById(id);
  }

  static delete(id) {
    const db = getDb();
    return db.prepare('DELETE FROM call_reports WHERE id = ?').run(id);
  }

  static getPerformanceSummary({ employee_id, startDate, endDate } = {}) {
    const db = getDb();
    let query = 'SELECT outcome, COUNT(*) as count FROM call_reports WHERE 1=1';
    const params = [];
    if (employee_id) {
      query += ' AND employee_id = ?';
      params.push(employee_id);
    }
    if (startDate) {
      query += ' AND date(call_date) >= date(?)';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date(call_date) <= date(?)';
      params.push(endDate);
    }
    query += ' GROUP BY outcome';
    const rows = db.prepare(query).all(...params);
    const summary = { 
      totalCalls: 0, 
      total_calls: 0, 
      connected: 0, 
      converted: 0, 
      interested: 0, 
      followUpNeeded: 0, 
      call_back: 0, 
      failed: 0, 
      not_reachable: 0 
    };
    rows.forEach(r => {
      const count = Number(r.count);
      summary.totalCalls += count;
      summary.total_calls += count;
      if (r.outcome === 'connected') summary.connected += count;
      if (r.outcome === 'converted') summary.converted += count;
      if (r.outcome === 'interested') summary.interested += count;
      if (r.outcome === 'follow_up' || r.outcome === 'follow_up_needed' || r.outcome === 'call_back') {
        summary.followUpNeeded += count;
        summary.call_back += count;
      }
      if (r.outcome === 'not_reachable' || r.outcome === 'busy' || r.outcome === 'failed') {
        summary.failed += count;
        summary.not_reachable += count;
      }
    });
    return summary;
  }
}

module.exports = CallReport;
