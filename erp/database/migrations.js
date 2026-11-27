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
  addColumnIfNotExists('users', 'referral_code TEXT', 'referral_code');

  // Student -> Referring Employee attribution columns
  addColumnIfNotExists('students', 'referred_by INTEGER', 'referred_by');
  addColumnIfNotExists('students', 'referral_code TEXT', 'referral_code');

  // Link referral codes directly to employee users & support referrer_type
  addColumnIfNotExists('referrals', 'employee_id INTEGER', 'employee_id');
  addColumnIfNotExists('referrals', "referrer_type TEXT DEFAULT 'student'", 'referrer_type');

  // Live offline class & trainer availability details synced from Admin -> Student dashboard
  addColumnIfNotExists('courses', 'class_timing TEXT', 'class_timing');
  addColumnIfNotExists('courses', "class_available INTEGER DEFAULT 1", 'class_available');
  addColumnIfNotExists('courses', "trainer_available_today INTEGER DEFAULT 1", 'trainer_available_today');
  addColumnIfNotExists('courses', 'trainer_status_note TEXT', 'trainer_status_note');
  addColumnIfNotExists('courses', 'classroom_location TEXT', 'classroom_location');

  // Multi-employee task batch grouping, assigner name & attached task document (.xlsx, .docx, .pdf, .pptx)
  addColumnIfNotExists('employee_tasks', 'batch_group_id TEXT', 'batch_group_id');
  addColumnIfNotExists('employee_tasks', 'assigned_by_name TEXT', 'assigned_by_name');
  addColumnIfNotExists('employee_tasks', 'attachment_name TEXT', 'attachment_name');
  addColumnIfNotExists('employee_tasks', 'attachment_original_name TEXT', 'attachment_original_name');
  addColumnIfNotExists('employee_tasks', 'attachment_path TEXT', 'attachment_path');
  addColumnIfNotExists('employee_tasks', 'attachment_ext TEXT', 'attachment_ext');
  addColumnIfNotExists('employee_tasks', 'attachment_size INTEGER DEFAULT 0', 'attachment_size');

  // Attendance admin override flag + updated timestamp
  addColumnIfNotExists('attendance', 'updated_by_admin INTEGER DEFAULT 0', 'updated_by_admin');
  addColumnIfNotExists('attendance', 'updated_at DATETIME', 'updated_at');

  // Create Employee Work Proofs table (.pdf, .pptx, .xlsx, .docx up to 10MB)
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS employee_proofs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        task_id INTEGER,
        category TEXT NOT NULL,
        title TEXT,
        remarks TEXT,
        file_name TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_ext TEXT NOT NULL,
        file_size INTEGER DEFAULT 0,
        status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted','approved','needs_revision','rejected')),
        reviewed_by INTEGER,
        review_notes TEXT,
        reviewed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    logger.warn('Could not ensure employee_proofs table:', e.message);
  }

  // Upgrade attendance.method CHECK constraint to also allow 'offline' safely
  try {
    const attSchemaRow = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='attendance'").get();
    if (attSchemaRow && attSchemaRow.sql && !attSchemaRow.sql.includes("'offline'")) {
      db.exec(`
        CREATE TABLE IF NOT EXISTS attendance_v2 (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          course_id INTEGER NOT NULL,
          date DATE NOT NULL,
          status TEXT DEFAULT 'present' CHECK(status IN ('present','absent','late','leave','holiday')),
          check_in_time TEXT,
          check_out_time TEXT,
          method TEXT DEFAULT 'manual' CHECK(method IN ('manual','qr','online','offline','gps')),
          remarks TEXT,
          marked_by INTEGER,
          updated_by_admin INTEGER DEFAULT 0,
          updated_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, course_id, date)
        );
        INSERT INTO attendance_v2 (id, student_id, course_id, date, status, check_in_time, check_out_time, method, remarks, marked_by, updated_by_admin, updated_at, created_at)
        SELECT id, student_id, course_id, date, status, check_in_time, check_out_time, method, remarks, marked_by, COALESCE(updated_by_admin, 0), updated_at, created_at FROM attendance;
        DROP TABLE attendance;
        ALTER TABLE attendance_v2 RENAME TO attendance;
        CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
      `);
      logger.info('Upgraded attendance table CHECK constraint to allow offline mode');
    }
  } catch (e) {
    logger.warn('Could not upgrade attendance method CHECK constraint:', e.message);
  }

  // Ensure every employee user (and trainer/staff) has a unique referral_code + matching referrals row
  try {
    const employees = db.prepare(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.referral_code, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name IN ('employee', 'trainer', 'staff') AND u.deleted_at IS NULL
    `).all();

    for (const emp of employees) {
      let code = (emp.referral_code || '').trim().toUpperCase();
      if (!code) {
        const cleanPrefix = (emp.first_name || 'EMP').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'EMP';
        code = `AROX-${cleanPrefix}${String(emp.id).padStart(2, '0')}`;
        let suffix = 1;
        while (
          db.prepare('SELECT id FROM users WHERE UPPER(referral_code) = UPPER(?) AND id != ?').get(code, emp.id) ||
          db.prepare('SELECT id FROM referrals WHERE LOWER(code) = LOWER(?) AND (employee_id IS NULL OR employee_id != ?)').get(code, emp.id)
        ) {
          code = `AROX-${cleanPrefix}${emp.id}${suffix++}`;
        }
        db.prepare('UPDATE users SET referral_code = ? WHERE id = ?').run(code, emp.id);
      }

      const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.email;
      const existingRef = db.prepare('SELECT id, employee_id FROM referrals WHERE LOWER(code) = LOWER(?)').get(code);
      if (!existingRef) {
        db.prepare(`
          INSERT INTO referrals (code, referrer_name, referrer_email, referrer_type, discount_percent, max_uses, times_used, employee_id, is_active)
          VALUES (?, ?, ?, 'employee', 5, 0, 0, ?, 1)
        `).run(code, fullName, emp.email, emp.id);
      } else if (!existingRef.employee_id) {
        db.prepare("UPDATE referrals SET employee_id = ?, referrer_type = 'employee', is_active = 1 WHERE id = ?").run(emp.id, existingRef.id);
      }
    }

    // Backfill students.referred_by from students.referral_code or registrations.referral_code if missing
    db.exec(`
      UPDATE students
      SET referral_code = (
        SELECT r.referral_code FROM registrations r
        WHERE r.student_id = students.id AND r.referral_code IS NOT NULL AND TRIM(r.referral_code) != ''
        ORDER BY r.id DESC LIMIT 1
      )
      WHERE (referral_code IS NULL OR TRIM(referral_code) = '')
        AND EXISTS (
          SELECT 1 FROM registrations r
          WHERE r.student_id = students.id AND r.referral_code IS NOT NULL AND TRIM(r.referral_code) != ''
        );

      UPDATE students
      SET referred_by = COALESCE(
        (SELECT u.id FROM users u WHERE UPPER(u.referral_code) = UPPER(students.referral_code) LIMIT 1),
        (SELECT rf.employee_id FROM referrals rf WHERE LOWER(rf.code) = LOWER(students.referral_code) AND rf.employee_id IS NOT NULL LIMIT 1)
      )
      WHERE referred_by IS NULL AND referral_code IS NOT NULL AND TRIM(referral_code) != '';
    `);
  } catch (e) {
    logger.warn('Could not backfill employee referral codes:', e.message);
  }

  // Ensure default payment settings reflect 6379000598@amazonpay if unset or still old default
  try {
    const upiRow = db.prepare("SELECT value FROM settings WHERE key = 'upi_id' AND section = 'payment'").get();
    const oldVal = upiRow ? String(upiRow.value || '').replace(/^"|"$/g, '') : '';
    if (!upiRow || !oldVal || oldVal === 'aroxtechnologies@icici' || oldVal === 'aroxtech@upi') {
      const defaults = {
        upi_id: '6379000598@amazonpay',
        upi_name: 'AROX Tech Pvt. Ltd.',
        bank_name: 'Amazon Pay UPI',
        account_number: '',
        ifsc_code: '',
        qr_note: 'Pay via any UPI app to 6379000598@amazonpay'
      };
      const stmt = db.prepare(`
        INSERT INTO settings (key, value, section, updated_at)
        VALUES (?, ?, 'payment', CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, section = excluded.section, updated_at = CURRENT_TIMESTAMP
      `);
      for (const [k, v] of Object.entries(defaults)) {
        stmt.run(k, String(v));
      }
    }
  } catch (e) {
    logger.warn('Could not initialize payment settings:', e.message);
  }

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
