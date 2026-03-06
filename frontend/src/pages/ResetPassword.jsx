import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle, AlertCircle, Loader2, ArrowRight, HeartPulse } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                token,
                newPassword: password
            });
            setStatus({ type: 'success', message: res.data.message });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || 'Failed to reset password. The link may have expired.' 
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100 text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Invalid Recovery Link</h2>
                    <p className="text-slate-500 font-medium mb-8">This password reset link is missing or malformed. Please request a new one.</p>
                    <Link to="/login" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] border border-slate-100 p-12">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-200">
                        <HeartPulse className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 italic">New Security Access</h1>
                    <p className="text-slate-500 font-medium">Create a strong, unique password for your MindEezy account.</p>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-2xl mb-8 flex items-start animate-in fade-in slide-in-from-top-2 border-l-4 ${
                        status.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'
                    }`}>
                        {status.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3 shrink-0" /> : <AlertCircle className="h-5 w-5 mr-3 shrink-0" />}
                        <p className="text-sm font-bold leading-relaxed">{status.message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="password" required minLength={8}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                                placeholder="New Password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="password" required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                                placeholder="Confirm New Password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading || status.type === 'success'}
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 px-6 rounded-2xl shadow-xl shadow-blue-900/10 transition-all flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Update & Secure <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center justify-center group">
                        Return to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
