const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('arox-main-main/erp/Arox-main/views');

// Helper to insert cards directly below the top header or before catalogue-toolbar
function addCardsToFile(filePath, marker, cardsHtml) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<!-- Summary Metric Cards -->') || content.includes('Summary Metric Cards')) {
    console.log('Already has cards:', filePath);
    return;
  }
  
  if (content.includes(marker)) {
    content = content.replace(marker, cardsHtml + '\n' + marker);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✓ Added overview cards to:', filePath);
  } else {
    console.warn('✗ Marker not found in:', filePath, marker);
  }
}

// 1. admin/students/index.ejs
const adminStudentsCards = `<!-- Summary Metric Cards -->
<%
  const totalStudents = students ? students.length : 0;
  const activeStudents = students ? students.filter(s => (s.status || 'active').toLowerCase() === 'active').length : 0;
  const enrolledStudents = students ? students.filter(s => Number(s.course_count || 0) > 0).length : 0;
  const collegesCount = students ? new Set(students.map(s => (s.college_name || s.college || '').trim()).filter(Boolean)).size : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="users"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Students</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalStudents %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Registered cohort</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="user-check"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Active Learners</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= activeStudents %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">In good standing</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="graduation-cap"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Enrolled in Programs</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= enrolledStudents %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Active course batches</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="building-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Partner Institutions</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= collegesCount %></div>
    <div class="erp-p" style="margin-top: 6px; color: #000000; font-weight: 600; font-size: 12px;">Colleges & Universities</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'admin/students/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="students">', adminStudentsCards);

// 2. admin/employees/index.ejs
const adminEmployeesCards = `<!-- Summary Metric Cards -->
<%
  const totalEmployees = employees ? employees.length : 0;
  const activeEmployees = employees ? employees.filter(e => (e.status || 'active').toLowerCase() === 'active').length : 0;
  const staffTrainers = employees ? employees.filter(e => e.role_name === 'employee' || (e.department || '').toLowerCase().includes('train') || (e.department || '').toLowerCase().includes('tech')).length : 0;
  const adminOfficers = employees ? employees.filter(e => e.role_name === 'admin' || e.role_name === 'super_admin').length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="briefcase"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Staff</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalEmployees %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Employees & management</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="user-check"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Active Members</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= activeEmployees %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Currently operational</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="user-cog"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Operations & Training</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= staffTrainers %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Instructional & CRM</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="shield-check"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Administrators</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= adminOfficers %></div>
    <div class="erp-p" style="margin-top: 6px; color: #000000; font-weight: 600; font-size: 12px;">Privileged access</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'admin/employees/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="employees">', adminEmployeesCards);

// 3. admin/clients/index.ejs
const adminClientsCards = `<!-- Summary Metric Cards -->
<%
  const totalClients = clients ? clients.length : 0;
  const activePartners = clients ? clients.filter(c => (c.status || '').toLowerCase() === 'partner').length : 0;
  const prospectsCount = clients ? clients.filter(c => (c.status || '').toLowerCase() === 'prospect' || (c.status || '').toLowerCase() === 'contacted').length : 0;
  const industriesCount = clients ? new Set(clients.map(c => (c.industry || c.category || '').trim()).filter(Boolean)).size : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="building-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Clients</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalClients %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Enterprise & Colleges</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="handshake"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Active Partners</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= activePartners %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">MoUs & Contracts</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="target"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">In Discussions</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= prospectsCount %></div>
    <div class="erp-p" style="margin-top: 6px; color: #D97706; font-weight: 600; font-size: 12px;">Prospects & Outreach</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="layers"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Industry Sectors</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= industriesCount %></div>
    <div class="erp-p" style="margin-top: 6px; color: #000000; font-weight: 600; font-size: 12px;">Diverse Domains</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'admin/clients/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="clients">', adminClientsCards);

// 4. admin/tasks/index.ejs
const adminTasksCards = `<!-- Summary Metric Cards -->
<%
  const totalTasks = tasks ? tasks.length : 0;
  const completedTasks = tasks ? tasks.filter(t => t.status === 'completed').length : 0;
  const inProgressTasks = tasks ? tasks.filter(t => t.status === 'in_progress' || t.status === 'todo' || t.status === 'review').length : 0;
  const highPriorityTasks = tasks ? tasks.filter(t => (t.priority || '').toLowerCase() === 'high').length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="check-square"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Tasks</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalTasks %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Delegated assignments</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="check-circle-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Completed</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= completedTasks %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Successfully resolved</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="clock"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">In Progress</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= inProgressTasks %></div>
    <div class="erp-p" style="margin-top: 6px; color: #D97706; font-weight: 600; font-size: 12px;">Active queue</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="alert-circle"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">High Priority</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= highPriorityTasks %></div>
    <div class="erp-p" style="margin-top: 6px; color: #DC2626; font-weight: 600; font-size: 12px;">Urgent deliverables</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'admin/tasks/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="admin_tasks">', adminTasksCards);

// 5. admin/payments/index.ejs
const adminPaymentsCards = `<!-- Summary Metric Cards -->
<%
  const totalPayments = payments ? payments.length : 0;
  const verifiedPayments = payments ? payments.filter(p => p.status === 'completed').length : 0;
  const pendingPayments = payments ? payments.filter(p => p.status === 'pending').length : 0;
  const totalAmountCleared = payments ? payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount || 0), 0) : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="indian-rupee"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Verified Fee</div>
    </div>
    <div class="erp-card-value" style="color: #000000;">₹<%= totalAmountCleared.toLocaleString('en-IN') %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Cleared collections</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="receipt"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Transactions</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalPayments %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Total receipts logged</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="check-circle-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Verified Cleared</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= verifiedPayments %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">UTR confirmed</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="clock"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Pending Verification</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= pendingPayments %></div>
    <div class="erp-p" style="margin-top: 6px; color: #D97706; font-weight: 600; font-size: 12px;">Needs review</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'admin/payments/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="admin_payments">', adminPaymentsCards);

// 6. admin/users/index.ejs
const adminUsersCards = `<!-- Summary Metric Cards -->
<%
  const totalUsers = users ? users.length : 0;
  const activeUsers = users ? users.filter(u => (u.status || 'active').toLowerCase() === 'active').length : 0;
  const staffUsers = users ? users.filter(u => u.role_name === 'employee' || u.role_name === 'staff').length : 0;
  const studentUsers = users ? users.filter(u => u.role_name === 'student').length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="users"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Users</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalUsers %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">System accounts</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="user-check"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Active Logins</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= activeUsers %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Authenticated access</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="briefcase"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Employee Accounts</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= staffUsers %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Operations & CRM</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="graduation-cap"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Student Accounts</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= studentUsers %></div>
    <div class="erp-p" style="margin-top: 6px; color: #000000; font-weight: 600; font-size: 12px;">Student portal</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'admin/users/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="users">', adminUsersCards);

// 7. employee/clients.ejs
addCardsToFile(path.join(rootDir, 'employee/clients.ejs'), '<div class="catalogue-toolbar" data-catalogue="emp_clients">', adminClientsCards);

// 8. employee/tasks.ejs
addCardsToFile(path.join(rootDir, 'employee/tasks.ejs'), '<div class="catalogue-toolbar" data-catalogue="emp_tasks">', adminTasksCards);

// 9. employee/contacts.ejs
const empContactsCards = `<!-- Summary Metric Cards -->
<%
  const totalContacts = contacts ? contacts.length : 0;
  const studentContacts = contacts ? contacts.filter(c => c.type === 'student').length : 0;
  const clientContacts = contacts ? contacts.filter(c => c.type === 'client').length : 0;
  const verifiedPhones = contacts ? contacts.filter(c => c.phone).length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="address-book"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Directory</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalContacts %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">All reachable profiles</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="graduation-cap"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Student Contacts</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= studentContacts %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Learners & Interns</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="building-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Corporate Clients</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= clientContacts %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Enterprise & Colleges</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="phone"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Direct Dial / WhatsApp</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= verifiedPhones %></div>
    <div class="erp-p" style="margin-top: 6px; color: #000000; font-weight: 600; font-size: 12px;">Verified phone numbers</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'employee/contacts.ejs'), '<div class="catalogue-toolbar" data-catalogue="emp_contacts">', empContactsCards);

// 10. employee/reviews.ejs
const empReviewsCards = `<!-- Summary Metric Cards -->
<%
  const totalReviews = reviews ? reviews.length : 0;
  const avgRating = reviews && reviews.length > 0 ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length).toFixed(1) : '5.0';
  const fiveStars = reviews ? reviews.filter(r => Number(r.rating || 0) === 5).length : 0;
  const repliedReviews = reviews ? reviews.filter(r => r.admin_reply || r.status === 'approved').length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="message-square"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Feedback</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalReviews %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Submitted reviews</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="star"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Average Rating</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= avgRating %> ★</div>
    <div class="erp-p" style="margin-top: 6px; color: #EAB308; font-weight: 600; font-size: 12px;">Overall satisfaction</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="award"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">5-Star Ratings</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= fiveStars %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Top tier reviews</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="check-circle-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Acknowledged</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= repliedReviews %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Reviewed by management</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'employee/reviews.ejs'), '<div class="catalogue-toolbar" data-catalogue="emp_reviews">', empReviewsCards);

// 11. employee/follow-ups.ejs
const empFollowUpsCards = `<!-- Summary Metric Cards -->
<%
  const totalFollowups = followUps ? followUps.length : 0;
  const pendingFollowups = followUps ? followUps.filter(f => f.status === 'pending').length : 0;
  const completedFollowups = followUps ? followUps.filter(f => f.status === 'completed').length : 0;
  const callMeetings = followUps ? followUps.filter(f => (f.type || '').includes('call') || (f.type || '').includes('meeting')).length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="calendar"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Follow-ups</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalFollowups %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Scheduled communications</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="clock"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Pending Action</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= pendingFollowups %></div>
    <div class="erp-p" style="margin-top: 6px; color: #D97706; font-weight: 600; font-size: 12px;">Upcoming outreach</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="check-circle-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Completed</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= completedFollowups %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Executed logs</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="phone-call"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Direct Calls & Meets</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= callMeetings %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Interactive discussions</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'employee/follow-ups.ejs'), '<div class="catalogue-toolbar" data-catalogue="emp_followups">', empFollowUpsCards);

// 12. student/courses/index.ejs
const studentCoursesCards = `<!-- Summary Metric Cards -->
<%
  const totalCourses = registrations ? registrations.length : 0;
  const activeCourses = registrations ? registrations.filter(r => r.status === 'confirmed' || r.status === 'active').length : 0;
  const completedCourses = registrations ? registrations.filter(r => r.status === 'completed').length : 0;
  const credentialsReady = registrations ? registrations.filter(r => r.offer_letter_generated || r.status === 'completed').length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="book-open"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Enrolled Programs</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalCourses %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Active & completed courses</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="play-circle"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Active Learning</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= activeCourses %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Currently in session</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="award"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Completed Tracks</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= completedCourses %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Curriculum cleared</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="file-check-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Credentials Ready</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= credentialsReady %></div>
    <div class="erp-p" style="margin-top: 6px; color: #000000; font-weight: 600; font-size: 12px;">Letters & Certificates</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'student/courses/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="st_courses">', studentCoursesCards);

// 13. student/attendance/index.ejs
const studentAttendanceCards = `<!-- Summary Metric Cards -->
<%
  const enrolledCoursesCount = courses ? courses.length : 0;
  const overallPct = courses && courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.percentage || 0), 0) / courses.length) : 0;
  const totalDaysPresent = courses ? courses.reduce((acc, c) => acc + (c.presentDays || 0), 0) : 0;
  const markedTodayStatus = courses && courses.some(c => c.isMarkedToday) ? 'Completed' : 'Pending';
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="book-open"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Enrolled Courses</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= enrolledCoursesCount %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Active course batches</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="percent"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Overall Attendance</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= overallPct %>%</div>
    <div class="erp-p" style="margin-top: 6px; color: <%= overallPct >= 75 ? '#16A34A' : '#DC2626' %>; font-weight: 600; font-size: 12px;"><%= overallPct >= 75 ? 'Meets 75% threshold' : 'Below 75% required' %></div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="calendar-check"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Sessions Present</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalDaysPresent %> <span style="font-size: 13px; font-weight: 500; color: #64748B;">Days</span></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Logged & verified</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="clock"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Today's Session</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= markedTodayStatus %></div>
    <div class="erp-p" style="margin-top: 6px; color: <%= markedTodayStatus === 'Completed' ? '#16A34A' : '#D97706' %>; font-weight: 600; font-size: 12px;"><%= markedTodayStatus === 'Completed' ? 'Logged for today' : 'Log your session today' %></div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'student/attendance/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="st_attendance">', studentAttendanceCards);

// 14. student/reviews/index.ejs
const studentReviewsCards = `<!-- Summary Metric Cards -->
<%
  const totalEnrolled = enrolledCourses ? enrolledCourses.length : 0;
  const reviewsCount = myReviews ? myReviews.length : 0;
  const studentAvg = myReviews && myReviews.length > 0 ? (myReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / myReviews.length).toFixed(1) : '5.0';
  const repliesCount = myReviews ? myReviews.filter(r => r.admin_reply).length : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="book-open"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Enrolled Courses</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalEnrolled %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Cohorts available to review</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="message-square-check"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Submitted Reviews</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= reviewsCount %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">Shared feedback</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="star"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Average Rating</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= studentAvg %> ★</div>
    <div class="erp-p" style="margin-top: 6px; color: #EAB308; font-weight: 600; font-size: 12px;">Your submitted average</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="message-circle"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Trainer Responses</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= repliesCount %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Official replies received</div>
  </div>
</div>`;
addCardsToFile(path.join(rootDir, 'student/reviews/index.ejs'), '<div class="catalogue-toolbar" data-catalogue="st_reviews">', studentReviewsCards);

// 15. employee/students.ejs (Upgrade with Overview Cards, Catalogue Toolbar and Table)
const empStudentsUpgrade = `<div class="erp-h1" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; color: #000000;">
  <div>
    <div style="font-size: 24px; font-weight: 750;">Students & Corporate Batch Cohorts</div>
    <div style="font-size: 13px; color: #64748B; font-weight: 500; margin-top: 4px;">Explore active students, batch allocations, and training progress</div>
  </div>
  <div style="font-size: 13px; color: #64748B; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;">
    <i data-lucide="users" style="width: 15px; height: 15px;"></i>
    <span>Student Outreach Hub</span>
  </div>
</div>

<!-- Summary Metric Cards -->
<%
  const totalStudents = students ? students.length : 0;
  const activeStudents = students ? students.filter(s => (s.status || 'active').toLowerCase() === 'active').length : 0;
  const withCourse = students ? students.filter(s => s.course_title).length : 0;
  const collegesCount = students ? new Set(students.map(s => (s.college || '').trim()).filter(Boolean)).size : 0;
%>
<div class="erp-grid-4" style="margin-bottom: 24px;">
  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="users"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Total Students</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= totalStudents %></div>
    <div class="erp-p" style="margin-top: 6px; color: #64748B; font-size: 12px;">Enrolled cohort</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="user-check"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Active Students</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= activeStudents %></div>
    <div class="erp-p" style="margin-top: 6px; color: #16A34A; font-weight: 600; font-size: 12px;">In good standing</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="graduation-cap"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Assigned Programs</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= withCourse %></div>
    <div class="erp-p" style="margin-top: 6px; color: #2563EB; font-weight: 600; font-size: 12px;">Course batches</div>
  </div>

  <div class="erp-card" style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 20px;">
    <div class="erp-card-header">
      <div class="erp-card-icon" style="background: #000000; color: #FFFFFF;">
        <i data-lucide="building-2"></i>
      </div>
      <div class="erp-card-title" style="color: #64748B;">Colleges Represented</div>
    </div>
    <div class="erp-card-value" style="color: #000000;"><%= collegesCount %></div>
    <div class="erp-p" style="margin-top: 6px; color: #000000; font-weight: 600; font-size: 12px;">Partner institutions</div>
  </div>
</div>

<!-- Interactive Catalogue Filter Toolbar (Apple + Google Material 3) -->
<div class="catalogue-toolbar" data-catalogue="emp_students">
  <div class="catalogue-filters-group">
    <!-- Search Input -->
    <div class="catalogue-search-wrap">
      <i data-lucide="search"></i>
      <input type="text" class="catalogue-search-input" placeholder="Search by name, ID, email, college, course...">
    </div>

    <!-- Status Filter -->
    <select class="catalogue-select" data-filter="status" title="Filter by Status">
      <option value="all">All Statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="pending">Pending</option>
    </select>

    <!-- Sort Dropdown -->
    <select class="catalogue-select" data-filter="sort" title="Sort records">
      <option value="name">Student Name (A - Z)</option>
      <option value="name_desc">Student Name (Z - A)</option>
      <option value="newest">Newest First</option>
    </select>

    <!-- Reset Button -->
    <button type="button" class="catalogue-reset-btn" title="Reset all filters">
      <i data-lucide="rotate-ccw" style="width: 13px; height: 13px;"></i>
      <span>Reset</span>
    </button>

    <!-- Result Counter -->
    <span class="catalogue-count-badge">Showing <%= students ? students.length : 0 %> students</span>
  </div>
</div>

<div class="catalogue-list-view">
  <div class="erp-card" style="padding: 0; background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
    <div class="erp-table-container" style="border: none; border-radius: 0; margin-bottom: 0;">
      <table class="erp-table">
        <thead>
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700;">
            <th style="padding: 12px 16px;">Student ID</th>
            <th style="padding: 12px 16px;">Student Name</th>
            <th style="padding: 12px 16px;">College & Department</th>
            <th style="padding: 12px 16px;">Assigned Program</th>
            <th style="padding: 12px 16px;">Contact</th>
            <th style="padding: 12px 16px;">Status</th>
          </tr>
        </thead>
        <tbody>
          <% if (students && students.length > 0) { %>
            <% students.forEach(s => { 
              const fullName = (s.first_name + ' ' + (s.last_name || '')).trim();
              const sStatus = (s.status || 'active').toLowerCase();
            %>
              <tr data-search="<%= (fullName + ' ' + (s.student_id || '') + ' ' + (s.email || '') + ' ' + (s.college || '') + ' ' + (s.department || '') + ' ' + (s.course_title || '')).toLowerCase() %>"
                  data-status="<%= sStatus %>"
                  data-name="<%= fullName.toLowerCase() %>"
                  data-newest="<%= s.id %>">
                <td style="padding: 12px 16px; font-weight: 600; color: #64748B;"><%= s.student_id %></td>
                <td style="padding: 12px 16px; font-weight: 650; color: #000;"><%= fullName %></td>
                <td style="padding: 12px 16px; color: #334155;">
                  <div><%= s.college || 'Anna University' %></div>
                  <div style="font-size: 11px; color: #64748B;"><%= s.department || 'CSE' %></div>
                </td>
                <td style="padding: 12px 16px; color: #334155;">
                  <%= s.course_title || 'Full Stack Web Development' %>
                </td>
                <td style="padding: 12px 16px; color: #475569; font-size: 12px;">
                  <div><%= s.email %></div>
                  <div><%= s.phone %></div>
                </td>
                <td style="padding: 12px 16px;">
                  <span style="font-size: 11px; font-weight: 700; padding: 2px 7px; background: #000; color: #fff; border-radius: 4px; text-transform: uppercase;">
                    <%= s.status || 'Active' %>
                  </span>
                </td>
              </tr>
            <% }) %>
          <% } else { %>
            <tr>
              <td colspan="6" style="padding: 32px; text-align: center; color: #64748B;">No students registered.</td>
            </tr>
          <% } %>
        </tbody>
      </table>
    </div>
  </div>
</div>`;
fs.writeFileSync(path.join(rootDir, 'employee/students.ejs'), empStudentsUpgrade, 'utf8');
console.log('✓ Upgraded employee/students.ejs with overview cards & catalogue toolbar');

console.log('All overview cards successfully added!');
