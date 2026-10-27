const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const apiRoutes = require('./routes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(cors({
  origin: config.corsOrigin === '*' ? true : config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (e.g. index.html, student-dashboard.html, faculty-dashboard.html)
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// API Routes
app.use('/api', apiRoutes);

// Fallback route for SPA / root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 404 Handler for undefined API routes
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

// Start Server
const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 M&M Mentor-Mentee Backend API Server is running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`📄 Frontend: http://localhost:${config.port}/`);
  console.log(`🩺 Health check: http://localhost:${config.port}/api/health`);
  console.log(`-------------------------------------------------------`);
  console.log(`Sample Student Credentials:`);
  console.log(`  Identifier: 1CR21CS042 or student@college.edu`);
  console.log(`  Password:   academicPass@2025`);
  console.log(`Sample Faculty Credentials:`);
  console.log(`  Identifier: dr.sharma@niet.edu`);
  console.log(`  Password:   academicPass@2025`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
