const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../utils/ApiResponse');
const { UserRepository } = require('../repositories');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, 'Not authorized. Please login.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserRepository.findById(decoded.id);

    if (!user || !user.isActive) {
      return ApiResponse.error(res, 'User not found or deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Invalid or expired token.', 401);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return ApiResponse.error(res, 'Access denied. Admin only.', 403);
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserRepository.findById(decoded.id);
    } catch {}
  }
  next();
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = { protect, adminOnly, optionalAuth, generateToken };
