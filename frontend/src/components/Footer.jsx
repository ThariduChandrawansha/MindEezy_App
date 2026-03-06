import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin, ArrowRight, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 pt-24 pb-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">MindEezy</span>
            </Link>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Making mental health care accessible, professional, and effortless for everyone. Join our community of wellness today.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-white font-bold text-lg mb-6 flex items-center">
                 <ShieldAlert className="h-5 w-5 mr-2 text-rose-500" /> Emergency
              </h4>
              <ul className="space-y-4">
                <li><a href="tel:119" className="text-slate-400 hover:text-rose-400 transition-colors flex justify-between"><span>Police Hotline</span><span className="font-mono text-white">119</span></a></li>
                <li><a href="tel:1926" className="text-slate-400 hover:text-rose-400 transition-colors flex justify-between"><span>Mental Health</span><span className="font-mono text-white">1926</span></a></li>
                <li><a href="tel:1333" className="text-slate-400 hover:text-rose-400 transition-colors flex justify-between"><span>CCC Line</span><span className="font-mono text-white">1333</span></a></li>
                <li><a href="tel:0767520620" className="text-slate-400 hover:text-rose-400 transition-colors flex justify-between"><span>Sumithrayo</span><span className="font-mono text-white">0767520620</span></a></li>
                <li><a href="tel:1375" className="text-slate-400 hover:text-rose-400 transition-colors flex justify-between"><span>Life Line</span><span className="font-mono text-white">1375</span></a></li>
                <li><a href="tel:1929" className="text-slate-400 hover:text-rose-400 transition-colors flex justify-between"><span>Child Protection</span><span className="font-mono text-white">1929</span></a></li>
              </ul>
              <Link to="/emergency" className="mt-6 w-full inline-block text-center py-2 bg-rose-600/20 text-rose-500 font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-rose-600 hover:text-white transition-colors border border-rose-500/30">
                View All Services
              </Link>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-bold text-lg mb-6">Experience</h4>
              <ul className="space-y-4">
                <li><Link to="/professionals" className="text-slate-400 hover:text-blue-400 transition-colors">Our Specialists</Link></li>
                <li><Link to="/blogs" className="text-slate-400 hover:text-blue-400 transition-colors">Wellness Blogs</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-bold text-lg mb-6">Connect</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-slate-400">
                  <Mail className="h-4 w-4 mr-3" /> support@mindeezy.com
                </li>
                <li className="flex items-center text-slate-400">
                  <Phone className="h-4 w-4 mr-3" /> +94 112 345 678
                </li>
                <li className="flex items-start text-slate-400">
                  <MapPin className="h-4 w-4 mr-3 mt-1 shrink-0" /> Colombo, Sri Lanka
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} MindEezy Care. All rights reserved.
          </p>
          <div className="flex space-x-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
