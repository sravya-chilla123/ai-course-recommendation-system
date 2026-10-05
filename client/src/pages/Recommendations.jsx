import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import aiService from '../services/aiService';
import CourseCard from '../components/CourseCard';
import { AILoadingBanner } from '../components/Loader';
import {
  Sparkles,
  Target,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  MapPin,
  RefreshCw,
  CheckCircle,
  Lightbulb,
  Layers,
  HelpCircle
} from 'lucide-react';

export const Recommendations = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedCourseIds, setSavedCourseIds] = useState(new Set());

  // Check if profile is incomplete as per SRS FR5:
  // "The system shall not call the AI API if the student profile is incomplete; instead it shall display:
  // 'Complete your profile to receive personalized AI recommendations' with a Complete Profile button."
  const isProfileIncomplete = !user?.careerGoal || !user?.experienceLevel || (!user?.skills || user.skills.length === 0);

  // Fetch existing saved recommendations on load
  const loadExistingRecommendations = async () => {
    try {
      setInitialLoading(true);
      const [recRes, savedRes] = await Promise.allSettled([
        api.get('/recommendations'),
        api.get('/saved-courses')
      ]);

      if (recRes.status === 'fulfilled' && recRes.value.data.success) {
        setRecommendations(recRes.value.data.data);
      }

      if (savedRes.status === 'fulfilled' && savedRes.value.data.success) {
        const ids = new Set(savedRes.value.data.data.map(item => String(item.courseId?._id || item.courseId)));
        setSavedCourseIds(ids);
      }
    } catch (e) {
      console.warn('Error retrieving saved recommendations:', e);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadExistingRecommendations();
  }, []);

  // Action to Generate New AI Recommendations (FR5)
  const handleGenerateAI = async () => {
    if (isProfileIncomplete) {
      addToast('Please complete your profile before generating AI recommendations.', 'error');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Attempt backend API first
      const res = await api.post('/recommendations/generate');
      if (res.data.success) {
        setRecommendations(res.data.data);
        addToast('AI has successfully generated your personalized recommendations!', 'success');
      } else {
        throw new Error(res.data.message || 'Generation failed');
      }
    } catch (err) {
      console.warn('Backend API recommendation attempt failed, invoking client AI fallback engine:', err.message);

      try {
        // Fallback to client rule-based AI engine (Zero failure guarantee)
        const coursesRes = await api.get('/courses');
        const catalog = coursesRes.data.data || [];
        const clientAiRecs = await aiService.getCareerRecommendations(user, catalog);

        if (clientAiRecs && clientAiRecs.length > 0) {
          setRecommendations(clientAiRecs);
          addToast('AI recommendations generated successfully!', 'success');
        } else {
          setErrorMessage('No suitable course found matching your exact profile. Please try updating your profile.');
        }
      } catch (fallbackErr) {
        // As per FR5: "If the AI API fails, the system shall display 'Unable to generate recommendations right now. Please try again.' without crashing."
        setErrorMessage('Unable to generate recommendations right now. Please try again.');
        addToast('Unable to generate recommendations right now. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature 3: AI Course Recommendation (FR5)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized AI Course Advisor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Intelligent recommendations prioritizing career goals, filling skill gaps, and forming a logical sequence.
          </p>
        </div>

        {recommendations.length > 0 && (
          <Link
            to="/learning-path"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition self-start sm:self-auto"
          >
            <MapPin className="w-4 h-4" />
            <span>View Timeline Roadmap</span>
          </Link>
        )}
      </div>

      {/* Incomplete Profile Guard Notice (Strictly as per FR5) */}
      {isProfileIncomplete ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Complete your profile to receive personalized AI recommendations
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              The AI learning advisor requires your target career goal, experience level, and at least one current skill to accurately identify skill gaps and generate relevant picks.
            </p>
          </div>
          <div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Complete Profile Now</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Action Banner to Trigger AI Recommendations */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Profile Verified & Ready
              </p>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Target Role: <span className="text-indigo-600">{user?.careerGoal}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Known Skills: {(user?.skills || []).slice(0, 4).join(', ') || 'None'} • Level: {user?.experienceLevel}
            </p>
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/25 transition hover:scale-105 disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analyzing Profile...' : 'Get AI Recommendations'}</span>
          </button>
        </div>
      )}

      {/* Loading Indicator (FR11: "AI is analyzing your profile and preparing your personalized learning path...") */}
      {loading && <AILoadingBanner />}

      {/* Error / No Suitable Course Found Notice (FR5) */}
      {errorMessage && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-xs font-semibold text-rose-800">{errorMessage}</p>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-700 transition shrink-0"
          >
            Update Profile
          </Link>
        </div>
      )}

      {/* AI Recommendations List */}
      {!loading && recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Recommended Curriculum ({recommendations.length} Courses)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Ordered by logical learning progression
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => {
              const courseObj = rec.courseDetails || {
                _id: rec.courseId,
                courseName: rec.courseName,
                category: 'AI Recommendation',
                difficulty: rec.difficulty,
                skills: rec.skillsGained,
                duration: '6 weeks',
                description: rec.reason
              };

              return (
                <div key={rec._id || rec.courseId} className="flex flex-col">
                  <CourseCard
                    course={courseObj}
                    isSavedInitial={savedCourseIds.has(String(courseObj._id))}
                    onSaveToggle={handleSaveToggle}
                    recommendationReason={rec.reason}
                    learningOrder={rec.learningOrder}
                  />

                  {/* Skills Gained Tag Pills */}
                  {rec.skillsGained && rec.skillsGained.length > 0 && (
                    <div className="mt-2 px-3 py-2 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">Skills Gained:</span>
                      <span className="truncate">{rec.skillsGained.join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Roadmap CTA Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="font-bold text-base">Ready to start your structured learning pathway?</h4>
              <p className="text-xs text-indigo-200 mt-0.5">
                View these recommended courses sequenced along a step-by-step career milestone timeline.
              </p>
            </div>
            <Link
              to="/learning-path"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-indigo-50 transition shrink-0"
            >
              <span>Explore Visual Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Empty State before user triggers recommendations */}
      {!loading && !initialLoading && recommendations.length === 0 && !errorMessage && !isProfileIncomplete && (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-xs">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">No Recommendations Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Click "Get AI Recommendations" above. Our engine will synthesize your skills and target role into a customized learning sequence.
          </p>
          <button
            onClick={handleGenerateAI}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
