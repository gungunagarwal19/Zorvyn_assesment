const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authenticate');

// All dashboard routes require authentication
// Anyone can view their own dashboard

router.get('/summary', authenticate, dashboardController.getSummary);

router.get('/category-breakdown', authenticate, dashboardController.getCategoryBreakdown);

router.get('/monthly-trend', authenticate, dashboardController.getMonthlyTrend);

router.get('/recent-activity', authenticate, dashboardController.getRecentActivity);

router.get('/expenses-by-category', authenticate, dashboardController.getExpensesByCategory);

router.get('/income-by-category', authenticate, dashboardController.getIncomeByCategory);

module.exports = router;
