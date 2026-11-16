const logger = require('../utils/logger');

/**
 * Non-destructive database migrations
 * Safely creates new tables and adds missing columns without altering or deleting existing data.
 */
function runTriangularSyncMigrations(db) {
  logger.info('🔄 Running Triangular Sync database migrations...');

  // 1. Create audit_logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      user_role TEXT,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      old_values TEXT,
      new_values TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_audit_module ON audit_logs(module);
    CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
  `);

  // 2. Create referrals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      referrer_name TEXT NOT NULL,
      referrer_email TEXT,
      discount_percent REAL DEFAULT 0,
      max_uses INTEGER DEFAULT 0,
      times_used INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(code);
  `);

  // 3. Create reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_type TEXT NOT NULL CHECK(user_type IN ('student', 'employee')),
      reviewer_name TEXT NOT NULL,
      reviewer_email TEXT NOT NULL,
      course_id INTEGER,
      course_title TEXT,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      title TEXT,
      comment TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'acknowledged', 'rejected')),
      acknowledged_by INTEGER,
      acknowledged_by_name TEXT,
      acknowledged_at DATETIME,
      admin_reply TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
  `);

  // 4. Create call_reports table
  db.exec(`
    CREATE TABLE IF NOT EXISTS call_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      contact_type TEXT NOT NULL CHECK(contact_type IN ('student', 'client')),
      student_id INTEGER,
      client_id INTEGER,
      contact_name TEXT NOT NULL,
      contact_phone TEXT,
      contact_email TEXT,
      call_date DATETIME NOT NULL,
      outcome TEXT NOT NULL,
      notes TEXT,
      next_followup DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_call_reports_emp ON call_reports(employee_id);
    CREATE INDEX IF NOT EXISTS idx_call_reports_date ON call_reports(call_date);
  `);

  // 5. High-Speed Performance Indexes for Triangular Sync & Dashboards
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_reg_del_status ON registrations(deleted_at, status);
    CREATE INDEX IF NOT EXISTS idx_reg_student_del ON registrations(student_id, deleted_at);
    CREATE INDEX IF NOT EXISTS idx_reg_course_del ON registrations(course_id, deleted_at);
    CREATE INDEX IF NOT EXISTS idx_pay_del_status ON payments(deleted_at, status);
    CREATE INDEX IF NOT EXISTS idx_pay_student_del ON payments(student_id, deleted_at);
    CREATE INDEX IF NOT EXISTS idx_pay_reg_del ON payments(registration_id, deleted_at);
    CREATE INDEX IF NOT EXISTS idx_att_student_date ON attendance(student_id, date);
    CREATE INDEX IF NOT EXISTS idx_att_course_date ON attendance(course_id, date);
    CREATE INDEX IF NOT EXISTS idx_std_del ON students(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_cli_del ON clients(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_usr_del_role ON users(deleted_at, role_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_assigned_status ON employee_tasks(assigned_to, status);
    CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON reviews(status, created_at);
    CREATE INDEX IF NOT EXISTS idx_referrals_code_active ON referrals(code, is_active);
    CREATE INDEX IF NOT EXISTS idx_call_reports_emp_date ON call_reports(employee_id, call_date);
  `);

  // Helper function to safely add column if it does not exist
  function addColumnIfNotExists(table, columnDef, columnName) {
    try {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all();
      const exists = columns.some(col => col.name === columnName);
      if (!exists) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
        logger.info(`➕ Added column '${columnName}' to table '${table}'`);
      }
    } catch (err) {
      logger.warn(`Could not add column '${columnName}' to '${table}': ${err.message}`);
    }
  }

  // Add missing columns to existing tables
  addColumnIfNotExists('registrations', 'referral_code TEXT', 'referral_code');
  addColumnIfNotExists('registrations', 'deleted_at DATETIME', 'deleted_at');
  addColumnIfNotExists('payments', 'verified_by INTEGER', 'verified_by');
  addColumnIfNotExists('payments', 'verified_by_name TEXT', 'verified_by_name');
  addColumnIfNotExists('payments', 'verified_at DATETIME', 'verified_at');
  addColumnIfNotExists('payments', 'deleted_at DATETIME', 'deleted_at');
  addColumnIfNotExists('students', 'deleted_at DATETIME', 'deleted_at');
  addColumnIfNotExists('clients', 'deleted_at DATETIME', 'deleted_at');
  addColumnIfNotExists('courses', 'deleted_at DATETIME', 'deleted_at');
  addColumnIfNotExists('users', 'designation TEXT', 'designation');
  addColumnIfNotExists('users', 'department TEXT', 'department');
  addColumnIfNotExists('users', 'deleted_at DATETIME', 'deleted_at');

  // Insert default roles if missing
  try {
    db.exec(`
      INSERT OR IGNORE INTO roles (id, name, description) VALUES
      (1, 'super_admin', 'Super Administrator with full access'),
      (2, 'admin', 'Administrator'),
      (3, 'student', 'Student'),
      (4, 'employee', 'Company Employee / Staff / Trainer');
      UPDATE roles SET name = 'employee', description = 'Company Employee / Staff / Trainer' WHERE id = 4;
    `);
  } catch (e) {}

  // Seed initial referral codes if empty
  try {
    const refCount = db.prepare('SELECT COUNT(*) as count FROM referrals').get();
    if (!refCount || refCount.count === 0) {
      db.exec(`
        INSERT OR IGNORE INTO referrals (code, referrer_name, referrer_email, discount_percent, max_uses, times_used, is_active) VALUES
        ('AROX2026', 'Campus Ambassador Program', 'ambassador@aroxtech.com', 10, 100, 0, 1),
        ('TECHFEST15', 'National Tech Symposium', 'outreach@aroxtech.com', 15, 50, 0, 1),
        ('PARTNER50', 'Alumni Referral Network', 'alumni@aroxtech.com', 5, 200, 0, 1);
      `);
      logger.info('✅ Seeded default referral codes.');
    }
  } catch (e) {}

  logger.info('✅ Triangular Sync database migrations completed successfully.');
}

module.exports = { runTriangularSyncMigrations };
