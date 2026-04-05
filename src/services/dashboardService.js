const prisma = require('../utils/database');
const AppError = require('../utils/appError');

class DashboardService {
  async getSummary(userId) {
    const records = await prisma.financialRecord.findMany({
      where: {
        userId,
        deletedAt: null
      }
    });

    const income = records
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);

    const expenses = records
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);

    const netBalance = income - expenses;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: netBalance,
      recordCount: records.length
    };
  }

  async getCategoryBreakdown(userId) {
    const records = await prisma.financialRecord.findMany({
      where: {
        userId,
        deletedAt: null
      }
    });

    const breakdown = {};

    records.forEach(record => {
      if (!breakdown[record.category]) {
        breakdown[record.category] = {
          income: 0,
          expense: 0,
          total: 0
        };
      }

      if (record.type === 'INCOME') {
        breakdown[record.category].income += record.amount;
      } else {
        breakdown[record.category].expense += record.amount;
      }

      breakdown[record.category].total = 
        breakdown[record.category].income - breakdown[record.category].expense;
    });

    return breakdown;
  }

  async getMonthlyTrend(userId, months = 12) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const records = await prisma.financialRecord.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startDate
        }
      }
    });

    const trends = {};

    records.forEach(record => {
      const monthKey = record.date.toISOString().slice(0, 7); // YYYY-MM

      if (!trends[monthKey]) {
        trends[monthKey] = {
          income: 0,
          expense: 0
        };
      }

      if (record.type === 'INCOME') {
        trends[monthKey].income += record.amount;
      } else {
        trends[monthKey].expense += record.amount;
      }
    });

    return trends;
  }

  async getRecentActivity(userId, days = 30, limit = 10) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await prisma.financialRecord.findMany({
      where: {
        userId,
        deletedAt: null,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return records;
  }

  async getExpenseCategories(userId) {
    const records = await prisma.financialRecord.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        deletedAt: null
      }
    });

    const categories = {};

    records.forEach(record => {
      if (!categories[record.category]) {
        categories[record.category] = 0;
      }
      categories[record.category] += record.amount;
    });

    return categories;
  }

  async getIncomeCategories(userId) {
    const records = await prisma.financialRecord.findMany({
      where: {
        userId,
        type: 'INCOME',
        deletedAt: null
      }
    });

    const categories = {};

    records.forEach(record => {
      if (!categories[record.category]) {
        categories[record.category] = 0;
      }
      categories[record.category] += record.amount;
    });

    return categories;
  }
}

module.exports = new DashboardService();
