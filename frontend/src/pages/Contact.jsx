import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Phone, Mail, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/public/contact', formData);
      showNotification('success', 'Your message has been sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      showNotification('error', 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Get in touch with us</h1>
        <p className="text-lg text-slate-500 font-medium">We're here to support your mental health journey. Whether you have a question or need direct assistance, reach out.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin className="h-6 w-6"/></div>
             <div>
                <h3 className="font-black text-slate-800 text-lg mb-1">Our Location</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">No 12, Wellness Avenue,<br/>Colombo 03, Sri Lanka</p>
             </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Phone className="h-6 w-6"/></div>
             <div>
                <h3 className="font-black text-slate-800 text-lg mb-1">Phone Number</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">+94 112 345 678<br/>+94 777 123 456</p>
             </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-4">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Mail className="h-6 w-6"/></div>
             <div>
                <h3 className="font-black text-slate-800 text-lg mb-1">Email Address</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">support@mindeezy.com<br/>appointments@mindeezy.com</p>
             </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-10 rounded-3xl shadow-xl shadow-blue-50/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -z-10 -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Name</label>
                <input 
                  type="text" required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-sm"
                  placeholder="John Doe"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <input 
                  type="email" required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-sm"
                  placeholder="john@example.com"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</label>
              <input 
                type="text" required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-sm"
                placeholder="How can we help you?"
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
              <textarea 
                required
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm min-h-[160px] resize-y"
                placeholder="Write your message here..."
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-200 transition-all uppercase tracking-widest text-xs disabled:opacity-70 flex items-center justify-center group"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              Send Message
            </button>
          </form>
        </div>
      </div>

      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default Contact;
