const financialRecordService = require('../services/financialRecordService');
const { financialRecordSchema, updateFinancialRecordSchema } = require('../utils/validation');
const AppError = require('../utils/appError');

const createRecord = async (req, res, next) => {
  try {
    const { error, value } = financialRecordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const record = await financialRecordService.createRecord(req.user.id, value);

    res.status(201).json({
      message: 'Financial record created successfully.',
      record
    });
  } catch (error) {
    next(error);
  }
};

const getRecord = async (req, res, next) => {
  try {
    const recordId = req.params.id;  // String ID for MongoDB
    const record = await financialRecordService.getRecordById(recordId, req.user.id);

    res.status(200).json({ record });
  } catch (error) {
    next(error);
  }
};

const getUserRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      type: req.query.type,
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      minAmount: req.query.minAmount,
      maxAmount: req.query.maxAmount
    };

    const result = await financialRecordService.getRecordsByUser(
      req.user.id,
      filters,
      page,
      limit
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const { error, value } = updateFinancialRecordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const recordId = req.params.id;  // String ID for MongoDB
    const updated = await financialRecordService.updateRecord(recordId, req.user.id, value);

    res.status(200).json({
      message: 'Financial record updated successfully.',
      record: updated
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const recordId = req.params.id;  // String ID for MongoDB
    await financialRecordService.deleteRecord(recordId, req.user.id);

    res.status(200).json({
      message: 'Financial record deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecord,
  getUserRecords,
  updateRecord,
  deleteRecord
};
