import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import {
  Bookmark,
  TrendingUp,
  Clock,
  PlayCircle,
  ExternalLink,
  Trash2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const SavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  const fetchSavedCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/saved-courses');
      if (res.data.success) {
        setSavedCourses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching saved courses:', err);
      addToast('Error loading your saved courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCourses();
  }, []);

  const handleRemoveCourse = async (courseId) => {
    try {
      await api.delete(`/saved-courses/${courseId}`);
      setSavedCourses(prev => prev.filter(sc => String(sc.courseId?._id || sc.courseId) !== String(courseId)));
      addToast('Course removed from saved list.', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Error removing saved course', 'error');
    }
  };

  const handleUpdateProgress = async (courseId, pct) => {
    setUpdatingId(courseId);
    const status = pct === 0 ? 'Not Started' : pct === 100 ? 'Completed' : 'In Progress';

    try {
      const res = await api.put(`/progress/${courseId}`, {
        completionPercentage: pct,
        status
      });

      if (res.data.success) {
        setSavedCourses(prev =>
          prev.map(sc => {
            const scId = sc.courseId?._id || sc.courseId;
            if (String(scId) === String(courseId)) {
              return {
                ...sc,
                progress: {
                  ...sc.progress,
                  completionPercentage: pct,
                  status
                }
              };
            }
            return sc;
          })
        );
        addToast(`Progress updated to ${pct}% (${status})`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating progress', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculation
  const totalSaved = savedCourses.length;
  const inProgressCount = savedCourses.filter(sc => sc.progress?.status === 'In Progress').length;
  const completedCount = savedCourses.filter(sc => sc.progress?.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Feature 5: Saved Courses & Progress Tracking (FR7 & FR8)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Course Tracker & Bookmarks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your saved learning resources and update real-time completion milestones.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>Add More Courses</span>
        </Link>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Saved</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalSaved}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currently In Progress</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Finished & Mastered</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Saved Courses List */}
      {loading ? (
        <Loader message="Loading your saved courses and progress..." />
      ) : savedCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-xs">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">Your Saved List is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Bookmark courses from the catalog or from your AI recommendations to track your progress here.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Courses</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedCourses.map((item) => {
            const c = item.courseId;
            if (!c) return null;

            const courseId = c._id;
            const currentStatus = item.progress?.status || 'Not Started';
            const currentPct = item.progress?.completionPercentage || 0;
            const isUpdating = updatingId === courseId;

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-4"
              >
                {/* Course Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {c.category}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                        {c.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{c.duration}</span>
                      </span>
                    </div>

                    <Link
                      to={`/courses/${courseId}`}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition block"
                    >
                      {c.courseName}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  {/* Actions: Open & Delete */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {c.courseLink && (
                      <a
                        href={c.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Open Course</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}

                    <Link
                      to={`/courses/${courseId}`}
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition"
                    >
                      Details
                    </Link>

                    <button
                      onClick={() => handleRemoveCourse(courseId)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Real-time Progress Bar & Milestones (FR8) */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Completion Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        currentStatus === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : currentStatus === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {currentStatus}
                      </span>
                    </span>

                    <span className="font-black text-indigo-600 text-sm">
                      {currentPct}%
                    </span>
                  </div>

                  {/* Progress Bar (FR8) */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        currentPct === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${currentPct}%` }}
                    />
                  </div>

                  {/* 0%, 25%, 50%, 75%, 100% Milestone buttons (FR8) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Set Milestone:
                    </span>
                    <div className="flex gap-1.5">
                      {[0, 25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateProgress(courseId, pct)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-lg transition border ${
                            currentPct === pct
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedCourses;
