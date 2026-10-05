const express = require('express');
const router = express.Router();
const {
  generateRecommendations,
  getSavedRecommendations
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateRecommendations);
router.get('/', getSavedRecommendations);

module.exports = router;
