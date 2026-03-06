import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCog, Activity, Settings, Filter, Download, Plus, Banknote, Landmark, PieChart, TrendingUp, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import BlogManagement from './BlogManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [revenue, setRevenue] = useState({ total_revenue: 0, total_sales: 0, total_paid_appointments: 0 });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const revRes = await axios.get('http://localhost:5000/api/payments/admin/revenue');
      setRevenue(revRes.data);
      const withRes = await axios.get('http://localhost:5000/api/payments/admin/withdrawals');
      setWithdrawals(withRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/admin/withdrawals/${id}`, { status });
      fetchData(); // Refresh list and counters
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">System Administration</h1>
          <p className="text-slate-500">Welcome, {user?.username}. System health is optimal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-[32px] shadow-xl shadow-emerald-100 text-white">
          <PieChart className="h-8 w-8 mb-4 opacity-80" />
          <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Platform Revenue (20%)</p>
          <h3 className="text-3xl font-black mt-1">LKR {Number(revenue.total_revenue || 0).toLocaleString()}</h3>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-bold">
            <span className="uppercase tracking-widest opacity-70">Total System Fees</span>
            <span className="bg-white/20 px-2 py-0.5 rounded uppercase">LIVE</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <TrendingUp className="h-8 w-8 mb-4 text-blue-500" />
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Gross Booking Volume</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">LKR {Number(revenue.total_sales || 0).toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-blue-600 text-[10px] font-black uppercase tracking-widest">
            <Activity className="h-3 w-3 mr-1" />
            <span>Total Sales</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <Banknote className="h-8 w-8 mb-4 text-indigo-500" />
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Paid Consultations</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{revenue.total_paid_appointments || 0}</h3>
          <div className="mt-4 flex items-center text-indigo-600 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            <span>Completed Payments</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <ShieldCheck className="h-8 w-8 mb-4 text-emerald-500" />
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Withdrawal Requests</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{withdrawals.filter(w => w.status === 'pending').length}</h3>
          <div className="mt-4 flex items-center text-rose-500 text-[10px] font-black uppercase tracking-widest">
            <Clock className="h-3 w-3 mr-1" />
            <span>Awaiting Review</span>
          </div>
        </div>
      </div>

  

      {/* Withdrawal Management Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm flex items-center gap-3">
              <Landmark className="h-5 w-5 text-indigo-500" /> Doctor Withdrawal Requests
           </h3>
           <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-widest">
              Action Required
           </span>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Requesting Doctor</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {withdrawals.length === 0 ? (
                    <tr>
                       <td colSpan="4" className="px-8 py-10 text-center font-bold text-slate-400">No withdrawal requests found.</td>
                    </tr>
                 ) : (
                    withdrawals.map((w, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                             <div className="font-bold text-slate-800">{w.doctor_name}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #DW-{w.id}</div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="font-black text-slate-800">LKR {Number(w.amount).toLocaleString()}</div>
                          </td>
                          <td className="px-8 py-5">
                             <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                w.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                w.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                             }`}>
                                {w.status}
                             </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             {w.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                   <button 
                                      onClick={() => handleWithdrawalStatus(w.id, 'approved')}
                                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all font-inter"
                                   >
                                      Approve
                                   </button>
                                   <button 
                                      onClick={() => handleWithdrawalStatus(w.id, 'rejected')}
                                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-inter"
                                   >
                                      Reject
                                   </button>
                                </div>
                             )}
                          </td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </div>


    </div>
  );
};

export default AdminDashboard;
