const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getStoreState } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pathpilot_super_secure_jwt_secret_key_2026_production';

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
      data: null
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const user = memoryStore.users.find(u => String(u._id) === String(decoded.id));
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists in memory session.',
          data: null
        });
      }
      req.user = user;
    } else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.',
          data: null
        });
      }
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      data: null
    });
  }
};

// Grant access to specific roles (e.g. 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthorized'}' is not authorized to access this route`,
        data: null
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
  JWT_SECRET
};
