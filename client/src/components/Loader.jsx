import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        <Sparkles className="w-6 h-6 text-indigo-600 absolute animate-pulse" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-800">{message}</p>
        <p className="text-xs text-slate-500">PathPilot Intelligence Engine</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6 border border-slate-100 max-w-sm w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export const AILoadingBanner = ({ message = "AI is analyzing your profile and preparing your personalized learning path..." }) => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/30 rounded-2xl p-6 text-center shadow-glass flex flex-col items-center justify-center gap-4 my-6 animate-pulse-glow">
      <div className="relative">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <Sparkles className="w-5 h-5 text-purple-600 absolute -top-1 -right-1" />
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-900">{message}</h4>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          Synthesizing your career goals, existing skill stack, and logical learning sequences...
        </p>
      </div>
    </div>
  );
};

export default Loader;
