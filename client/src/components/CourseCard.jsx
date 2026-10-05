import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Award, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const CourseCard = ({ course, isSavedInitial = false, onSaveToggle, recommendationReason, learningOrder }) => {
  const [saved, setSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast('Please log in to save courses to your dashboard.', 'info');
      return;
    }

    setSaving(true);
    try {
      if (saved) {
        await api.delete(`/saved-courses/${course._id}`);
        setSaved(false);
        addToast('Course removed from saved list.', 'info');
        if (onSaveToggle) onSaveToggle(course._id, false);
      } else {
        await api.post('/saved-courses', { courseId: course._id });
        setSaved(true);
        addToast('Course saved to your dashboard!', 'success');
        if (onSaveToggle) onSaveToggle(course._id, true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating saved status.';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Web Development':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'AI':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Data':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Cloud':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Security':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Database':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Learning Order Badge if provided (FR6 / Recommendation) */}
      {learningOrder && (
        <div className="absolute -top-3 -left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Step {learningOrder}</span>
        </div>
      )}

      <div>
        {/* Top Badges & Save Action */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${getCategoryColor(course.category)}`}>
              {course.category}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>

          <button
            onClick={handleSaveToggle}
            disabled={saving}
            title={saved ? 'Remove from Saved' : 'Save Course'}
            className={`p-2 rounded-xl border transition-all ${
              saved
                ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-transparent hover:border-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {course.courseName}
        </h3>

        {/* AI Recommendation Reason if present */}
        {recommendationReason && (
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 mb-3 text-xs text-indigo-900">
            <span className="font-bold text-indigo-700 flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3 h-3" /> Why Recommended:
            </span>
            <p className="italic leading-relaxed">{recommendationReason}</p>
          </div>
        )}

        {/* Description */}
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
          {course.description}
        </p>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(course.skills || []).slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {(course.skills || []).length > 4 && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
              +{(course.skills || []).length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{course.duration}</span>
        </div>

        <Link
          to={`/courses/${course._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group/btn bg-indigo-50/60 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
