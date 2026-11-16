const { Client, Lead, FollowUp, EmployeeTask, EmployeeTarget, User, Student, Course } = require('../models');
const logger = require('../utils/logger');
const { getDb } = require('../config/database');

const employeeController = {
  /**
   * GET /employee/dashboard
   */
  async dashboard(req, res) {
    try {
      const employeeId = req.user.id;
      const todayDate = new Date().toISOString().split('T')[0];
      const CallReport = require('../models/CallReport');

      // KPI data
      const clientStats = Client.getStats(employeeId);
      const pipelineStats = Lead.getPipelineStats(employeeId);
      const followUpStats = FollowUp.getStats(employeeId);
      const taskStats = EmployeeTask.getStats(employeeId);
      const callStats = CallReport.getPerformanceSummary({ employee_id: employeeId });
      const performance = EmployeeTarget.getPerformanceMetrics(employeeId);

      // Today's Follow-ups
      const todayFollowUps = FollowUp.findAll({
        employee_id: employeeId,
        filter: 'today'
      });

      // Priority Tasks
      const pendingTasks = EmployeeTask.findAll({
        assigned_to: employeeId,
        status: 'todo'
      }).slice(0, 5);

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

      res.render('employee/tasks', {
        layout: 'layouts/employee',
        title: 'My Tasks - AROX ERP',
        pageTitle: 'Tasks & To-Dos',
        currentPath: '/employee/tasks',
        user: req.user,
        tasks,
        stats,
        leads: myLeads,
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
      const students = db.prepare(`
        SELECT 
          s.id, s.student_id, s.first_name, s.last_name, s.email, s.phone,
          s.college, s.department, s.year_of_study, s.status,
          c.title as course_title, c.batch_name
        FROM students s
        LEFT JOIN registrations r ON r.student_id = s.id
        LEFT JOIN courses c ON r.course_id = c.id
        ORDER BY s.first_name ASC
      `).all() || [];

      res.render('employee/students', {
        layout: 'layouts/employee',
        title: 'Students & Batches - AROX ERP',
        pageTitle: 'Students Directory',
        currentPath: '/employee/students',
        user: req.user,
        students
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
      const employeeId = req.user.id;
      const user = User.findById(employeeId);
      const metrics = EmployeeTarget.getPerformanceMetrics(employeeId);

      res.render('employee/profile', {
        layout: 'layouts/employee',
        title: 'My Profile - AROX ERP',
        pageTitle: 'My Profile',
        currentPath: '/employee/profile',
        user: req.user,
        profile: user,
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

      const oldClient = Client.findById(req.params.id);
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

      const oldClient = Client.findById(req.params.id);
      if (!oldClient) return res.status(404).json({ success: false, message: 'Client not found.' });

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
      const data = {
        ...req.body,
        assigned_to: req.body.assigned_to || req.user.id
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
      const data = {
        ...req.body,
        employee_id: req.body.employee_id || req.user.id
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
      FollowUp.delete(req.params.id);
      res.json({ success: true, message: 'Follow-up removed successfully!' });
    } catch (e) {
      logger.error('deleteFollowUp error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  /**
   * POST /api/employee/tasks
   */
  async createTask(req, res) {
    try {
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');

      const data = {
        ...req.body,
        assigned_to: req.body.assigned_to || req.user.id,
        assigned_by: req.user.id
      };
      const task = EmployeeTask.create(data);

      try {
        logAudit({
          user_id: req.user.id,
          user_role: req.user.role,
          action: 'CREATE',
          entity: 'employee_tasks',
          entity_id: String(task.id),
          old_value: null,
          new_value: { title: task.title, assigned_to: task.assigned_to, priority: task.priority },
          ip_address: req.ip || req.connection.remoteAddress
        });
      } catch (logErr) {
        logger.warn('Failed to log audit for createTask:', logErr.message);
      }

      syncService.broadcast('task:created', {
        id: task.id,
        title: task.title,
        assignedTo: task.assigned_to,
        priority: task.priority,
        updatedBy: req.user.full_name || req.user.email,
        timestamp: new Date().toISOString()
      });

      res.json({ success: true, message: 'Task created successfully!', task });
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

      const { status } = req.body;
      const oldTask = EmployeeTask.findById(req.params.id);
      const task = EmployeeTask.updateStatus(req.params.id, status);

      try {
        logAudit({
          user_id: req.user.id,
          user_role: req.user.role,
          action: 'UPDATE',
          entity: 'employee_tasks',
          entity_id: String(req.params.id),
          old_value: { status: oldTask ? oldTask.status : null },
          new_value: { status },
          ip_address: req.ip || req.connection.remoteAddress
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

      const oldTask = EmployeeTask.findById(req.params.id);
      const task = EmployeeTask.update(req.params.id, req.body);

      try {
        logAudit({
          user_id: req.user.id,
          user_role: req.user.role,
          action: 'UPDATE',
          entity: 'employee_tasks',
          entity_id: String(req.params.id),
          old_value: oldTask,
          new_value: req.body,
          ip_address: req.ip || req.connection.remoteAddress
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

      const oldTask = EmployeeTask.findById(req.params.id);
      EmployeeTask.delete(req.params.id);

      try {
        logAudit({
          user_id: req.user.id,
          user_role: req.user.role,
          action: 'DELETE',
          entity: 'employee_tasks',
          entity_id: String(req.params.id),
          old_value: oldTask,
          new_value: null,
          ip_address: req.ip || req.connection.remoteAddress
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
   * GET /employee/internships (Leads > Internships)
   * Student internship details, editable same as admin
   */
  async internships(req, res) {
    try {
      const db = getDb();
      const internships = db.prepare(`
        SELECT 
          r.*,
          s.first_name, s.last_name, s.email, s.phone, s.college, s.department, s.degree, s.year_of_study,
          c.title as course_title, c.batch_name as course_batch, c.duration as course_duration, c.price as course_price,
          c.mode as course_mode
        FROM registrations r
        JOIN students s ON r.student_id = s.id
        JOIN courses c ON r.course_id = c.id
        WHERE r.deleted_at IS NULL
        ORDER BY r.created_at DESC
      `).all() || [];

      const courses = db.prepare('SELECT id, title, duration, mode, batch_name, price FROM courses WHERE is_active = 1').all() || [];

      res.render('employee/internships', {
        layout: 'layouts/employee',
        title: 'Leads: Internships - Employee Portal',
        pageTitle: 'Internships Pipeline',
        currentPath: '/employee/internships',
        user: req.user,
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
   * Employee logs and views student and client contact call reports
   */
  async callReports(req, res) {
    try {
      const db = getDb();
      const CallReport = require('../models/CallReport');
      const employeeId = req.user.id;

      const reports = CallReport.findAll({ employee_id: employeeId });
      const stats = CallReport.getPerformanceSummary({ employee_id: employeeId });

      // Load contacts for dropdown selection
      const students = db.prepare('SELECT id, (first_name || \' \' || last_name) as name, email, phone FROM students WHERE deleted_at IS NULL ORDER BY first_name ASC').all() || [];
      const clients = db.prepare('SELECT id, company_name as name, contact_person, email, phone FROM clients WHERE deleted_at IS NULL ORDER BY company_name ASC').all() || [];

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

      let contacts = [];

      // Query Students Contacts
      if (type === 'all' || type === 'student') {
        let stuSql = `
          SELECT 
            s.id,
            (s.first_name || ' ' || s.last_name) as name,
            s.email,
            s.phone,
            COALESCE(s.phone, '') as whatsapp,
            'student' as contact_type,
            COALESCE(s.college, 'College Student') as affiliation,
            s.department as details
          FROM students s
          WHERE s.deleted_at IS NULL
        `;
        const stuParams = [];
        if (search) {
          stuSql += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.phone LIKE ? OR s.email LIKE ?)';
          const term = `%${search}%`;
          stuParams.push(term, term, term, term);
        }
        const stuRows = db.prepare(stuSql).all(...stuParams);
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
  }
};

module.exports = employeeController;
