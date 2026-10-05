import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'Web Development',
  'Programming',
  'Data',
  'AI',
  'Cloud',
  'Security',
  'Database'
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const CourseModal = ({ isOpen, onClose, courseToEdit, onSaved }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    category: 'Web Development',
    description: '',
    skills: '',
    difficulty: 'Beginner',
    duration: '',
    courseLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        courseName: courseToEdit.courseName || '',
        category: courseToEdit.category || 'Web Development',
        description: courseToEdit.description || '',
        skills: Array.isArray(courseToEdit.skills) ? courseToEdit.skills.join(', ') : '',
        difficulty: courseToEdit.difficulty || 'Beginner',
        duration: courseToEdit.duration || '',
        courseLink: courseToEdit.courseLink || ''
      });
    } else {
      setFormData({
        courseName: '',
        category: 'Web Development',
        description: '',
        skills: '',
        difficulty: 'Beginner',
        duration: '',
        courseLink: ''
      });
    }
    setError('');
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (
      !formData.courseName.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.skills.trim() ||
      !formData.difficulty ||
      !formData.duration.trim() ||
      !formData.courseLink.trim()
    ) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (courseToEdit) {
        await api.put(`/courses/${courseToEdit._id}`, payload);
        addToast('Course updated successfully!', 'success');
      } else {
        await api.post('/courses', payload);
        addToast('New course created successfully!', 'success');
      }

      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save course.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">
              {courseToEdit ? 'Edit Course Catalog Item' : 'Add New Course to Catalog'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Name *
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g. Modern Web Development with React & Node"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Difficulty Level *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-white"
              >
                {DIFFICULTIES.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of what the student will learn..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skills Covered (Comma-separated) *
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Express, REST APIs, Tailwind CSS"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 6 weeks, 8 weeks"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course Link (URL) *
              </label>
              <input
                type="url"
                name="courseLink"
                value={formData.courseLink}
                onChange={handleChange}
                placeholder="https://example.com/course"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : courseToEdit ? 'Save Changes' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
