const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/:id', meetingController.getMeetingById);
router.patch('/:id', meetingController.updateMeeting);

module.exports = router;
