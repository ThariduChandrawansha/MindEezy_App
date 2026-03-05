import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Star, CheckCircle2, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
            <Star className="h-4 w-4 fill-blue-700" />
            <span>Trusted by 10,000+ users worldwide</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 leading-[1.1]">
            Your Mental <span className="text-blue-600">Well-being</span> Matters Most.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Professional therapy and mental health support tailored to you. Connect with licensed specialists from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/register" className="btn-primary py-4 px-8 text-lg flex items-center justify-center">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/about" className="px-8 py-4 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 text-center">
              Learn More
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="absolute -z-10 top-0 left-0 w-full h-full bg-blue-100 rounded-[3rem] blur-3xl opacity-30 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800" 
            alt="Mental Health Professional" 
            className="rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/5]"
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Heart, title: 'Compassionate Care', desc: 'Our practitioners are trained to provide empathy-first therapy.' },
          { icon: Shield, title: 'Safe & Secure', desc: 'Your data is encrypted and your sessions are completely private.' },
          { icon: CheckCircle2, title: 'Verified Experts', desc: 'Every doctor on our platform is licensed and background checked.' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <item.icon className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">{item.title}</h3>
            <p className="text-slate-600">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to prioritize yourself?</h2>
          <p className="text-blue-100 text-lg opacity-90">
            Join thousands of others who fixed their mental health routines with MindEezy.
          </p>
          <Link to="/register" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl shadow-blue-900/20 italic">
            Get Started For Free
          </Link>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-[-30deg] translate-x-1/2"></div>
      </section>
    </div>
  );
};

export default Home;
