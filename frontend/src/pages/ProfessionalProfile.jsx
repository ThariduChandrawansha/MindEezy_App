import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, MapPin, Calendar, Clock, Video, UserCircle, 
  CheckCircle2, ArrowLeft, HeartPulse, GraduationCap, Award
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookAppointmentModal from '../components/BookAppointmentModal';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchProf = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/public/professionals/${id}`);
        setProf(res.data);
      } catch (err) {
        console.error(err);
        setError('Professional not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProf();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-slate-50">
   
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="h-16 w-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Loading Profile...</p>
      </div>
    </div>
  );

  if (error || !prof) return (
    <div className="min-h-screen flex flex-col bg-slate-50">
    
      <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <UserCircle className="h-24 w-24 text-slate-300 mb-6" />
        <h2 className="text-3xl font-black text-slate-800 mb-2">Profile Not Found</h2>
        <p className="text-slate-500 font-medium mb-8">The professional you are looking for does not exist or has been removed.</p>
        <Link to="/professionals" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Professionals
        </Link>
      </div>
    </div>
  );

  const avgRating = prof.avg_rating ? Number(prof.avg_rating).toFixed(1) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
  

      <main className="flex-grow pb-24">
        {/* Banner */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 w-full relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl -mt-24 md:-mt-32 relative z-10">
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 mb-8 border border-slate-100">
            <div className="flex flex-col md:flex-row gap-8 items-start">
               
               {/* Profile Image */}
               <div className="shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-2xl md:rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
                  {prof.profile_pic_path ? (
                    <img src={`http://localhost:5000${prof.profile_pic_path}`} className="w-full h-full object-cover" alt={`Dr. ${prof.username}`} />
                  ) : (
                    <UserCircle className="h-24 w-24 text-indigo-300" />
                  )}
               </div>

               {/* Header Info */}
               <div className="flex-grow pt-2 md:pt-6 w-full">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-none bg-clip-text">Dr. {prof.username}</h1>
                        {prof.online_available ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-black rounded-lg border border-emerald-200 flex items-center">
                            <Video className="h-3 w-3 mr-1" /> Online
                          </span>
                        ) : null}
                      </div>
                      <p className="text-lg md:text-xl text-blue-600 font-bold mb-4">{prof.specialty || 'General Practitioner'}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 md:gap-8">
                        {/* Rating block */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`h-5 w-5 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-500 hover:scale-110 transition-transform cursor-crosshair' : 'text-slate-200 fill-slate-200'}`} />
                            ))}
                          </div>
                          <div>
                            <span className="text-lg font-black text-slate-800 leading-none block">{avgRating > 0 ? avgRating : 'New'}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{prof.review_count} Review{prof.review_count !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        {/* Sessions block */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <HeartPulse className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-lg font-black text-slate-800 leading-none block">{prof.total_channelings || 0}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sessions Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                      <button 
                        onClick={() => user ? setIsBookingOpen(true) : window.location.href = '/login'}
                        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all uppercase tracking-widest text-xs flex items-center justify-center hover:-translate-y-1 group"
                      >
                         <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" /> 
                         Book Appointment
                      </button>
                      <p className="text-center text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-3">Usually responds instantly</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Column: Details */}
             <div className="lg:col-span-1 space-y-6">
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Award className="h-4 w-4" /> Credentials
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Qualification</label>
                      <p className="font-bold text-slate-700 flex items-start gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                        {prof.qualification || 'Not provided'}
                      </p>
                    </div>
                    {prof.experience_years && (
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Experience</label>
                        <p className="font-bold text-slate-700 flex items-center gap-2 bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg inline-flex">
                          {prof.experience_years} Years
                        </p>
                      </div>
                    )}
                    {prof.license_number && (
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">License No.</label>
                        <p className="font-bold text-slate-700 font-mono bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 inline-block">
                          {prof.license_number}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Consultation Info */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Video className="h-4 w-4" /> Consultation
                  </h3>
                  
                  <ul className="space-y-4 font-bold text-sm text-slate-600">
                    <li className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Video className="h-4 w-4" />
                      </div>
                      {prof.online_available ? 'Online Video Sessions Available' : 'In-person Only'}
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                         <Calendar className="h-4 w-4" />
                      </div>
                      Secure Booking via Platform
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      End-to-end Encrypted
                    </li>
                  </ul>
                </div>

             </div>

             {/* Right Column: Bio & Feedbacks */}
             <div className="lg:col-span-2 space-y-8">
                
                {/* About section */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                   <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4">About Dr. {prof.username}</h3>
                   <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                     {prof.bio ? (
                       <p className="whitespace-pre-line">{prof.bio}</p>
                     ) : (
                       <p className="italic text-slate-400">Dr. {prof.username} has not added a professional biography yet. Book an appointment to get to know them.</p>
                     )}
                   </div>
                </div>

                {/* Feedbacks section */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-black text-slate-800 tracking-tight">Patient Feedback</h3>
                     <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{prof.recentFeedbacks?.length || 0} Recent</span>
                   </div>

                   {(!prof.recentFeedbacks || prof.recentFeedbacks.length === 0) ? (
                     <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                       <Star className="h-10 w-10 text-slate-300 fill-slate-300 mx-auto mb-3" />
                       <p className="font-bold text-slate-500">No reviews yet</p>
                       <p className="text-sm text-slate-400 mt-1">Be the first to leave a review after your session.</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {prof.recentFeedbacks.map(f => (
                         <div key={f.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors">
                           <div className="flex justify-between items-start mb-4">
                             <div>
                               <p className="font-bold text-slate-800">{f.patient_name}</p>
                               <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">
                                 {format(new Date(f.created_at), 'MMM d, yyyy')}
                               </p>
                             </div>
                             <div className="flex gap-0.5">
                               {[1,2,3,4,5].map(s => (
                                 <Star key={s} className={`h-4 w-4 ${s <= f.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200 fill-slate-200'}`} />
                               ))}
                             </div>
                           </div>
                           {f.comment && (
                             <p className="text-sm font-medium text-slate-600 italic bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                               "{f.comment}"
                             </p>
                           )}
                         </div>
                       ))}
                     </div>
                   )}
                </div>

             </div>

          </div>
        </div>
      </main>

      {/* Reused Booking Modal */}
      {user && prof && (
        <BookAppointmentModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          professionalId={prof.id}
          professionalName={`Dr. ${prof.username}`}
        />
      )}

     
    </div>
  );
};

export default ProfessionalProfile;
