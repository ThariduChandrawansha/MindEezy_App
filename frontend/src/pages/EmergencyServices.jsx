import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, AlertTriangle, HeartHandshake, ShieldAlert, Users, PhoneCall, Ear } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EmergencyServices = () => {
  const hotlines = [
    {
      name: "Emergency Hotline",
      number: "119",
      description: "National emergency police hotline for immediate threat to life or property.",
      icon: <ShieldAlert className="h-8 w-8" />,
      color: "bg-rose-600",
      textColor: "text-rose-600",
      lightBg: "bg-rose-50",
      borderColor: "border-rose-200"
    },
    {
      name: "National Mental Health Hotline",
      number: "1926",
      description: "Dedicated 24/7 hotline for mental health crises, psychological support, and guidance.",
      icon: <HeartHandshake className="h-8 w-8" />,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      lightBg: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      name: "CCC Line",
      number: "1333",
      description: "Courage, Compassion, and Commitment line. Free telephone counseling for anyone in crisis.",
      icon: <PhoneCall className="h-8 w-8" />,
      color: "bg-indigo-600",
      textColor: "text-indigo-600",
      lightBg: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      name: "Sumithrayo",
      number: "+94 767 520 620",
      description: "Providing emotional support to help people experiencing distress or despair, including suicidal feelings.",
      icon: <Users className="h-8 w-8" />,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      lightBg: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      name: "Lanka Life Line",
      number: "1375",
      description: "Confidential emotional support for individuals experiencing psychological distress.",
      icon: <Ear className="h-8 w-8" />,
      color: "bg-teal-600",
      textColor: "text-teal-600",
      lightBg: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      name: "National Child Protection Authority",
      number: "1929",
      description: "To report child abuse or seek help regarding child protection issues.",
      icon: <AlertTriangle className="h-8 w-8" />,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      lightBg: "bg-amber-50",
      borderColor: "border-amber-200"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
  

      <main className="flex-grow pt-16 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Header Section */}
          <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 bg-rose-100 rounded-full mb-6">
              <Phone className="h-10 w-10 text-rose-600 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-6">
              Get Immediate <span className="text-rose-600">Help</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium bg-rose-50 p-6 rounded-2xl border border-rose-100">
              If you or someone you know is in immediate danger, experiencing a mental health crisis, or having thoughts of self-harm, please reach out immediately. <strong>You are not alone.</strong> These services are confidential and available to help you right now. 
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotlines.map((hotline, idx) => (
              <div key={idx} className={`bg-white rounded-3xl border ${hotline.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col h-full group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${hotline.lightBg} ${hotline.textColor}`}>
                    {hotline.icon}
                  </div>
                  <a 
                    href={`tel:${hotline.number.replace(/\s+/g, '')}`} 
                    className={`shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${hotline.color} text-white hover:scale-110 active:scale-95 transition-transform shadow-lg`}
                    title="Call Now"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                  {hotline.name}
                </h3>
                
                <a 
                  href={`tel:${hotline.number.replace(/\s+/g, '')}`} 
                  className={`text-3xl font-black ${hotline.textColor} mb-4 inline-block hover:underline decoration-4 underline-offset-4`}
                >
                  {hotline.number}
                </a>
                
                <p className="text-slate-500 font-medium leading-relaxed mt-auto border-t border-slate-100 pt-4">
                  {hotline.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-xl font-black text-slate-800 mb-4">Not an emergency?</h3>
            <p className="text-slate-500 mb-6">Schedule a session with one of our licensed professionals.</p>
            <Link to="/professionals" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition-colors shadow-xl">
              Find a Professional
            </Link>
          </div>

        </div>
      </main>

     
    </div>
  );
};

export default EmergencyServices;
