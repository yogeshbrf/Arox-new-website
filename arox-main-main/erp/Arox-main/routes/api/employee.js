const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const employeeController = require('../../controllers/employeeController');

router.use(authenticate);
router.use(roleGuard('employee', 'trainer', 'staff', 'admin', 'super_admin'));

// Clients
router.post('/clients', employeeController.createClient);
router.put('/clients/:id', employeeController.updateClient);
router.delete('/clients/:id', employeeController.deleteClient);

// Leads
router.post('/leads', employeeController.createLead);
router.put('/leads/:id/stage', employeeController.updateLeadStage);
router.put('/leads/:id', employeeController.updateLead);
router.delete('/leads/:id', employeeController.deleteLead);

// Follow-ups
router.post('/follow-ups', employeeController.createFollowUp);
router.put('/follow-ups/:id/complete', employeeController.completeFollowUp);
router.delete('/follow-ups/:id', employeeController.deleteFollowUp);

// Tasks
router.post('/tasks', employeeController.createTask);
router.put('/tasks/:id/status', employeeController.updateTaskStatus);
router.put('/tasks/:id', employeeController.updateTask);
router.delete('/tasks/:id', employeeController.deleteTask);

module.exports = router;
