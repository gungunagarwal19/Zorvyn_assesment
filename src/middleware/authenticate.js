const { extractToken, verifyToken } = require('../utils/jwt');
const AppError = require('../utils/appError');
const { getDB } = require('../utils/database');
const { ObjectId } = require('mongodb');

const authenticate = async (req, res, next) => {
  try {
    
    const authHeader =req.headers.token;
    
    const token = extractToken(authHeader);

    if (!token) {
      return next(new AppError('No token provided. Please log in.', 401));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new AppError('Invalid or expired token.', 401));
    }

    const db = getDB();
    const usersCollection = db.collection('User');
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return next(new AppError('User not found.', 401));
    }

    if (user.status === 'INACTIVE') {
      return next(new AppError('User account is inactive.', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Authentication failed.', 401));
  }
};

module.exports = authenticate;
