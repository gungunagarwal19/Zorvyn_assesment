const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const extractToken = (authHeader) => {
  if (!authHeader) return null;
  // Support standard 'Bearer <token>' header, but also accept a raw token
  // sent in either `Authorization` or custom `token` header.
  if (typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return authHeader;
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};
