const User = require('../../models/User');
const logger = require('../../utils/logger');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb } = require('../../config/database');

exports.index = (req, res) => {
  try {
    const users = User.findAll();
    res.render('admin/users/index', {
      layout: 'layouts/admin',
      title: 'Staff & Users | AROX ERP',
      pageTitle: 'Staff & Users',
      user: req.user,
      users
    });
  } catch (error) {
    logger.error('Users Index Error:', error);
    res.status(500).render('website/error', { 
      layout: 'layouts/admin',
      code: 500,
      message: 'Failed to load users.',
      user: req.user || { first_name: 'Admin', last_name: '', role: 'admin' }
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, role, phone } = req.body;
    
    if (User.findByEmail(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Default registered admin or employee password is the same as the email
    const defaultPassword = req.body.password || email;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const newId = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: role || 'staff',
      phone: phone || null
    });

    logger.info(`New staff created: ${email} with default password: ${defaultPassword}`);

    res.json({ 
      success: true, 
      message: 'User created successfully',
      id: newId.id || newId,
      referral_code: newId.referral_code || null,
      tempPassword: defaultPassword
    });
  } catch (error) {
    logger.error('User Create Error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    // Prevent deactivating self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }

    const db = getDb();
    db.prepare('UPDATE users SET status = @status WHERE id = @id').run({
      status: is_active ? 'active' : 'inactive',
      id
    });

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    logger.error('User Status Update Error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

exports.employeesIndex = (req, res) => {
  try {
    const db = getDb();
    const missingCodeEmps = db.prepare(`
      SELECT u.id, u.first_name, u.last_name, u.email
      FROM users u
      WHERE u.role_id = 4 AND (u.referral_code IS NULL OR TRIM(u.referral_code) = '') AND u.deleted_at IS NULL
    `).all();
    for (const emp of missingCodeEmps) {
      User.ensureEmployeeReferralCode(emp.id, emp.first_name, emp.last_name, emp.email);
    }

    const employees = db.prepare(`
      SELECT u.*, r.name as role_name,
        (SELECT COUNT(*) FROM students s WHERE (s.referred_by = u.id OR (u.referral_code IS NOT NULL AND UPPER(s.referral_code) = UPPER(u.referral_code))) AND s.deleted_at IS NULL) AS referred_students_count
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.role_id IN (1, 2, 4) AND u.deleted_at IS NULL
      ORDER BY u.created_at DESC
    `).all();

    res.render('admin/employees/index', {
      layout: 'layouts/admin',
      title: 'Employees Directory | AROX ERP',
      pageTitle: 'Employee Management',
      currentPath: '/admin/employees',
      user: req.user,
      employees
    });
  } catch (error) {
    logger.error('Employees Index Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/admin',
      code: 500,
      message: 'Failed to load employees.',
      user: req.user
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role, designation, department, status } = req.body;
    const db = getDb();

    let role_id = null;
    if (role) {
      const r = db.prepare('SELECT id FROM roles WHERE name = ?').get(role);
      if (r) role_id = r.id;
    }

    db.prepare(`
      UPDATE users SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        role_id = COALESCE(?, role_id),
        designation = COALESCE(?, designation),
        department = COALESCE(?, department),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      first_name || null,
      last_name || null,
      email || null,
      phone || null,
      role_id || null,
      designation || null,
      department || null,
      status || null,
      id
    );

    if (role_id === 4) {
      User.ensureEmployeeReferralCode(parseInt(id, 10), first_name, last_name, email, req.body.referral_code);
    }

    res.json({ success: true, message: 'Employee updated successfully.' });
  } catch (error) {
    logger.error('User Update Error:', error);
    res.status(500).json({ error: 'Failed to update user: ' + error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const db = getDb();
    
    // Ensure not deleting the last admin
    const adminCount = db.prepare(`
      SELECT COUNT(*) as count 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE (r.name = 'admin' OR r.name = 'super_admin') AND u.deleted_at IS NULL
    `).get().count;
    const targetUser = db.prepare(`
      SELECT r.name as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ?
    `).get(id);
    
    if (targetUser && (targetUser.role === 'admin' || targetUser.role === 'super_admin') && adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin account' });
    }

    // Soft delete
    db.prepare('UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    logger.error('User Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
