import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, AlertCircle, Loader2, HeartPulse, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [licenseImage, setLicenseImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (role === 'doctor' && !licenseImage) {
      setError('A medical license image is required for Doctor accounts');
      setLoading(false);
      return;
    }

    try {
      let licenseUrl = null;
      if (role === 'doctor' && licenseImage) {
        const fd = new FormData();
        fd.append('image', licenseImage);
        const uploadRes = await axios.post('http://localhost:5000/api/users/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        licenseUrl = uploadRes.data.filePath;
      }
      
      await register(username, email, password, role, licenseUrl);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] border border-slate-100 overflow-hidden min-h-[800px]">
        
        {/* Left Side - Community & Trust */}
        <div className="hidden lg:flex relative bg-slate-900 flex-col justify-between p-16">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/landing/doctor.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-900/40"></div>
           
           <div className="relative z-10">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-blue-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                  <HeartPulse className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">MindEezy</span>
              </Link>
           </div>

           <div className="relative z-10 space-y-10">
              <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter italic">
                Start your Journey to <span className="text-blue-400 underline decoration-white/20 underline-offset-8">Wellness.</span>
              </h2>
              
              <div className="space-y-6">
                 {[
                   "Free initial mood assessment",
                   "Access to 50+ vetting specialists",
                   "Encrypted private journaling",
                   "24/7 emergency support access"
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-4 text-blue-100/80 font-bold">
                      <CheckCircle2 className="h-6 w-6 text-blue-400 shrink-0" />
                      <span>{text}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 italic">
              <p className="text-xs text-blue-200/50 font-bold uppercase tracking-widest leading-loose text-center">Join 10,000+ Active Users Worldwide</p>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 md:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
                <div className="mb-10">
                   <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 leading-none italic">Create Account</h1>
                   <p className="text-slate-500 font-medium">Join our ecosystem of care and clinical excellence.</p>
                </div>

                {error && (
                  <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-2xl mb-8 flex items-start animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 text-rose-600 mr-3 shrink-0" />
                    <p className="text-sm text-rose-800 font-bold leading-relaxed">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <button
                       type="button"
                       onClick={() => setRole('customer')}
                       className={`py-3 px-4 rounded-xl border-2 font-black transition-all text-xs tracking-widest uppercase flex items-center justify-center gap-2 ${role === 'customer' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-blue-50/50'}`}
                     >
                       <User className="h-4 w-4" /> Patient
                     </button>
                     <button
                       type="button"
                       onClick={() => setRole('doctor')}
                       className={`py-3 px-4 rounded-xl border-2 font-black transition-all text-xs tracking-widest uppercase flex items-center justify-center gap-2 ${role === 'doctor' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50/50'}`}
                     >
                       <ShieldCheck className="h-4 w-4" /> Doctor
                     </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Identity</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text" required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                        placeholder="Choose Username"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Communications</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="email" required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                        placeholder="Email Address"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Security</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="password" required minLength={8}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                            placeholder="Password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="password" required
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-sm"
                            placeholder="Confirm"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                    </div>
                  </div>

                  {role === 'doctor' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 ml-4">Medical License (Required)</label>
                      <div className="relative group">
                         <input
                           type="file" accept="image/*" required={role === 'doctor'}
                           onChange={(e) => setLicenseImage(e.target.files[0])}
                           className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer bg-slate-50 border border-slate-200 p-2 rounded-2xl"
                         />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-4 italic mt-1 font-medium">Please upload a clear image of your active medical license. Max 2MB.</p>
                    </div>
                  )}

                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 px-6 rounded-2xl shadow-xl shadow-blue-900/10 transition-all flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UserPlus className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" /> Create Free Account</>}
                  </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 font-medium">
                        Already have an account? {' '}
                        <Link to="/login" className="text-indigo-600 font-black hover:text-blue-600 transition-colors inline-flex items-center group ml-2">
                           Sign In Securely <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

