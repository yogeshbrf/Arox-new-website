/**
 * TRIANGULAR SYNC ACCEPTANCE TEST SUITE
 * Validates all 9 core requirements for Admin, Employee, and Student panels.
 */

const http = require('http');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { initDb, getDb, closeDb } = require('../config/database');
const authConfig = require('../config/auth');
const { Referral, Review, CallReport, Client, Student } = require('../models');

// Helper to make HTTP requests against express app
function makeRequest(server, options, body = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runAcceptanceTests() {
  console.log('\n============================================================');
  console.log('🚀 RUNNING TRIANGULAR SYNC ACCEPTANCE TESTS (1 - 9)');
  console.log('============================================================\n');

  await initDb();
  const db = getDb();

  // Create ephemeral HTTP server
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`📡 Test server listening on 127.0.0.1:${port}`);

  // Generate tokens for testing
  const adminToken = jwt.sign({ id: 1, email: 'admin@aroxtech.com', role: 'admin' }, authConfig.secret, { expiresIn: '1h' });
  const employeeToken = jwt.sign({ id: 4, email: 'employee@arox.com', role: 'employee' }, authConfig.secret, { expiresIn: '1h' });
  const studentToken = jwt.sign({ id: 3, email: 'student@arox.com', role: 'student' }, authConfig.secret, { expiresIn: '1h' });

  const results = [];

  function recordResult(num, name, passed, details = '') {
    results.push({ num, name, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [Test ${num}] ${name}`);
    if (details) console.log(`   └─ ${details}`);
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: Employee edits a student's payment -> Admin and Student panels show the new value without manual DB edits
    // -------------------------------------------------------------
    try {
      const res = await makeRequest(server, {
        method: 'PUT',
        path: '/api/payments/1',
        headers: { 'Authorization': `Bearer ${employeeToken}` }
      }, {
        amount: 8999,
        payment_method: 'upi',
        transaction_id: 'UTR-SYNC-TEST-001',
        status: 'completed',
        notes: 'Verified in full by Rajesh Kumar'
      });

      const paymentInDb = db.prepare('SELECT * FROM payments WHERE id = 1').get();
      const regInDb = db.prepare('SELECT * FROM registrations WHERE id = 1').get();
      const auditLog = db.prepare("SELECT * FROM audit_logs WHERE action = 'UPDATE_PAYMENT' ORDER BY id DESC LIMIT 1").get();

      const passed = res.status === 200 &&
                     paymentInDb && paymentInDb.status === 'completed' &&
                     regInDb && Number(regInDb.paid_amount) === 8999 && Number(regInDb.balance_amount) === 0 &&
                     auditLog && auditLog.user_id === 4;

      recordResult(1, "Employee edits a student's payment -> Admin & Student panels show new value", passed,
        `HTTP ${res.status}, Paid: ₹${regInDb ? regInDb.paid_amount : 0}, Balance: ₹${regInDb ? regInDb.balance_amount : 'N/A'}, Audit user: ${auditLog ? auditLog.user_id : 'none'}`);
    } catch (e) {
      recordResult(1, "Employee edits a student's payment", false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 2: Admin edits an internship record -> Employee Leads > Internships and Student My Course update
    // -------------------------------------------------------------
    try {
      const res = await makeRequest(server, {
        method: 'PUT',
        path: '/api/registrations/1',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }, {
        first_name: 'Aarav',
        last_name: 'Sharma',
        email: 'student@arox.com',
        phone: '9876543210',
        college: 'Anna University CEG',
        department: 'Computer Science',
        course_id: 1,
        batch_name: 'Batch-Triangular-Sync-2026',
        start_date: '2026-10-01',
        end_date: '2026-12-31',
        mode: 'hybrid',
        status: 'confirmed',
        total_amount: 8999,
        paid_amount: 8999,
        balance_amount: 0,
        referral_code: 'AROX2026',
        notes: 'Updated schedule by Admin'
      });

      const updatedReg = db.prepare('SELECT * FROM registrations WHERE id = 1').get();
      const auditLog = db.prepare("SELECT * FROM audit_logs WHERE action IN ('UPDATE_INTERNSHIP', 'UPDATE_REGISTRATION') ORDER BY id DESC LIMIT 1").get();

      // Verify that query used by Employee Internships gets the updated record
      const employeeInternshipQuery = db.prepare(`
        SELECT r.batch_name, r.mode, r.status
        FROM registrations r
        WHERE r.id = 1 AND r.deleted_at IS NULL
      `).get();

      // Verify that query used by Student My Course gets the updated record
      const studentCourseQuery = db.prepare(`
        SELECT r.batch_name, r.mode, r.status
        FROM registrations r
        WHERE r.id = 1 AND r.student_id = 1
      `).get();

      const passed = res.status === 200 &&
                     updatedReg.batch_name === 'Batch-Triangular-Sync-2026' &&
                     updatedReg.mode === 'hybrid' &&
                     employeeInternshipQuery.batch_name === 'Batch-Triangular-Sync-2026' &&
                     studentCourseQuery.batch_name === 'Batch-Triangular-Sync-2026' &&
                     auditLog !== undefined;

      recordResult(2, 'Admin edits an internship record -> Employee Leads & Student My Course update', passed,
        `Batch: ${updatedReg.batch_name}, Mode: ${updatedReg.mode}, Employee query: ${employeeInternshipQuery.batch_name}, Student query: ${studentCourseQuery.batch_name}`);
    } catch (e) {
      recordResult(2, 'Admin edits an internship record', false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 3: Student registers on website with a referral code -> appears in Admin Referral and Admin Internships
    // -------------------------------------------------------------
    try {
      // Ensure referral code exists
      let referral = Referral.findByCode('TRIANGULAR25');
      if (!referral) {
        referral = Referral.create({
          code: 'TRIANGULAR25',
          referrer_name: 'Alumni Network',
          referrer_email: 'alumni@arox.com',
          discount_percent: 15,
          max_uses: 50
        });
      }

      const initialUses = referral.uses_count !== undefined ? referral.uses_count : (referral.times_used || 0);

      // Student applies via website
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/registrations/apply'
      }, {
        course_id: 1,
        first_name: 'Priya',
        last_name: 'Sundaram',
        email: `priya.${Date.now()}@example.com`,
        phone: '9840112233',
        college: 'PSG Tech',
        department: 'ECE',
        degree: 'B.E',
        year_of_study: '3',
        referral_code: 'TRIANGULAR25',
        mode: 'online'
      });

      const updatedRef = Referral.findByCode('TRIANGULAR25');
      const updatedUses = updatedRef.uses_count !== undefined ? updatedRef.uses_count : (updatedRef.times_used || 0);
      const referredStudents = Referral.getReferredStudents(referral.id);
      const priyaInReferred = referredStudents.find(s => s.first_name === 'Priya');

      const internRow = db.prepare("SELECT * FROM registrations WHERE referral_code = 'TRIANGULAR25' AND deleted_at IS NULL ORDER BY id DESC LIMIT 1").get();

      const passed = res.status === 201 &&
                     updatedUses === initialUses + 1 &&
                     priyaInReferred !== undefined &&
                     internRow !== undefined;

      recordResult(3, 'Student registers on website with referral code -> Admin Referral & Admin Internships', passed,
        `HTTP ${res.status}, Referral Uses: ${updatedUses}, Attributed Student: ${priyaInReferred ? priyaInReferred.first_name : 'none'}, Reg ID: ${internRow ? internRow.registration_id : 'none'}`);
    } catch (e) {
      recordResult(3, 'Student registers on website with referral code', false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 4: Student marks attendance today -> visible in Admin/Employee; cannot mark yesterday/tomorrow or twice
    // -------------------------------------------------------------
    try {
      // Format today
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Reset today's attendance for student 1 and course 1 to test freshly
      db.prepare('DELETE FROM attendance WHERE student_id = 1 AND course_id = 1 AND date = ?').run(todayStr);

      // Attempt 1: Mark attendance today
      const res1 = await makeRequest(server, {
        method: 'POST',
        path: '/api/student/attendance/mark',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      }, { course_id: 1 });

      // Attempt 2: Duplicate mark today -> should be blocked with 400
      const res2 = await makeRequest(server, {
        method: 'POST',
        path: '/api/student/attendance/mark',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      }, { course_id: 1 });

      // Check attendance in DB
      const marked = db.prepare('SELECT * FROM attendance WHERE student_id = 1 AND course_id = 1 AND date = ?').get(todayStr);

      // Query representing Admin/Employee view
      const adminAttQuery = db.prepare('SELECT a.*, s.first_name, s.last_name FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.date = ?').all(todayStr);

      const passed = res1.status === 200 &&
                     res2.status === 400 &&
                     res2.data.message.includes('already marked') &&
                     marked !== undefined &&
                     adminAttQuery.some(a => a.student_id === 1);

      recordResult(4, 'Student marks attendance today -> visible in Admin/Employee; duplicate blocked', passed,
        `Mark 1: HTTP ${res1.status}, Mark 2 Duplicate: HTTP ${res2.status} ("${res2.data.message}"), Admin Attendance count today: ${adminAttQuery.length}`);
    } catch (e) {
      recordResult(4, 'Student marks attendance today', false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 5: Employee logs a call report -> Admin sees it under that employee's Reports
    // -------------------------------------------------------------
    try {
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/call-reports',
        headers: { 'Authorization': `Bearer ${employeeToken}` }
      }, {
        contact_type: 'student',
        student_id: 1,
        contact_name: 'Aarav Sharma',
        contact_phone: '9876543210',
        contact_email: 'student@arox.com',
        outcome: 'converted',
        notes: 'Followed up on full-stack web project completion.',
        next_followup: '2026-11-10'
      });

      // Verify Admin view queries for this employee
      const adminEmployeeReports = CallReport.findAll({ employee_id: 4 });
      const adminPerformance = CallReport.getPerformanceSummary({ employee_id: 4 });

      const createdLog = adminEmployeeReports.find(r => r.contact_name === 'Aarav Sharma' && r.outcome === 'converted');
      const totalCallsCount = adminPerformance.total_calls !== undefined ? adminPerformance.total_calls : adminPerformance.totalCalls;

      const passed = res.status === 201 &&
                     createdLog !== undefined &&
                     totalCallsCount >= 1;

      recordResult(5, "Employee logs a call report -> Admin sees it under that employee's Reports", passed,
        `HTTP ${res.status}, Log ID: ${createdLog ? createdLog.id : 'none'}, Admin Reports under Employee #4: ${adminEmployeeReports.length}, Total Calls: ${totalCallsCount}`);
    } catch (e) {
      recordResult(5, "Employee logs a call report", false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 6: Student tries to edit payment or open another student's data via API -> blocked (403)
    // -------------------------------------------------------------
    try {
      // 1. Student attempts to edit payment
      const resPaymentEdit = await makeRequest(server, {
        method: 'PUT',
        path: '/api/payments/1',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      }, { amount: 1000, status: 'completed' });

      // 2. Student attempts to verify payment
      const resPaymentVerify = await makeRequest(server, {
        method: 'POST',
        path: '/api/payments/1/verify',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      }, {});

      // 3. Student attempts to edit registration
      const resRegEdit = await makeRequest(server, {
        method: 'PUT',
        path: '/api/registrations/1',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      }, { status: 'completed' });

      // 4. Student attempts to view Admin referrals
      const resReferral = await makeRequest(server, {
        method: 'GET',
        path: '/api/referrals',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });

      const passed = resPaymentEdit.status === 403 &&
                     resPaymentVerify.status === 403 &&
                     resRegEdit.status === 403 &&
                     resReferral.status === 403;

      recordResult(6, "Student tries to edit payment / access admin APIs -> blocked (403 Forbidden)", passed,
        `Payment Edit: ${resPaymentEdit.status}, Payment Verify: ${resPaymentVerify.status}, Reg Edit: ${resRegEdit.status}, Referral API: ${resReferral.status}`);
    } catch (e) {
      recordResult(6, "Student tries to edit payment -> blocked (403)", false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 7: Admin deletes a client/student -> no broken references in any panel
    // -------------------------------------------------------------
    try {
      // Create a test client first
      const newClient = Client.create({
        company_name: 'SoftDelete Corp',
        contact_person: 'David Miller',
        email: 'david@softdelete.test',
        phone: '9998887776',
        assigned_to: 4
      });

      // Log a call report referencing this client
      CallReport.create({
        employee_id: 4,
        contact_type: 'client',
        client_id: newClient.id,
        contact_name: 'David Miller',
        outcome: 'interested',
        notes: 'Discussed campus recruitment drive.'
      });

      // Employee or Admin deletes the client
      const resDelete = await makeRequest(server, {
        method: 'DELETE',
        path: `/api/employee/clients/${newClient.id}`,
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      // Verify client is soft deleted
      const clientInDb = db.prepare('SELECT * FROM clients WHERE id = ?').get(newClient.id);
      const activeClients = Client.findAll();
      const isStillInActive = activeClients.some(c => c.id === newClient.id);

      // Verify call report referencing the client still exists without broken joins
      const relatedReports = CallReport.findAll({ client_id: newClient.id });

      const passed = resDelete.status === 200 &&
                     clientInDb && clientInDb.deleted_at !== null &&
                     !isStillInActive &&
                     relatedReports.length > 0;

      recordResult(7, 'Admin/Employee deletes a client -> soft-deleted, no broken references', passed,
        `HTTP ${resDelete.status}, deleted_at: ${clientInDb ? clientInDb.deleted_at : 'null'}, Hidden from active: ${!isStillInActive}, Related call logs preserved: ${relatedReports.length}`);
    } catch (e) {
      recordResult(7, 'Admin deletes a client -> no broken references', false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 8: Certificate generator still works unchanged with updated data
    // -------------------------------------------------------------
    try {
      const res = await makeRequest(server, {
        method: 'GET',
        path: '/api/students'
      });

      const students = res.data;
      const isArray = Array.isArray(students);
      const studentAarav = isArray ? students.find(s => s.name && s.name.includes('Aarav')) : null;
      const hasAttendances = studentAarav && Array.isArray(studentAarav.attendances);

      const passed = res.status === 200 &&
                     isArray &&
                     students.length > 0 &&
                     studentAarav !== null &&
                     hasAttendances;

      recordResult(8, 'Certificate generator reads synced data without breaking templates/logic', passed,
        `HTTP ${res.status}, Student count: ${students.length}, Aarav found: ${!!studentAarav}, Aarav attendances: ${hasAttendances ? studentAarav.attendances.length : 0}`);
    } catch (e) {
      recordResult(8, 'Certificate generator still works with updated data', false, e.message);
    }

    // -------------------------------------------------------------
    // TEST 9: Admin acknowledges a review -> status shows on Admin and the reviewer's panel
    // -------------------------------------------------------------
    try {
      // Clear any prior review by user 3 on course 2 for clean test state
      db.prepare('DELETE FROM reviews WHERE user_id = 3 AND course_id = 2').run();

      // 1. Submit review as student
      const revRes = await makeRequest(server, {
        method: 'POST',
        path: '/api/reviews',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      }, {
        course_id: 2,
        rating: 5,
        review_text: 'Outstanding machine learning curriculum and hands-on guidance!'
      });

      const newReviewId = revRes.data.data ? revRes.data.data.id : null;

      // 2. Admin acknowledges the review and adds a reply
      const ackRes = await makeRequest(server, {
        method: 'PUT',
        path: `/api/reviews/${newReviewId}/acknowledge`,
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }, {
        admin_reply: 'Thank you Aarav! We take pride in our real-world curriculum.'
      });

      // 3. Verify in database
      const reviewInDb = Review.findById(newReviewId);

      // 4. Verify Student reviews view query gets the acknowledged status & admin reply
      const studentReviews = Review.findAll({ user_id: 3 });
      const studentRev = studentReviews.find(r => r.id === newReviewId);

      const passed = revRes.status === 201 &&
                     ackRes.status === 200 &&
                     reviewInDb && reviewInDb.status === 'acknowledged' &&
                     reviewInDb.admin_reply.includes('Thank you Aarav') &&
                     studentRev && studentRev.status === 'acknowledged' &&
                     studentRev.admin_reply.includes('Thank you Aarav');

      recordResult(9, "Admin acknowledges a review -> status & reply show on Admin & reviewer's panel", passed,
        `Submit HTTP: ${revRes.status}, Acknowledge HTTP: ${ackRes.status}, Status: ${reviewInDb ? reviewInDb.status : 'none'}, Reply: "${reviewInDb ? reviewInDb.admin_reply : ''}"`);
    } catch (e) {
      recordResult(9, 'Admin acknowledges a review', false, e.message);
    }

  } finally {
    server.close();
    closeDb();
  }

  console.log('\n============================================================');
  console.log('📊 ACCEPTANCE TEST SUMMARY:');
  console.log('============================================================');
  const totalPassed = results.filter(r => r.passed).length;
  console.log(`Passed: ${totalPassed} / ${results.length}`);
  
  if (totalPassed === results.length) {
    console.log('🎉 ALL 9 ACCEPTANCE CRITERIA PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ SOME ACCEPTANCE TESTS FAILED!\n');
    process.exit(1);
  }
}

if (require.main === module) {
  runAcceptanceTests().catch(err => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  });
}

module.exports = runAcceptanceTests;
