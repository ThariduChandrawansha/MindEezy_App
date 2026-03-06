import React from 'react';
import { ShieldCheck, HeartPulse, Brain, Zap, CheckCircle2, Star, Target, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-100/50 backdrop-blur-sm border border-blue-200 text-blue-700 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-sm">
            <Target className="h-4 w-4 text-blue-600" />
            <span>Our Shared Vision</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            Redefining mental care for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800">Mind.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">
            "MindEezy was born from a simple belief: professional mental healthcare should be as immediate as a thought and as comforting as a conversation."
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[140px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[140px] -z-10 opacity-60"></div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group-hover:-translate-y-4 transition-transform duration-700">
                <img 
                  src="/images/landing/doctor.png" 
                  alt="Clinical Excellence" 
                  className="w-full h-[600px] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-900 rounded-[3rem] p-8 text-white z-20 shadow-2xl flex flex-col justify-center gap-4">
                 <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white fill-white" />
                 </div>
                 <h4 className="text-2xl font-black tracking-tighter">100% Verified Specialists</h4>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-slate-100 rounded-[3rem] scale-110 -z-10 group-hover:scale-125 transition-transform duration-1000"></div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">The Philosophy</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Why MindEezy is <span className="text-blue-600">Different.</span></h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  We don't just provide a directory; we provide a clinical ecosystem designed for long-term emotional sustainability.
                </p>
              </div>

              <div className="grid gap-8">
                {[
                  { 
                    icon: Brain, 
                    title: "Clinical Equilibrium", 
                    desc: "Our platform uses AI-assisted sentiment analysis to help you track emotional patterns over time.",
                    clr: "bg-blue-50 text-blue-600"
                  },
                  { 
                    icon: ShieldCheck, 
                    title: "Medical Privacy Standard", 
                    desc: "Bank-level encryption ensures your session data and journals remain strictly between you and your doctor.",
                    clr: "bg-emerald-50 text-emerald-600"
                  },
                  { 
                    icon: Users, 
                    title: "Community Synergy", 
                    desc: "Access our vast library of peer-reviewed articles and join moderated wellness forums.",
                    clr: "bg-indigo-50 text-indigo-600"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className={`h-14 w-14 shrink-0 shadow-sm rounded-2xl flex items-center justify-center ${item.clr} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="pt-2">
                       <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{item.title}</h4>
                       <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Impact */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-12">
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight italic">
                 "Our mission is to bring clinical emotional care to your <span className="text-blue-500 underline decoration-indigo-500 decoration-8 underline-offset-8">fingertips.</span>"
               </h2>
               <div className="flex flex-col items-center">
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mb-6"></div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">MindEezy Leadership Team</p>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-[120px]"></div>
      </section>

      {/* CTA section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-slate-50 rounded-[4rem] p-16 md:p-32 flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="space-y-6 max-w-xl">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Join the next <span className="bg-indigo-100 px-4 py-1 rounded-2xl text-indigo-700 italic">Evolution</span> of Therapy.</h3>
              <p className="text-xl text-slate-500 font-medium">Be part of the 10,000+ people who are reclaiming their peace of mind through MindEezy.</p>
            </div>
            <Link to="/register" className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center shadow-2xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 group">
              Start Your Journey <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

