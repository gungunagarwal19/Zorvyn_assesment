const userService = require('../services/userService');
const { userRegistrationSchema, userLoginSchema, updateUserRoleSchema, updateUserStatusSchema } = require('../utils/validation');

const register = async (req, res, next) => {
  try {
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const role = req.body.role || 'VIEWER';
    const user = await userService.createUser(value, role);

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await userService.authenticateUser(value.email, value.password);

    res.status(200).json({
      message: 'Login successful.',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user._id);

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await userService.getAllUsers(page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { error, value } = updateUserRoleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.params.id;
    const updatedUser = await userService.updateUserRole(userId, value.role);

    res.status(200).json({
      message: 'User role updated successfully.',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { error, value } = updateUserStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.params.id;
    const updatedUser = await userService.updateUserStatus(userId, value.status);

    res.status(200).json({
      message: 'User status updated successfully.',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        status: updatedUser.status
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  updateUserRole,
  updateUserStatus
};
