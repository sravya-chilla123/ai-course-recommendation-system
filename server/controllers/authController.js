const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getStoreState } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Calculate profile completion utility
const calculateCompletion = (user) => {
  const checks = [
    Boolean(user.name && user.name.trim()),
    Boolean(user.email && user.email.trim()),
    Boolean(user.careerGoal && user.careerGoal.trim()),
    Boolean(user.experienceLevel && user.experienceLevel.trim()),
    Boolean(user.skills && user.skills.length > 0),
    Boolean(user.interests && user.interests.length > 0),
    Boolean(user.preferredTechnologies && user.preferredTechnologies.length > 0)
  ];
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
};

// Seed demo users in memory store if empty
const ensureDemoUsersInMemory = async () => {
  const { isUsingMemory, memoryStore } = getStoreState();
  if (isUsingMemory && memoryStore.users.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const studentPass = await bcrypt.hash('student123', salt);
    const adminPass = await bcrypt.hash('admin123', salt);

    memoryStore.users.push({
      _id: 'mem_user_student',
      name: 'Alex Johnson',
      email: 'student@pathpilot.com',
      password: studentPass,
      role: 'student',
      careerGoal: 'Full Stack Web Developer',
      experienceLevel: 'Beginner',
      skills: ['HTML5', 'CSS3', 'Basic JavaScript'],
      interests: ['Web Development', 'Cloud Computing'],
      preferredTechnologies: ['React', 'Node.js', 'Tailwind CSS'],
      createdAt: new Date()
    });

    memoryStore.users.push({
      _id: 'mem_user_admin',
      name: 'Dr. Sarah Connor (Admin)',
      email: 'admin@pathpilot.com',
      password: adminPass,
      role: 'admin',
      careerGoal: 'Curriculum Director',
      experienceLevel: 'Advanced',
      skills: ['Curriculum Design', 'Database Administration'],
      interests: ['AI', 'Data', 'Security'],
      preferredTechnologies: ['MongoDB', 'Docker'],
      createdAt: new Date()
    });
  }
};

// @desc    Register a new student/user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.',
        data: null
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
        data: null
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
        data: null
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      await ensureDemoUsersInMemory();
      const existing = memoryStore.users.find(u => u.email === normalizedEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
          data: null
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: `mem_user_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'student',
        skills: [],
        interests: [],
        careerGoal: '',
        experienceLevel: 'Beginner',
        preferredTechnologies: [],
        createdAt: new Date()
      };

      memoryStore.users.push(newUser);
      const token = generateToken(newUser._id);

      const safeUser = { ...newUser, profileCompletion: 28 };
      delete safeUser.password;

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: { user: safeUser, token }
      });
    }

    // MongoDB Mode
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
        data: null
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'student'
    });

    const token = generateToken(user._id);
    const profileCompletion = user.calculateProfileCompletion();

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          interests: user.interests,
          careerGoal: user.careerGoal,
          experienceLevel: user.experienceLevel,
          preferredTechnologies: user.preferredTechnologies,
          profileCompletion
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error occurred while registering user.',
      data: null
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
        data: null
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      await ensureDemoUsersInMemory();
      const user = memoryStore.users.find(u => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
          data: null
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
          data: null
        });
      }

      const token = generateToken(user._id);
      const safeUser = { ...user, profileCompletion: calculateCompletion(user) };
      delete safeUser.password;

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: { user: safeUser, token }
      });
    }

    // MongoDB Mode
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
        data: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
        data: null
      });
    }

    const token = generateToken(user._id);
    const profileCompletion = user.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          interests: user.interests,
          careerGoal: user.careerGoal,
          experienceLevel: user.experienceLevel,
          preferredTechnologies: user.preferredTechnologies,
          profileCompletion
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error occurred while logging in.',
      data: null
    });
  }
};
