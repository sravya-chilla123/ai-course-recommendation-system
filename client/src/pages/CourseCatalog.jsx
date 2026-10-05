import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import { Search, Filter, BookOpen, Sparkles, X, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Programming',
  'Data',
  'AI',
  'Cloud',
  'Security',
  'Database'
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [savedCourseIds, setSavedCourseIds] = useState(new Set());

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;

      const res = await api.get('/courses', { params });
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCourses = async () => {
    try {
      const res = await api.get('/saved-courses');
      if (res.data.success) {
        const ids = new Set(res.data.data.map(item => String(item.courseId?._id || item.courseId)));
        setSavedCourseIds(ids);
      }
    } catch (e) {
      // not logged in or quiet fail
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    fetchSavedCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
  };

  const handleSaveToggle = (courseId, isSaved) => {
    setSavedCourseIds(prev => {
      const next = new Set(prev);
      if (isSaved) next.add(String(courseId));
      else next.delete(String(courseId));
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Feature 2: Course Database and Search (FR3)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Course Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover verified technical courses across 7 distinct computing disciplines.
          </p>
        </div>

        <button
          onClick={fetchCourses}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Catalog</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by course name, technology, or skills (e.g. React, Docker, Python)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); fetchCourses(); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            Search
          </button>
        </form>

        {/* Categories Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Categories
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Difficulty:</span>
            <div className="flex gap-1.5">
              {DIFFICULTIES.map((diff) => {
                const active = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                      active
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{courses.length}</span> courses
          </p>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <Loader message="Fetching course catalog..." />
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">No matching courses found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Try adjusting your search keywords or switching filters back to "All".
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-indigo-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isSavedInitial={savedCourseIds.has(String(course._id))}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
