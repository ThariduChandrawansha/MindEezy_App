import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Heart, 
  Shield, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Users, 
  MessageCircle, 
  Zap, 
  Clock, 
  ShieldCheck,
  Video,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Loader2
} from 'lucide-react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingProfs, setLoadingProfs] = useState(true);

  useEffect(() => {
    fetchBlogs();
    fetchProfessionals();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(res.data.filter(b => b.status === 'published').slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/public/professionals');
      setProfessionals(res.data.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfs(false);
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION - High Impact */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-100/50 backdrop-blur-sm border border-blue-200 text-blue-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                <zap className="h-4 w-4 text-blue-600 animate-pulse" />
                <span>Modern Mental Healthcare Platform</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                Mindful <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800">Growth</span> starts here.
              </h1>
              
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                Experience the next generation of mental wellness. Connect with top professionals, track your daily moods, and join a community of 10,000+ growing minds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/register" className="group px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 hover:-translate-y-1">
                  Join MindEezy <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/about" className="px-10 py-5 border-2 border-slate-200 rounded-[2rem] text-slate-800 font-black text-lg hover:border-blue-600 hover:text-blue-600 transition-all text-center">
                  Explore Ecosystem
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-200/50">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-4 ring-slate-50">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black">+10k</div>
                </div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Verified Active Users
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative animate-in fade-in zoom-in duration-1000">
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="space-y-4 pt-12">
                   <img 
                    src="/images/landing/doctor.png" 
                    alt="Professional Care" 
                    className="w-full h-80 object-cover rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(37,99,235,0.2)] border-8 border-white"
                  />
                   <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100">
                      <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
                        <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                      </div>
                      <h4 className="font-black text-slate-800 tracking-tight">Emotional Support</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest leading-loose">Compassionate clinical guidance for your journey</p>
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-200">
                      <BrainCircuit className="h-10 w-10 mb-4 opacity-50" />
                      <h3 className="text-2xl font-black leading-tight mb-2 tracking-tight">AI Integrated Progress Tracking</h3>
                      <Link to="/register" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                        Learn More <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                  </div>
                  <img 
                    src="/images/landing/patient.png" 
                    alt="Mental Peace" 
                    className="w-full h-64 object-cover rounded-[3rem] shadow-2xl border-8 border-white"
                  />
                  <img 
                    src="/images/landing/abstract.png" 
                    alt="Clarity" 
                    className="w-full h-40 object-cover rounded-[3rem] shadow-xl border-8 border-white"
                  />
                </div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-[120px] -z-10 opacity-60"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] -z-10 opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION - Trust & Values */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Why MindEezy?</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Revolutionizing the way you care for your <span className="bg-blue-50 px-4 py-1 rounded-2xl text-blue-700">Mind.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: ShieldCheck, 
                color: "bg-emerald-50 text-emerald-600",
                title: 'Clinical Security', 
                desc: 'End-to-end encryption for every session. Your personal records and journal entries are accessible only by you and your approved specialist.' 
              },
              { 
                icon: Users, 
                color: "bg-indigo-50 text-indigo-600",
                title: 'Diverse Expertise', 
                desc: 'From child psychology to career counseling, search through our network of vetted professionals across multiple clinical categories.' 
              },
              { 
                icon: Video, 
                color: "bg-blue-50 text-blue-600",
                title: 'Virtual Consultations', 
                desc: 'High-definition video consultations with built-in interactive tools, allowing you to connect regardless of your physical location.' 
              },
            ].map((item, idx) => (
              <div key={idx} className="group p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500">
                <div className={`h-16 w-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROFESSIONALS CAROUSEL - Dynamic */}
      <section className="py-32 bg-slate-900 text-white rounded-[4rem] mx-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Match with Clinical Experts</h2>
               <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Your partner in <span className="text-blue-500 underline decoration-indigo-500 decoration-8 underline-offset-8">Healing.</span></h3>
            </div>
            <Link to="/professionals" className="flex items-center gap-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all backdrop-blur-md">
              Browse All Doctors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative group/carousel">
             <div className="flex overflow-x-auto gap-8 pb-12 custom-scrollbar-hide snap-x no-scrollbar">
                {loadingProfs ? (
                   <div className="w-full flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>
                ) : professionals.map((prof) => (
                  <Link to={`/professionals/${prof.id}`} key={prof.id} className="min-w-[320px] md:min-w-[400px] snap-center bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-500 group flex flex-col h-full">
                     <div className="h-64 relative overflow-hidden">
                        {prof.profile_pic_path ? (
                           <img src={`http://localhost:5000${prof.profile_pic_path}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={prof.username} />
                        ) : (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Users className="h-16 w-16 text-slate-700" /></div>
                        )}
                        <div className="absolute top-6 left-6">
                           <span className="px-4 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                              {prof.category || 'Specialist'}
                           </span>
                        </div>
                     </div>
                     <div className="p-10 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors">Dr. {prof.username}</h4>
                           <div className="flex items-center gap-1.5 text-amber-400">
                             <Star className="h-4 w-4 fill-amber-400" />
                             <span className="font-black text-sm">{prof.avg_rating ? Number(prof.avg_rating).toFixed(1) : '5.0'}</span>
                           </div>
                        </div>
                        <p className="text-slate-400 font-medium text-sm line-clamp-3 mb-8 leading-relaxed">
                           {prof.bio || "Bringing years of clinical experience to help you find clarity and peace."}
                        </p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                           <span className="text-xs font-black uppercase tracking-widest text-blue-400">{prof.experience_years || '5+'} Years Exp.</span>
                           <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all">
                              <ChevronRight className="h-5 w-5" />
                           </div>
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
             
             {/* Navigation Overlay */}
             <div className="absolute top-1/2 -left-4 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                <button className="h-12 w-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-900"><ChevronLeft className="h-6 w-6" /></button>
             </div>
             <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                <button className="h-12 w-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-900"><ChevronRight className="h-6 w-6" /></button>
             </div>
          </div>
        </div>
      </section>

      {/* 4. BLOGS CAROUSEL - Expertise */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-20">
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 italic">Research & Insights</h2>
               <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter max-w-2xl">Discover clinical wisdom from our <span className="text-indigo-600">Thought Leaders.</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {loadingBlogs ? (
                  <div className="col-span-3 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>
               ) : blogs.map((blog) => (
                  <Link to={`/blogs/${blog.id}`} key={blog.id} className="group flex flex-col bg-white border border-slate-100 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 hover:-translate-y-2">
                     <div className="h-64 relative overflow-hidden overflow-hidden">
                        {blog.image_path_1 ? (
                           <img src={`http://localhost:5000${blog.image_path_1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                        ) : (
                           <div className="w-full h-full bg-slate-50 flex items-center justify-center"><BookOpen className="h-12 w-12 text-slate-200" /></div>
                        )}
                        <div className="absolute top-6 left-6">
                           <span className="px-5 py-2 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                              {blog.category_name || 'Insights'}
                           </span>
                        </div>
                     </div>
                     <div className="p-10 flex flex-col flex-grow">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-3">
                           <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
                           <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                           <span>By {blog.author_name}</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors mb-6 line-clamp-2 italic">
                           {blog.title}
                        </h4>
                        <div className="mt-auto flex items-center gap-3 text-indigo-600 font-bold text-xs uppercase tracking-widest group-hover:gap-5 transition-all">
                           Read Full Insight <ArrowRight className="h-4 w-4" />
                        </div>
                     </div>
                  </Link>
               ))}
            </div>

            <div className="mt-20 text-center">
               <Link to="/blogs" className="inline-flex items-center gap-4 bg-slate-50 border border-slate-200 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-slate-600 hover:bg-white hover:border-indigo-600 hover:text-indigo-600 hover:shadow-xl transition-all">
                  Access Knowledge Library <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
         </div>
      </section>

      {/* 5. CONTACT & REGISTER CTA */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[5rem] p-12 md:p-32 text-center text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
               <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                  <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-10 group-hover:rotate-[360deg] transition-transform duration-1000">
                     <Heart className="h-10 w-10 text-white fill-white" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter italic">Transform your Mental Equilibrium.</h2>
                  <p className="text-xl text-blue-100 font-medium mb-12 max-w-2xl leading-relaxed">
                     Join MindEezy today and start your journey with a community that prioritizes your peace of mind over everything else.
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                     <Link to="/register" className="px-12 py-6 bg-white text-indigo-700 rounded-[2.5rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.3)]">
                        Register Securely
                     </Link>
                     <Link to="/contact" className="px-10 py-6 border-2 border-white/30 hover:border-white rounded-[2.5rem] font-black text-xl hover:bg-white/10 transition-all">
                        Talk to Support
                     </Link>
                  </div>
                  
                  <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
                     {[
                       { icon: Shield, val: "256-bit", label: "Encryption" },
                       { icon: Clock, val: "24/7", label: "Global Reach" },
                       { icon: CheckCircle2, val: "100%", label: "Verified Drs" },
                       { icon: MessageCircle, val: "50k", label: "Messages" }
                     ].map((s, i) => (
                       <div key={i} className="flex flex-col items-center">
                          <s.icon className="h-5 w-5 mb-2 opacity-50" />
                          <span className="text-xl font-black tracking-tight">{s.val}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{s.label}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Design Background */}
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] shrink-0"></div>
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2"></div>
            </div>
         </div>
         
         <div className="absolute -z-10 bottom-0 left-0 w-full h-64 bg-slate-900"></div>
      </section>

    </div>
  );
};

export default Home;

