const AppError = require('../utils/appError');

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to access this resource.', 403));
    }

    next();
  };
};

module.exports = authorize;
