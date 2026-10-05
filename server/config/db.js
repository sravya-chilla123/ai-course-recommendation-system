const mongoose = require('mongoose');
const { sampleCourses } = require('./seedData');

let isUsingMemory = false;

// In-Memory Data Store (High-performance fallback if MongoDB Atlas is unavailable)
const memoryStore = {
  users: [],
  courses: [],
  savedCourses: [],
  progress: [],
  recommendations: []
};

// Seed in-memory store with default courses
const seedMemoryCourses = () => {
  if (memoryStore.courses.length === 0) {
    sampleCourses.forEach((c, idx) => {
      memoryStore.courses.push({
        _id: `mem_course_${idx + 1}`,
        ...c,
        createdAt: new Date()
      });
    });
    console.log(`[Memory DB] Seeded ${memoryStore.courses.length} courses into in-memory store.`);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.trim() === '') {
    console.log('[DB] No valid MONGO_URI provided in .env. Initializing in-memory fallback store.');
    isUsingMemory = true;
    seedMemoryCourses();
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    isUsingMemory = false;

    // Check if courses need to be seeded into MongoDB
    const Course = require('../models/Course');
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(sampleCourses);
      console.log(`[MongoDB] Seeded ${sampleCourses.length} initial courses into MongoDB.`);
    }
  } catch (error) {
    console.warn(`[DB Warning] MongoDB Atlas connection failed (${error.message}). Switching to resilient in-memory fallback store.`);
    isUsingMemory = true;
    seedMemoryCourses();
  }
};

const getStoreState = () => ({
  isUsingMemory,
  memoryStore
});

module.exports = {
  connectDB,
  getStoreState,
  memoryStore
};
