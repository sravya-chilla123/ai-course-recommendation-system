import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  BookOpen,
  Sparkles,
  MapPin,
  Bookmark,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Layers },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'AI Recommender', path: '/recommendations', icon: Sparkles, badge: 'AI' },
    { name: 'Learning Path', path: '/learning-path', icon: MapPin },
    { name: 'Saved & Progress', path: '/saved-courses', icon: Bookmark },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  PathPilot
                </span>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block -mt-0.5">
                Course Guidance MVP
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/admin')
                      ? 'bg-purple-100 text-purple-900 font-semibold'
                      : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>
          )}

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Profile Completion Indicator */}
                <Link
                  to="/profile"
                  title="View / Edit Profile"
                  className="hidden lg:flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-700 transition"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Profile:</span>
                  <span className="font-bold text-indigo-700">
                    {user?.profileCompletion ?? 0}%
                  </span>
                </Link>

                {/* User avatar & details */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left text-xs leading-none">
                    <p className="font-semibold text-slate-800">{user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-all hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs"
              >
                {user?.name?.charAt(0) || 'U'}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="p-3 bg-indigo-50/70 rounded-xl flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded-full border border-indigo-200">
                  {user?.profileCompletion ?? 0}% Done
                </span>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-indigo-600" />
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-purple-800 bg-purple-50"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span>Admin Course Management</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <User className="w-5 h-5 text-slate-500" />
                <span>My Student Profile</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
