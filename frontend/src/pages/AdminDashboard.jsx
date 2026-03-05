import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCog, Activity, Settings, Filter, Download, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">System Administration</h1>
          <p className="text-slate-500">Welcome, {user?.username}. System health is optimal.</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">
            <Download className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <ShieldCheck className="h-8 w-8 mb-4 opacity-80" />
          <p className="text-blue-100 text-sm font-medium">System Security</p>
          <h3 className="text-3xl font-bold mt-1">Level 4</h3>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
            <span>Last Audit: Today 04:20 AM</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">Secure</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <UserCog className="h-8 w-8 mb-4 text-slate-400" />
          <p className="text-slate-500 text-sm font-medium">Total Active Users</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">1,284</h3>
          <div className="mt-4 flex items-center text-emerald-600 text-sm font-semibold">
            <Activity className="h-4 w-4 mr-1" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <Settings className="h-8 w-8 mb-4 text-slate-400" />
          <p className="text-slate-500 text-sm font-medium">API Health Status</p>
          <h3 className="text-3xl font-bold text-emerald-500 mt-1">99.9%</h3>
          <div className="mt-4 flex items-center text-slate-400 text-sm">
            <span>Server: aws-east-1</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">User Management</h3>
          <div className="flex space-x-2">
            <button className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex items-center">
              <Filter className="h-3 w-3 mr-2" /> Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              {[
                { name: 'Alice Johnson', email: 'alice@example.com', role: 'doctor', status: 'Active' },
                { name: 'Bob Smith', email: 'bob@example.com', role: 'customer', status: 'Inactive' },
                { name: 'Charlie Davis', email: 'charlie@example.com', role: 'doctor', status: 'Active' },
              ].map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-slate-800 not-italic">{u.name}</div>
                      <div className="text-xs text-slate-500 not-italic">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase not-italic ${u.role === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`h-2 w-2 rounded-full inline-block mr-2 ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className="text-sm text-slate-700 not-italic">{u.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right not-italic">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold mr-4">Edit</button>
                    <button className="text-rose-600 hover:text-rose-800 font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
