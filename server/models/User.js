const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  skills: {
    type: [String],
    default: []
  },
  interests: {
    type: [String],
    default: []
  },
  careerGoal: {
    type: String,
    default: '',
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', ''],
    default: 'Beginner'
  },
  preferredTechnologies: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Helper function to calculate profile completion % (as per FR2)
UserSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  const checks = [
    Boolean(this.name && this.name.trim()),
    Boolean(this.email && this.email.trim()),
    Boolean(this.careerGoal && this.careerGoal.trim()),
    Boolean(this.experienceLevel && this.experienceLevel.trim()),
    Boolean(this.skills && this.skills.length > 0),
    Boolean(this.interests && this.interests.length > 0),
    Boolean(this.preferredTechnologies && this.preferredTechnologies.length > 0)
  ];
  const passed = checks.filter(Boolean).length;
  score = Math.round((passed / checks.length) * 100);
  return score;
};

module.exports = mongoose.model('User', UserSchema);
