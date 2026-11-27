const { Client, Lead, FollowUp, EmployeeTask, EmployeeTarget, User, Student, Course } = require('../models');
const EmployeeProof = require('../models/EmployeeProof');
const logger = require('../utils/logger');
const { getDb } = require('../config/database');
const fs = require('fs');
const path = require('path');

/**
 * Resolve the employee's unique referral code and build a SQL scope filter
 * so employees only ever see students referred by their own code.
 */
function getEmployeeReferralScope(db, reqUser) {
  const roleLower = String((reqUser && reqUser.role) || '').toLowerCase();
  const isAdmin = ['admin', 'super_admin'].includes(roleLower);
  const empRow = db.prepare('SELECT id, first_name, last_name, email, referral_code FROM users WHERE id = ?').get(reqUser.id);
  let referralCode = empRow && empRow.referral_code ? empRow.referral_code.trim().toUpperCase() : null;

  if (!referralCode && empRow && !isAdmin) {
    referralCode = User.ensureEmployeeReferralCode(empRow.id, empRow.first_name, empRow.last_name, empRow.email);
  }

  const refParam = referralCode || '';
  return {
    isAdmin,
    employeeId: reqUser.id,
    referralCode,
    whereClause: isAdmin
      ? 's.deleted_at IS NULL'
      : `s.deleted_at IS NULL AND (
           s.referred_by = @empId
           ${refParam ? "OR UPPER(COALESCE(s.referral_code, '')) = UPPER(@empRefCode)" : ''}
           OR EXISTS (
             SELECT 1 FROM registrations rx
             LEFT JOIN referrals rf ON LOWER(rx.referral_code) = LOWER(rf.code)
             WHERE rx.student_id = s.id
               AND (
                 rf.employee_id = @empId
                 ${refParam ? "OR UPPER(COALESCE(rx.referral_code, '')) = UPPER(@empRefCode)" : ''}
               )
           )
         )`,
    params: { empId: reqUser.id, empRefCode: refParam }
  };
}

const employeeController = {
  /**
   * GET /employee/dashboard
   */
  async dashboard(req, res) {
    try {
      const db = getDb();
      const employeeId = req.user.id;
      const todayDate = new Date().toISOString().split('T')[0];
      const CallReport = require('../models/CallReport');
      const scope = getEmployeeReferralScope(db, req.user);

      // KPI data
      const clientStats = Client.getStats(employeeId);
      const pipelineStats = Lead.getPipelineStats(employeeId);
      const followUpStats = FollowUp.getStats(employeeId);
      const taskStats = EmployeeTask.getStats(employeeId);
      const callStats = CallReport.getPerformanceSummary({ employee_id: employeeId });
      const performance = EmployeeTarget.getPerformanceMetrics(employeeId);

      // Strictly only students referred by this employee's unique referral code
      const referredStudents = db.prepare(`
        SELECT s.id, s.student_id, s.first_name, s.last_name, s.email, s.phone, s.college,
               s.referral_code, s.created_at,
               (SELECT c.title FROM registrations r JOIN courses c ON r.course_id = c.id WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as course_title,
               (SELECT r.status FROM registrations r WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as reg_status
        FROM students s
        WHERE ${scope.whereClause}
        ORDER BY s.created_at DESC
        LIMIT 20
      `).all(scope.params);

      // Uploaded work proofs + assigned tasks for proof dropdown
      const myTasks = EmployeeTask.findAll({ assigned_to: employeeId });
      const uploadedProofs = EmployeeProof.getByEmployee(employeeId);

      // Today's Follow-ups
      const todayFollowUps = FollowUp.findAll({
        employee_id: employeeId,
        filter: 'today'
      });

      // Priority Tasks
      const pendingTasks = myTasks.filter(t => t.status !== 'completed').slice(0, 6);

      // Recent Leads
      const recentLeads = Lead.findAll({
        assigned_to: employeeId
      }).slice(0, 5);

      // Recent Calls Logged
      const recentCalls = CallReport.findAll({
        employee_id: employeeId
      }).slice(0, 5);

      res.render('employee/dashboard', {
        layout: 'layouts/employee',
        title: 'Employee Dashboard - AROX ERP',
        pageTitle: 'Dashboard Overview',
        currentPath: '/employee/dashboard',
        user: req.user,
        referralCode: scope.referralCode,
        referredStudents,
        referredStudentsCount: referredStudents.length,
        myTasks,
        uploadedProofs,
        clientStats,
        pipelineStats,
        followUpStats,
        taskStats,
        callStats,
        performance,
        todayFollowUps,
        pendingTasks,
        recentLeads,
        recentCalls
      });
    } catch (error) {
      logger.error('Employee dashboard error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load employee dashboard.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/clients
   */
  async clients(req, res) {
    try {
      const employeeId = req.user.id;
      const { search, industry, location, status } = req.query;

      const clients = Client.findAll({
        search,
        industry,
        location,
        status
      });

      const stats = Client.getStats();

      res.render('employee/clients', {
        layout: 'layouts/employee',
        title: 'Find & Manage Clients - AROX ERP',
        pageTitle: 'Find Clients',
        currentPath: '/employee/clients',
        user: req.user,
        clients,
        stats,
        filters: { search, industry, location, status }
      });
    } catch (error) {
      logger.error('Employee clients error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load client directory.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/leads
   */
  async leads(req, res) {
    try {
      const employeeId = req.user.id;
      const { search, stage, priority, source, view = 'kanban' } = req.query;

      const leads = Lead.findAll({
        search,
        stage,
        priority,
        source,
        assigned_to: employeeId
      });

      const pipelineStats = Lead.getPipelineStats(employeeId);
      const allClients = Client.findAll();

      // Group leads by stage for Kanban view
      const kanbanLeads = {
        new: leads.filter(l => l.stage === 'new'),
        contacted: leads.filter(l => l.stage === 'contacted'),
        discussion: leads.filter(l => l.stage === 'discussion'),
        proposal: leads.filter(l => l.stage === 'proposal'),
        won: leads.filter(l => l.stage === 'won'),
        lost: leads.filter(l => l.stage === 'lost')
      };

      res.render('employee/leads', {
        layout: 'layouts/employee',
        title: 'Manage Leads & Pipeline - AROX ERP',
        pageTitle: 'Manage Leads',
        currentPath: '/employee/leads',
        user: req.user,
        leads,
        kanbanLeads,
        pipelineStats,
        clients: allClients,
        activeView: view,
        filters: { search, stage, priority, source }
      });
    } catch (error) {
      logger.error('Employee leads error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load leads pipeline.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/follow-ups
   */
  async followUps(req, res) {
    try {
      const employeeId = req.user.id;
      const { tab = 'today' } = req.query;

      const followUps = FollowUp.findAll({
        employee_id: employeeId,
        filter: tab
      });

      const stats = FollowUp.getStats(employeeId);
      const myLeads = Lead.findAll({ assigned_to: employeeId });
      const myClients = Client.findAll();

      res.render('employee/follow-ups', {
        layout: 'layouts/employee',
        title: 'Follow-up Communications - AROX ERP',
        pageTitle: 'Follow-ups',
        currentPath: '/employee/follow-ups',
        user: req.user,
        followUps,
        stats,
        leads: myLeads,
        clients: myClients,
        activeTab: tab
      });
    } catch (error) {
      logger.error('Employee follow-ups error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load follow-up schedules.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/tasks
   */
  async tasks(req, res) {
    try {
      const employeeId = req.user.id;
      const { status = 'all', priority, category, search } = req.query;

      const tasks = EmployeeTask.findAll({
        assigned_to: employeeId,
        status,
        priority,
        category,
        search
      });

      const stats = EmployeeTask.getStats(employeeId);
      const myLeads = Lead.findAll({ assigned_to: employeeId });
      const uploadedProofs = EmployeeProof.getByEmployee(employeeId);

      res.render('employee/tasks', {
        layout: 'layouts/employee',
        title: 'My Tasks - AROX ERP',
        pageTitle: 'Tasks & To-Dos',
        currentPath: '/employee/tasks',
        user: req.user,
        tasks,
        stats,
        leads: myLeads,
        uploadedProofs,
        activeStatus: status,
        filters: { priority, category, search }
      });
    } catch (error) {
      logger.error('Employee tasks error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load employee tasks.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/performance
   */
  async performance(req, res) {
    try {
      const employeeId = req.user.id;
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const metrics = EmployeeTarget.getPerformanceMetrics(employeeId, currentMonth, currentYear);
      const pipelineStats = Lead.getPipelineStats(employeeId);
      const followUpStats = FollowUp.getStats(employeeId);
      const taskStats = EmployeeTask.getStats(employeeId);

      // Recent closed leads
      const wonDeals = Lead.findAll({
        assigned_to: employeeId,
        stage: 'won'
      });

      res.render('employee/performance', {
        layout: 'layouts/employee',
        title: 'Performance & KPI Metrics - AROX ERP',
        pageTitle: 'My Performance',
        currentPath: '/employee/performance',
        user: req.user,
        metrics,
        pipelineStats,
        followUpStats,
        taskStats,
        wonDeals
      });
    } catch (error) {
      logger.error('Employee performance error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load performance metrics.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/students
   */
  async students(req, res) {
    try {
      const db = getDb();
      const scope = getEmployeeReferralScope(db, req.user);
      const search = (req.query.search || '').trim();
      let extraWhere = '';
      const params = { ...scope.params };
      if (search) {
        extraWhere = ' AND (s.first_name LIKE @q OR s.last_name LIKE @q OR s.email LIKE @q OR s.student_id LIKE @q OR s.college LIKE @q)';
        params.q = `%${search}%`;
      }

      const students = db.prepare(`
        SELECT 
          s.id, s.student_id, s.first_name, s.last_name, s.email, s.phone,
          s.college, s.department, s.year_of_study, s.status, s.referral_code, s.created_at,
          (SELECT c.title FROM registrations r JOIN courses c ON r.course_id = c.id WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as course_title,
          (SELECT COALESCE(r.batch_name, c.batch_name) FROM registrations r JOIN courses c ON r.course_id = c.id WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as batch_name,
          (SELECT r.status FROM registrations r WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as reg_status,
          (SELECT r.total_amount FROM registrations r WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as total_amount,
          (SELECT r.paid_amount FROM registrations r WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as paid_amount,
          (SELECT r.balance_amount FROM registrations r WHERE r.student_id = s.id ORDER BY r.created_at DESC LIMIT 1) as balance_amount
        FROM students s
        WHERE ${scope.whereClause}${extraWhere}
        ORDER BY s.created_at DESC
      `).all(params) || [];

      res.render('employee/students', {
        layout: 'layouts/employee',
        title: 'Referred Students - AROX ERP',
        pageTitle: 'My Referred Students',
        currentPath: '/employee/students',
        user: req.user,
        referralCode: scope.referralCode,
        isAdminView: scope.isAdmin,
        students,
        search
      });
    } catch (error) {
      logger.error('Employee students error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load student directory.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/profile
   */
  async profile(req, res) {
    try {
      const db = getDb();
      const employeeId = req.user.id;
      const user = User.findById(employeeId);
      const scope = getEmployeeReferralScope(db, req.user);
      const metrics = EmployeeTarget.getPerformanceMetrics(employeeId);

      res.render('employee/profile', {
        layout: 'layouts/employee',
        title: 'My Profile - AROX ERP',
        pageTitle: 'My Profile',
        currentPath: '/employee/profile',
        user: req.user,
        profile: user,
        referralCode: scope.referralCode || (user && user.referral_code) || null,
        metrics
      });
    } catch (error) {
      logger.error('Employee profile error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load employee profile.',
        user: req.user
      });
    }
  },

  // ============================================
  // API ACTIONS (POST / PUT / DELETE)
  // ============================================

  /**
   * POST /api/employee/clients
   */
  async createClient(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');

      const data = {
        ...req.body,
        assigned_to: req.body.assigned_to || req.user.id
      };
      const client = Client.create(data);

      logAudit(req, {
        action: 'CREATE_CLIENT',
        module: 'clients',
        entityType: 'client',
        entityId: client.id,
        newValues: client
      });

      syncService.broadcast('client:created', {
        id: client.id,
        companyName: client.company_name,
        message: `Client ${client.company_name} added.`
      });

      res.json({ success: true, message: 'Client added successfully!', client });
    } catch (e) {
      logger.error('createClient error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * PUT /api/employee/clients/:id
   */
  async updateClient(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);

      const oldClient = Client.findById(req.params.id);
      if (!oldClient) return res.status(404).json({ success: false, message: 'Client not found.' });
      if (!isAdmin && oldClient.assigned_to && oldClient.assigned_to !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only update clients assigned to you.' });
      }

      const client = Client.update(req.params.id, req.body);

      logAudit(req, {
        action: 'UPDATE_CLIENT',
        module: 'clients',
        entityType: 'client',
        entityId: req.params.id,
        oldValues: oldClient,
        newValues: req.body
      });

      syncService.broadcast('client:updated', {
        id: req.params.id,
        companyName: client ? client.company_name : 'Client',
        message: `Client ${client ? client.company_name : ''} updated.`
      });

      res.json({ success: true, message: 'Client updated successfully!', client });
    } catch (e) {
      logger.error('updateClient error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * DELETE /api/employee/clients/:id
   */
  async deleteClient(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);

      const oldClient = Client.findById(req.params.id);
      if (!oldClient) return res.status(404).json({ success: false, message: 'Client not found.' });
      if (!isAdmin && oldClient.assigned_to && oldClient.assigned_to !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Only Admin or assigned owner can delete this client.' });
      }

      Client.delete(req.params.id);

      logAudit(req, {
        action: 'DELETE_CLIENT',
        module: 'clients',
        entityType: 'client',
        entityId: req.params.id,
        oldValues: oldClient
      });

      syncService.broadcast('client:deleted', {
        id: req.params.id,
        companyName: oldClient.company_name,
        message: `Client ${oldClient.company_name} removed.`
      });

      res.json({ success: true, message: 'Client deleted successfully without broken references.' });
    } catch (e) {
      logger.error('deleteClient error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * POST /api/employee/leads
   */
  async createLead(req, res) {
    try {
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const data = {
        ...req.body,
        assigned_to: isAdmin ? (req.body.assigned_to || req.user.id) : req.user.id
      };
      const lead = Lead.create(data);
      res.json({ success: true, message: 'Lead added to pipeline!', lead });
    } catch (e) {
      logger.error('createLead error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * PUT /api/employee/leads/:id/stage
   */
  async updateLeadStage(req, res) {
    try {
      const { stage } = req.body;
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const existing = Lead.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Lead not found.' });
      if (!isAdmin && existing.assigned_to && existing.assigned_to !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only move your own leads.' });
      }
      const lead = Lead.updateStage(req.params.id, stage);
      res.json({ success: true, message: `Lead moved to ${stage}`, lead });
    } catch (e) {
      logger.error('updateLeadStage error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * PUT /api/employee/leads/:id
   */
  async updateLead(req, res) {
    try {
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const existing = Lead.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Lead not found.' });
      if (!isAdmin && existing.assigned_to && existing.assigned_to !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only update your own leads.' });
      }
      const lead = Lead.update(req.params.id, req.body);
      res.json({ success: true, message: 'Lead updated successfully!', lead });
    } catch (e) {
      logger.error('updateLead error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * DELETE /api/employee/leads/:id
   */
  async deleteLead(req, res) {
    try {
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const existing = Lead.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Lead not found.' });
      if (!isAdmin && existing.assigned_to && existing.assigned_to !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Only Admin or assigned owner can delete this lead.' });
      }
      Lead.delete(req.params.id);
      res.json({ success: true, message: 'Lead deleted successfully!' });
    } catch (e) {
      logger.error('deleteLead error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * POST /api/employee/follow-ups
   */
  async createFollowUp(req, res) {
    try {
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const data = {
        ...req.body,
        employee_id: isAdmin ? (req.body.employee_id || req.user.id) : req.user.id
      };
      const followUp = FollowUp.create(data);
      res.json({ success: true, message: 'Follow-up scheduled successfully!', followUp });
    } catch (e) {
      logger.error('createFollowUp error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * PUT /api/employee/follow-ups/:id/complete
   */
  async completeFollowUp(req, res) {
    try {
      const { outcome, notes } = req.body;
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const existing = FollowUp.findById ? FollowUp.findById(req.params.id) : null;
      if (existing && !isAdmin && existing.employee_id && existing.employee_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only complete your own follow-ups.' });
      }
      const followUp = FollowUp.complete(req.params.id, outcome, notes);
      res.json({ success: true, message: 'Follow-up logged as completed!', followUp });
    } catch (e) {
      logger.error('completeFollowUp error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * DELETE /api/employee/follow-ups/:id
   */
  async deleteFollowUp(req, res) {
    try {
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const existing = FollowUp.findById ? FollowUp.findById(req.params.id) : null;
      if (existing && !isAdmin && existing.employee_id && existing.employee_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only delete your own follow-ups.' });
      }
      FollowUp.delete(req.params.id);
      res.json({ success: true, message: 'Follow-up removed successfully!' });
    } catch (e) {
      logger.error('deleteFollowUp error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * POST /api/employee/tasks
   * Admin can assign the same task to multiple employees; regular employees can only create self-tasks.
   */
  async createTask(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      const assignerName = `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || req.user.email;

      // Support single or multiple employee assignment
      let assigneeIds = [];
      if (Array.isArray(req.body.assigned_to_ids)) {
        assigneeIds = req.body.assigned_to_ids.map(v => parseInt(v, 10)).filter(v => Number.isInteger(v) && v > 0);
      } else if (typeof req.body.assigned_to_ids === 'string' && req.body.assigned_to_ids.trim()) {
        assigneeIds = req.body.assigned_to_ids.split(',').map(v => parseInt(v.trim(), 10)).filter(v => Number.isInteger(v) && v > 0);
      } else if (Array.isArray(req.body.assigned_to)) {
        assigneeIds = req.body.assigned_to.map(v => parseInt(v, 10)).filter(v => Number.isInteger(v) && v > 0);
      } else if (req.body.assigned_to) {
        const single = parseInt(req.body.assigned_to, 10);
        if (Number.isInteger(single) && single > 0) assigneeIds = [single];
      }

      if (assigneeIds.length === 0) {
        assigneeIds = [req.user.id];
      }

      if (!isAdmin) {
        if (assigneeIds.length > 1 || assigneeIds[0] !== req.user.id) {
          if (req.file && req.file.path) {
            try { require('fs').unlinkSync(req.file.path); } catch (e) {}
          }
          return res.status(403).json({
            success: false,
            message: 'Only Admins can assign tasks to other or multiple employees.'
          });
        }
      }

      const path = require('path');
      const taskPayload = {
        ...req.body,
        assigned_by: req.user.id,
        assigned_by_name: assignerName
      };
      if (req.file) {
        const ext = path.extname(req.file.originalname || req.file.filename).toLowerCase().replace('.', '');
        taskPayload.attachment_name = req.file.filename;
        taskPayload.attachment_original_name = req.file.originalname;
        taskPayload.attachment_path = `/uploads/tasks/${req.file.filename}`;
        taskPayload.attachment_ext = ext;
        taskPayload.attachment_size = req.file.size || 0;
      }

      const createdTasks = assigneeIds.length > 1
        ? EmployeeTask.createMany(assigneeIds, taskPayload)
        : [EmployeeTask.create({ ...taskPayload, assigned_to: assigneeIds[0] })];
      const task = createdTasks[0];

      try {
        logAudit(req, {
          action: 'CREATE',
          module: 'tasks',
          entityType: 'employee_tasks',
          entityId: String(task.id),
          oldValues: null,
          newValues: { title: task.title, assigned_to_ids: assigneeIds, priority: task.priority }
        });
      } catch (logErr) {
        logger.warn('Failed to log audit for createTask:', logErr.message);
      }

      syncService.broadcast('task:created', {
        id: task.id,
        count: createdTasks.length,
        title: task.title,
        assignedTo: assigneeIds,
        priority: task.priority,
        updatedBy: assignerName,
        timestamp: new Date().toISOString(),
        message: createdTasks.length > 1
          ? `Task "${task.title}" assigned to ${createdTasks.length} employees.`
          : `New task "${task.title}" created.`
      });

      res.json({
        success: true,
        message: createdTasks.length > 1
          ? `Task assigned to ${createdTasks.length} employees successfully!`
          : 'Task created successfully!',
        task,
        tasks: createdTasks
      });
    } catch (e) {
      logger.error('createTask error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * PUT /api/employee/tasks/:id/status
   */
  async updateTaskStatus(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);

      const { status } = req.body;
      const oldTask = EmployeeTask.findById(req.params.id);
      if (!oldTask) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      if (!isAdmin && oldTask.assigned_to !== req.user.id && oldTask.assigned_by !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only update status of your own tasks.' });
      }

      const task = EmployeeTask.updateStatus(req.params.id, status);

      try {
        logAudit(req, {
          action: 'UPDATE',
          module: 'tasks',
          entityType: 'employee_tasks',
          entityId: String(req.params.id),
          oldValues: { status: oldTask.status },
          newValues: { status }
        });
      } catch (logErr) {
        logger.warn('Failed to log audit for updateTaskStatus:', logErr.message);
      }

      syncService.broadcast('task:updated', {
        id: req.params.id,
        title: task ? task.title : 'Task',
        status: status,
        updatedBy: req.user.full_name || req.user.email,
        timestamp: new Date().toISOString()
      });

      res.json({ success: true, message: `Task status updated to ${status}`, task });
    } catch (e) {
      logger.error('updateTaskStatus error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * PUT /api/employee/tasks/:id
   */
  async updateTask(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);

      const oldTask = EmployeeTask.findById(req.params.id);
      if (!oldTask) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      if (!isAdmin) {
        if (oldTask.assigned_to !== req.user.id && oldTask.assigned_by !== req.user.id) {
          return res.status(403).json({ success: false, message: 'Access denied.' });
        }
        // Admin-assigned tasks are Show-Only for employees except status updates
        if (oldTask.assigned_by && oldTask.assigned_by !== req.user.id) {
          if (req.file && req.file.path) {
            try { require('fs').unlinkSync(req.file.path); } catch (e) {}
          }
          return res.status(403).json({
            success: false,
            message: 'Admin-assigned tasks cannot be edited by employees. Use status update or upload work proof instead.'
          });
        }
      }

      const path = require('path');
      const updateData = { ...req.body };
      if (req.file) {
        const ext = path.extname(req.file.originalname || req.file.filename).toLowerCase().replace('.', '');
        updateData.attachment_name = req.file.filename;
        updateData.attachment_original_name = req.file.originalname;
        updateData.attachment_path = `/uploads/tasks/${req.file.filename}`;
        updateData.attachment_ext = ext;
        updateData.attachment_size = req.file.size || 0;
      }

      const task = EmployeeTask.update(req.params.id, updateData);

      try {
        logAudit(req, {
          action: 'UPDATE',
          module: 'tasks',
          entityType: 'employee_tasks',
          entityId: String(req.params.id),
          oldValues: oldTask,
          newValues: req.body
        });
      } catch (logErr) {
        logger.warn('Failed to log audit for updateTask:', logErr.message);
      }

      syncService.broadcast('task:updated', {
        id: req.params.id,
        title: task ? task.title : 'Task',
        status: task ? task.status : req.body.status,
        updatedBy: req.user.full_name || req.user.email,
        timestamp: new Date().toISOString()
      });

      res.json({ success: true, message: 'Task updated successfully!', task });
    } catch (e) {
      logger.error('updateTask error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * DELETE /api/employee/tasks/:id
   */
  async deleteTask(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);

      const oldTask = EmployeeTask.findById(req.params.id);
      if (!oldTask) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      if (!isAdmin && oldTask.assigned_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Admin-assigned tasks can only be deleted by an Admin.'
        });
      }

      EmployeeTask.delete(req.params.id);

      try {
        logAudit(req, {
          action: 'DELETE',
          module: 'tasks',
          entityType: 'employee_tasks',
          entityId: String(req.params.id),
          oldValues: oldTask,
          newValues: null
        });
      } catch (logErr) {
        logger.warn('Failed to log audit for deleteTask:', logErr.message);
      }

      syncService.broadcast('task:deleted', {
        id: req.params.id,
        title: oldTask ? oldTask.title : 'Task',
        updatedBy: req.user.full_name || req.user.email,
        timestamp: new Date().toISOString()
      });

      res.json({ success: true, message: 'Task deleted successfully!' });
    } catch (e) {
      logger.error('deleteTask error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * GET /api/employee/tasks/:id/attachment
   * Serves attached task document (.xlsx, .docx, .pdf, .pptx) inline or as download (?download=1)
   */
  async downloadTaskAttachment(req, res) {
    try {
      const path = require('path');
      const fs = require('fs');
      const os = require('os');
      const task = EmployeeTask.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      if (!isAdmin && task.assigned_to !== req.user.id && task.assigned_by !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied for this task attachment.' });
      }
      if (!task.attachment_name && !task.attachment_path) {
        return res.status(404).json({ success: false, message: 'No attachment found for this task.' });
      }

      const fileName = task.attachment_name || path.basename(task.attachment_path);
      const candidates = [
        path.join(__dirname, '..', 'public', 'uploads', 'tasks', fileName),
        path.join(os.tmpdir(), 'uploads', 'tasks', fileName)
      ];
      const filePath = candidates.find(p => fs.existsSync(p));
      if (!filePath) {
        return res.status(404).json({ success: false, message: 'Attachment file could not be located on disk.' });
      }

      const mimeMap = {
        pdf: 'application/pdf',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      };
      const ext = String(task.attachment_ext || path.extname(fileName).slice(1)).toLowerCase();
      const downloadName = String(task.attachment_original_name || fileName).replace(/["\r\n]/g, '_');
      const disposition = req.query.download === '1' ? 'attachment' : 'inline';

      res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `${disposition}; filename="${downloadName}"`);
      return res.sendFile(path.resolve(filePath));
    } catch (e) {
      logger.error('downloadTaskAttachment error:', e);
      return res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * GET /api/employee/tasks/:id/attachment/preview
   * Returns structured preview data for .xlsx, .docx, .pptx or inline URL for .pdf
   */
  async previewTaskAttachment(req, res) {
    try {
      const path = require('path');
      const fs = require('fs');
      const os = require('os');
      const { buildDocumentPreview } = require('../utils/docPreview');
      const task = EmployeeTask.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      const roleLower = String((req.user && req.user.role) || '').toLowerCase();
      const isAdmin = ['admin', 'super_admin'].includes(roleLower);
      if (!isAdmin && task.assigned_to !== req.user.id && task.assigned_by !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied for this task attachment.' });
      }
      if (!task.attachment_name && !task.attachment_path) {
        return res.status(404).json({ success: false, message: 'No attachment found for this task.' });
      }

      const fileName = task.attachment_name || path.basename(task.attachment_path);
      const candidates = [
        path.join(__dirname, '..', 'public', 'uploads', 'tasks', fileName),
        path.join(os.tmpdir(), 'uploads', 'tasks', fileName)
      ];
      const filePath = candidates.find(p => fs.existsSync(p));
      if (!filePath) {
        return res.status(404).json({ success: false, message: 'Attachment file could not be located on disk.' });
      }

      const ext = String(task.attachment_ext || path.extname(fileName).slice(1)).toLowerCase();
      const rawUrl = `/api/employee/tasks/${task.id}/attachment`;
      const buffer = ext === 'pdf' ? null : fs.readFileSync(filePath);
      const preview = buildDocumentPreview(buffer, ext, task.attachment_original_name || fileName, rawUrl);
      return res.json({ success: true, preview });
    } catch (e) {
      logger.error('previewTaskAttachment error:', e);
      return res.status(500).json({ success: false, message: e.message || 'Could not generate preview.' });
    }
  },

  /**
   * GET /employee/internships (Leads > Internships)
   * Student internship details, editable same as admin
   */
  async internships(req, res) {
    try {
      const db = getDb();
      const scope = getEmployeeReferralScope(db, req.user);
      const internships = db.prepare(`
        SELECT 
          r.*,
          s.first_name, s.last_name, s.email, s.phone, s.college, s.department, s.degree, s.year_of_study,
          c.title as course_title, c.batch_name as course_batch, c.duration as course_duration, c.price as course_price,
          c.mode as course_mode
        FROM registrations r
        JOIN students s ON r.student_id = s.id
        JOIN courses c ON r.course_id = c.id
        WHERE r.deleted_at IS NULL AND (${scope.whereClause})
        ORDER BY r.created_at DESC
      `).all(scope.params) || [];

      const courses = db.prepare('SELECT id, title, duration, mode, batch_name, price FROM courses WHERE is_active = 1').all() || [];

      res.render('employee/internships', {
        layout: 'layouts/employee',
        title: 'Referred Internships - Employee Portal',
        pageTitle: 'Referred Student Internships',
        currentPath: '/employee/internships',
        user: req.user,
        referralCode: scope.referralCode,
        isAdminView: scope.isAdmin,
        internships,
        courses
      });
    } catch (error) {
      logger.error('Employee internships error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load internships.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/call-reports
   * Employee logs and views their call reports (student dropdown scoped to referred students)
   */
  async callReports(req, res) {
    try {
      const db = getDb();
      const CallReport = require('../models/CallReport');
      const employeeId = req.user.id;
      const scope = getEmployeeReferralScope(db, req.user);

      const reports = CallReport.findAll({ employee_id: employeeId });
      const stats = CallReport.getPerformanceSummary({ employee_id: employeeId });

      // Load only this employee's referred students + assigned/active clients
      const students = db.prepare(`SELECT s.id, (s.first_name || ' ' || s.last_name) as name, s.email, s.phone FROM students s WHERE ${scope.whereClause} ORDER BY s.first_name ASC`).all(scope.params) || [];
      const clients = scope.isAdmin
        ? db.prepare('SELECT id, company_name as name, contact_person, email, phone FROM clients WHERE deleted_at IS NULL ORDER BY company_name ASC').all() || []
        : db.prepare('SELECT id, company_name as name, contact_person, email, phone FROM clients WHERE deleted_at IS NULL AND (assigned_to = ? OR assigned_to IS NULL) ORDER BY company_name ASC').all(employeeId) || [];

      res.render('employee/call-reports', {
        layout: 'layouts/employee',
        title: 'Call Reports - Employee Portal',
        pageTitle: 'Call Reports',
        currentPath: '/employee/call-reports',
        user: req.user,
        reports,
        stats,
        students,
        clients
      });
    } catch (error) {
      logger.error('Employee call reports error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load call reports.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/contacts
   * Client and student contacts only (phone, email, WhatsApp, other) with Click-to-call / WhatsApp
   */
  async contacts(req, res) {
    try {
      const db = getDb();
      const { type = 'all', search = '' } = req.query;
      const scope = getEmployeeReferralScope(db, req.user);

      let contacts = [];

      // Query Referred Students Contacts ONLY
      if (type === 'all' || type === 'student') {
        let stuSql = `
          SELECT 
            s.id,
            (s.first_name || ' ' || s.last_name) as name,
            s.email,
            s.phone,
            COALESCE(s.phone, '') as whatsapp,
            'student' as contact_type,
            COALESCE(s.college, 'Referred Student') as affiliation,
            COALESCE(s.referral_code, 'Referred') as details
          FROM students s
          WHERE ${scope.whereClause}
        `;
        const stuParams = { ...scope.params };
        if (search) {
          stuSql += ' AND (s.first_name LIKE @search OR s.last_name LIKE @search OR s.phone LIKE @search OR s.email LIKE @search)';
          stuParams.search = `%${search}%`;
        }
        const stuRows = db.prepare(stuSql).all(stuParams);
        contacts.push(...stuRows);
      }

      // Query Clients Contacts
      if (type === 'all' || type === 'client') {
        let cliSql = `
          SELECT 
            c.id,
            c.contact_person as name,
            c.email,
            c.phone,
            COALESCE(c.phone, '') as whatsapp,
            'client' as contact_type,
            c.company_name as affiliation,
            (c.industry || ' • ' || c.location) as details
          FROM clients c
          WHERE c.deleted_at IS NULL
        `;
        const cliParams = [];
        if (search) {
          cliSql += ' AND (c.contact_person LIKE ? OR c.company_name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?)';
          const term = `%${search}%`;
          cliParams.push(term, term, term, term);
        }
        const cliRows = db.prepare(cliSql).all(...cliParams);
        contacts.push(...cliRows);
      }

      // Sort alphabetically
      contacts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      res.render('employee/contacts', {
        layout: 'layouts/employee',
        title: 'Contacts Directory - Employee Portal',
        pageTitle: 'Contacts Directory',
        currentPath: '/employee/contacts',
        user: req.user,
        contacts,
        filters: { type, search }
      });
    } catch (error) {
      logger.error('Employee contacts error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load contacts directory.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/reviews
   * Employee reviews and ratings view
   */
  async reviews(req, res) {
    try {
      const Review = require('../models/Review');
      const reviews = Review.findAll();
      const myReviews = Review.findAll({ user_id: req.user.id });

      res.render('employee/reviews', {
        layout: 'layouts/employee',
        title: 'Reviews & Rating - Employee Portal',
        pageTitle: 'Reviews & Feedback',
        currentPath: '/employee/reviews',
        user: req.user,
        reviews,
        myReviews
      });
    } catch (error) {
      logger.error('Employee reviews error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load reviews.',
        user: req.user
      });
    }
  },

  /**
   * GET /employee/settings
   */
  async settings(req, res) {
    try {
      const user = User.findById(req.user.id);
      res.render('employee/settings', {
        layout: 'layouts/employee',
        title: 'Settings & Preferences - Employee Portal',
        pageTitle: 'Settings',
        currentPath: '/employee/settings',
        user: req.user,
        profile: user
      });
    } catch (error) {
      logger.error('Employee settings error:', error);
      res.status(500).render('website/error', {
        layout: 'layouts/employee',
        title: 'Error - AROX ERP',
        code: 500,
        message: 'Failed to load settings.',
        user: req.user
      });
    }
  },
  // ============================================
  // EMPLOYEE WORK PROOFS (.pdf, .pptx, .xlsx, .docx up to 10MB)
  // ============================================

  async listProofs(req, res) {
    try {
      const proofs = EmployeeProof.getByEmployee(req.user.id, {
        category: req.query.category,
        status: req.query.status
      });
      res.json({ success: true, data: proofs });
    } catch (error) {
      logger.error('List employee proofs error:', error);
      res.status(500).json({ success: false, message: 'Failed to load uploaded proofs.' });
    }
  },

  async uploadProof(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please attach a valid proof document (.pdf, .pptx, .xlsx, or .docx up to 10MB).'
        });
      }

      const category = (req.body.category || 'Daily Work Report').trim();
      const title = (req.body.title || req.file.originalname).trim();
      const remarks = req.body.remarks ? String(req.body.remarks).trim() : null;
      const taskId = req.body.task_id ? parseInt(req.body.task_id, 10) : null;
      const ext = path.extname(req.file.originalname || '').toLowerCase().replace('.', '');

      if (taskId) {
        const task = EmployeeTask.findById(taskId);
        if (!task || (task.assigned_to !== req.user.id && !['admin', 'super_admin'].includes((req.user.role || '').toLowerCase()))) {
          try { fs.unlinkSync(req.file.path); } catch (e) {}
          return res.status(403).json({ success: false, message: 'You can only attach proof to your own tasks.' });
        }
      }

      const created = EmployeeProof.create({
        employee_id: req.user.id,
        task_id: taskId || null,
        category,
        title,
        remarks,
        file_name: req.file.filename,
        original_name: req.file.originalname,
        file_path: `/uploads/proofs/${req.file.filename}`,
        file_ext: ext,
        file_size: req.file.size || 0
      });

      const syncService = require('../services/syncService');
      const empName = `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || req.user.email;
      syncService.broadcast('proof:uploaded', {
        proofId: created.id,
        employeeId: req.user.id,
        category,
        title,
        message: `${empName} uploaded work proof "${title}" (${ext.toUpperCase()}).`
      });

      res.status(201).json({
        success: true,
        message: 'Work proof uploaded successfully!',
        data: created
      });
    } catch (error) {
      logger.error('Upload proof error:', error);
      res.status(500).json({ success: false, message: 'Failed to upload work proof: ' + error.message });
    }
  },

  async deleteProof(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const existing = EmployeeProof.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Proof not found.' });
      }
      const isAdmin = ['admin', 'super_admin'].includes((req.user.role || '').toLowerCase());
      if (existing.employee_id !== req.user.id && !isAdmin) {
        return res.status(403).json({ success: false, message: 'You can only delete your own work proofs.' });
      }
      if (!isAdmin && existing.status === 'approved') {
        return res.status(403).json({ success: false, message: 'Approved proofs cannot be deleted by employee.' });
      }

      EmployeeProof.deleteById(id);
      if (existing.file_name) {
        const diskPath = path.join(__dirname, '..', 'public', 'uploads', 'proofs', existing.file_name);
        try { if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath); } catch (e) {}
      }

      res.json({ success: true, message: 'Proof removed successfully.' });
    } catch (error) {
      logger.error('Delete proof error:', error);
      res.status(500).json({ success: false, message: 'Failed to remove proof.' });
    }
  }
};

module.exports = employeeController;
