const prisma = require('../utils/database');
const AppError = require('../utils/appError');

class FinancialRecordService {
  async createRecord(userId, recordData) {
    const { type, category, amount, date, notes } = recordData;

    const record = await prisma.financialRecord.create({
      data: {
        userId,
        type,
        category,
        amount,
        date: new Date(date),
        notes: notes || ''
      }
    });

    await this.logAudit(userId, 'CREATE', 'FinancialRecord', record.id, {
      type,
      category,
      amount
    });

    return record;
  }

  async getRecordById(recordId, userId) {
    const record = await prisma.financialRecord.findUnique({
      where: { id: recordId }
    });

    if (!record) {
      throw new AppError('Record not found.', 404);
    }

    // Users can only view their own records unless admin
    if (record.userId !== userId) {
      throw new AppError('You do not have permission to view this record.', 403);
    }

    return record;
  }

  async getRecordsByUser(userId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = {
      userId,
      deletedAt: null,
      ...this.buildFilters(filters)
    };

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' }
      }),
      prisma.financialRecord.count({ where })
    ]);

    return {
      records,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateRecord(recordId, userId, updateData) {
    const record = await this.getRecordById(recordId, userId);

    const oldData = {
      type: record.type,
      category: record.category,
      amount: record.amount
    };

    const updated = await prisma.financialRecord.update({
      where: { id: recordId },
      data: updateData
    });

    await this.logAudit(userId, 'UPDATE', 'FinancialRecord', recordId, {
      before: oldData,
      after: updateData
    });

    return updated;
  }

  async deleteRecord(recordId, userId) {
    const record = await this.getRecordById(recordId, userId);

    await prisma.financialRecord.update({
      where: { id: recordId },
      data: { deletedAt: new Date() }
    });

    await this.logAudit(userId, 'DELETE', 'FinancialRecord', recordId, {
      amount: record.amount
    });
  }

  buildFilters(filters) {
    const where = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    if (filters.minAmount || filters.maxAmount) {
      where.amount = {};
      if (filters.minAmount) {
        where.amount.gte = parseFloat(filters.minAmount);
      }
      if (filters.maxAmount) {
        where.amount.lte = parseFloat(filters.maxAmount);
      }
    }

    return where;
  }

  async logAudit(userId, action, resource, resourceId, changes) {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes: JSON.stringify(changes)
      }
    });
  }
}

module.exports = new FinancialRecordService();
