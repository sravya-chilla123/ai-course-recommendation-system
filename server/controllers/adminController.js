const Course = require('../models/Course');
const User = require('../models/User');
const { getStoreState } = require('../config/db');

// @desc    Get system statistics for Admin Dashboard (FR10)
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const totalCourses = memoryStore.courses.length;
      const totalStudents = memoryStore.users.filter(u => u.role === 'student').length;

      // Group courses by category
      const categoryCounts = {};
      memoryStore.courses.forEach(c => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      });

      const categoriesBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count
      }));

      return res.status(200).json({
        success: true,
        message: 'Admin statistics retrieved',
        data: {
          totalCourses,
          totalStudents,
          totalCategories: categoriesBreakdown.length,
          categoriesBreakdown
        }
      });
    }

    // MongoDB Mode
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });

    const categoriesAggregation = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved',
      data: {
        totalCourses,
        totalStudents,
        totalCategories: categoriesAggregation.length,
        categoriesBreakdown: categoriesAggregation
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin stats',
      data: null
    });
  }
};
