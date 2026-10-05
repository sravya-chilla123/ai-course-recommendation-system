/**
 * AI Service for PathPilot
 * Strictly Free Tier - Rule-Based Mock AI engine that returns structured JSON
 * exactly matching SRS Section 3 (FR5), Section 8.3 & Appendix C without any paid API keys.
 */

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Recommend courses based on student profile (skills, interests, career goal, level, preferred tech)
   * Follows SRS FR5 prioritization:
   * 1. Matches career goal
   * 2. Builds on existing skills
   * 3. Fills skill gaps
   * 4. Considers experience level
   * 5. Forms logical sequence
   * Does NOT recommend intro courses for skills already mastered.
   */
  async getCareerRecommendations(profile, catalogCourses = []) {
    await delay(800);

    const {
      careerGoal = '',
      skills = [],
      interests = [],
      experienceLevel = 'Beginner',
      preferredTechnologies = []
    } = profile;

    const normalizedSkills = (skills || []).map(s => s.toLowerCase().trim());
    const normalizedInterests = (interests || []).map(i => i.toLowerCase().trim());
    const normalizedTech = (preferredTechnologies || []).map(t => t.toLowerCase().trim());
    const goalLower = (careerGoal || '').toLowerCase().trim();

    // Score courses
    const scored = catalogCourses.map(course => {
      let score = 0;
      const reasons = [];
      const courseSkillsLower = (course.skills || []).map(s => s.toLowerCase());
      const courseCatLower = (course.category || '').toLowerCase();
      const courseTitleLower = (course.courseName || '').toLowerCase();

      // 1. Goal match
      if (goalLower) {
        if (
          courseTitleLower.includes(goalLower) ||
          courseCatLower.includes(goalLower) ||
          courseSkillsLower.some(s => goalLower.includes(s) || s.includes(goalLower))
        ) {
          score += 35;
          reasons.push(`Directly targets your objective of becoming a ${careerGoal}`);
        }
      }

      // 2. Existing skills
      const overlapping = courseSkillsLower.filter(cs =>
        normalizedSkills.some(ns => cs.includes(ns) || ns.includes(cs))
      );
      if (overlapping.length > 0) {
        score += 20;
        reasons.push(`Builds on your current mastery of ${overlapping.join(', ')}`);
      }

      // 3. Skill gap
      const newSkills = (course.skills || []).filter(
        cs => !normalizedSkills.some(ns => cs.toLowerCase() === ns || ns.includes(cs.toLowerCase()))
      );
      if (newSkills.length > 0) {
        score += 25;
        reasons.push(`Acquires essential competencies in ${newSkills.slice(0, 3).join(', ')}`);
      }

      // 4. Level appropriateness
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

      // Redundancy check: no intro courses for existing skills
      if (course.difficulty === 'Beginner' && overlapping.length > 0 && newSkills.length === 0) {
        score -= 50;
      }

      // Tech match
      const techMatch = courseSkillsLower.filter(cs =>
        normalizedTech.some(nt => cs.includes(nt) || nt.includes(cs))
      );
      if (techMatch.length > 0) {
        score += 15;
        reasons.push(`Features your preferred tools: ${techMatch.join(', ')}`);
      }

      if (normalizedInterests.some(ni => courseCatLower.includes(ni) || courseTitleLower.includes(ni))) {
        score += 10;
        reasons.push(`Aligned with ${course.category} interests`);
      }

      const reasonText = reasons.length > 0
        ? reasons.join('. ') + '.'
        : `Strengthens your core foundation in ${course.category}.`;

      return {
        course,
        score,
        reasonText,
        newSkills
      };
    });

    // Sort by score
    const topScored = scored.filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);

    // Sequence logically by difficulty (5. Logical learning sequence)
    const rank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    topScored.sort((a, b) => (rank[a.course.difficulty] || 2) - (rank[b.course.difficulty] || 2));

    return topScored.map((item, idx) => ({
      courseId: item.course._id,
      courseName: item.course.courseName,
      reason: item.reasonText,
      difficulty: item.course.difficulty,
      skillsGained: item.newSkills.length > 0 ? item.newSkills : item.course.skills,
      learningOrder: idx + 1,
      courseDetails: item.course
    }));
  },

  /**
   * Generates a step-by-step personalized learning path roadmap
   */
  async generateRoadmap(career, profile = {}) {
    await delay(800);
    const target = career || profile.careerGoal || 'Software Engineer';
    const level = profile.experienceLevel || 'Beginner';

    return {
      title: `${target} Personalized Learning Roadmap`,
      targetRole: target,
      currentLevel: level,
      estimatedWeeks: 24,
      phases: [
        {
          phase: 1,
          name: 'Core Foundations & Programming Syntax',
          status: 'completed',
          duration: '4-6 weeks',
          description: `Build strong command over language idioms, algorithms, and computational thinking.`,
          milestones: ['Variables & Control Structures', 'Object-Oriented Programming', 'Basic Data Structures'],
          keyTechnologies: ['JavaScript', 'Python', 'Git']
        },
        {
          phase: 2,
          name: 'System Architecture & Web Engineering',
          status: 'in-progress',
          duration: '6-8 weeks',
          description: `Develop modern client-server architectures with REST APIs, state management, and responsive layouts.`,
          milestones: ['React Component Lifecycle', 'RESTful API Construction', 'Authentication & JWT'],
          keyTechnologies: ['React', 'Express', 'Tailwind CSS']
        },
        {
          phase: 3,
          name: 'Database Modeling & Persistence',
          status: 'upcoming',
          duration: '4-6 weeks',
          description: `Master schema normalization, indexing, document design patterns, and caching layers.`,
          milestones: ['Relational & Document DBs', 'Aggregation Pipelines', 'Query Optimization'],
          keyTechnologies: ['MongoDB', 'PostgreSQL', 'Mongoose']
        },
        {
          phase: 4,
          name: 'Cloud Deployment, AI & Production Readiness',
          status: 'upcoming',
          duration: '6-8 weeks',
          description: `Deploy resilient applications to cloud infrastructure, integrate AI APIs, and manage CI/CD.`,
          milestones: ['Docker Containerization', 'Cloud Infrastructure Deployments', 'LLM Integration'],
          keyTechnologies: ['Docker', 'AWS/Vercel', 'Gemini API']
        }
      ]
    };
  },

  /**
   * Evaluates student skills against a target Job Description
   */
  async analyzeReadiness(studentSkills = [], jobDescription = '') {
    await delay(800);

    const jdTokens = (jobDescription || '').toLowerCase();
    const commonTech = [
      'react', 'node.js', 'mongodb', 'express', 'javascript', 'typescript',
      'python', 'docker', 'aws', 'sql', 'git', 'tailwind', 'rest apis', 'graphql'
    ];

    const requiredInJd = commonTech.filter(tech => jdTokens.includes(tech));
    const finalRequired = requiredInJd.length > 0 ? requiredInJd : ['javascript', 'react', 'node.js', 'mongodb', 'git'];

    const studentLower = studentSkills.map(s => s.toLowerCase().trim());
    const matchedSkills = finalRequired.filter(req => studentLower.some(s => s.includes(req) || req.includes(s)));
    const missingSkills = finalRequired.filter(req => !matchedSkills.includes(req));

    const matchScore = Math.round((matchedSkills.length / Math.max(finalRequired.length, 1)) * 100);

    return {
      matchScore,
      rating: matchScore >= 75 ? 'Job Ready' : matchScore >= 45 ? 'Moderately Prepared' : 'Foundational Stage',
      matchedSkills,
      missingSkills,
      strengths: matchedSkills.length > 0 ? matchedSkills : ['Core Enthusiasm', 'Foundational Fundamentals'],
      recommendations: missingSkills.map(m => `Prioritize high-impact course on ${m.toUpperCase()} to bridge employer gap.`),
      suggestedNextAction: missingSkills.length > 0
        ? `Enroll in specialized course covering ${missingSkills[0].toUpperCase()}`
        : 'Prepare for technical interviews and build full-stack portfolio projects.'
    };
  },

  /**
   * Interactive AI Learning Mentor Q&A
   */
  async answerMentorQuestion(question, profile = {}) {
    await delay(800);
    const q = (question || '').toLowerCase();

    if (q.includes('roadmap') || q.includes('start') || q.includes('where')) {
      return {
        answer: `Given your target role as **${profile.careerGoal || 'Software Developer'}** and current level (**${profile.experienceLevel || 'Beginner'}**), the best path forward is to complete our recommended Phase 1 courses, build 2 hands-on projects, and log your progress regularly.`,
        suggestedTopics: ['View Learning Path', 'Course Catalog', 'Update Skills']
      };
    }

    if (q.includes('job') || q.includes('interview') || q.includes('resume')) {
      return {
        answer: `Employers in modern tech prioritize demonstrable projects over theoretical tests. Ensure your GitHub features full-stack MERN applications with clean READMEs, responsive styling, and robust error handling. Check out your Profile completion score to track readiness!`,
        suggestedTopics: ['Skill Gap Analysis', 'Update Profile', 'Saved Courses']
      };
    }

    return {
      answer: `Based on your profile with skills in **${(profile.skills || []).slice(0, 3).join(', ') || 'modern tech'}**, you are positioned well for high-growth tracks. Continue focusing on structured courses in your personalized learning path to turn conceptual knowledge into production-ready capability!`,
      suggestedTopics: ['Get AI Recommendations', 'Explore Courses', 'Personalized Roadmap']
    };
  }
};

export default aiService;
