const { getDB } = require('../utils/database');
const AppError = require('../utils/appError');
const { ObjectId } = require('mongodb');

class FinancialRecordService {
  async createRecord(userId, recordData) {
    const { type, category, amount, date, notes } = recordData;
    const db = getDB();
    const recordsCollection = db.collection('FinancialRecord');

    const result = await recordsCollection.insertOne({
      userId: new ObjectId(userId),
      type,
      category,
      amount,
      date: new Date(date),
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    });

    const record = await recordsCollection.findOne({ _id: result.insertedId });

    await this.logAudit(userId, 'CREATE', 'FinancialRecord', record._id.toString(), {
      type,
      category,
      amount
    });

    return record;
  }

  async getRecordById(recordId, userId) {
    const db = getDB();
    const recordsCollection = db.collection('FinancialRecord');
    const record = await recordsCollection.findOne({ _id: new ObjectId(recordId), deletedAt: null });

    if (!record) {
      throw new AppError('Record not found.', 404);
    }

    if (record.userId.toString() !== userId && (!record.userId || record.userId.toString() !== userId)) {
      throw new AppError('You do not have permission to view this record.', 403);
    }

    return record;
  }

  async getRecordsByUser(userId, filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = {
      userId: new ObjectId(userId),
      deletedAt: null,
      ...this.buildFilters(filters)
    };
    const db = getDB();
    const recordsCollection = db.collection('FinancialRecord');

    const [records, total] = await Promise.all([
      recordsCollection.find(where).sort({ date: -1 }).skip(skip).limit(limit).toArray(),
      recordsCollection.countDocuments(where)
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
    const db = getDB();
    const recordsCollection = db.collection('FinancialRecord');

    const record = await this.getRecordById(recordId, userId);

    const oldData = {
      type: record.type,
      category: record.category,
      amount: record.amount
    };

    await recordsCollection.updateOne({ _id: new ObjectId(recordId) }, { $set: { ...updateData, updatedAt: new Date() } });

    const updated = await recordsCollection.findOne({ _id: new ObjectId(recordId) });

    await this.logAudit(userId, 'UPDATE', 'FinancialRecord', recordId, {
      before: oldData,
      after: updateData
    });

    return updated;
  }

  async deleteRecord(recordId, userId) {
    const db = getDB();
    const recordsCollection = db.collection('FinancialRecord');

    const record = await this.getRecordById(recordId, userId);

    await recordsCollection.updateOne({ _id: new ObjectId(recordId) }, { $set: { deletedAt: new Date(), updatedAt: new Date() } });

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
    const db = getDB();
    const auditCollection = db.collection('AuditLog');
    await auditCollection.insertOne({
      userId: new ObjectId(userId),
      action,
      resource,
      resourceId,
      changes: JSON.stringify(changes),
      createdAt: new Date()
    });
  }
}

module.exports = new FinancialRecordService();
