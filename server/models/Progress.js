const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  completionPercentage: {
    type: Number,
    enum: [0, 25, 50, 75, 100],
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
