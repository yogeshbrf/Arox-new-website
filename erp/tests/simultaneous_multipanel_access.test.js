/**
 * SIMULTANEOUS MULTI-PANEL & CROSS-SYSTEM ACCESS TEST
 * Verifies that:
 * 1. Admin, Employee, and Student sessions can coexist simultaneously in the same browser without 403 errors.
 * 2. Cross-system network access and real-time SSE syncing work properly.
 */

const http = require('http');
const app = require('../server');
const { initDb, getDb, closeDb } = require('../config/database');

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

function extractCookies(setCookieHeader) {
  if (!setCookieHeader) return {};
  const cookies = {};
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  headers.forEach(h => {
    const parts = h.split(';')[0].split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
  return cookies;
}

function cookieHeaderString(cookieObj) {
  return Object.entries(cookieObj).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function runSimultaneousAccessTests() {
  console.log('\n============================================================');
  console.log('🧪 TESTING SIMULTANEOUS MULTI-PANEL & CROSS-SYSTEM SESSIONS');
  console.log('============================================================\n');

  await initDb();

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`📡 Test server online at 127.0.0.1:${port}`);

  const cookieJar = {};
  const testResults = [];

  function record(name, passed, details = '') {
    testResults.push({ name, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} : ${name}`);
    if (details) console.log(`   └─ ${details}`);
  }

  try {
    // -------------------------------------------------------------
    // Step 1: Login as Admin
    // -------------------------------------------------------------
    const adminLoginRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/auth/login'
    }, {
      email: 'admin@aroxtech.com',
      password: 'Admin@123',
      role: 'admin'
    });

    const adminCookies = extractCookies(adminLoginRes.headers['set-cookie']);
    Object.assign(cookieJar, adminCookies);

    record(
      'Admin Login Sets admin_token & token cookies',
      adminLoginRes.status === 200 && !!adminCookies.admin_token,
      `Status: ${adminLoginRes.status}, admin_token: ${adminCookies.admin_token ? 'Present' : 'Missing'}`
    );

    // -------------------------------------------------------------
    // Step 2: Login as Employee in same browser (simultaneous)
    // -------------------------------------------------------------
    const empLoginRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/auth/login'
    }, {
      email: 'employee@arox.com',
      password: 'employee123',
      role: 'employee'
    });

    const empCookies = extractCookies(empLoginRes.headers['set-cookie']);
    Object.assign(cookieJar, empCookies);

    record(
      'Employee Login Sets employee_token without wiping admin_token',
      empLoginRes.status === 200 && !!empCookies.employee_token && !!cookieJar.admin_token,
      `Status: ${empLoginRes.status}, employee_token: ${empCookies.employee_token ? 'Present' : 'Missing'}, admin_token in jar: ${cookieJar.admin_token ? 'Preserved' : 'Lost'}`
    );

    // -------------------------------------------------------------
    // Step 3: Login as Student in same browser (simultaneous)
    // -------------------------------------------------------------
    const studentLoginRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/auth/login'
    }, {
      email: 'student@arox.com',
      password: 'student123',
      role: 'student'
    });

    const studentCookies = extractCookies(studentLoginRes.headers['set-cookie']);
    Object.assign(cookieJar, studentCookies);

    record(
      'Student Login Sets student_token (all 3 coexisting in cookie jar)',
      studentLoginRes.status === 200 && !!studentCookies.student_token && !!cookieJar.admin_token && !!cookieJar.employee_token,
      `admin_token: ${!!cookieJar.admin_token}, employee_token: ${!!cookieJar.employee_token}, student_token: ${!!cookieJar.student_token}`
    );

    const allCookiesHeader = cookieHeaderString(cookieJar);

    // -------------------------------------------------------------
    // Step 4: Access Admin Dashboard with multi-cookie jar (NO 403!)
    // -------------------------------------------------------------
    const adminDashRes = await makeRequest(server, {
      method: 'GET',
      path: '/admin/dashboard',
      headers: {
        'Cookie': allCookiesHeader
      }
    });

    record(
      'Admin Dashboard accessible with multi-panel cookie jar (NO 403)',
      adminDashRes.status === 200,
      `HTTP Status: ${adminDashRes.status} (Expected 200 OK)`
    );

    // -------------------------------------------------------------
    // Step 5: Access Employee Dashboard with multi-cookie jar (NO 403!)
    // -------------------------------------------------------------
    const empDashRes = await makeRequest(server, {
      method: 'GET',
      path: '/employee/dashboard',
      headers: {
        'Cookie': allCookiesHeader
      }
    });

    record(
      'Employee Dashboard accessible with multi-panel cookie jar (NO 403)',
      empDashRes.status === 200,
      `HTTP Status: ${empDashRes.status} (Expected 200 OK)`
    );

    // -------------------------------------------------------------
    // Step 6: Access Student Dashboard with multi-cookie jar (NO 403!)
    // -------------------------------------------------------------
    const studentDashRes = await makeRequest(server, {
      method: 'GET',
      path: '/student/dashboard',
      headers: {
        'Cookie': allCookiesHeader
      }
    });

    record(
      'Student Dashboard accessible with multi-panel cookie jar (NO 403)',
      studentDashRes.status === 200,
      `HTTP Status: ${studentDashRes.status} (Expected 200 OK)`
    );

    // -------------------------------------------------------------
    // Step 7: Admin makes write API call with X-Role: admin (NO 403!)
    // -------------------------------------------------------------
    const adminApiRes = await makeRequest(server, {
      method: 'PUT',
      path: '/api/registrations/1',
      headers: {
        'Cookie': allCookiesHeader,
        'Referer': `http://127.0.0.1:${port}/admin/internships`,
        'X-Role': 'admin'
      }
    }, {
      first_name: 'Aarav',
      last_name: 'Sharma',
      email: 'student@arox.com',
      phone: '9876543210',
      course_id: 1,
      batch_name: 'Multi-Panel-Sync-Batch',
      start_date: '2026-10-01',
      end_date: '2026-12-31',
      mode: 'online',
      status: 'confirmed',
      total_amount: 8999,
      paid_amount: 8999,
      balance_amount: 0
    });

    record(
      'Admin write API call succeeds seamlessly with multi-cookie jar (NO 403)',
      adminApiRes.status === 200,
      `HTTP Status: ${adminApiRes.status}, Message: ${adminApiRes.data ? adminApiRes.data.message : ''}`
    );

    // -------------------------------------------------------------
    // Step 8: Employee makes call report API with X-Role: employee (NO 403!)
    // -------------------------------------------------------------
    const empApiRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/call-reports',
      headers: {
        'Cookie': allCookiesHeader,
        'Referer': `http://127.0.0.1:${port}/employee/call-reports`,
        'X-Role': 'employee'
      }
    }, {
      contact_type: 'student',
      student_id: 1,
      contact_name: 'Aarav Sharma',
      outcome: 'converted',
      notes: 'Multi-panel simultaneous test call log'
    });

    record(
      'Employee write API call succeeds seamlessly with multi-cookie jar (NO 403)',
      empApiRes.status === 201,
      `HTTP Status: ${empApiRes.status}, Outcome: converted`
    );

    // -------------------------------------------------------------
    // Step 9: Cross-system SSE sync status & polling endpoint (HTTP 200)
    // -------------------------------------------------------------
    const ssePollRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/sync/status?since=0',
      headers: {
        'Origin': 'http://192.168.1.50:3000' // Cross-system origin simulation
      }
    });

    record(
      'Cross-System Sync polling works across network origins',
      ssePollRes.status === 200 && Array.isArray(ssePollRes.data.events),
      `HTTP Status: ${ssePollRes.status}, Events in sync buffer: ${ssePollRes.data ? ssePollRes.data.events.length : 0}`
    );

  } finally {
    server.close();
    closeDb();
  }

  console.log('\n============================================================');
  console.log('📊 SIMULTANEOUS MULTI-PANEL TEST SUMMARY:');
  console.log('============================================================');
  const allPassed = testResults.every(r => r.passed);
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! ALL 3 PANELS OPERATE SIMULTANEOUSLY WITHOUT 403 ERRORS!\n');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

if (require.main === module) {
  runSimultaneousAccessTests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
}

module.exports = runSimultaneousAccessTests;

