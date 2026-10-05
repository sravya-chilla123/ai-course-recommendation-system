const Course = require('../models/Course');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const { getStoreState } = require('../config/db');

// Rule-Based AI Engine implementing SRS FR5 logic
const runRuleBasedAI = (studentProfile, catalogCourses) => {
  const {
    careerGoal = '',
    skills = [],
    interests = [],
    experienceLevel = 'Beginner',
    preferredTechnologies = []
  } = studentProfile;

  const normalizedSkills = skills.map(s => s.toLowerCase().trim());
  const normalizedInterests = interests.map(i => i.toLowerCase().trim());
  const normalizedTech = preferredTechnologies.map(t => t.toLowerCase().trim());
  const goalLower = careerGoal.toLowerCase().trim();

  // Score each course based on SRS Section 3 FR5 priorities
  const scored = catalogCourses.map(course => {
    let score = 0;
    const reasons = [];
    const courseSkillsLower = (course.skills || []).map(s => s.toLowerCase());
    const courseCatLower = (course.category || '').toLowerCase();
    const courseTitleLower = (course.courseName || '').toLowerCase();

    // Priority 1: Match career goal
    let goalMatch = false;
    if (goalLower) {
      if (
        courseTitleLower.includes(goalLower) ||
        courseCatLower.includes(goalLower) ||
        courseSkillsLower.some(s => goalLower.includes(s) || s.includes(goalLower))
      ) {
        score += 35;
        goalMatch = true;
        reasons.push(`Directly advances your goal of becoming a ${careerGoal}`);
      }
    }

    // Priority 2: Building on existing skills
    const overlappingSkills = courseSkillsLower.filter(cs =>
      normalizedSkills.some(ns => cs.includes(ns) || ns.includes(cs))
    );
    if (overlappingSkills.length > 0) {
      score += 20;
      reasons.push(`Builds on your background in ${overlappingSkills.join(', ')}`);
    }

    // Priority 3: Filling skill gaps (skills the course teaches that student doesn't have yet)
    const newSkills = (course.skills || []).filter(
      cs => !normalizedSkills.some(ns => cs.toLowerCase() === ns || ns.includes(cs.toLowerCase()))
    );
    if (newSkills.length > 0) {
      score += 25;
      reasons.push(`Fills vital skill gap in ${newSkills.slice(0, 3).join(', ')}`);
    }

    // Priority 4: Appropriate for experience level
    if (experienceLevel === 'Beginner') {
      if (course.difficulty === 'Beginner') score += 20;
      else if (course.difficulty === 'Intermediate') score += 10;
      else if (course.difficulty === 'Advanced') score -= 15;
    } else if (experienceLevel === 'Intermediate') {
      if (course.difficulty === 'Intermediate') score += 20;
      else if (course.difficulty === 'Advanced') score += 15;
      else if (course.difficulty === 'Beginner') score += 5;
    } else if (experienceLevel === 'Advanced') {
      if (course.difficulty === 'Advanced') score += 25;
      else if (course.difficulty === 'Intermediate') score += 15;
      else if (course.difficulty === 'Beginner') score -= 20;
    }

    // Rule: Do not recommend introductory courses for skills the student already has
    if (course.difficulty === 'Beginner' && overlappingSkills.length > 0 && newSkills.length === 0) {
      score -= 50; // Heavily penalize redundant beginner course
    }

    // Preferred Tech & Interests boost
    const techMatch = courseSkillsLower.filter(cs =>
      normalizedTech.some(nt => cs.includes(nt) || nt.includes(cs))
    );
    if (techMatch.length > 0) {
      score += 15;
      reasons.push(`Covers your preferred stack (${techMatch.join(', ')})`);
    }

    if (normalizedInterests.some(ni => courseCatLower.includes(ni) || courseTitleLower.includes(ni))) {
      score += 10;
      reasons.push(`Aligns with your interest in ${course.category}`);
    }

    // Combine reasons into a concise, professional explanation
    const reasonText = reasons.length > 0
      ? reasons.join('. ') + '.'
      : `Broadens your foundational knowledge in ${course.category} with targeted skills.`;

    return {
      course,
      score,
      reasonText,
      newSkills
    };
  });

  // Filter out negative/irrelevant scores and sort descending by score
  const validScored = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Take top 4-6 courses
  const selected = validScored.slice(0, 5);

  // Priority 5: Courses forming a logical learning sequence (Beginner -> Intermediate -> Advanced)
  const difficultyRank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  selected.sort((a, b) => {
    const diffA = difficultyRank[a.course.difficulty] || 2;
    const diffB = difficultyRank[b.course.difficulty] || 2;
    return diffA - diffB;
  });

  return selected.map((item, index) => ({
    courseId: item.course._id,
    courseName: item.course.courseName,
    reason: item.reasonText,
    difficulty: item.course.difficulty,
    skillsGained: item.newSkills.length > 0 ? item.newSkills : item.course.skills,
    learningOrder: index + 1,
    courseDetails: item.course
  }));
};

// @desc    Generate AI recommendations based on student profile
// @route   POST /api/recommendations/generate
// @access  Private (Student)
exports.generateRecommendations = async (req, res) => {
  try {
    const { isUsingMemory, memoryStore } = getStoreState();
    let user = null;
    let catalogCourses = [];

    if (isUsingMemory) {
      user = memoryStore.users.find(u => String(u._id) === String(req.user._id));
      catalogCourses = [...memoryStore.courses];
    } else {
      user = await User.findById(req.user._id);
      catalogCourses = await Course.find();
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    // Profile completeness check as required by FR5:
    // "The system shall not call the AI API if the student profile is incomplete; instead it shall display:
    // 'Complete your profile to receive personalized AI recommendations' with a Complete Profile button."
    const isProfileIncomplete = !user.careerGoal || !user.experienceLevel || (!user.skills || user.skills.length === 0);

    if (isProfileIncomplete) {
      return res.status(400).json({
        success: false,
        isIncomplete: true,
        message: 'Complete your profile to receive personalized AI recommendations.',
        data: null
      });
    }

    if (!catalogCourses || catalogCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No courses available in catalog to recommend. Please contact admin.',
        data: null
      });
    }

    // Run AI recommendation generation
    const recommendations = runRuleBasedAI(user, catalogCourses);

    if (recommendations.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No suitable course found matching your exact profile. Please try updating your profile.',
        data: []
      });
    }

    // Store generated recommendations in the database (or memory) and clean old ones
    if (isUsingMemory) {
      memoryStore.recommendations = memoryStore.recommendations.filter(
        r => String(r.userId) !== String(user._id)
      );
      recommendations.forEach(rec => {
        memoryStore.recommendations.push({
          _id: `mem_rec_${Date.now()}_${rec.learningOrder}`,
          userId: user._id,
          courseId: rec.courseId,
          reason: rec.reason,
          learningOrder: rec.learningOrder,
          createdAt: new Date()
        });
      });
    } else {
      await Recommendation.deleteMany({ userId: user._id });
      const recDocs = recommendations.map(r => ({
        userId: user._id,
        courseId: r.courseId,
        reason: r.reason,
        learningOrder: r.learningOrder
      }));
      await Recommendation.insertMany(recDocs);
    }

    return res.status(200).json({
      success: true,
      message: 'Personalized AI recommendations generated successfully',
      data: recommendations
    });
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    // SRS FR5: "If the AI API fails, the system shall display 'Unable to generate recommendations right now. Please try again.' without crashing."
    return res.status(500).json({
      success: false,
      message: 'Unable to generate recommendations right now. Please try again.',
      data: null
    });
  }
};

// @desc    Get saved recommendations
// @route   GET /api/recommendations
// @access  Private (Student)
exports.getSavedRecommendations = async (req, res) => {
  try {
    const { isUsingMemory, memoryStore } = getStoreState();

    if (isUsingMemory) {
      const userRecs = memoryStore.recommendations
        .filter(r => String(r.userId) === String(req.user._id))
        .sort((a, b) => a.learningOrder - b.learningOrder);

      const hydrated = userRecs.map(r => {
        const course = memoryStore.courses.find(c => String(c._id) === String(r.courseId)) || {};
        return {
          _id: r._id,
          courseId: r.courseId,
          courseName: course.courseName || 'Course',
          reason: r.reason,
          difficulty: course.difficulty || 'Intermediate',
          skillsGained: course.skills || [],
          learningOrder: r.learningOrder,
          courseDetails: course,
          createdAt: r.createdAt
        };
      });

      return res.status(200).json({
        success: true,
        message: 'Saved recommendations fetched',
        data: hydrated
      });
    }

    // MongoDB Mode
    const recs = await Recommendation.find({ userId: req.user._id })
      .populate('courseId')
      .sort({ learningOrder: 1 });

    const formatted = recs
      .filter(r => r.courseId) // Filter out deleted courses
      .map(r => ({
        _id: r._id,
        courseId: r.courseId._id,
        courseName: r.courseId.courseName,
        reason: r.reason,
        difficulty: r.courseId.difficulty,
        skillsGained: r.courseId.skills,
        learningOrder: r.learningOrder,
        courseDetails: r.courseId,
        createdAt: r.createdAt
      }));

    return res.status(200).json({
      success: true,
      message: 'Saved recommendations fetched',
      data: formatted
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching recommendations',
      data: null
    });
  }
};
