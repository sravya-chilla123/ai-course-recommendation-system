const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);

module.exports = router;
