import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Video, Search, ChevronRight, UserCircle, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Professionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public/professionals');
        setProfessionals(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter(p => 
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.specialty && p.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
    

      <main className="flex-grow pt-16 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expert</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">Browse our network of licensed psychologists, therapists, and counselors ready to help you navigate life's challenges.</p>
            
            {/* Search */}
            <div className="mt-8 relative max-w-xl mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search by name or specialty (e.g., Anxiety, CBT)..."
                className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-slate-700 shadow-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="h-12 w-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Professionals...</p>
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <UserCircle className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2">Nobody found</h3>
              <p className="text-slate-500 font-medium">We couldn't find any professionals matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessionals.map((prof) => {
                const avgRating = prof.avg_rating ? Number(prof.avg_rating).toFixed(1) : 0;
                
                return (
                  <div key={prof.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full relative">
                    {/* Specialty Badge */}
                    <div className="absolute top-4 left-4 z-10">
                       <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border border-blue-100">
                         {prof.specialty || 'General'}
                       </span>
                    </div>

                    <div className="h-48 bg-slate-100 relative overflow-hidden shrink-0">
                      {prof.profile_pic_path ? (
                        <img src={`http://localhost:5000${prof.profile_pic_path}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={`Dr. ${prof.username}`} />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100 text-indigo-200">
                          <UserCircle className="h-20 w-20 mb-2" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                      
                      {/* Name & Title on Image */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-black truncate leading-tight">Dr. {prof.username}</h3>
                        <p className="text-sm font-medium text-slate-200 truncate">{prof.qualification || 'Licensed Professional'}</p>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      
                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col bg-slate-50 p-3 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                             <Star className="h-4 w-4 fill-amber-500" />
                             <span className="font-black text-slate-800 leading-none">{avgRating > 0 ? avgRating : 'New'}</span>
                           </div>
                           <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                             {prof.review_count} Review{prof.review_count !== 1 ? 's' : ''}
                           </span>
                        </div>
                        <div className="flex flex-col bg-slate-50 p-3 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-1.5 text-blue-500 mb-1">
                             <CheckCircle2 className="h-4 w-4" />
                             <span className="font-black text-slate-800 leading-none">{prof.total_channelings || 0}</span>
                           </div>
                           <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                             Sessions
                           </span>
                        </div>
                      </div>

                      {/* Bio Preview */}
                      <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow font-medium leading-relaxed">
                        {prof.bio || "This professional hasn't added a bio yet."}
                      </p>

                      <Link 
                        to={`/professionals/${prof.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-md mt-auto"
                      >
                        View Profile <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

     
    </div>
  );
};

export default Professionals;
