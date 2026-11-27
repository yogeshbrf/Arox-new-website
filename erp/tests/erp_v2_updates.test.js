/**
 * Integration Verification Suite for All 9 Arox ERP Updates & RBAC Privilege Boundaries
 * Tests live Express server + SQLite migrations without leaving stray test artifacts.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { initDb, getDb } = require('../config/database');
const { migrate } = require('../database/migrate');

function request(server, { method = 'GET', path: reqPath, headers = {} }, body = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const isBuffer = Buffer.isBuffer(body);
    const payload = body == null ? null : (isBuffer || typeof body === 'string' ? body : JSON.stringify(body));

    const reqHeaders = { ...headers };
    if (payload && !isBuffer && !reqHeaders['Content-Type']) {
      reqHeaders['Content-Type'] = 'application/json';
    }
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: reqPath,
      method,
      headers: reqHeaders
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        const ct = res.headers['content-type'] || '';
        let json = null;
        if (ct.includes('application/json')) {
          try { json = JSON.parse(raw.toString('utf8')); } catch (e) {}
        }
        resolve({ status: res.statusCode, headers: res.headers, raw, text: raw.toString('utf8'), json });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function buildMultipart(fields, fileField) {
  const boundary = '----AroxTestBoundary' + Date.now();
  const parts = [];
  for (const [k, v] of Object.entries(fields || {})) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`));
  }
  if (fileField) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\nContent-Type: ${fileField.contentType}\r\n\r\n`
    ));
    parts.push(fileField.content);
    parts.push(Buffer.from('\r\n'));
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return {
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`
  };
}

async function runSuite() {
  console.log('\n============================================================');
  console.log('🧪 AROX ERP V2 REQUIREMENTS & RBAC VERIFICATION SUITE');
  console.log('============================================================\n');

  await initDb();
  migrate();
  const db = getDb();

  // Require main app after DB initialization
  const app = require('../server');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  console.log(`📡 Test server running on 127.0.0.1:${server.address().port}`);

  const createdUserIds = [];
  const createdStudentIds = [];
  const createdTaskIds = [];
  const createdProofIds = [];
  const createdAttIds = [];
  const createdRefCodes = [];
  let originalCourse1 = db.prepare('SELECT * FROM courses WHERE id = 1').get();

  try {
    // Login seeded Admin, Employee, and Student
    const adminLogin = await request(server, { method: 'POST', path: '/api/auth/login' }, {
      email: 'admin@aroxtech.com', password: 'admin', role: 'admin'
    });
    const adminToken = adminLogin.json.data.token;
    assert(adminToken, 'Admin login token retrieved');

    const empLogin = await request(server, { method: 'POST', path: '/api/auth/login' }, {
      email: 'employee@arox.com', password: 'employee', role: 'employee'
    });
    const empToken = empLogin.json.data.token;
    const empUserId = empLogin.json.data.user.id;
    assert(empToken, 'Seeded employee login token retrieved');

    const stuLogin = await request(server, { method: 'POST', path: '/api/auth/login' }, {
      email: 'student@arox.com', password: 'student', role: 'student'
    });
    const stuToken = stuLogin.json.data.token;
    assert(stuToken, 'Seeded student login token retrieved');

    // ---------------------------------------------------------
    // CHECK 1 & 8: Sidebar Hover/Pin/Thin-Scrollbar, Duotone Icons & Mobile Bottom Nav
    // ---------------------------------------------------------
    const [cssRes, shellJsRes] = await Promise.all([
      request(server, { path: '/erp-assets/css/erp-theme.css' }),
      request(server, { path: '/erp-assets/js/erp-shell.js' })
    ]);
    assert.strictEqual(cssRes.status, 200, 'erp-theme.css served');
    assert.strictEqual(shellJsRes.status, 200, 'erp-shell.js served');
    assert(cssRes.text.includes('.erp-sidebar:hover') && cssRes.text.includes('.erp-sidebar.sidebar-pinned'), 'CSS has hover-open and click-pin sidebar rules');
    assert(cssRes.text.includes('.force-collapse') && shellJsRes.text.includes('force-collapse'), 'Sidebar immediate-hide on unpin implemented in CSS and JS');
    assert(cssRes.text.includes('scrollbar-width: none') && cssRes.text.includes('scrollbar-width: thin'), 'CSS hides scrollbar when collapsed and shows thin scrollbar on hover/pin');
    assert(/\.erp-mobile-toggle\s*\{\s*display:\s*none\s*!important;/.test(cssRes.text), 'CSS enforces hidden hamburger toggle on mobile');
    assert(cssRes.text.includes('.erp-mobile-nav-brand') && cssRes.text.includes('.erp-profile-wrapper'), 'CSS has mobile topbar brand and profile styles');

    const [adminDash, empDash, stuDash] = await Promise.all([
      request(server, { path: '/admin/dashboard', headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' } }),
      request(server, { path: '/employee/dashboard', headers: { Authorization: `Bearer ${empToken}`, 'X-Role': 'employee' } }),
      request(server, { path: '/student/dashboard', headers: { Authorization: `Bearer ${stuToken}`, 'X-Role': 'student' } })
    ]);

    for (const [label, page] of [['Admin', adminDash], ['Employee', empDash], ['Student', stuDash]]) {
      assert.strictEqual(page.status, 200, `${label} dashboard loads HTTP 200`);
      assert(!page.text.includes('erp-mobile-toggle'), `${label} topbar has NO mobile hamburger button`);
      assert(page.text.includes('erp-bottom-nav') && page.text.includes('nav-pill-box'), `${label} renders app-style mobile bottom navigation`);
      assert(page.text.includes('erp-duotone-icon') && page.text.includes('sidebar-layers'), `${label} renders unified duotone sidebar icons`);
      assert(page.text.includes('erp-mobile-nav-brand'), `${label} topbar has mobile logo / current page`);
      assert(page.text.includes('erp-profile-wrapper') && !page.text.includes('erp-profile hidden md:flex'), `${label} topbar profile icon is unhidden on mobile`);
      assert(page.text.includes('/erp-assets/js/erp-shell.js'), `${label} includes unified erp-shell.js`);
    }
    console.log('✅ CHECK 1 & 8 PASS: Sidebar unpin/thin-scrollbar, duotone icons, mobile bottom nav & topbar verified across all 3 panels');

    // ---------------------------------------------------------
    // CHECK 2: Payment UPI ID (6379000598@amazonpay) & Live QR PNG
    // ---------------------------------------------------------
    const payCfg = await request(server, { path: '/api/payments/config' });
    assert.strictEqual(payCfg.status, 200);
    assert.strictEqual(payCfg.json.data.upi_id, '6379000598@amazonpay', 'Active UPI ID must be 6379000598@amazonpay');

    const qrRes = await request(server, { path: '/api/payments/qr?amount=2500&note=TestFee' });
    assert.strictEqual(qrRes.status, 200);
    assert(qrRes.headers['content-type'].includes('image/png'), 'QR endpoint returns PNG image');
    assert.deepStrictEqual(qrRes.raw.slice(0, 4), Buffer.from([0x89, 0x50, 0x4E, 0x47]), 'Valid PNG binary signature');

    const stuPayPage = await request(server, { path: '/student/payments', headers: { Authorization: `Bearer ${stuToken}`, 'X-Role': 'student' } });
    assert.strictEqual(stuPayPage.status, 200);
    assert(stuPayPage.text.includes('6379000598@amazonpay'), 'Student payments shows 6379000598@amazonpay');
    assert(stuPayPage.text.includes('/api/payments/qr'), 'Student payments embeds live QR');
    assert(!stuPayPage.text.includes('aroxtechnologies@icici'), 'Legacy UPI removed from Student payments');
    console.log('✅ CHECK 2 PASS: UPI 6379000598@amazonpay & dynamic scannable QR PNG verified');

    // ---------------------------------------------------------
    // CHECK 3: Daily Attendance (Student Update Today + Admin Full Control)
    // ---------------------------------------------------------
    const studentRow = db.prepare('SELECT id FROM students WHERE user_id = ?').get(stuLogin.json.data.user.id);
    assert(studentRow, 'Seeded student row exists');
    const enroll = db.prepare('SELECT course_id FROM registrations WHERE student_id = ? LIMIT 1').get(studentRow.id);
    assert(enroll, 'Student has a registration');

    const stuAttUpdate = await request(server, {
      method: 'PUT',
      path: '/api/student/attendance/today',
      headers: { Authorization: `Bearer ${stuToken}`, 'X-Role': 'student' }
    }, { course_id: enroll.course_id, status: 'late', method: 'offline', remarks: 'Traffic delay today' });
    assert.strictEqual(stuAttUpdate.status, 200, 'Student updates today attendance successfully');
    assert.strictEqual(stuAttUpdate.json.data.status, 'late');
    assert.strictEqual(stuAttUpdate.json.data.method, 'offline');

    const adminAttPage = await request(server, { path: '/admin/attendance', headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' } });
    assert.strictEqual(adminAttPage.status, 200, 'Admin attendance page loads');

    const customDate = '2026-10-15';
    const adminUpsert = await request(server, {
      method: 'POST',
      path: '/api/admin/attendance',
      headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' }
    }, { student_id: studentRow.id, course_id: enroll.course_id, date: customDate, status: 'leave', method: 'manual', remarks: 'Medical leave' });
    assert.strictEqual(adminUpsert.status, 200);
    const createdAttId = adminUpsert.json.data.id;
    createdAttIds.push(createdAttId);

    const adminPut = await request(server, {
      method: 'PUT',
      path: `/api/admin/attendance/${createdAttId}`,
      headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' }
    }, { status: 'present', remarks: 'Attended makeup offline session' });
    assert.strictEqual(adminPut.status, 200);
    assert.strictEqual(adminPut.json.data.status, 'present');
    assert.strictEqual(adminPut.json.data.updated_by_admin, 1);

    const adminDel = await request(server, {
      method: 'DELETE',
      path: `/api/admin/attendance/${createdAttId}`,
      headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' }
    });
    assert.strictEqual(adminDel.status, 200);
    console.log('✅ CHECK 3 PASS: Student daily attendance self-update & full Admin CRUD verified');

    // ---------------------------------------------------------
    // CHECK 4: Admin Offline Class Schedule Syncs -> Student Dashboard
    // ---------------------------------------------------------
    const offlineUpd = await request(server, {
      method: 'PUT',
      path: `/admin/courses/${enroll.course_id}`,
      headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' }
    }, {
      mode: 'offline',
      duration: '14 Weeks Offline',
      class_timing: '09:30 AM - 12:00 PM',
      trainer_name: 'Karthik M',
      classroom_location: 'Campus Lab 3',
      class_available: 1,
      trainer_available_today: 0,
      trainer_status_note: 'Substitute mentor handling lab review'
    });
    assert.strictEqual(offlineUpd.status, 200, 'Admin updates offline class schedule');

    const stuDashUpdated = await request(server, { path: '/student/dashboard', headers: { Authorization: `Bearer ${stuToken}`, 'X-Role': 'student' } });
    assert.strictEqual(stuDashUpdated.status, 200);
    assert(stuDashUpdated.text.includes('14 Weeks Offline'), 'Student dashboard reflects Admin updated duration');
    assert(stuDashUpdated.text.includes('09:30 AM - 12:00 PM'), 'Student dashboard reflects Admin updated class timing');
    assert(stuDashUpdated.text.includes('Class Today: Available'), 'Student dashboard shows Class Today status');
    assert(stuDashUpdated.text.includes('Trainer Today: Unavailable'), 'Student dashboard shows Trainer Today availability');
    console.log('✅ CHECK 4 PASS: Admin offline class updates sync live to Student Dashboard');

    // ---------------------------------------------------------
    // CHECK 5: Employee Unique Referral Code -> Referred Students Only
    // ---------------------------------------------------------
    const ts = Date.now();
    const empARes = await request(server, { method: 'POST', path: '/api/auth/register' }, {
      name: 'Emp Alpha', email: `emp.alpha.${ts}@arox.com`, phone: '9876500001', password: 'password123', role: 'employee'
    });
    assert.strictEqual(empARes.status, 201);
    const empAId = empARes.json.data.user.id;
    const empACode = empARes.json.data.user.referral_code;
    const empAToken = empARes.json.data.token;
    createdUserIds.push(empAId);
    if (empACode) createdRefCodes.push(empACode);
    assert(empACode && empACode.startsWith('AROX-'), `Employee A auto-received unique referral code: ${empACode}`);

    const empBRes = await request(server, { method: 'POST', path: '/api/auth/register' }, {
      name: 'Emp Beta', email: `emp.beta.${ts}@arox.com`, phone: '9876500002', password: 'password123', role: 'employee'
    });
    assert.strictEqual(empBRes.status, 201);
    const empBId = empBRes.json.data.user.id;
    const empBCode = empBRes.json.data.user.referral_code;
    const empBToken = empBRes.json.data.token;
    createdUserIds.push(empBId);
    if (empBCode) createdRefCodes.push(empBCode);
    assert(empBCode && empBCode !== empACode, 'Employee B has distinct referral code');

    const refStuRes = await request(server, { method: 'POST', path: '/api/auth/register' }, {
      name: 'Referred StudentOne',
      email: `ref.stu.${ts}@example.com`,
      phone: '9876500099',
      password: 'password123',
      role: 'student',
      referral_code: empACode
    });
    assert.strictEqual(refStuRes.status, 201);
    createdUserIds.push(refStuRes.json.data.user.id);
    if (refStuRes.json.data.user.student && refStuRes.json.data.user.student.id) {
      createdStudentIds.push(refStuRes.json.data.user.student.id);
    }

    const empADash = await request(server, { path: '/employee/students', headers: { Authorization: `Bearer ${empAToken}`, 'X-Role': 'employee' } });
    const empBDash = await request(server, { path: '/employee/students', headers: { Authorization: `Bearer ${empBToken}`, 'X-Role': 'employee' } });
    assert(empADash.text.includes(`ref.stu.${ts}@example.com`), 'Employee A sees student referred with Emp A code');
    assert(!empBDash.text.includes(`ref.stu.${ts}@example.com`), 'Employee B does NOT see student referred by Emp A');
    console.log('✅ CHECK 5 PASS: Employee unique referral codes & strict referred-student dashboard scoping verified');

    // ---------------------------------------------------------
    // CHECK 6: Multi-Employee Task Assignment
    // ---------------------------------------------------------
    const multiTaskRes = await request(server, {
      method: 'POST',
      path: '/api/employee/tasks',
      headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' }
    }, {
      title: `MultiTask Verification ${ts}`,
      description: 'Assigned to two employees at once',
      priority: 'high',
      category: 'documentation',
      assigned_to_ids: [empAId, empBId]
    });
    assert.strictEqual(multiTaskRes.status, 200);
    assert.strictEqual(multiTaskRes.json.tasks.length, 2, 'Two tasks created for 2 selected employees');
    multiTaskRes.json.tasks.forEach(t => createdTaskIds.push(t.id));

    const [empATasksPage, empBTasksPage] = await Promise.all([
      request(server, { path: '/employee/tasks', headers: { Authorization: `Bearer ${empAToken}`, 'X-Role': 'employee' } }),
      request(server, { path: '/employee/tasks', headers: { Authorization: `Bearer ${empBToken}`, 'X-Role': 'employee' } })
    ]);
    assert(empATasksPage.text.includes(`MultiTask Verification ${ts}`), 'Employee A sees multi-assigned task');
    assert(empBTasksPage.text.includes(`MultiTask Verification ${ts}`), 'Employee B sees multi-assigned task');
    console.log('✅ CHECK 6 PASS: Admin multi-employee task assignment verified');

    // ---------------------------------------------------------
    // CHECK 7: Employee Work Proof Upload (Dropdown + PDF/PPTX/XLSX/DOCX <= 10MB)
    // ---------------------------------------------------------
    const validPdf = buildMultipart(
      { category: 'Client Presentation', title: `Deck Proof ${ts}`, task_id: String(createdTaskIds[0]), remarks: 'Done' },
      { name: 'proof', filename: 'deliverable.pdf', contentType: 'application/pdf', content: Buffer.from('%PDF-1.4\n%AROX test proof\n%%EOF') }
    );
    const uploadOk = await request(server, {
      method: 'POST',
      path: '/api/employee/proofs',
      headers: { Authorization: `Bearer ${empAToken}`, 'X-Role': 'employee', 'Content-Type': validPdf.contentType }
    }, validPdf.body);
    assert.strictEqual(uploadOk.status, 201, 'Valid .pdf work proof uploaded (201)');
    const proofId = uploadOk.json.data.id;
    createdProofIds.push(proofId);

    const invalidExe = buildMultipart(
      { category: 'Daily Work Report', title: 'Bad File' },
      { name: 'proof', filename: 'malware.exe', contentType: 'application/octet-stream', content: Buffer.from('MZ90') }
    );
    const uploadBad = await request(server, {
      method: 'POST',
      path: '/api/employee/proofs',
      headers: { Authorization: `Bearer ${empAToken}`, 'X-Role': 'employee', 'Content-Type': invalidExe.contentType }
    }, invalidExe.body);
    assert.strictEqual(uploadBad.status, 400, 'Disallowed .exe extension cleanly rejected with HTTP 400');

    const adminApprove = await request(server, {
      method: 'PUT',
      path: `/api/admin/proofs/${proofId}/review`,
      headers: { Authorization: `Bearer ${adminToken}`, 'X-Role': 'admin' }
    }, { status: 'approved', review_notes: 'Looks great' });
    assert.strictEqual(adminApprove.status, 200);
    assert.strictEqual(adminApprove.json.data.status, 'approved');
    console.log('✅ CHECK 7 PASS: Employee proof upload (.pdf allowed, .exe rejected) & Admin approval verified');

    // ---------------------------------------------------------
    // CHECK 9: Strict Role Privilege Enforcement (RBAC Matrix)
    // ---------------------------------------------------------
    const unauthPay = await request(server, { method: 'POST', path: '/api/payments' }, { registration_id: 'X', amount: 1 });
    assert.strictEqual(unauthPay.status, 401, 'Unauthenticated POST /api/payments rejected with 401');

    const unauthSync = await request(server, { method: 'POST', path: '/api/sync/broadcast' }, { eventType: 'x' });
    assert.strictEqual(unauthSync.status, 401, 'Unauthenticated POST /api/sync/broadcast rejected with 401');

    const empPayMut = await request(server, {
      method: 'PUT', path: '/api/payments/1', headers: { Authorization: `Bearer ${empToken}`, 'X-Role': 'employee' }
    }, { amount: 100 });
    assert.strictEqual(empPayMut.status, 403, 'Employee blocked from mutating payments (Show Only -> 403)');

    const empRegMut = await request(server, {
      method: 'PUT', path: '/api/registrations/1', headers: { Authorization: `Bearer ${empToken}`, 'X-Role': 'employee' }
    }, { total_amount: 100 });
    assert.strictEqual(empRegMut.status, 403, 'Employee blocked from modifying student financial fees (403)');

    const empStudentWeb = await request(server, {
      path: '/student/dashboard', headers: { Authorization: `Bearer ${empToken}` }
    });
    assert([302, 403].includes(empStudentWeb.status), 'Employee blocked from accessing Student portal directly');

    const empAssignOtherTask = await request(server, {
      method: 'POST',
      path: '/api/employee/tasks',
      headers: { Authorization: `Bearer ${empAToken}`, 'X-Role': 'employee' }
    }, { title: 'Unauthorized assign', assigned_to: empBId });
    assert.strictEqual(empAssignOtherTask.status, 403, 'Employee cannot assign task to another employee (403)');

    const empDeleteAdminTask = await request(server, {
      method: 'DELETE',
      path: `/api/employee/tasks/${createdTaskIds[0]}`,
      headers: { Authorization: `Bearer ${empAToken}`, 'X-Role': 'employee' }
    });
    assert.strictEqual(empDeleteAdminTask.status, 403, 'Employee cannot delete Admin-assigned task (403)');

    const empDelApprovedProof = await request(server, {
      method: 'DELETE',
      path: `/api/employee/proofs/${proofId}`,
      headers: { Authorization: `Bearer ${empAToken}`, 'X-Role': 'employee' }
    });
    assert.strictEqual(empDelApprovedProof.status, 403, 'Employee cannot delete Admin-approved proof (403)');

    const empDelOtherProof = await request(server, {
      method: 'DELETE',
      path: `/api/employee/proofs/${proofId}`,
      headers: { Authorization: `Bearer ${empBToken}`, 'X-Role': 'employee' }
    });
    assert.strictEqual(empDelOtherProof.status, 403, 'Employee B cannot delete Employee A proof (403)');

    const stuAdminApi = await request(server, {
      path: '/api/admin/attendance', headers: { Authorization: `Bearer ${stuToken}`, 'X-Role': 'student' }
    });
    assert.strictEqual(stuAdminApi.status, 403, 'Student blocked from Admin attendance API (403)');

    const stuEmpApi = await request(server, {
      path: '/api/employee/proofs', headers: { Authorization: `Bearer ${stuToken}`, 'X-Role': 'student' }
    });
    assert.strictEqual(stuEmpApi.status, 403, 'Student blocked from Employee proof API (403)');
    console.log('✅ CHECK 9 PASS: Complete RBAC & ownership boundary matrix verified');

    console.log('\n🎉 ALL 9 REQUIREMENTS & RBAC CHECKS PASSED SUCCESSFULLY!\n');
  } finally {
    // Cleanup synthetic test records and uploaded test proof file so DB stays pristine
    for (const pid of createdProofIds) {
      const pf = db.prepare('SELECT file_name FROM employee_proofs WHERE id = ?').get(pid);
      if (pf && pf.file_name) {
        const fp = path.join(__dirname, '..', 'public', 'uploads', 'proofs', pf.file_name);
        try { if (fs.existsSync(fp)) fs.unlinkSync(fp); } catch (e) {}
      }
      try { db.prepare('DELETE FROM employee_proofs WHERE id = ?').run(pid); } catch (e) {}
    }
    for (const tid of createdTaskIds) {
      try { db.prepare('DELETE FROM employee_tasks WHERE id = ?').run(tid); } catch (e) {}
    }
    for (const sid of createdStudentIds) {
      try { db.prepare('DELETE FROM students WHERE id = ?').run(sid); } catch (e) {}
    }
    for (const code of createdRefCodes) {
      try { db.prepare('DELETE FROM referrals WHERE UPPER(code) = UPPER(?)').run(code); } catch (e) {}
    }
    for (const uid of createdUserIds) {
      try { db.prepare('DELETE FROM users WHERE id = ?').run(uid); } catch (e) {}
    }
    if (originalCourse1) {
      try {
        db.prepare(`
          UPDATE courses
          SET mode = ?, duration = ?, class_timing = ?, trainer_name = ?, classroom_location = ?,
              class_available = ?, trainer_available_today = ?, trainer_status_note = ?
          WHERE id = 1
        `).run(
          originalCourse1.mode, originalCourse1.duration, originalCourse1.class_timing,
          originalCourse1.trainer_name, originalCourse1.classroom_location,
          originalCourse1.class_available !== undefined ? originalCourse1.class_available : 1,
          originalCourse1.trainer_available_today !== undefined ? originalCourse1.trainer_available_today : 1,
          originalCourse1.trainer_status_note || null
        );
      } catch (e) {}
    }
    server.close();
  }
}

runSuite().then(() => process.exit(0)).catch(err => {
  console.error('❌ TEST FAILURE:', err);
  process.exit(1);
});
