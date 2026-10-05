import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import { ProgressPieChart } from '../components/ProgressChart';
import { Loader } from '../components/Loader';
import {
  Sparkles,
  BookOpen,
  MapPin,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Compass,
  AlertTriangle
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [progressSummary, setProgressSummary] = useState({
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    totalTracked: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch recommendations, saved courses, and progress summary in parallel
        const [recsRes, savedRes, progRes] = await Promise.allSettled([
          api.get('/recommendations'),
          api.get('/saved-courses'),
          api.get('/progress')
        ]);

        if (recsRes.status === 'fulfilled' && recsRes.value.data.success) {
          setRecommendations(recsRes.value.data.data.slice(0, 4));
        }

        if (savedRes.status === 'fulfilled' && savedRes.value.data.success) {
          setSavedCourses(savedRes.value.data.data.slice(0, 4));
        }

        if (progRes.status === 'fulfilled' && progRes.value.data.success) {
          setProgressSummary(progRes.value.data.data.summary || {
            notStarted: 0,
            inProgress: 0,
            completed: 0,
            totalTracked: 0
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completion = user?.profileCompletion ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner & Profile Completion (FR9) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/10">
              <Compass className="w-3.5 h-3.5 text-indigo-300" />
              <span>Student Learning Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-xl">
              Target Career Role:{' '}
              <span className="font-bold text-white">
                {user?.careerGoal || 'Not specified yet'}
              </span>{' '}
              • Experience Level:{' '}
              <span className="font-bold text-white capitalize">
                {user?.experienceLevel || 'Beginner'}
              </span>
            </p>
          </div>

          {/* Profile Completion Meter */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 w-full md:w-72 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Profile Completion
              </span>
              <span className="text-base font-black text-emerald-300">{completion}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-indigo-400 rounded-full transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-200 leading-tight">
              {completion < 70
                ? 'Complete remaining profile fields for optimal AI recommendations.'
                : 'Your profile is fully optimized for precision AI matching!'}
            </p>
          </div>
        </div>

        {/* Quick Actions (FR9: Complete Profile, Get AI Recommendations, Explore Courses, View Learning Path) */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition border border-white/10"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Complete Profile</span>
          </Link>
          <Link
            to="/recommendations"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-black shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Get AI Picks</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition border border-white/10"
          >
            <BookOpen className="w-4 h-4 text-indigo-300" />
            <span>Explore Courses</span>
          </Link>
          <Link
            to="/learning-path"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition border border-white/10"
          >
            <MapPin className="w-4 h-4 text-purple-300" />
            <span>View Learning Path</span>
          </Link>
        </div>
      </div>

      {/* Overview Analytics Grid (FR9 Progress Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Courses</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{savedCourses.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{progressSummary.inProgress}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{progressSummary.completed}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Not Started</p>
            <p className="text-2xl font-black text-slate-600 mt-1">{progressSummary.notStarted}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Progress Visualization & Saved Courses Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Breakdown Donut Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Progress Distribution</h3>
            <Link to="/saved-courses" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage Tracker
            </Link>
          </div>
          <ProgressPieChart summary={progressSummary} />
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Enrolled: {progressSummary.totalTracked} courses</span>
            <Link to="/saved-courses" className="font-bold text-slate-700 hover:text-indigo-600">
              Update Percentages →
            </Link>
          </div>
        </div>

        {/* Saved Courses Quick List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">My Saved Courses</h3>
              <p className="text-xs text-slate-500">Bookmarked courses ready for study</p>
            </div>
            <Link to="/saved-courses" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {savedCourses.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No saved courses yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Explore the catalog or generate AI recommendations to bookmark courses.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-100 transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Course Catalog</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCourses.map((item) => {
                const c = item.courseId;
                if (!c) return null;
                const status = item.progress?.status || 'Not Started';
                const pct = item.progress?.completionPercentage || 0;

                return (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <Link
                        to={`/courses/${c._id}`}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 truncate block"
                      >
                        {c.courseName}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {c.category}
                        </span>
                        <span className="text-[10px] text-slate-500">• {c.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-600">{pct}%</span>
                        <p className="text-[10px] text-slate-400">{status}</p>
                      </div>
                      <Link
                        to={`/courses/${c._id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3-5 AI Recommended Courses Preview (FR9) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                Recommended For Your Career Path
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Curated by the intelligence engine based on your goals, current skills, and skill gap priorities.
            </p>
          </div>

          <Link
            to="/recommendations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0"
          >
            <span>Run New AI Analysis</span>
            <Sparkles className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading your dashboard recommendations..." />
        ) : recommendations.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-10 h-10 text-indigo-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Recommendations Generated Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Click the button below to allow our AI learning advisor to evaluate your profile and build your customized course list.
            </p>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Recommendations</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((rec) => (
              <CourseCard
                key={rec._id || rec.courseId}
                course={rec.courseDetails || { _id: rec.courseId, courseName: rec.courseName, category: 'AI', difficulty: rec.difficulty, skills: rec.skillsGained, duration: '6 weeks', description: rec.reason }}
                recommendationReason={rec.reason}
                learningOrder={rec.learningOrder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
