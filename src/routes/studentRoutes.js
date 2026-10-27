const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All student routes require authentication and Student role
router.use(authenticate, authorizeRoles('Student'));

router.get('/profile', studentController.getProfile);
router.get('/meetings', studentController.getMeetings);
router.post('/meetings/request', studentController.requestMeeting);
router.get('/milestones', studentController.getMilestones);
router.post('/milestones', studentController.createMilestone);
router.patch('/milestones/:id', studentController.updateMilestone);

module.exports = router;
