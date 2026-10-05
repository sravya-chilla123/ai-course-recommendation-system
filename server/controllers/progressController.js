const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { getStoreState } = require('../config/db');

// @desc    Get progress for all courses for current student
// @route   GET /api/progress
// @access  Private (Student)
exports.getProgress = async (req, res) => {
  try {
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const userProgress = memoryStore.progress.filter(
        p => String(p.userId) === String(req.user._id)
      );

      const enriched = userProgress.map(p => {
        const course = memoryStore.courses.find(c => String(c._id) === String(p.courseId));
        return {
          ...p,
          course: course || { _id: p.courseId, courseName: 'Course' }
        };
      });

      // Calculate summary stats for Dashboard (FR9)
      const notStarted = enriched.filter(p => p.status === 'Not Started').length;
      const inProgress = enriched.filter(p => p.status === 'In Progress').length;
      const completed = enriched.filter(p => p.status === 'Completed').length;

      return res.status(200).json({
        success: true,
        message: 'Progress retrieved',
        data: {
          items: enriched,
          summary: {
            totalTracked: enriched.length,
            notStarted,
            inProgress,
            completed
          }
        }
      });
    }

    // MongoDB Mode
    const progressList = await Progress.find({ userId: req.user._id })
      .populate('courseId')
      .sort({ updatedAt: -1 });

    const formatted = progressList
      .filter(p => p.courseId)
      .map(p => ({
        _id: p._id,
        userId: p.userId,
        courseId: p.courseId._id,
        course: p.courseId,
        status: p.status,
        completionPercentage: p.completionPercentage,
        updatedAt: p.updatedAt
      }));

    const notStarted = formatted.filter(p => p.status === 'Not Started').length;
    const inProgress = formatted.filter(p => p.status === 'In Progress').length;
    const completed = formatted.filter(p => p.status === 'Completed').length;

    return res.status(200).json({
      success: true,
      message: 'Progress retrieved',
      data: {
        items: formatted,
        summary: {
          totalTracked: formatted.length,
          notStarted,
          inProgress,
          completed
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching progress',
      data: null
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/progress/:courseId
// @access  Private (Student)
exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    let { status, completionPercentage } = req.body;

    const validStatuses = ['Not Started', 'In Progress', 'Completed'];
    const validPercentages = [0, 25, 50, 75, 100];

    // Defaults and synchronizations
    if (completionPercentage !== undefined) {
      completionPercentage = Number(completionPercentage);
      if (!validPercentages.includes(completionPercentage)) {
        return res.status(400).json({
          success: false,
          message: 'completionPercentage must be one of: 0, 25, 50, 75, 100',
          data: null
        });
      }
      if (!status) {
        if (completionPercentage === 0) status = 'Not Started';
        else if (completionPercentage === 100) status = 'Completed';
        else status = 'In Progress';
      }
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be one of: Not Started, In Progress, Completed',
        data: null
      });
    }

    // If status is completed and completionPercentage not given, set to 100
    if (status === 'Completed' && completionPercentage === undefined) {
      completionPercentage = 100;
    } else if (status === 'Not Started' && completionPercentage === undefined) {
      completionPercentage = 0;
    }

    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      let record = memoryStore.progress.find(
        p => String(p.userId) === String(req.user._id) && String(p.courseId) === String(courseId)
      );

      if (record) {
        if (status) record.status = status;
        if (completionPercentage !== undefined) record.completionPercentage = completionPercentage;
        record.updatedAt = new Date();
      } else {
        record = {
          _id: `mem_prog_${Date.now()}`,
          userId: req.user._id,
          courseId,
          status: status || 'In Progress',
          completionPercentage: completionPercentage !== undefined ? completionPercentage : 25,
          updatedAt: new Date()
        };
        memoryStore.progress.push(record);
      }

      const course = memoryStore.courses.find(c => String(c._id) === String(courseId));

      return res.status(200).json({
        success: true,
        message: 'Progress updated successfully',
        data: {
          ...record,
          course: course || { _id: courseId }
        }
      });
    }

    // MongoDB Mode
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found', data: null });
    }

    const updateFields = { updatedAt: Date.now() };
    if (status) updateFields.status = status;
    if (completionPercentage !== undefined) updateFields.completionPercentage = completionPercentage;

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId },
      { $set: updateFields },
      { new: true, upsert: true, runValidators: true }
    ).populate('courseId');

    return res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        _id: progress._id,
        userId: progress.userId,
        courseId: progress.courseId._id,
        course: progress.courseId,
        status: progress.status,
        completionPercentage: progress.completionPercentage,
        updatedAt: progress.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating progress',
      data: null
    });
  }
};
