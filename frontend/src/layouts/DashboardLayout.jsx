import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Bell,
  FolderTree,
  FileText
} from 'lucide-react';

import MentalHealthChat from '../components/MentalHealthChat';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const doctorLinks = [
    { name: 'Overview', path: '/doctor', icon: LayoutDashboard },
    { name: 'Patients', path: '/doctor/patients', icon: Users },
    { name: 'Schedule', path: '/doctor/schedule', icon: Calendar },
    { name: 'Settings', path: '/doctor/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Control Panel', path: '/admin', icon: ShieldCheck },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Blog Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Blog Posts', path: '/admin/blogs', icon: FileText },
    { name: 'System Health', path: '/admin/system', icon: Settings },
  ];

  const links = user?.role === 'admin' ? adminLinks : doctorLinks;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-30`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-blue-600 p-2 rounded-xl shrink-0 shadow-lg shadow-blue-500/20">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black text-white tracking-tight animate-in fade-in slide-in-from-left-2">
                MindEezy
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <link.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-blue-400'}`} />
                {isSidebarOpen && <span className="font-semibold">{link.name}</span>}
                {isActive && isSidebarOpen && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`p-4 rounded-2xl bg-slate-800/50 flex items-center ${isSidebarOpen ? 'space-x-4' : 'justify-center'}`}>
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">{user?.username}</p>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">{user?.role}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full mt-4 flex items-center ${isSidebarOpen ? 'space-x-4 px-4 py-3' : 'justify-center py-4'} rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all font-semibold`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top bar for dashboard */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-20">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center space-x-6">
            <button className="relative p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100 italic">
               <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`} alt="Avatar" />
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          {children}
        </main>
      </div>
      <MentalHealthChat />
    </div>
  );
};

export default DashboardLayout;
