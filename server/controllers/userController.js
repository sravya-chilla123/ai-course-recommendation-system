const User = require('../models/User');
const { getStoreState } = require('../config/db');

// Calculate profile completion percentage utility
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

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const user = memoryStore.users.find(u => String(u._id) === String(req.user._id));
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found', data: null });
      }
      const safe = { ...user, profileCompletion: calculateCompletion(user) };
      delete safe.password;
      return res.status(200).json({ success: true, message: 'Profile retrieved', data: safe });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const profileCompletion = user.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved',
      data: {
        ...user.toObject(),
        profileCompletion
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile',
      data: null
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, skills, interests, careerGoal, experienceLevel, preferredTechnologies } = req.body;
    const { isUsingMemory, memoryStore } = getStoreState();

    const cleanArray = (val) => {
      if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    if (isUsingMemory) {
      const userIndex = memoryStore.users.findIndex(u => String(u._id) === String(req.user._id));
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found', data: null });
      }

      if (name !== undefined) memoryStore.users[userIndex].name = name.trim();
      if (careerGoal !== undefined) memoryStore.users[userIndex].careerGoal = careerGoal.trim();
      if (experienceLevel !== undefined) memoryStore.users[userIndex].experienceLevel = experienceLevel;
      if (skills !== undefined) memoryStore.users[userIndex].skills = cleanArray(skills);
      if (interests !== undefined) memoryStore.users[userIndex].interests = cleanArray(interests);
      if (preferredTechnologies !== undefined) memoryStore.users[userIndex].preferredTechnologies = cleanArray(preferredTechnologies);

      const updated = memoryStore.users[userIndex];
      const safe = { ...updated, profileCompletion: calculateCompletion(updated) };
      delete safe.password;

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: safe
      });
    }

    // MongoDB Mode
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    if (name !== undefined) user.name = name.trim();
    if (careerGoal !== undefined) user.careerGoal = careerGoal.trim();
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
    if (skills !== undefined) user.skills = cleanArray(skills);
    if (interests !== undefined) user.interests = cleanArray(interests);
    if (preferredTechnologies !== undefined) user.preferredTechnologies = cleanArray(preferredTechnologies);

    await user.save();
    const profileCompletion = user.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...user.toObject(),
        profileCompletion
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
      data: null
    });
  }
};
