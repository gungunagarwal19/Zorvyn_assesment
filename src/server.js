require('dotenv').config();
const express = require('express');
const AppError = require('./utils/appError');
const { connectDB } = require('./utils/database');
const userRoutes = require('./routes/userRoutes');
const financialRecordRoutes = require('./routes/financialRecordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/records', financialRecordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Internal Server Error';

  if (error.statusCode === 404) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  if (error.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
