const express = require('express');
const router = express.Router();
const {
  saveCourse,
  getSavedCourses,
  removeSavedCourse
} = require('../controllers/savedCourseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', saveCourse);
router.get('/', getSavedCourses);
router.delete('/:courseId', removeSavedCourse);

module.exports = router;
