import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Compass, Lock, Mail, ArrowRight, AlertCircle, Shield, User } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      addToast(`Welcome back, ${result.user.name}!`, 'success');
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.message);
      addToast(result.message, 'error');
    }
  };

  // Demo Login Helpers for Instant Evaluation
  const fillStudentDemo = () => {
    setEmail('student@pathpilot.com');
    setPassword('student123');
    setError('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@pathpilot.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-600/30">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to continue your personalized learning journey
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
            Instant Demo Credentials (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillStudentDemo}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@pathpilot.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
