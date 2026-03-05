import React from 'react';
import { ShieldCheck, HeartPulse, Brain, Zap, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <HeartPulse className="h-20 w-20 text-blue-600 mx-auto animate-pulse" />
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight leading-tight">
          Redefining mental health care for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">modern world.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          MindEezy is a platform dedicated to breaking down barriers. We connect you with top-tier emotional wellness professionals instantly, securely, and seamlessly.
        </p>
      </section>

      {/* Stats/Image Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white bg-slate-100 relative h-[500px]">
           {/* Abstract aesthetic placeholder for an image */}
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-400"></div>
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] mix-blend-overlay bg-cover bg-center opacity-60"></div>
           <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-white">
              <h3 className="text-2xl font-black tracking-tight mb-2">Our Mission</h3>
              <p className="font-medium text-blue-50">To provide accessible, premium, and confidential mental health support globally.</p>
           </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight border-l-8 border-blue-600 pl-6">
            Why choose MindEezy?
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
               <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm shrink-0"><Brain className="h-6 w-6" /></div>
               <div>
                 <h4 className="text-xl font-bold text-slate-800 mb-1">Clinical Excellence</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">All our professionals are heavily vetted, licensed, and specialized in various therapeutic methodologies.</p>
               </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 shadow-sm shrink-0"><ShieldCheck className="h-6 w-6" /></div>
               <div>
                 <h4 className="text-xl font-bold text-slate-800 mb-1">Absolute Privacy</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">Your data, journals, and sessions are protected with bank-level encryption. Your privacy is our priority.</p>
               </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 shadow-sm shrink-0"><Zap className="h-6 w-6" /></div>
               <div>
                 <h4 className="text-xl font-bold text-slate-800 mb-1">Instant Access</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">No more waiting lists. Connect with a specialist and book a session in under 3 minutes.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 opacity-20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <Star className="h-12 w-12 text-amber-400 mx-auto" fill="currentColor" />
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Ready to begin your journey?</h2>
          <p className="text-xl font-medium text-slate-400">Join thousands of others who have taken the first step towards a healthier state of mind.</p>
          <div className="pt-8">
            <Link to="/register" className="inline-block px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all uppercase tracking-widest text-sm hover:-translate-y-1">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
