const dashboardService = require('../services/dashboardService');

const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary(req.user.id);

    res.status(200).json({
      summary
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await dashboardService.getCategoryBreakdown(req.user.id);

    res.status(200).json({
      breakdown
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrend = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const trends = await dashboardService.getMonthlyTrend(req.user.id, months);

    res.status(200).json({
      trends
    });
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const limit = parseInt(req.query.limit) || 10;
    const activity = await dashboardService.getRecentActivity(req.user.id, days, limit);

    res.status(200).json({
      activity
    });
  } catch (error) {
    next(error);
  }
};

const getExpensesByCategory = async (req, res, next) => {
  try {
    const expenses = await dashboardService.getExpenseCategories(req.user.id);

    res.status(200).json({
      expenses
    });
  } catch (error) {
    next(error);
  }
};

const getIncomeByCategory = async (req, res, next) => {
  try {
    const income = await dashboardService.getIncomeCategories(req.user.id);

    res.status(200).json({
      income
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  getRecentActivity,
  getExpensesByCategory,
  getIncomeByCategory
};
