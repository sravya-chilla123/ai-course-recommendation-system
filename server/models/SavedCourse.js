const mongoose = require('mongoose');

const SavedCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a student cannot save the same course twice
SavedCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('SavedCourse', SavedCourseSchema);
