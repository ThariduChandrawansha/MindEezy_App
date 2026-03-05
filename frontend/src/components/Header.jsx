import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-50 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 tracking-tight">
            MindEezy
          </span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-12 text-slate-500 font-semibold tracking-wide">
          <Link to="/" className="hover:text-blue-600 transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/blogs" className="hover:text-blue-600 transition-colors relative group">
            Blogs
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/professionals" className="hover:text-blue-600 transition-colors relative group">
            Professionals
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/emergency" className="text-rose-600 font-bold hover:text-rose-700 transition-colors relative group flex items-center">
            Emergency
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6 pl-6 border-l border-slate-100 italic">
              <Link 
                to={user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor' : '/profile'}
                className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all group not-italic"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white group-hover:scale-110 transition-transform">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-700 font-bold text-sm leading-none group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.username}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role}</span>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 not-italic"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-6 py-2.5 text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-all">
                Login
              </Link>
              <Link to="/register" className="px-7 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
