import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import aiService from '../services/aiService';
import Loader from '../components/Loader';
import {
  MapPin,
  Route,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlayCircle,
  ExternalLink,
  Target,
  BrainCircuit,
  Award,
  Layers,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const LearningPath = () => {
  const { user } = useAuth();
  const [learningSteps, setLearningSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'cards'

  // Readiness evaluation state
  const [readinessData, setReadinessData] = useState(null);
  const [analyzingReadiness, setAnalyzingReadiness] = useState(false);

  // Mentor question state
  const [mentorQuestion, setMentorQuestion] = useState('');
  const [mentorAnswer, setMentorAnswer] = useState(null);
  const [askingMentor, setAskingMentor] = useState(false);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recommendations');
        if (res.data.success && res.data.data.length > 0) {
          // Sort by learningOrder
          const sorted = [...res.data.data].sort((a, b) => a.learningOrder - b.learningOrder);
          setLearningSteps(sorted);
        }
      } catch (err) {
        console.error('Error fetching learning path:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  const handleAnalyzeReadiness = async () => {
    setAnalyzingReadiness(true);
    try {
      const data = await aiService.analyzeReadiness(
        user?.skills || [],
        user?.careerGoal || 'Full Stack Web Developer'
      );
      setReadinessData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingReadiness(false);
    }
  };

  const handleAskMentor = async (e) => {
    e.preventDefault();
    if (!mentorQuestion.trim()) return;

    setAskingMentor(true);
    try {
      const response = await aiService.answerMentorQuestion(mentorQuestion, user);
      setMentorAnswer(response);
    } catch (e) {
      console.error(e);
    } finally {
      setAskingMentor(false);
    }
  };

  const getDifficultyBadge = (diff) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <Route className="w-3.5 h-3.5" />
            <span>Feature 4: Personalized Learning Path (FR6)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Target Career Learning Pathway
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ordered roadmap from your existing skills to becoming a{' '}
            <span className="font-bold text-indigo-600">{user?.careerGoal || 'Software Professional'}</span>.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'timeline' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'cards' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Connected Cards
          </button>
        </div>
      </div>

      {loading ? (
        <Loader message="Synthesizing personalized learning path..." />
      ) : learningSteps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-xs">
          <MapPin className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">No Learning Path Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Your learning path is constructed automatically when you run the AI recommender. Complete your profile and trigger the AI analysis to view your roadmap.
          </p>
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Learning Path</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Visual Roadmap: Timeline View */}
          {viewMode === 'timeline' ? (
            <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-indigo-600 before:via-purple-600 before:to-emerald-500">
              {learningSteps.map((step, idx) => {
                const c = step.courseDetails || {};
                return (
                  <div key={step._id || idx} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div className="absolute -left-6 sm:-left-10 top-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-4 border-indigo-600 text-indigo-700 flex items-center justify-center font-black text-xs shadow-md group-hover:scale-110 transition-transform">
                      {step.learningOrder || idx + 1}
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-lg transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Step {step.learningOrder || idx + 1}
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(step.difficulty || c.difficulty)}`}>
                              {step.difficulty || c.difficulty || 'Intermediate'}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{c.duration || '6-8 weeks'}</span>
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {step.courseName || c.courseName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to={`/courses/${step.courseId || c._id}`}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition"
                          >
                            <span>Course Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          {c.courseLink && (
                            <a
                              href={c.courseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition border border-slate-200"
                              title="Start on Platform"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* AI Reason for position in learning sequence */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-indigo-700 mr-1">Path Progression Logic:</span>
                        {step.reason}
                      </div>

                      {/* Skills Gained in this Step */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-500">Skills Acquired:</span>
                        {(step.skillsGained || c.skills || []).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-md"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Connected Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {learningSteps.map((step, idx) => {
                const c = step.courseDetails || {};
                return (
                  <div
                    key={step._id || idx}
                    className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          #{step.learningOrder || idx + 1}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(step.difficulty || c.difficulty)}`}>
                          {step.difficulty || c.difficulty}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base mb-2">
                        {step.courseName || c.courseName}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {step.reason}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">{c.duration || '6 weeks'}</span>
                      <Link
                        to={`/courses/${step.courseId || c._id}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                      >
                        <span>Start Milestone</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Skill Gap & Job Readiness Analyzer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Target Role Skill Gap & Employability Readiness
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluate your current profile readiness against current industry standards for {user?.careerGoal || 'Software Engineer'}.
                </p>
              </div>

              <button
                onClick={handleAnalyzeReadiness}
                disabled={analyzingReadiness}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition self-start sm:self-auto disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{analyzingReadiness ? 'Analyzing...' : 'Run Readiness Audit'}</span>
              </button>
            </div>

            {readinessData && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Overall Match Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-indigo-600">{readinessData.matchScore}%</span>
                      <span className="text-xs font-bold text-slate-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                        {readinessData.rating}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Immediate Priority
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mt-1 max-w-sm">
                      {readinessData.suggestedNextAction}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Matched Industry Competencies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {readinessData.matchedSkills.length > 0 ? (
                        readinessData.matchedSkills.map(s => (
                          <span key={s} className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Add more skills to your profile.</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-rose-700 mb-2 flex items-center gap-1.5">
                      <Target className="w-4 h-4" /> Identified Skill Gaps to Close
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {readinessData.missingSkills.length > 0 ? (
                        readinessData.missingSkills.map(s => (
                          <span key={s} className="text-xs font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold">Zero critical gaps found!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Advisor Guidance Query Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Ask PathPilot AI Learning Advisor
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Get targeted coaching on how to navigate technical hurdles, prepare for technical interviews, or choose your next elective.
            </p>

            <form onSubmit={handleAskMentor} className="flex gap-2">
              <input
                type="text"
                value={mentorQuestion}
                onChange={(e) => setMentorQuestion(e.target.value)}
                placeholder="e.g. How should I pace my roadmap to prepare for internship season?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
              <button
                type="submit"
                disabled={askingMentor}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0 disabled:opacity-50"
              >
                {askingMentor ? 'Thinking...' : 'Ask AI'}
              </button>
            </form>

            {mentorAnswer && (
              <div className="p-4 bg-white rounded-2xl border border-indigo-200 text-xs text-slate-800 space-y-2 animate-fade-in shadow-xs">
                <p className="font-semibold leading-relaxed whitespace-pre-line">
                  {mentorAnswer.answer}
                </p>
                {mentorAnswer.suggestedTopics && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">Related Pathways:</span>
                    {mentorAnswer.suggestedTopics.map(t => (
                      <span key={t} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPath;
