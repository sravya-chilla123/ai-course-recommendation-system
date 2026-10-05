const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const User = require('../models/User');
const { getStoreState } = require('../config/db');

// Optional auth middleware for getCourseById to detect logged-in student's save/progress state
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const { isUsingMemory, memoryStore } = getStoreState();
      if (isUsingMemory) {
        req.user = memoryStore.users.find(u => String(u._id) === String(decoded.id));
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (e) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

router.get('/', getCourses);
router.get('/:id', optionalAuth, getCourseById);

// Admin-only endpoints
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;
