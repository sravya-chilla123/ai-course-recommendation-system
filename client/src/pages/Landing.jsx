import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Target,
  Route,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  BookOpen,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-200/40 via-purple-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Career & Course Recommendation System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Find the Perfect Online Courses & Master Your{' '}
          <span className="gradient-text">Career Learning Path</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Stop getting lost in thousands of disconnected courses. PathPilot analyzes your unique skills, experience level, and career aspirations to generate structured, personalized learning journeys.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-xs transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-panel p-4 rounded-xl shadow-xs border border-slate-200">
            <p className="text-2xl font-black text-indigo-600">100%</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Free Tier & Open</p>
            <p className="text-xs text-slate-600 mt-1">Zero paywalls or API billing constraints</p>
          </div>
          <div className="glass-panel p-4 rounded-xl shadow-xs border border-slate-200">
            <p className="text-2xl font-black text-emerald-600">7 Domains</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Curated Catalog</p>
            <p className="text-xs text-slate-600 mt-1">Web, AI, Cloud, Data, Security & more</p>
          </div>
          <div className="glass-panel p-4 rounded-xl shadow-xs border border-slate-200">
            <p className="text-2xl font-black text-purple-600">Contextual</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reasoned AI</p>
            <p className="text-xs text-slate-600 mt-1">Clear explanations for every course pick</p>
          </div>
          <div className="glass-panel p-4 rounded-xl shadow-xs border border-slate-200">
            <p className="text-2xl font-black text-amber-600">Stepwise</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visual Roadmap</p>
            <p className="text-xs text-slate-600 mt-1">From beginner fundamentals to mastery</p>
          </div>
        </div>
      </section>

      {/* How It Works Section (3 steps as per SRS IR1) */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-2">
              Workflow Overview
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How PathPilot Works in 3 Simple Steps
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              A guided system tailored directly to college students seeking structured employability skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg mb-6">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Build Your Student Profile</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Define your current programming skills, areas of interest, target career role, and experience level (Beginner, Intermediate, or Advanced).
              </p>
              <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-time completion percentage tracking</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-black text-lg mb-6">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Receive AI Recommendations</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Our intelligence engine matches your profile against verified courses, prioritizing your career goals, closing skill gaps, and providing transparent reasoning.
              </p>
              <div className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                <BrainCircuit className="w-4 h-4 text-purple-500" />
                <span>Zero redundant beginner courses</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-lg mb-6">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Track & Follow Your Roadmap</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Visualize your ordered roadmap in a clear timeline. Bookmark courses, update completion percentages (0%, 25%, 50%, 75%, 100%), and monitor analytics.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Interactive progress charts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-2">
            Engineered as per SRS v1.0
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Features Built for Student Success
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Career Goal Alignment</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every course recommendation is directly scored against your dream job title, ensuring zero wasted time on tangential subjects.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Route className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Visual Learning Timeline</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connected card roadmap displaying foundational prerequisites through advanced mastery in a logically sequenced flow.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Multi-Filter Course Catalog</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant search across titles, technologies, and 7 categories with difficulty filters (Beginner, Intermediate, Advanced).
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Real-time Progress Tracker</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Update course states from Not Started to In Progress and Completed with 0-100% granular milestones.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Role-Based Admin Catalog Control</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Admins can manage the entire curriculum database: add new courses, modify durations, remove outdated entries, and view metrics.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Privacy & Local Resilience</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Passwords hashed securely with bcrypt. Dual database engine guarantees 100% uptime with zero external paid dependencies.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-center shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black mb-3">
            Ready to Accelerate Your Tech Career?
          </h3>
          <p className="text-indigo-200 text-sm max-w-xl mx-auto mb-6">
            Join PathPilot today. Complete your profile in under 2 minutes and unlock your personalized roadmap.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-indigo-900 font-extrabold text-sm hover:bg-indigo-50 shadow-md transition hover:scale-105"
          >
            <span>{isAuthenticated ? 'Open Dashboard' : 'Create Free Student Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
