const SavedCourse = require('../models/SavedCourse');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { getStoreState } = require('../config/db');

// @desc    Save a course
// @route   POST /api/saved-courses
// @access  Private (Student)
exports.saveCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required', data: null });
    }

    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      // Check if course exists
      const course = memoryStore.courses.find(c => String(c._id) === String(courseId));
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found', data: null });
      }

      // Check duplicate
      const alreadySaved = memoryStore.savedCourses.some(
        sc => String(sc.userId) === String(req.user._id) && String(sc.courseId) === String(courseId)
      );

      if (alreadySaved) {
        return res.status(400).json({
          success: false,
          message: 'You have already saved this course.',
          data: null
        });
      }

      const newSaved = {
        _id: `mem_sc_${Date.now()}`,
        userId: req.user._id,
        courseId,
        createdAt: new Date()
      };
      memoryStore.savedCourses.push(newSaved);

      return res.status(201).json({
        success: true,
        message: 'Course saved successfully',
        data: { ...newSaved, course }
      });
    }

    // MongoDB Mode
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found', data: null });
    }

    const existing = await SavedCourse.findOne({ userId: req.user._id, courseId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already saved this course.',
        data: null
      });
    }

    const saved = await SavedCourse.create({ userId: req.user._id, courseId });
    const populated = await saved.populate('courseId');

    return res.status(201).json({
      success: true,
      message: 'Course saved successfully',
      data: populated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error saving course',
      data: null
    });
  }
};

// @desc    List saved courses
// @route   GET /api/saved-courses
// @access  Private (Student)
exports.getSavedCourses = async (req, res) => {
  try {
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const userSaved = memoryStore.savedCourses.filter(
        sc => String(sc.userId) === String(req.user._id)
      );

      const data = userSaved.map(sc => {
        const course = memoryStore.courses.find(c => String(c._id) === String(sc.courseId));
        const progress = memoryStore.progress.find(
          p => String(p.userId) === String(req.user._id) && String(p.courseId) === String(sc.courseId)
        ) || { status: 'Not Started', completionPercentage: 0 };

        return {
          _id: sc._id,
          userId: sc.userId,
          courseId: course || { _id: sc.courseId, courseName: 'Unknown Course' },
          progress,
          createdAt: sc.createdAt
        };
      }).filter(item => item.courseId);

      return res.status(200).json({
        success: true,
        count: data.length,
        message: 'Saved courses retrieved',
        data
      });
    }

    // MongoDB Mode
    const saved = await SavedCourse.find({ userId: req.user._id })
      .populate('courseId')
      .sort({ createdAt: -1 });

    const validSaved = saved.filter(item => item.courseId);

    // Attach progress info
    const progressList = await Progress.find({ userId: req.user._id });
    const progressMap = {};
    progressList.forEach(p => {
      progressMap[String(p.courseId)] = p;
    });

    const enriched = validSaved.map(item => ({
      _id: item._id,
      userId: item.userId,
      courseId: item.courseId,
      progress: progressMap[String(item.courseId._id)] || { status: 'Not Started', completionPercentage: 0 },
      createdAt: item.createdAt
    }));

    return res.status(200).json({
      success: true,
      count: enriched.length,
      message: 'Saved courses retrieved',
      data: enriched
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching saved courses',
      data: null
    });
  }
};

// @desc    Remove saved course
// @route   DELETE /api/saved-courses/:courseId
// @access  Private (Student)
exports.removeSavedCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const initial = memoryStore.savedCourses.length;
      memoryStore.savedCourses = memoryStore.savedCourses.filter(
        sc => !(String(sc.userId) === String(req.user._id) && (String(sc.courseId) === String(courseId) || String(sc._id) === String(courseId)))
      );

      if (memoryStore.savedCourses.length === initial) {
        return res.status(404).json({ success: false, message: 'Saved course record not found', data: null });
      }

      return res.status(200).json({
        success: true,
        message: 'Course removed from saved list',
        data: null
      });
    }

    // MongoDB Mode
    const result = await SavedCourse.findOneAndDelete({
      userId: req.user._id,
      $or: [{ courseId }, { _id: courseId.length === 24 ? courseId : null }]
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Saved course record not found', data: null });
    }

    return res.status(200).json({
      success: true,
      message: 'Course removed from saved list',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error removing saved course',
      data: null
    });
  }
};
