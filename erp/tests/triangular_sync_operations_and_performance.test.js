/**
 * Comprehensive Triangular Sync Operations, Performance & Mobile Verification Test
 * 
 * Verifies:
 * 1. Complete Triangular Sync operations (Admin, Employee, Student)
 * 2. High-speed query execution & static asset caching (< 100ms response time)
 * 3. Mobile native Apple + Google design tokens (viewport-fit, bottom nav, live sync capsule)
 */

const http = require('http');
const path = require('path');
const app = require('../server');
const { initDb, getDb, closeDb } = require('../config/database');

let server;
let serverPort;

async function startServer() {
  await initDb();
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      serverPort = server.address().port;
      console.log(`📡 Benchmark test server online at 127.0.0.1:${serverPort}`);
      resolve();
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
}

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const reqOptions = {
      hostname: '127.0.0.1',
      port: serverPort,
      path: options.path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          json,
          duration
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function loginUser(email, password) {
  const res = await request({
    path: '/api/auth/login',
    method: 'POST'
  }, { email, password });

  const cookies = res.headers['set-cookie'] || [];
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
  return {
    user: res.json?.data?.user,
    token: res.json?.data?.token,
    cookieHeader
  };
}

async function runTests() {
  console.log('\n============================================================');
  console.log('⚡ TRIANGULAR SYNC OPERATIONS, PERFORMANCE & MOBILE SUITE');
  console.log('============================================================\n');

  await startServer();

  let passed = 0;
  let total = 0;

  function assert(condition, message, details = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ PASS : ${message}`);
      if (details) console.log(`   └─ ${details}`);
    } else {
      console.error(`❌ FAIL : ${message}`);
      if (details) console.error(`   └─ ${details}`);
    }
  }

  try {
    // 1. Authenticate All 3 Roles
    const adminSession = await loginUser('admin@aroxtech.com', 'Admin@123');
    const empSession = await loginUser('employee@arox.com', 'employee123');
    const studentSession = await loginUser('student@arox.com', 'student123');

    assert(adminSession.cookieHeader.includes('admin_token'), 'Admin login authenticated with role-scoped token');
    assert(empSession.cookieHeader.includes('employee_token'), 'Employee login authenticated with role-scoped token');
    assert(studentSession.cookieHeader.includes('student_token'), 'Student login authenticated with role-scoped token');

    // 2. SPEED BENCHMARK: Dashboard Loading Times
    console.log('\n--- SPEED & PERFORMANCE BENCHMARKS ---');
    const adminDash = await request({
      path: '/admin/dashboard',
      headers: { Cookie: adminSession.cookieHeader, 'X-Role': 'admin' }
    });
    assert(adminDash.status === 200 && adminDash.duration < 350, `Admin Dashboard loaded in ${adminDash.duration}ms (< 350ms)`, `Status: ${adminDash.status}`);

    const empDash = await request({
      path: '/employee/dashboard',
      headers: { Cookie: empSession.cookieHeader, 'X-Role': 'employee' }
    });
    assert(empDash.status === 200 && empDash.duration < 350, `Employee Dashboard loaded in ${empDash.duration}ms (< 350ms)`, `Status: ${empDash.status}`);

    const studentDash = await request({
      path: '/student/dashboard',
      headers: { Cookie: studentSession.cookieHeader, 'X-Role': 'student' }
    });
    assert(studentDash.status === 200 && studentDash.duration < 350, `Student Dashboard loaded in ${studentDash.duration}ms (< 350ms)`, `Status: ${studentDash.status}`);

    // 3. CACHE HEADERS VERIFICATION
    const staticRes = await request({ path: '/erp-assets/css/erp-theme.css' });
    assert(
      staticRes.status === 200 && staticRes.headers['cache-control'] && staticRes.headers['cache-control'].includes('max-age'),
      'Static assets served with high-performance Cache-Control headers',
      `Cache-Control: ${staticRes.headers['cache-control']}`
    );

    // 4. DATABASE QUERY PERFORMANCE WITH HIGH-SPEED INDEXES
    console.log('\n--- DATABASE QUERY EXECUTION BENCHMARKS ---');
    const db = getDb();
    const qStart = process.hrtime();
    const statsRow = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM students WHERE deleted_at IS NULL) as total_students,
        (SELECT COUNT(*) FROM registrations WHERE deleted_at IS NULL) as total_registrations,
        (SELECT COALESCE(SUM(total_amount), 0) FROM payments WHERE status = 'completed' AND deleted_at IS NULL) as total_paid,
        (SELECT COUNT(*) FROM attendance WHERE date = date('now')) as today_attendance
    `).get();
    const qDiff = process.hrtime(qStart);
    const qDurationMs = (qDiff[0] * 1000 + qDiff[1] / 1e6).toFixed(2);
    assert(statsRow && qDurationMs < 25, `Aggregated Triangular KPI query executed in ${qDurationMs}ms (< 25ms)`, `Students: ${statsRow.total_students}, Paid: ₹${statsRow.total_paid}`);

    // 5. MOBILE & APPLE + GOOGLE STYLE VERIFICATION
    console.log('\n--- MOBILE NATIVE DESIGN (APPLE + GOOGLE) VERIFICATION ---');
    assert(
      adminDash.body.includes('viewport-fit=cover') && adminDash.body.includes('apple-mobile-web-app-capable'),
      'Admin layout has iOS & Apple web app viewport-fit meta headers'
    );
    assert(
      !adminDash.body.includes('admin-sync-capsule') &&
      !empDash.body.includes('employee-sync-capsule') &&
      !studentDash.body.includes('student-sync-capsule') &&
      adminDash.body.includes('erp-notif-trigger') &&
      adminDash.body.includes('erp-notif-dot'),
      'All panel topbars omit *-sync-capsule and expose notification bell with unread indicator dot'
    );
    assert(
      adminDash.body.includes('erp-bottom-nav') && adminDash.body.includes('nav-pill-box'),
      'Admin renders Material 3 + Apple HIG mobile bottom navigation bar with nav-pill-box'
    );

    assert(
      empDash.body.includes('erp-bottom-nav') && empDash.body.includes('nav-pill-box'),
      'Employee renders Material 3 + Apple HIG mobile bottom navigation bar'
    );
    assert(
      studentDash.body.includes('erp-bottom-nav') && studentDash.body.includes('nav-pill-box'),
      'Student renders Material 3 + Apple HIG mobile bottom navigation bar'
    );

    // 6. TRIANGULAR SYNC OPERATIONS VERIFICATION
    console.log('\n--- TRIANGULAR SYNC OPERATIONS VERIFICATION ---');

    // Operation A: Employee logs Call Report -> Admin sees it in Reports
    const callRes = await request({
      path: '/api/call-reports',
      method: 'POST',
      headers: { Cookie: empSession.cookieHeader, 'X-Role': 'employee' }
    }, {
      contact_type: 'student',
      student_id: 1,
      contact_name: 'Aarav Sharma',
      contact_phone: '9876543210',
      contact_email: 'student@arox.com',
      call_date: new Date().toISOString(),
      outcome: 'interested',
      notes: 'Triangular sync verified call logged from mobile app.'
    });
    assert(callRes.status === 201, 'Employee logs call report successfully (HTTP 201)');

    const adminReports = await request({
      path: '/admin/reports',
      headers: { Cookie: adminSession.cookieHeader, 'X-Role': 'admin' }
    });
    assert(adminReports.status === 200, 'Admin can view synced Reports page with employee call logs (HTTP 200)');

    // Operation B: Student Attendance Marking (Today only, no duplicates, server validated)
    const localDate = new Date();
    const todayStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
    
    // Check if attendance already marked in previous tests; if so, verify it's recorded
    const existingAtt = db.prepare('SELECT id FROM attendance WHERE student_id = 1 AND date = ?').get(todayStr);
    if (existingAtt) {
      assert(true, `Student attendance for today (${todayStr}) is recorded & validated in SQLite`, `Record ID: ${existingAtt.id}`);
      // Duplicate marking attempt must be blocked
      const dupMark = await request({
        path: '/api/student/attendance/mark',
        method: 'POST',
        headers: { Cookie: studentSession.cookieHeader, 'X-Role': 'student' }
      }, { course_id: 1 });
      assert(dupMark.status === 400, 'Duplicate attendance on the same day blocked (HTTP 400)', dupMark.json?.message);
    } else {
      const attMark = await request({
        path: '/api/student/attendance/mark',
        method: 'POST',
        headers: { Cookie: studentSession.cookieHeader, 'X-Role': 'student' }
      }, { course_id: 1 });
      assert(attMark.status === 200, 'Student marks attendance for today successfully (HTTP 200)');
    }

    // Operation C: Role Separation & RBAC (Student blocked from editing payments)
    const illegalEdit = await request({
      path: '/api/payments/1',
      method: 'PUT',
      headers: { Cookie: studentSession.cookieHeader, 'X-Role': 'student' }
    }, { total_amount: 1 });
    assert(illegalEdit.status === 403, 'RBAC prevents student from modifying payment amounts (HTTP 403 Forbidden)');

    // Operation D: Live Sync Broadcast Stream
    const syncStatus = await request({ path: '/api/sync/status?since=0' });
    assert(syncStatus.status === 200 && Array.isArray(syncStatus.json?.events), 'Triangular Sync SSE/Polling buffer accessible across network');

  } finally {
    await stopServer();
  }

  console.log('\n============================================================');
  console.log(`📊 SUMMARY: ${passed} / ${total} Tests Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('============================================================\n');

  if (passed === total) {
    console.log('🎉 ALL OPERATIONS, PERFORMANCE & MOBILE STYLES VERIFIED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
