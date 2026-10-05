import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Clock,
  Award,
  Bookmark,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  PlayCircle,
  Sparkles,
  Layers
} from 'lucide-react';

export const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  // Progress state (FR4 & FR8)
  const [progressStatus, setProgressStatus] = useState('Not Started');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          const c = res.data.data;
          setCourse(c);
          setIsSaved(c.isSaved || false);
          if (c.progress) {
            setProgressStatus(c.progress.status || 'Not Started');
            setCompletionPercentage(c.progress.completionPercentage || 0);
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        addToast('Error loading course details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      addToast('Please sign in to bookmark this course.', 'info');
      return;
    }

    setSavingBookmark(true);
    try {
      if (isSaved) {
        await api.delete(`/saved-courses/${id}`);
        setIsSaved(false);
        addToast('Removed from your saved courses.', 'info');
      } else {
        await api.post('/saved-courses', { courseId: id });
        setIsSaved(true);
        addToast('Course successfully saved!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating saved state', 'error');
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleUpdateProgress = async (newPct, newStatus) => {
    if (!isAuthenticated) {
      addToast('Please sign in to update your course progress.', 'info');
      return;
    }

    setUpdatingProgress(true);
    try {
      const res = await api.put(`/progress/${id}`, {
        completionPercentage: newPct,
        status: newStatus
      });

      if (res.data.success) {
        setCompletionPercentage(newPct);
        setProgressStatus(newStatus);
        addToast(`Progress updated to ${newPct}% (${newStatus})`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating progress', 'error');
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return <Loader message="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested course record could not be found or has been removed.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>
      </div>

      {/* Main Course Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                {course.category}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                {course.difficulty}
              </span>
              <div className="flex items-center gap-1 text-slate-500 text-xs font-medium ml-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{course.duration}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {course.courseName}
            </h1>
          </div>

          {/* Action Buttons: Save & Start Course (FR4) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSaveToggle}
              disabled={savingBookmark}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition shadow-xs ${
                isSaved
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isSaved ? 'Bookmarked' : 'Save Course'}</span>
            </button>

            <a
              href={course.courseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition hover:scale-105"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start Course</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Course Description */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Overview & Curriculum Scope
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </div>

        {/* Skills Covered (FR4) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Core Competencies & Skills Covered
          </h3>
          <div className="flex flex-wrap gap-2">
            {(course.skills || []).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Student Progress Tracker Box (FR4 & FR8) */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>My Learning Progress for this Course</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Status:{' '}
                <span className="font-bold text-slate-800">{progressStatus}</span> • Completion:{' '}
                <span className="font-bold text-indigo-700">{completionPercentage}%</span>
              </p>
            </div>

            <span className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full ${
              progressStatus === 'Completed'
                ? 'bg-emerald-100 text-emerald-800'
                : progressStatus === 'In Progress'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {progressStatus}
            </span>
          </div>

          {/* Progress Bar (FR8) */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completionPercentage === 100
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Milestone Buttons (0%, 25%, 50%, 75%, 100% as per FR8) */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Update Completion Milestone:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {[0, 25, 50, 75, 100].map((pct) => {
                const isCurrent = completionPercentage === pct;
                const status = pct === 0 ? 'Not Started' : pct === 100 ? 'Completed' : 'In Progress';
                return (
                  <button
                    key={pct}
                    type="button"
                    disabled={updatingProgress}
                    onClick={() => handleUpdateProgress(pct, status)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition border ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
