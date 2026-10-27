const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All faculty routes require authentication and Faculty role
router.use(authenticate, authorizeRoles('Faculty'));

router.get('/profile', facultyController.getProfile);
router.get('/stats', facultyController.getStats);
router.get('/mentees', facultyController.getMentees);
router.get('/mentees/:studentId', facultyController.getMenteeDetails);
router.post('/meetings/log', facultyController.logMeeting);

module.exports = router;
