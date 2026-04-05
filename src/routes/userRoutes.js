const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', authenticate, userController.getCurrentUser);

// Admin only routes
router.get('/all', authenticate, authorize(['ADMIN']), userController.getAllUsers);
router.put('/:id/role', authenticate, authorize(['ADMIN']), userController.updateUserRole);
router.put('/:id/status', authenticate, authorize(['ADMIN']), userController.updateUserStatus);

module.exports = router;
