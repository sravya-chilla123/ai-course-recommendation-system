const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for local MVP and deployment
  },
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PathPilot AI Course Recommendation API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes as per SRS Section 4
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/saved-courses', require('./routes/savedCourses'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/admin', require('./routes/admin'));

// Global Error Handler
app.use(errorHandler);

// Catch unhandled 404s
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
    data: null
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 PathPilot API Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📚 SRS Version: 1.0 College MVP`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;