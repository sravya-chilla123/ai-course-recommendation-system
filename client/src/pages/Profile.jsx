import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  Target,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  X,
  Compass
} from 'lucide-react';

const COMMON_CAREER_GOALS = [
  'Full Stack Web Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI / Machine Learning Engineer',
  'Data Scientist',
  'Cloud & DevOps Architect',
  'Cybersecurity Analyst'
];

const SUGGESTED_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Express',
  'MongoDB', 'SQL', 'Docker', 'AWS', 'Git', 'Data Structures', 'TypeScript'
];

const SUGGESTED_INTERESTS = [
  'Web Development', 'AI', 'Data', 'Cloud', 'Security', 'Database', 'Mobile Dev'
];

const SUGGESTED_TECH = [
  'React', 'Node.js', 'Next.js', 'PyTorch', 'Docker', 'Kubernetes', 'PostgreSQL', 'Tailwind CSS'
];

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    careerGoal: '',
    experienceLevel: 'Beginner',
    skills: [],
    interests: [],
    preferredTechnologies: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newTech, setNewTech] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        careerGoal: user.careerGoal || '',
        experienceLevel: user.experienceLevel || 'Beginner',
        skills: user.skills || [],
        interests: user.interests || [],
        preferredTechnologies: user.preferredTechnologies || []
      });
    }
  }, [user]);

  // Live profile completion calculation
  const calculateLiveCompletion = () => {
    const checks = [
      Boolean(formData.name && formData.name.trim()),
      Boolean(formData.email && formData.email.trim()),
      Boolean(formData.careerGoal && formData.careerGoal.trim()),
      Boolean(formData.experienceLevel && formData.experienceLevel.trim()),
      Boolean(formData.skills && formData.skills.length > 0),
      Boolean(formData.interests && formData.interests.length > 0),
      Boolean(formData.preferredTechnologies && formData.preferredTechnologies.length > 0)
    ];
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  };

  const completionPct = calculateLiveCompletion();

  // Handlers for adding/removing array tags
  const addTag = (field, value, setter) => {
    const trimmed = value.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmed]
      }));
      setter('');
    }
  };

  const removeTag = (field, tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(t => t !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile(formData);
    setSaving(false);

    if (res.success) {
      addToast('Profile updated successfully!', 'success');
    } else {
      addToast(res.message || 'Error updating profile', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Feature 1: Student Profile Management (FR2)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Learning Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your skills and career targets updated for precision AI course recommendations.
          </p>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 shrink-0">
          <div className="relative flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - completionPct / 100)}
                strokeLinecap="round"
                className="text-indigo-600 transition-all duration-500"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-black text-xs text-slate-900">{completionPct}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion</p>
            <p className="text-xs font-semibold text-indigo-700">
              {completionPct === 100 ? 'All Fields Complete' : 'Profile in Progress'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Credentials Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Career Goal & Experience Level (FR2) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>Target Career Goal & Experience Level</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Career Goal *
              </label>
              <input
                type="text"
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                placeholder="e.g. Full Stack Web Developer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Quick select:</span>
                {COMMON_CAREER_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, careerGoal: goal })}
                    className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2 py-0.5 rounded-md transition"
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Experience Level *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                  const selected = formData.experienceLevel === level;
                  return (
                    <label
                      key={level}
                      className={`flex flex-col p-4 rounded-xl border cursor-pointer transition ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level}
                        checked={selected}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className="hidden"
                      />
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${selected ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {level}
                        </span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1">
                        {level === 'Beginner' && 'Little to no professional or coursework background'}
                        {level === 'Intermediate' && 'Comfortable with syntax and building small applications'}
                        {level === 'Advanced' && 'Deep architectural patterns and production code'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Skills, Interests, Preferred Technologies Multi-Select (FR2) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Skills, Interests & Technologies</span>
          </h2>

          {/* Current Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              My Current Skills (What you already know)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('skills', newSkill, setNewSkill))}
                placeholder="Add a skill and press Enter (e.g. JavaScript, HTML5)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => addTag('skills', newSkill, setNewSkill)}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-xs flex items-center gap-1 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-1 rounded-lg"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeTag('skills', skill)}
                    className="hover:text-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-slate-400">Suggestions:</span>
              {SUGGESTED_SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag('skills', s, setNewSkill)}
                  className="text-[10px] text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition"
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Areas of Interest
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('interests', newInterest, setNewInterest))}
                placeholder="e.g. Web Development, Cloud Computing, AI"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => addTag('interests', newInterest, setNewInterest)}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-xs flex items-center gap-1 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded-lg"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => removeTag('interests', interest)}
                    className="hover:text-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-slate-400">Suggestions:</span>
              {SUGGESTED_INTERESTS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => addTag('interests', i, setNewInterest)}
                  className="text-[10px] text-slate-500 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 px-1.5 py-0.5 rounded transition"
                >
                  +{i}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Technologies */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Preferred Technologies (Frameworks, tools, or databases you want to use)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('preferredTechnologies', newTech, setNewTech))}
                placeholder="e.g. React, Next.js, Docker, MongoDB"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => addTag('preferredTechnologies', newTech, setNewTech)}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-xs flex items-center gap-1 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.preferredTechnologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTag('preferredTechnologies', tech)}
                    className="hover:text-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-slate-400">Suggestions:</span>
              {SUGGESTED_TECH.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addTag('preferredTechnologies', t, setNewTech)}
                  className="text-[10px] text-slate-500 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-1.5 py-0.5 rounded transition"
                >
                  +{t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
