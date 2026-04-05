const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  role: Joi.string().valid('VIEWER', 'ANALYST', 'ADMIN').optional()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const financialRecordSchema = Joi.object({
  type: Joi.string().valid('INCOME', 'EXPENSE').required(),
  category: Joi.string().valid(
    'SALARY', 'BONUS', 'FREELANCE', 'INVESTMENT',
    'GROCERY', 'UTILITIES', 'ENTERTAINMENT', 'TRAVEL', 'HEALTHCARE', 'OTHER'
  ).required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().iso().required(),
  notes: Joi.string().allow('').optional()
});

const updateFinancialRecordSchema = Joi.object({
  type: Joi.string().valid('INCOME', 'EXPENSE').optional(),
  category: Joi.string().valid(
    'SALARY', 'BONUS', 'FREELANCE', 'INVESTMENT',
    'GROCERY', 'UTILITIES', 'ENTERTAINMENT', 'TRAVEL', 'HEALTHCARE', 'OTHER'
  ).optional(),
  amount: Joi.number().positive().optional(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().allow('').optional()
});

const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('VIEWER', 'ANALYST', 'ADMIN').required()
});

const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required()
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  financialRecordSchema,
  updateFinancialRecordSchema,
  updateUserRoleSchema,
  updateUserStatusSchema
};
