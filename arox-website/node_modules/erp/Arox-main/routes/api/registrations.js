const express = require('express');
const router = express.Router();
const registrationController = require('../../controllers/registrationController');
const upload = require('../../middleware/upload');
const { authenticate } = require('../../middleware/auth');
const roleGuard = require('../../middleware/roleGuard');

// POST /api/registrations - Create new registration
router.post('/', upload.single('photo'), registrationController.create);

// POST /api/registrations/apply - Public application form
router.post('/apply', upload.single('photo'), registrationController.apply);

// PUT /api/registrations/:id - Admin or Employee updates internship / registration details
router.put('/:id', authenticate, roleGuard('admin', 'super_admin', 'employee', 'trainer', 'staff'), registrationController.update);

// GET /api/registrations/:regId/offer-letter - Download offer letter
router.get('/:regId/offer-letter', registrationController.getOfferLetter);

// GET /api/registrations/:regId/application-pdf - Download application PDF
router.get('/:regId/application-pdf', registrationController.downloadApplicationPdf);

// Download constraints check and log
router.post('/check-download', registrationController.checkDownload);
router.post('/log-download', registrationController.logDownload);

module.exports = router;
