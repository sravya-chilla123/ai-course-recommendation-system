const Course = require('../models/Course');
const SavedCourse = require('../models/SavedCourse');
const Progress = require('../models/Progress');
const { getStoreState } = require('../config/db');

// @desc    List/search/filter courses
// @route   GET /api/courses
// @access  Public (or Authenticated)
exports.getCourses = async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      let filtered = [...memoryStore.courses];

      if (category && category !== 'All') {
        filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
      }

      if (difficulty && difficulty !== 'All') {
        filtered = filtered.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
      }

      if (search && search.trim() !== '') {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(c =>
          c.courseName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.skills.some(s => s.toLowerCase().includes(q))
        );
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        message: 'Courses fetched successfully',
        data: filtered
      });
    }

    // MongoDB Mode
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { courseName: regex },
        { description: regex },
        { skills: { $in: [regex] } }
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      message: 'Courses fetched successfully',
      data: courses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching courses',
      data: null
    });
  }
};

// @desc    Get single course details
// @route   GET /api/courses/:id
// @access  Public / Authenticated
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isUsingMemory, memoryStore } = getStoreState();
    let course = null;

    if (isUsingMemory) {
      course = memoryStore.courses.find(c => String(c._id) === String(id));
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found', data: null });
      }

      // Check if saved or progress for logged-in user if token was attached
      let isSaved = false;
      let progressInfo = null;

      if (req.user) {
        isSaved = memoryStore.savedCourses.some(
          sc => String(sc.userId) === String(req.user._id) && String(sc.courseId) === String(id)
        );
        const p = memoryStore.progress.find(
          pr => String(pr.userId) === String(req.user._id) && String(pr.courseId) === String(id)
        );
        if (p) progressInfo = p;
      }

      return res.status(200).json({
        success: true,
        message: 'Course details fetched',
        data: {
          ...course,
          isSaved,
          progress: progressInfo
        }
      });
    }

    // MongoDB Mode
    course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found', data: null });
    }

    let isSaved = false;
    let progressInfo = null;

    if (req.user) {
      const savedDoc = await SavedCourse.findOne({ userId: req.user._id, courseId: id });
      if (savedDoc) isSaved = true;

      const progressDoc = await Progress.findOne({ userId: req.user._id, courseId: id });
      if (progressDoc) progressInfo = progressDoc;
    }

    return res.status(200).json({
      success: true,
      message: 'Course details fetched',
      data: {
        ...course.toObject(),
        isSaved,
        progress: progressInfo
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course details',
      data: null
    });
  }
};

// @desc    Add course (Admin only)
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res) => {
  try {
    const { courseName, category, description, skills, difficulty, duration, courseLink } = req.body;

    if (!courseName || !category || !description || !skills || !difficulty || !duration || !courseLink) {
      return res.status(400).json({
        success: false,
        message: 'All course fields (courseName, category, description, skills, difficulty, duration, courseLink) are required.',
        data: null
      });
    }

    const cleanSkills = Array.isArray(skills)
      ? skills.map(s => String(s).trim()).filter(Boolean)
      : String(skills).split(',').map(s => s.trim()).filter(Boolean);

    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const newCourse = {
        _id: `mem_course_${Date.now()}`,
        courseName: courseName.trim(),
        category,
        description: description.trim(),
        skills: cleanSkills,
        difficulty,
        duration: duration.trim(),
        courseLink: courseLink.trim(),
        createdAt: new Date()
      };
      memoryStore.courses.unshift(newCourse);
      return res.status(201).json({
        success: true,
        message: 'Course added successfully',
        data: newCourse
      });
    }

    // MongoDB Mode
    const course = await Course.create({
      courseName: courseName.trim(),
      category,
      description: description.trim(),
      skills: cleanSkills,
      difficulty,
      duration: duration.trim(),
      courseLink: courseLink.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Course added successfully',
      data: course
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating course',
      data: null
    });
  }
};

// @desc    Edit course (Admin only)
// @route   PUT /api/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, category, description, skills, difficulty, duration, courseLink } = req.body;
    const { isUsingMemory, memoryStore } = getStoreState();

    const cleanSkills = skills !== undefined
      ? (Array.isArray(skills) ? skills.map(s => String(s).trim()).filter(Boolean) : String(skills).split(',').map(s => s.trim()).filter(Boolean))
      : undefined;

    if (isUsingMemory) {
      const courseIndex = memoryStore.courses.findIndex(c => String(c._id) === String(id));
      if (courseIndex === -1) {
        return res.status(404).json({ success: false, message: 'Course not found', data: null });
      }

      if (courseName) memoryStore.courses[courseIndex].courseName = courseName.trim();
      if (category) memoryStore.courses[courseIndex].category = category;
      if (description) memoryStore.courses[courseIndex].description = description.trim();
      if (cleanSkills) memoryStore.courses[courseIndex].skills = cleanSkills;
      if (difficulty) memoryStore.courses[courseIndex].difficulty = difficulty;
      if (duration) memoryStore.courses[courseIndex].duration = duration.trim();
      if (courseLink) memoryStore.courses[courseIndex].courseLink = courseLink.trim();

      return res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: memoryStore.courses[courseIndex]
      });
    }

    // MongoDB Mode
    let course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found', data: null });
    }

    if (courseName) course.courseName = courseName.trim();
    if (category) course.category = category;
    if (description) course.description = description.trim();
    if (cleanSkills) course.skills = cleanSkills;
    if (difficulty) course.difficulty = difficulty;
    if (duration) course.duration = duration.trim();
    if (courseLink) course.courseLink = courseLink.trim();

    await course.save();

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating course',
      data: null
    });
  }
};

// @desc    Delete course (Admin only)
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const initialLen = memoryStore.courses.length;
      memoryStore.courses = memoryStore.courses.filter(c => String(c._id) !== String(id));
      if (memoryStore.courses.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Course not found', data: null });
      }
      // Also clean up savedCourses and progress references
      memoryStore.savedCourses = memoryStore.savedCourses.filter(sc => String(sc.courseId) !== String(id));
      memoryStore.progress = memoryStore.progress.filter(p => String(p.courseId) !== String(id));
      memoryStore.recommendations = memoryStore.recommendations.filter(r => String(r.courseId) !== String(id));

      return res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
        data: null
      });
    }

    // MongoDB Mode
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found', data: null });
    }

    await course.deleteOne();
    await SavedCourse.deleteMany({ courseId: id });
    await Progress.deleteMany({ courseId: id });
    await Recommendation.deleteMany({ courseId: id });

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting course',
      data: null
    });
  }
};
