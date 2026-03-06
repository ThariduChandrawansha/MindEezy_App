import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Mail, Lock, LogIn, AlertCircle, Loader2, ArrowRight, HeartPulse, CheckCircle2, Send } from 'lucide-react';

const Login = () => {
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isForgotMode) {
        const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
        setSuccess(res.data.message);
      } else {
        const user = await login(email, password);
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] border border-slate-100 overflow-hidden min-h-[700px]">
        
        {/* Left Side - Visual & Branding */}
        <div className="hidden lg:flex relative bg-slate-900 flex-col justify-between p-16">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/landing/abstract.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40"></div>
           
           <div className="relative z-10">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-blue-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                  <HeartPulse className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">MindEezy</span>
              </Link>
           </div>

           <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter italic">
                {isForgotMode ? "Secure Access Recovery." : "Reclaim your Equilibrium."}
              </h2>
              <p className="text-blue-100/70 font-medium text-lg leading-relaxed max-w-sm">
                {isForgotMode 
                  ? "Enter your registered email and we'll help you regain access to your clinical ecosystem."
                  : "Log in to access your clinical dashboard, view session history, and track your daily emotional growth."}
              </p>
           </div>

           <div className="relative z-10 flex items-center gap-4 pt-8 border-t border-white/10 italic">
              <p className="text-sm text-blue-200/50 font-medium tracking-wide">Secure HIPAA-compliant Infrastructure</p>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 md:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
                <div className="mb-12">
                   <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                      {isForgotMode ? "Access Recovery" : "Welcome Back"}
                   </h1>
                   <p className="text-slate-500 font-medium">
                      {isForgotMode ? "Verify your identity to proceed." : "Continue your journey with our network of professionals."}
                   </p>
                </div>

                {error && (
                  <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-2xl mb-8 flex items-start animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 text-rose-600 mr-3 shrink-0" />
                    <p className="text-sm text-rose-800 font-bold leading-relaxed">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-2xl mb-8 flex items-start animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
                    <p className="text-sm text-emerald-800 font-bold leading-relaxed">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Credentials</label>
                    <div className="space-y-4">
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="email" required
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                            placeholder="Email Address"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        {!isForgotMode && (
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                              type="password" required
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                              placeholder="••••••••"
                              value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {!isForgotMode && (
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded-lg border-slate-200" />
                        <span className="text-slate-500 font-bold text-xs uppercase tracking-widest group-hover:text-slate-800 transition-colors">Remember Session</span>
                      </label>
                    )}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsForgotMode(!isForgotMode);
                        setError('');
                        setSuccess('');
                      }}
                      className="text-blue-600 font-black text-xs uppercase tracking-widest hover:text-indigo-700 transition-colors ml-auto"
                    >
                      {isForgotMode ? "Back to Login" : "Forgot Access?"}
                    </button>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 px-6 rounded-2xl shadow-xl shadow-blue-900/10 transition-all flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                      isForgotMode 
                        ? <><Send className="mr-3 h-5 w-5" /> Send Request</> 
                        : <><LogIn className="mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Enter MindEezy</>
                    )}
                  </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 font-medium">
                        New to the ecosystem? {' '}
                        <Link to="/register" className="text-indigo-600 font-black hover:text-blue-600 transition-colors inline-flex items-center group ml-2">
                           Create Free Account <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

