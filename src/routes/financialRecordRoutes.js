const express = require('express');
const router = express.Router();
const financialRecordController = require('../controllers/financialRecordController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All financial record routes require authentication
// Viewers can only read, Analysts can read/filter, Admins have full access
// But users can only access their own records

router.post(
  '/',
  authenticate,
  authorize(['ANALYST', 'ADMIN']), // Only ANALYST and ADMIN can create
  financialRecordController.createRecord
);

router.get('/', authenticate, financialRecordController.getUserRecords);

router.get('/:id', authenticate, financialRecordController.getRecord);

router.put(
  '/:id',
  authenticate,
  authorize(['ANALYST', 'ADMIN']), // Only ANALYST and ADMIN can update
  financialRecordController.updateRecord
);

router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']), // Only ADMIN can delete
  financialRecordController.deleteRecord
);

module.exports = router;
