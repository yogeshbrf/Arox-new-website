const { initDb, getDb, closeDb } = require('../config/database');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

async function seedTriangularData() {
  await initDb();
  const db = getDb();
  logger.info('🌱 Starting rich triangular sync database seeding...');

  const passHash = await bcrypt.hash('Admin@123', 10);
  const studentHash = await bcrypt.hash('student123', 10);
  const empHash = await bcrypt.hash('employee123', 10);

  // 1. Ensure Roles
  db.exec(`
    INSERT OR IGNORE INTO roles (id, name, description) VALUES
    (1, 'super_admin', 'Super Administrator'),
    (2, 'admin', 'Administrator'),
    (3, 'student', 'Student'),
    (4, 'employee', 'Employee / Staff / Trainer');
  `);

  // 2. Core Users
  // Admin
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role_id, first_name, last_name, phone, status, email_verified, designation, department)
    VALUES (1, 'admin@aroxtech.com', ?, 1, 'Arox', 'Admin', '9876543200', 'active', 1, 'System Administrator', 'Management')
  `).run(passHash);

  // Employee 1 (Rajesh Kumar)
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role_id, first_name, last_name, phone, status, email_verified, designation, department)
    VALUES (4, 'employee@arox.com', ?, 4, 'Rajesh', 'Kumar', '9876543201', 'active', 1, 'Senior Technical Lead & Trainer', 'Engineering & Operations')
  `).run(empHash);

  // Employee 2 (Pooja Sharma)
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role_id, first_name, last_name, phone, status, email_verified, designation, department)
    VALUES (5, 'pooja@arox.com', ?, 4, 'Pooja', 'Sharma', '9876543202', 'active', 1, 'Corporate Relations & Lead Manager', 'Business Development')
  `).run(empHash);

  // Student 1 (Aarav Sharma)
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role_id, first_name, last_name, phone, status, email_verified)
    VALUES (3, 'student@arox.com', ?, 3, 'Aarav', 'Sharma', '9876543210', 'active', 1)
  `).run(studentHash);

  // Student 2 (Sneha Reddy)
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role_id, first_name, last_name, phone, status, email_verified)
    VALUES (6, 'sneha.reddy@example.com', ?, 3, 'Sneha', 'Reddy', '9876543211', 'active', 1)
  `).run(studentHash);

  // Student 3 (Vikram Joshi)
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role_id, first_name, last_name, phone, status, email_verified)
    VALUES (7, 'vikram.joshi@example.com', ?, 3, 'Vikram', 'Joshi', '9876543212', 'active', 1)
  `).run(studentHash);

  // 3. Student Profiles
  db.prepare(`
    INSERT OR REPLACE INTO students (id, user_id, student_id, first_name, last_name, email, phone, gender, college, university, degree, department, year_of_study, graduation_year, status)
    VALUES 
    (1, 3, 'AT/INT/2026/0101', 'Aarav', 'Sharma', 'student@arox.com', '9876543210', 'male', 'Anna University CEG Campus', 'Anna University', 'B.Tech', 'Computer Science & Engineering', '3', '2026', 'active'),
    (2, 6, 'AT/INT/2026/0102', 'Sneha', 'Reddy', 'sneha.reddy@example.com', '9876543211', 'female', 'IIT Madras Research Park', 'IIT Madras', 'B.E', 'Information Technology', '4', '2026', 'active'),
    (3, 7, 'AT/INT/2026/0103', 'Vikram', 'Joshi', 'vikram.joshi@example.com', '9876543212', 'male', 'PSG College of Technology', 'Anna University', 'B.Tech', 'Artificial Intelligence & Data Science', '3', '2027', 'active')
  `).run();

  // 4. Courses
  db.prepare(`
    INSERT OR REPLACE INTO courses (id, slug, title, short_description, duration, duration_weeks, price, discounted_price, mode, level, trainer_name, start_date, end_date, batch_name, category, is_active)
    VALUES
    (1, 'full-stack-web-development', 'Full Stack Web Development', 'Master React, Node.js, Express, databases and full-stack software deployment.', '3 Months', 12, 12000, 8999, 'online', 'intermediate', 'Rajesh Kumar', '2026-10-01', '2026-12-31', 'Batch FSW-2026-Q4', 'internship', 1),
    (2, 'data-science-ai', 'Data Science & Artificial Intelligence', 'Python, Machine Learning, Deep Learning, and production model architectures.', '6 Months', 24, 18000, 14999, 'hybrid', 'advanced', 'Dr. Arun Varma', '2026-10-15', '2027-04-15', 'Batch AI-2026-Q4', 'internship', 1),
    (3, 'ui-ux-design', 'UI & UX Product Design', 'Figma, Design Systems, User Research, and interactive web prototyping.', '2 Months', 8, 8000, 5999, 'online', 'beginner', 'Pooja Sharma', '2026-10-01', '2026-11-30', 'Batch UIUX-2026-Q4', 'internship', 1)
  `).run();

  // 5. Registrations
  db.prepare(`
    INSERT OR REPLACE INTO registrations (id, registration_id, student_id, course_id, batch_name, start_date, end_date, mode, status, payment_plan, total_amount, paid_amount, balance_amount, referral_code, created_at)
    VALUES
    (1, 'REG-2026-001', 1, 1, 'Batch FSW-2026-Q4', '2026-10-01', '2026-12-31', 'online', 'confirmed', 'full', 8999, 8999, 0, 'AROX2026', '2026-10-01 10:00:00'),
    (2, 'REG-2026-002', 2, 2, 'Batch AI-2026-Q4', '2026-10-15', '2027-04-15', 'hybrid', 'confirmed', 'advance', 14999, 7500, 7499, 'TECHFEST15', '2026-10-15 11:30:00'),
    (3, 'REG-2026-003', 3, 3, 'Batch UIUX-2026-Q4', '2026-10-01', '2026-11-30', 'online', 'pending', 'full', 5999, 0, 5999, NULL, '2026-10-20 09:15:00')
  `).run();

  // 6. Payments
  db.prepare(`
    INSERT OR REPLACE INTO payments (id, payment_id, registration_id, student_id, amount, gst_amount, total_amount, payment_method, payment_type, transaction_id, status, verified_by, verified_by_name, verified_at, paid_at, created_at)
    VALUES
    (1, 'PAY-2026-1001', 1, 1, 7626.27, 1372.73, 8999, 'upi', 'full', 'UTR491029482910', 'completed', 4, 'Rajesh Kumar', '2026-10-01 12:00:00', '2026-10-01 12:00:00', '2026-10-01 10:30:00'),
    (2, 'PAY-2026-1002', 2, 2, 6355.93, 1144.07, 7500, 'upi', 'advance', 'UTR582910394812', 'completed', 1, 'Arox Admin', '2026-10-15 14:00:00', '2026-10-15 14:00:00', '2026-10-15 11:45:00'),
    (3, 'PAY-2026-1003', 3, 3, 5083.90, 915.10, 5999, 'upi', 'full', 'UTR901827364512', 'pending', NULL, NULL, NULL, NULL, '2026-10-25 16:20:00')
  `).run();

  // 7. Attendance (Today & past dates for Aarav)
  const today = new Date().toISOString().split('T')[0];
  db.prepare(`
    INSERT OR IGNORE INTO attendance (student_id, course_id, date, status, check_in_time, method)
    VALUES
    (1, 1, '2026-10-26', 'present', '09:05', 'online'),
    (1, 1, '2026-10-27', 'present', '09:02', 'online'),
    (1, 1, '2026-10-28', 'present', '09:10', 'online'),
    (2, 2, '2026-10-27', 'present', '09:15', 'online'),
    (2, 2, '2026-10-28', 'present', '09:00', 'online')
  `).run();

  // 8. Clients
  db.prepare(`
    INSERT OR REPLACE INTO clients (id, client_code, company_name, contact_person, email, phone, industry, location, status, assigned_to)
    VALUES
    (1, 'CLI-1001', 'Nexus Digital Solutions', 'Vikram Malhotra', 'vikram@nexusdigital.io', '9840123456', 'IT & Software', 'Chennai', 'partner', 4),
    (2, 'CLI-1002', 'Apollo MedTech Labs', 'Dr. Swati Rao', 'swati@apollomedtech.in', '9840654321', 'Healthcare & AI', 'Bangalore', 'contacted', 5),
    (3, 'CLI-1003', 'Starlight Logistics Inc', 'Karthik Raja', 'karthik@starlightlog.com', '9840998877', 'Supply Chain', 'Hyderabad', 'prospect', 4)
  `).run();

  // 9. Employee Tasks
  db.prepare(`
    INSERT OR REPLACE INTO employee_tasks (id, title, description, assigned_to, assigned_by, priority, status, category, due_date)
    VALUES
    (1, 'Review Capstone Submissions for Batch FSW', 'Grade React/Node assignment pull requests and provide technical feedback.', 4, 1, 'high', 'in_progress', 'documentation', '2026-10-31'),
    (2, 'Follow up with Apollo MedTech tie-up', 'Send campus internship proposal draft and curriculum syllabus.', 5, 1, 'medium', 'todo', 'client_outreach', '2026-11-02'),
    (3, 'Verify Pending Student Payments for October', 'Cross-check bank statement UTR entries and approve verified invoices.', 4, 1, 'high', 'todo', 'other', '2026-10-30')
  `).run();

  // 10. Call Reports
  db.prepare(`
    INSERT OR REPLACE INTO call_reports (id, employee_id, contact_type, student_id, client_id, contact_name, contact_phone, contact_email, call_date, outcome, notes, next_followup)
    VALUES
    (1, 4, 'student', 1, NULL, 'Aarav Sharma', '9876543210', 'student@arox.com', '2026-10-28 11:30:00', 'connected', 'Student completed module 3 early; requested mentor review for payment clearance.', '2026-11-04 11:00:00'),
    (2, 5, 'client', NULL, 1, 'Vikram Malhotra', '9840123456', 'vikram@nexusdigital.io', '2026-10-27 15:00:00', 'converted', 'Signed institutional MoU for 15 interns. Scheduled induction call.', '2026-11-10 14:00:00'),
    (3, 4, 'client', NULL, 2, 'Dr. Swati Rao', '9840654321', 'swati@apollomedtech.in', '2026-10-28 16:45:00', 'interested', 'Requested AI curriculum details for biomedical batch.', '2026-10-31 10:00:00')
  `).run();

  // 11. Reviews
  db.prepare(`
    INSERT OR REPLACE INTO reviews (id, user_id, user_type, reviewer_name, reviewer_email, course_id, course_title, rating, title, comment, status, acknowledged_by, acknowledged_by_name, acknowledged_at, admin_reply)
    VALUES
    (1, 3, 'student', 'Aarav Sharma', 'student@arox.com', 1, 'Full Stack Web Development', 5, 'Outstanding Hands-on Mentorship', 'Working on real projects gave me the practical software engineering confidence I needed.', 'acknowledged', 1, 'Arox Admin', '2026-10-25 15:30:00', 'Thank you Aarav! We are proud of your progress in the Full Stack track.'),
    (2, 4, 'employee', 'Rajesh Kumar', 'employee@arox.com', NULL, 'Training & Mentorship', 5, 'Highly Engaged Students Cohort', 'The batch curriculum flow and project grading tools are streamlined and intuitive.', 'pending', NULL, NULL, NULL, NULL)
  `).run();

  // 12. Referral Codes
  db.prepare(`
    INSERT OR REPLACE INTO referrals (id, code, referrer_name, referrer_email, discount_percent, max_uses, times_used, is_active)
    VALUES
    (1, 'AROX2026', 'Campus Ambassador Program', 'ambassador@aroxtech.com', 10, 100, 1, 1),
    (2, 'TECHFEST15', 'National Tech Symposium', 'outreach@aroxtech.com', 15, 50, 1, 1),
    (3, 'ALUMNI50', 'Alumni Referral Network', 'alumni@aroxtech.com', 5, 200, 0, 1)
  `).run();

  logger.info('🎉 Rich triangular sync database seeding completed successfully!');
  closeDb();
}

seedTriangularData().catch(err => {
  logger.error('Seeding failed:', err);
  process.exit(1);
});
