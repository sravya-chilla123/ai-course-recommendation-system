const express = require('express');
const router = express.Router();
const { getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getProgress);
router.put('/:courseId', updateProgress);

module.exports = router;
