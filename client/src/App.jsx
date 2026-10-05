import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import Recommendations from './pages/Recommendations';
import LearningPath from './pages/LearningPath';
import SavedCourses from './pages/SavedCourses';
import AdminDashboard from './pages/AdminDashboard';

export function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<CourseCatalog />} />
                <Route path="/courses/:id" element={<CourseDetails />} />

                {/* Protected Student Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learning-path"
                  element={
                    <ProtectedRoute>
                      <LearningPath />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved-courses"
                  element={
                    <ProtectedRoute>
                      <SavedCourses />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Application Footer */}
            <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>© {new Date().getFullYear()} PathPilot — AI-Based Personalized Course Recommendation System.</p>
                <p className="font-semibold text-indigo-600">SRS Version 1.0 College MVP • Free Tier Open Architecture</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
