import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseModal from '../components/CourseModal';
import { CategoryBarChart } from '../components/ProgressChart';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  BookOpen,
  Users,
  Layers,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalCategories: 0,
    categoriesBreakdown: []
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const { addToast } = useToast();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/courses')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      addToast('Error loading admin analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedCourse(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${courseName}"?`)) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      addToast(`Course "${courseName}" deleted successfully.`, 'info');
      fetchAdminData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error deleting course', 'error');
    }
  };

  // Filtered courses for the table
  const filteredCourses = courses.filter(c => {
    const matchesCat = filterCategory === 'All' || c.category === filterCategory;
    const matchesSearch = !search ||
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Course Management (FR10)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Curriculum Administration Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain the platform's verified course database, monitor curriculum metrics, and update offerings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Stats Grid (FR10) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Course Catalog
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalCourses}</p>
            <p className="text-[11px] text-slate-400 mt-1">Active verified courses</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Students
            </span>
            <p className="text-3xl font-black text-purple-600 mt-1">{stats.totalStudents}</p>
            <p className="text-[11px] text-slate-400 mt-1">Active student learners</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Technical Domains
            </span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{stats.totalCategories}</p>
            <p className="text-[11px] text-slate-400 mt-1">Distinct course categories</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Breakdown Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-1">
          Curriculum Category Distribution
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Course offerings balanced across computing domains
        </p>
        <CategoryBarChart breakdown={stats.categoriesBreakdown} />
      </div>

      {/* Course Management Table (FR10) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table by course or skill..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <span className="text-xs text-slate-500 font-semibold">Filter:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Categories</option>
              {stats.categoriesBreakdown.map(c => (
                <option key={c.category} value={c.category}>{c.category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12">
            <Loader message="Loading curriculum catalog..." />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No courses found matching filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Course Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Skills</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs">
                      <div className="truncate font-semibold">{c.courseName}</div>
                      <a
                        href={c.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[11px]">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        c.difficulty === 'Beginner'
                          ? 'bg-emerald-50 text-emerald-700'
                          : c.difficulty === 'Intermediate'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {c.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{c.duration}</td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(c.skills || []).slice(0, 3).map((s, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                        {(c.skills || []).length > 3 && (
                          <span className="text-[10px] text-slate-400">+{c.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit Course"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c._id, c.courseName)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Course Create / Edit Modal (FR10) */}
      <CourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseToEdit={selectedCourse}
        onSaved={fetchAdminData}
      />
    </div>
  );
};

export default AdminDashboard;
