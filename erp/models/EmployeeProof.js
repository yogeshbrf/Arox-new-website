const { getDb } = require('../config/database');

/**
 * EmployeeProof Model — stores work deliverable proofs (.pdf, .pptx, .xlsx, .docx up to 10MB)
 */
const EmployeeProof = {
  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO employee_proofs (
        employee_id, task_id, category, title, remarks,
        file_name, original_name, file_path, file_ext, file_size, status
      ) VALUES (
        @employee_id, @task_id, @category, @title, @remarks,
        @file_name, @original_name, @file_path, @file_ext, @file_size, 'submitted'
      )
    `);
    const result = stmt.run({
      employee_id: data.employee_id,
      task_id: data.task_id || null,
      category: data.category,
      title: data.title || data.original_name,
      remarks: data.remarks || null,
      file_name: data.file_name,
      original_name: data.original_name,
      file_path: data.file_path,
      file_ext: data.file_ext,
      file_size: data.file_size || 0
    });
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT p.*,
        COALESCE(NULLIF(TRIM(u.first_name || ' ' || COALESCE(u.last_name, '')), ''), u.email) AS employee_name,
        u.email AS employee_email,
        u.referral_code AS employee_referral_code,
        t.title AS task_title,
        COALESCE(NULLIF(TRIM(rv.first_name || ' ' || COALESCE(rv.last_name, '')), ''), rv.email) AS reviewer_name
      FROM employee_proofs p
      LEFT JOIN users u ON p.employee_id = u.id
      LEFT JOIN employee_tasks t ON p.task_id = t.id
      LEFT JOIN users rv ON p.reviewed_by = rv.id
      WHERE p.id = ?
    `).get(id);
  },

  getByEmployee(employeeId, filters = {}) {
    const db = getDb();
    let where = 'p.employee_id = @employeeId';
    const params = { employeeId };

    if (filters.category) {
      where += ' AND p.category = @category';
      params.category = filters.category;
    }
    if (filters.status) {
      where += ' AND p.status = @status';
      params.status = filters.status;
    }
    if (filters.task_id) {
      where += ' AND p.task_id = @task_id';
      params.task_id = parseInt(filters.task_id, 10);
    }

    return db.prepare(`
      SELECT p.*,
        t.title AS task_title,
        COALESCE(NULLIF(TRIM(rv.first_name || ' ' || COALESCE(rv.last_name, '')), ''), rv.email) AS reviewer_name
      FROM employee_proofs p
      LEFT JOIN employee_tasks t ON p.task_id = t.id
      LEFT JOIN users rv ON p.reviewed_by = rv.id
      WHERE ${where}
      ORDER BY p.created_at DESC, p.id DESC
    `).all(params);
  },

  getAll(filters = {}) {
    const db = getDb();
    let where = '1=1';
    const params = {};

    if (filters.employee_id) {
      where += ' AND p.employee_id = @employee_id';
      params.employee_id = parseInt(filters.employee_id, 10);
    }
    if (filters.category) {
      where += ' AND p.category = @category';
      params.category = filters.category;
    }
    if (filters.status) {
      where += ' AND p.status = @status';
      params.status = filters.status;
    }

    return db.prepare(`
      SELECT p.*,
        COALESCE(NULLIF(TRIM(u.first_name || ' ' || COALESCE(u.last_name, '')), ''), u.email) AS employee_name,
        u.email AS employee_email,
        u.referral_code AS employee_referral_code,
        t.title AS task_title,
        COALESCE(NULLIF(TRIM(rv.first_name || ' ' || COALESCE(rv.last_name, '')), ''), rv.email) AS reviewer_name
      FROM employee_proofs p
      LEFT JOIN users u ON p.employee_id = u.id
      LEFT JOIN employee_tasks t ON p.task_id = t.id
      LEFT JOIN users rv ON p.reviewed_by = rv.id
      WHERE ${where}
      ORDER BY p.created_at DESC, p.id DESC
    `).all(params);
  },

  review(id, { status, reviewed_by, review_notes }) {
    const db = getDb();
    db.prepare(`
      UPDATE employee_proofs
      SET status = @status,
          reviewed_by = @reviewed_by,
          review_notes = @review_notes,
          reviewed_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({
      id,
      status,
      reviewed_by: reviewed_by || null,
      review_notes: review_notes || null
    });
    return this.findById(id);
  },

  deleteById(id) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return null;
    db.prepare('DELETE FROM employee_proofs WHERE id = ?').run(id);
    return existing;
  }
};

module.exports = EmployeeProof;
