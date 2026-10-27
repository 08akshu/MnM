const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const facultyRoutes = require('./facultyRoutes');
const meetingRoutes = require('./meetingRoutes');
const db = require('../data/db');

// Health & Info Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Mentor-Mentee Academic Hub API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// System notices/announcements (public)
router.get('/announcements', (req, res) => {
  res.status(200).json({
    success: true,
    data: db.getAnnouncements()
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/faculty', facultyRoutes);
router.use('/meetings', meetingRoutes);

module.exports = router;
