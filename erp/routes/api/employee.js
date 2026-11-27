const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');
const employeeController = require('../../controllers/employeeController');
const upload = require('../../middleware/upload');

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
router.post('/tasks', upload.uploadTaskDocOptional, employeeController.createTask);
router.put('/tasks/:id/status', employeeController.updateTaskStatus);
router.get('/tasks/:id/attachment/preview', employeeController.previewTaskAttachment);
router.get('/tasks/:id/attachment', employeeController.downloadTaskAttachment);
router.put('/tasks/:id', upload.uploadTaskDocOptional, employeeController.updateTask);
router.delete('/tasks/:id', employeeController.deleteTask);

// Work Deliverable Proofs (.pdf, .pptx, .xlsx, .docx up to 10MB)
router.get('/proofs', employeeController.listProofs);
router.post('/proofs', upload.uploadProof.single('proof'), employeeController.uploadProof);
router.delete('/proofs/:id', employeeController.deleteProof);

module.exports = router;
