const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Please provide course name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Web Development', 'Programming', 'Data', 'AI', 'Cloud', 'Security', 'Database']
  },
  description: {
    type: String,
    required: [true, 'Please provide course description']
  },
  skills: {
    type: [String],
    required: [true, 'Please specify skills covered']
  },
  difficulty: {
    type: String,
    required: [true, 'Please specify difficulty'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: String,
    required: [true, 'Please specify course duration']
  },
  courseLink: {
    type: String,
    required: [true, 'Please provide valid course link']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);
