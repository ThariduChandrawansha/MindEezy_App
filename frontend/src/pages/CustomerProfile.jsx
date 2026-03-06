import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Settings, Heart, Bell, Key, MapPin, Book, Calendar, Clock, Camera,
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, X, Loader2, ClipboardList, Video,
  Star, ExternalLink, UserCheck, Stethoscope, MessageCircle,
  CreditCard, ShieldCheck, Lock, Landmark, Wallet
} from 'lucide-react';
import { format, addDays, startOfToday, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, subMonths, addMonths, isSameDay, parseISO } from 'date-fns';
import BookAppointmentModal from '../components/BookAppointmentModal';
import VideoConsultRoom from '../components/VideoConsultRoom';
import FeedbackModal from '../components/FeedbackModal';

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'journal'
  const [notification, setNotification] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Journaling & Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditable, setIsEditable] = useState(false);
  const [monthData, setMonthData] = useState({});
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [mentalSummary, setMentalSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [savingModal, setSavingModal] = useState(false);
  
  const [entryData, setEntryData] = useState({
    mood_level: null,
    note: '',
    entry: ''
  });

  // Appointment State
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeVideoRoom, setActiveVideoRoom] = useState(null);
  const [feedbackTarget, setFeedbackTarget] = useState(null); // appointment obj for feedback
  const [feedbackGiven, setFeedbackGiven] = useState(new Set()); // set of appointment IDs that got feedback
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardForm, setCardForm] = useState({ holder: '', number: '', expiry: '', cvc: '' });

const emojis = [
  { level: 0, label: 'Anger', icon: '😡', color: 'bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-200' },
  { level: 1, label: 'Fear', icon: '😨', color: 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200' },
  { level: 2, label: 'Joy', icon: '😄', color: 'bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-200' },
  { level: 3, label: 'Love', icon: '🥰', color: 'bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200' },
  { level: 4, label: 'Sadness', icon: '😢', color: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200' },
  { level: 5, label: 'Surprise', icon: '😲', color: 'bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200' }
];

  // Profile Completion State
  const [patientDetails, setPatientDetails] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    age: '', gender: '', address: '', phone: '', medical_history: '', stress_triggers: '',
    marital_status: '', employment_status: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Assessments State
  const [assessments, setAssessments] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  useEffect(() => {
    if (activeTab === 'journal' && user) {
      fetchMonthData(currentDate);
      fetchMentalSummary();
    }
    if (activeTab === 'profile' && user) {
      fetchDoctors();
      fetchPatientProfile();
      fetchAppointments();
    }
    if (activeTab === 'assessments' && user) {
      fetchAllAssessments();
      fetchMyResponses();
    }
  }, [activeTab, currentDate, user]);

  const fetchPatientProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile/patient/${user.id}`);
      if (res.data) {
        setPatientDetails(res.data);
        setProfileForm({
          age: res.data.age || '',
          gender: res.data.gender || '',
          address: res.data.address || '',
          phone: res.data.phone || '',
          medical_history: res.data.medical_history || '',
          stress_triggers: res.data.stress_triggers || '',
          marital_status: res.data.marital_status || '',
          employment_status: res.data.employment_status || ''
        });
      }
    } catch (err) {
      console.error("No profile found or error fetching", err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axios.put(`http://localhost:5000/api/profile/patient/${user.id}`, profileForm);
      showNotification('success', 'Profile updated successfully');
      setIsEditingProfile(false);
      fetchPatientProfile();
    } catch (err) {
      showNotification('error', 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/public/doctors');
      setDoctors(res.data);
      if (res.data.length > 0) setSelectedDoctor(res.data[0]); // Default to first doctor
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/public/appointments/${user.id}/customer`);
      setAppointments(res.data);
      // Check which completed appointments already have feedback
      const completed = res.data.filter(a => a.status === 'completed');
      const feedbackChecks = await Promise.all(
        completed.map(a => axios.get(`http://localhost:5000/api/feedbacks/appointment/${a.id}`).then(r => r.data ? a.id : null).catch(() => null))
      );
      setFeedbackGiven(new Set(feedbackChecks.filter(Boolean)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
       showNotification('error', 'Please select a valid image file');
       return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    setIsUploadingImage(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/profile/patient/${user.id}/upload-pic`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showNotification('success', 'Profile picture updated!');
      
      // Update local state by forcing a refetch
      if (updateUser) {
         updateUser({...user, profile_pic_path: res.data.profile_pic_path});
      }
      fetchPatientProfile(); // Refetch patient details just in case
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMonthData = async (date) => {
    setLoadingCalendar(true);
    try {
      const year = format(date, 'yyyy');
      const month = format(date, 'MM');
      const res = await axios.get(`http://localhost:5000/api/journals/${user.id}/month?year=${year}&month=${month}`);
      setMonthData(res.data);
    } catch (err) {
      showNotification('error', 'Failed to load calendar data');
    } finally {
      setLoadingCalendar(false);
    }
  };

  const fetchMentalSummary = async () => {
    setLoadingSummary(true);
    setSuggestedDoctors([]);
    try {
      const dbRes = await axios.get(`http://localhost:5000/api/journals/${user.id}/all`);
      const entries = dbRes.data.filter(e => e.entry && e.entry.trim() !== '');
      if (entries.length === 0) {
        setMentalSummary({ emotion: 'No data', description: 'Write more journals to get an AI mentality summary.' });
        return;
      }
      
      const combinedText = entries.map(e => e.entry).join('. ');
      const aiRes = await axios.post('http://localhost:5001/predict_emotion', { text: combinedText });
      
      const emotionTextConfig = {
        joy: { text: 'Generally Positive / Joyful', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
        sadness: { text: 'Feeling Down / Sadness', color: 'text-blue-500 bg-blue-50 border-blue-200' },
        anger: { text: 'Experiencing Frustration / Anger', color: 'text-rose-500 bg-rose-50 border-rose-200' },
        fear: { text: 'Anxious / Fearful', color: 'text-purple-500 bg-purple-50 border-purple-200' },
        surprise: { text: 'Surprised / Reactive', color: 'text-amber-500 bg-amber-50 border-amber-200' },
        love: { text: 'Affectionate / Loving', color: 'text-pink-500 bg-pink-50 border-pink-200' }
      };

      // Emotion → recommended specialty keywords
      const emotionSpecialtyMap = {
        sadness: ['depression', 'grief', 'mood', 'clinical', 'cognitive', 'psychologist', 'psychiatrist'],
        anger: ['anger', 'stress', 'conflict', 'behavioral', 'cbt', 'management', 'therapist'],
        fear: ['anxiety', 'trauma', 'ptsd', 'panic', 'ocd', 'phobia', 'stress', 'psychologist'],
        joy: ['wellness', 'life', 'coaching', 'positive', 'mindfulness', 'general'],
        love: ['relationship', 'couples', 'family', 'interpersonal', 'counseling'],
        surprise: ['adjustment', 'adaptive', 'transition', 'crisis', 'counseling']
      };

      const emotion = aiRes.data.emotion.toLowerCase();
      const result = emotionTextConfig[emotion] || { text: 'Neutral / Unknown', color: 'text-slate-500 bg-slate-50 border-slate-200' };
      setMentalSummary({ ...result, guide: aiRes.data.guide, detectedEmotion: emotion });

      // Fetch all professionals and filter by matching specialty
      const docsRes = await axios.get('http://localhost:5000/api/public/doctors');
      const allDocs = docsRes.data;
      const keywords = emotionSpecialtyMap[emotion] || [];

      // Score each doctor by how many keywords match their specialty/bio
      const scored = allDocs.map(doc => {
        const haystack = `${(doc.specialty || '')} ${(doc.bio || '')}`.toLowerCase();
        const score = keywords.filter(k => haystack.includes(k)).length;
        return { ...doc, matchScore: score };
      });

      // Sort by score desc, take top 3. If none match, just take top 3.
      scored.sort((a, b) => b.matchScore - a.matchScore);
      const top = scored.slice(0, 3);
      setSuggestedDoctors(top);
      
    } catch (err) {
      console.error(err);
      setMentalSummary({ emotion: 'Error', description: 'Could not generate summary at this time.', color: 'text-rose-500 bg-rose-50 border-rose-200' });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleDateClick = async (dateStr) => {
    setSelectedDate(dateStr);
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const isPastOrToday = dateStr <= todayStr;
    setIsEditable(isPastOrToday);
    
    setIsModalOpen(true);
    setLoadingModal(true);
    
    // Clear form first
    setEntryData({ mood_level: null, note: '', entry: '' });

    try {
      const res = await axios.get(`http://localhost:5000/api/journals/${user.id}/date/${dateStr}`);
      setEntryData({
        mood_level: res.data.mood_level !== undefined && res.data.mood_level !== null ? res.data.mood_level : null,
        note: res.data.note || '',
        entry: res.data.entry || ''
      });
    } catch (err) {
      showNotification('error', 'Failed to load daily entry');
    } finally {
      setLoadingModal(false);
    }
  };

  const fetchAllAssessments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assessments');
      const parsed = res.data.map(a => ({
        ...a,
        questions: (typeof a.questions === 'string' && a.questions) ? JSON.parse(a.questions) : (a.questions || [])
      }));
      setAssessments(parsed);
    } catch (err) { console.error(err); }
  };

  const fetchMyResponses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/assessments/customer/${user.id}/responses`);
      const parsed = res.data.map(r => ({
        ...r,
        responses: (typeof r.responses === 'string' && r.responses) ? JSON.parse(r.responses) : (r.responses || [])
      }));
      setMyResponses(parsed);
    } catch (err) { console.error(err); }
  };

  const startAssessment = (assessment) => {
    setActiveAssessment(assessment);
    setAssessmentAnswers({});
  };

  const submitAssessment = async (e) => {
    e.preventDefault();
    setSubmittingAssessment(true);
    
    const formattedResponses = activeAssessment.questions.map((q, i) => ({
      question: q.text,
      answer: assessmentAnswers[i] || ''
    }));

    try {
      await axios.post(`http://localhost:5000/api/assessments/${activeAssessment.id}/respond`, {
        user_id: user.id,
        responses: formattedResponses,
        score: 0,
        notes: ''
      });
      showNotification('success', 'Assessment completed and securely filed');
      setActiveAssessment(null);
      fetchMyResponses();
    } catch (err) {
      showNotification('error', 'Failed to submit assessment');
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    setSavingModal(true);
    try {
      await axios.post(`http://localhost:5000/api/journals/${user.id}/date/${selectedDate}`, entryData);
      showNotification('success', 'Entry saved successfully');
      setIsModalOpen(false);
      fetchMonthData(currentDate); // Refresh dots
    } catch (err) {
      showNotification('error', 'Failed to save entry');
    } finally {
      setSavingModal(false);
    }
  };

  // Calendar builder
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const dateFormat = "yyyy-MM-dd";
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Profile Summary (Always visible) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-black uppercase tracking-widest border border-white/30">
            {user?.role} Account
          </div>
          <div className="absolute -bottom-12 left-8 border-[6px] border-slate-50 rounded-full bg-white shadow-xl group/dp">
            <div className="h-24 w-24 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 relative">
               {isUploadingImage ? (
                 <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
               ) : user?.profile_pic_path ? (
                 <img src={`http://localhost:5000${user?.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
               ) : (
                 <span className="text-4xl font-black text-blue-600">{user?.username?.charAt(0).toUpperCase()}</span>
               )}

               {/* Upload Overlay */}
               <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/dp:opacity-100 transition-opacity cursor-pointer">
                 <Camera className="h-6 w-6 mb-1" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Update</span>
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
               </label>
            </div>
          </div>
        </div>
        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">{user?.username}</h1>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Emotional Wellness Advocate • Member since 2024</p>
            </div>
            {activeTab === 'profile' && (
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all text-sm uppercase tracking-widest"
              >
                {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Side Navigation Menu */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
            <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4 p-2">Quick Navigation</h3>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <User className="h-5 w-5" /> <span>Profile Details</span>
              </button>
              <button 
                onClick={() => setActiveTab('journal')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'journal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <div className="flex items-center space-x-3"><Book className="h-5 w-5" /> <span>My Journal</span></div>
                <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></div>
              </button>
              <button 
                onClick={() => setActiveTab('assessments')}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'assessments' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <ClipboardList className="h-5 w-5" /> <span>Assessments</span>
              </button>
           
            </nav>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Profile Details Block */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4">Personal Information</h3>
                
                {isEditingProfile || (!patientDetails && user?.role === 'customer') ? (
                   // --- EDIT FORM ---
                   <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Age</label>
                           <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" placeholder="e.g. 25" value={profileForm.age} onChange={e => setProfileForm({...profileForm, age: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gender</label>
                           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" value={profileForm.gender} onChange={e => setProfileForm({...profileForm, gender: e.target.value})}>
                             <option value="">Select Gender</option>
                             <option value="male">Male</option>
                             <option value="female">Female</option>
                             <option value="non-binary">Non-binary</option>
                             <option value="prefer_not_to_say">Prefer not to say</option>
                           </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Marital Status</label>
                           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" value={profileForm.marital_status} onChange={e => setProfileForm({...profileForm, marital_status: e.target.value})}>
                              <option value="">Select Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="In a Relationship">In a Relationship</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employment Status</label>
                           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" value={profileForm.employment_status} onChange={e => setProfileForm({...profileForm, employment_status: e.target.value})}>
                              <option value="">Select Status</option>
                              <option value="Employed">Employed</option>
                              <option value="Unemployed">Unemployed</option>
                           </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</label>
                           <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" placeholder="+123456789" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address</label>
                           <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" placeholder="Your City, Country" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Medical History <span className="text-slate-300 normal-case">(Optional)</span></label>
                         <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" rows="3" placeholder="Brief summary of past mental health focus..." value={profileForm.medical_history} onChange={e => setProfileForm({...profileForm, medical_history: e.target.value})}></textarea>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stress Triggers</label>
                         <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400" rows="2" placeholder="e.g. Work deadlines, social gatherings..." value={profileForm.stress_triggers} onChange={e => setProfileForm({...profileForm, stress_triggers: e.target.value})}></textarea>
                      </div>

                      <div className="flex justify-end pt-4">
                         <button type="submit" disabled={savingProfile} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-70">
                           {savingProfile ? 'Saving...' : 'Save Profile Details'}
                         </button>
                      </div>
                   </form>
                ) : (
                   // --- VIEW PROFILE ---
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Full Name<span className="text-slate-800 text-base normal-case font-bold">{user?.username}</span></p>
                     </div>
                                           <div className="space-y-1">
                                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Marital Status<span className="text-slate-800 text-base normal-case font-bold">{patientDetails?.marital_status || "Not provided"}</span></p>
                                           </div>
                                           <div className="space-y-1">
                                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Employment Status<span className="text-slate-800 text-base normal-case font-bold">{patientDetails?.employment_status || "Not provided"}</span></p>
                                           </div>
                     <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Email Address<span className="text-slate-800 text-base normal-case font-bold">{user?.email}</span></p>
                     </div>
                     <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Age<span className="text-slate-800 text-base normal-case font-bold">{patientDetails?.age || 'Not provided'}</span></p>
                     </div>
                     <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Gender<span className="text-slate-800 text-base normal-case font-bold capitalize">{patientDetails?.gender?.replace(/_/g, ' ') || 'Not provided'}</span></p>
                     </div>
                     <div className="space-y-1 space-x-1 col-span-1 md:col-span-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Location<span className="text-slate-800 text-base normal-case font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400"/> {patientDetails?.address || 'Not securely set'}</span></p>
                     </div>
                     
                     <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-50 mt-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Known Stress Triggers</p>
                       <p className="text-slate-700 font-medium text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                         {patientDetails?.stress_triggers || 'No triggers documented yet.'}
                       </p>
                     </div>
                   </div>
                )}
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex-grow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
                    <Calendar className="h-6 w-6 mr-3 text-indigo-500" /> My Appointments
                  </h3>
                </div>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 font-medium text-sm">You have no upcoming appointments.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map(app => (
                      <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg overflow-hidden shrink-0">
                            {app.profile_pic_path ? (
                               <img src={`http://localhost:5000${app.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
                            ) : (
                               app.professional_name?.charAt(0) || 'D'
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{app.professional_name || 'Doctor'}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-slate-400" /> {format(new Date(app.appointment_datetime), 'MMM do, yyyy h:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          {app.status === 'confirmed' && app.payment_status === 'unpaid' && (
                            <button
                              onClick={() => setPaymentTarget(app)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md shrink-0"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> Pay LKR {app.amount}
                            </button>
                          )}
                          {app.status === 'confirmed' && app.payment_status === 'paid' && (
                            <button
                              onClick={() => setActiveVideoRoom({
                                roomName: `mindeezy-consult-${app.id}`,
                                displayName: user?.username
                              })}
                              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md shrink-0"
                            >
                              <Video className="h-3.5 w-3.5" /> Join Video
                            </button>
                          )}
                          {/* Leave Feedback button for completed sessions without feedback */}
                          {app.status === 'completed' && !feedbackGiven.has(app.id) && (
                            <button
                              onClick={() => setFeedbackTarget(app)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md shrink-0"
                            >
                              ⭐ Leave Feedback
                            </button>
                          )}
                          {app.status === 'completed' && feedbackGiven.has(app.id) && (
                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shrink-0">
                              ✓ Reviewed
                            </span>
                          )}
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 ${
                            app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'completed' ? 'bg-slate-200 text-slate-600' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Book Doctor Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                   <div>
                     <h3 className="text-3xl font-black mb-2 tracking-tight">Need to talk to someone?</h3>
                     <p className="text-blue-100 font-bold opacity-90 text-sm">Our licensed professionals are available 24/7. Book a completely confidential session today.</p>
                     
                     {doctors.length > 0 && (
                       <div className="mt-4">
                         <label className="text-xs font-black uppercase tracking-widest text-blue-200 block mb-2">Select a Professional</label>
                         <select 
                            className="w-full md:w-64 px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white outline-none focus:ring-2 focus:ring-white border-white backdrop-blur-sm appearance-none font-bold cursor-pointer"
                            value={selectedDoctor?.id || ''}
                            onChange={(e) => {
                              const doc = doctors.find(d => d.id === parseInt(e.target.value));
                              setSelectedDoctor(doc);
                            }}
                         >
                            {doctors.map(doc => (
                              <option key={doc.id} value={doc.id} className="text-slate-800">{doc.username} - {doc.specialty}</option>
                            ))}
                         </select>
                       </div>
                     )}
                   </div>
                   <button 
                     onClick={() => selectedDoctor && setIsBookingOpen(true)}
                     className="shrink-0 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest text-xs disabled:opacity-50"
                     disabled={!selectedDoctor}
                   >
                     Book Session
                   </button>
                </div>
                {/* Decorative BG */}
                <Heart className="absolute -right-10 -bottom-10 h-64 w-64 text-white opacity-10 rotate-12" />
              </div>
            </div>
          )}

          {/* TAB: JOURNAL */}
          {activeTab === 'journal' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mood & Journal Calendar</h3>
                  <div className="flex space-x-2">
                    <button onClick={prevMonth} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                    <span className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm min-w-[140px] text-center shadow-lg">{format(currentDate, 'MMMM yyyy')}</span>
                    <button onClick={nextMonth} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"><ChevronRight className="h-5 w-5" /></button>
                  </div>
                </div>

                {loadingCalendar ? (
                  <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" /></div>
                ) : (
                  <div>
                    {/* AI Mentality Summary */}
                    <div className="mb-6 rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white shadow-sm overflow-hidden">
                       <div className="p-6 flex flex-col md:flex-row items-center justify-between border-b border-slate-100">
                         <div className="mb-4 md:mb-0">
                           <h4 className="font-black text-slate-800 tracking-tight flex items-center mb-1">
                             <span className="text-xl mr-2">🤖</span> AI Mentality Summary
                           </h4>
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Based on your recent journal entries</p>
                         </div>
                         
                         {loadingSummary ? (
                           <div className="flex items-center gap-2 text-indigo-500 font-bold px-4 py-2 bg-indigo-50 rounded-xl">
                             <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                           </div>
                         ) : mentalSummary ? (
                           <div className={`px-6 py-3 rounded-xl border font-black text-sm uppercase tracking-widest shadow-sm ${mentalSummary.color || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                             {mentalSummary.text || mentalSummary.emotion}
                           </div>
                         ) : null}
                       </div>
                       
                       {mentalSummary && mentalSummary.description && !mentalSummary.guide && (
                         <div className="p-6 bg-white text-slate-600 font-medium text-sm">
                           {mentalSummary.description}
                         </div>
                       )}

                       {mentalSummary && mentalSummary.guide && (
                         <div className="p-6 bg-indigo-50/50">
                           <h5 className="font-bold text-indigo-800 mb-2 flex items-center">
                             <span className="mr-2">💡</span> Personalized AI Guide & Advice
                           </h5>
                           <p className="text-indigo-900/80 leading-relaxed text-sm">
                             {mentalSummary.guide}
                           </p>
                         </div>
                       )}
                    </div>

                    {/* AI Suggested Professionals */}
                    {suggestedDoctors.length > 0 && (
                      <div className="mb-6 rounded-2xl border border-violet-100 bg-white shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-100 rounded-xl">
                              <Stethoscope className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-800 tracking-tight">AI-Recommended Professionals</h4>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                Matched to your {mentalSummary?.text?.toLowerCase() || 'emotional'} state
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate('/professionals')}
                            className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors px-3 py-1.5 bg-white rounded-xl border border-violet-200 hover:border-violet-400"
                          >
                            View All <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {suggestedDoctors.map((doc, i) => (
                            <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-violet-50/30 transition-colors group">
                              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-slate-700' : 'bg-orange-300 text-white'}`}>{i + 1}</div>
                              <div className="shrink-0 h-12 w-12 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-lg overflow-hidden border-2 border-violet-100 shadow">
                                {doc.profile_pic_path ? (
                                  <img src={`http://localhost:5000${doc.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
                                ) : (
                                  doc.username?.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-800 truncate">{doc.username}</p>
                                <p className="text-xs text-violet-600 font-bold uppercase tracking-wider truncate mt-0.5">{doc.specialty || 'General Counseling'}</p>
                                {doc.avg_rating ? (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs text-slate-500 font-bold">{parseFloat(doc.avg_rating).toFixed(1)} <span className="font-normal text-slate-400">({doc.review_count} reviews)</span></span>
                                  </div>
                                ) : <p className="text-[10px] text-slate-400 font-bold mt-1">No reviews yet</p>}
                                {doc.experience_years && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{doc.experience_years} yrs experience</p>}
                              </div>
                              <button
                                onClick={() => navigate(`/professionals/${doc.id}`)}
                                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md group-hover:scale-105"
                              >
                                <UserCheck className="h-3.5 w-3.5" /> View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                        <div key={dayName} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{dayName}</div>
                      ))}
                    </div>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-3">
                      {days.map((dayItem, i) => {
                        const dateStr = format(dayItem, 'yyyy-MM-dd');
                        const isCurrentMonth = isSameMonth(dayItem, currentDate);
                        const isToday = isSameDay(dayItem, new Date());
                        const dayData = monthData[dateStr];
                        
                        return (
                          <div 
                            key={i} 
                            onClick={() => handleDateClick(dateStr)}
                            className={`
                              relative flex flex-col justify-start p-2 min-h-[90px] border-2 rounded-2xl cursor-pointer transition-all hover:scale-[1.03] active:scale-95 group
                              ${!isCurrentMonth ? 'opacity-30 pointer-events-none border-dashed border-slate-200' : 'border-slate-100 bg-slate-50 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100'}
                              ${isToday ? 'bg-indigo-50 border-indigo-200' : ''}
                            `}
                          >
                            <span className={`text-sm font-black text-right block ${isToday ? 'text-indigo-600' : 'text-slate-600'}`}>
                              {format(dayItem, 'd')}
                            </span>
                            
                            {/* Indicators */}
                            {dayData && (
                               <div className="mt-auto flex flex-col gap-1 w-full justify-center items-center opacity-80 group-hover:opacity-100 transition-opacity">
                                  {dayData.hasMood && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md w-full text-center truncate shadow-sm mt-0.5">Mood: {emojis.find(e => e.level == dayData.mood_level)?.label || dayData.mood_level}</span>}
                                  {dayData.hasJournal && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md w-full text-center truncate shadow-sm mt-0.5">Written</span>}
                               </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              {activeAssessment ? (
                /* Assessment Taking View */
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                   <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{activeAssessment.name}</h3>
                        <p className="text-slate-500 font-medium text-sm mt-2">{activeAssessment.description}</p>
                      </div>
                      <button onClick={() => setActiveAssessment(null)} className="px-5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-colors shrink-0">
                         Cancel
                      </button>
                   </div>
                   
                   <form onSubmit={submitAssessment} className="space-y-8">
                      {activeAssessment.questions?.map((q, i) => (
                         <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                            <p className="font-bold text-slate-800"><span className="text-teal-600 mr-2">{i + 1}.</span>{q.text}</p>
                            
                            {q.type === 'rating' && (
                              <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map(val => (
                                  <label key={val} className={`flex-1 text-center py-3 rounded-xl border-2 cursor-pointer transition-all ${assessmentAnswers[i] === String(val) ? 'border-teal-500 bg-teal-50 text-teal-700 font-black scale-105 shadow-md' : 'border-slate-200 bg-white text-slate-500 hover:border-teal-200 font-bold'}`}>
                                    <input type="radio" className="hidden" name={`q_${i}`} value={val} checked={assessmentAnswers[i] === String(val)} onChange={(e) => setAssessmentAnswers({...assessmentAnswers, [i]: e.target.value})} />
                                    {val}
                                  </label>
                                ))}
                              </div>
                            )}

                            {q.type === 'boolean' && (
                              <div className="flex gap-4">
                                {['Yes', 'No'].map(val => (
                                  <label key={val} className={`flex-1 text-center py-3 rounded-xl border-2 cursor-pointer transition-all ${assessmentAnswers[i] === val ? 'border-teal-500 bg-teal-50 text-teal-700 font-black scale-105 shadow-md' : 'border-slate-200 bg-white text-slate-500 hover:border-teal-200 font-bold'}`}>
                                    <input type="radio" className="hidden" name={`q_${i}`} value={val} checked={assessmentAnswers[i] === val} onChange={(e) => setAssessmentAnswers({...assessmentAnswers, [i]: e.target.value})} />
                                    {val}
                                  </label>
                                ))}
                              </div>
                            )}

                            {q.type === 'text' && (
                              <textarea 
                                required 
                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-400 outline-none"
                                rows="3"
                                placeholder="Your answer..."
                                value={assessmentAnswers[i] || ''}
                                onChange={(e) => setAssessmentAnswers({...assessmentAnswers, [i]: e.target.value})}
                              />
                            )}
                         </div>
                      ))}
                      
                      <div className="flex justify-end pt-4">
                        <button type="submit" disabled={submittingAssessment} className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-xl shadow-teal-200 transition-all uppercase tracking-widest text-xs disabled:opacity-50">
                          {submittingAssessment ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Assessment Securely'}
                        </button>
                      </div>
                   </form>
                </div>
              ) : (
                <>
                  {/* Available Assessments */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center mb-6">
                      <ClipboardList className="h-6 w-6 mr-3 text-teal-500" /> Available Assessments
                    </h3>
                    
                    {assessments.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-500 font-medium text-sm">No new assessments to take.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assessments.map(a => {
                          const hasCompleted = myResponses.some(r => r.assessment_id === a.id);
                          return (
                          <div key={a.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-teal-300 transition-colors group flex flex-col justify-between h-full">
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg mb-2">{a.name}</h4>
                              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{a.description}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">By Dr. {a.professional_name}</span>
                              {hasCompleted ? (
                                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-emerald-100">
                                  Completed
                                </span>
                              ) : (
                                <button onClick={() => startAssessment(a)} className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                                  Take Test
                                </button>
                              )}
                            </div>
                          </div>
                        )})}
                      </div>
                    )}
                  </div>

                  {/* Past Submissions */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center mb-6">
                      My Past Responses
                    </h3>
                    
                    {myResponses.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-slate-500 font-medium text-sm">You haven't completed any assessments yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         {myResponses.map(r => (
                            <div key={r.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm">
                               <div>
                                 <h4 className="font-black text-slate-800">{r.assessment_name}</h4>
                                 <p className="text-xs text-slate-500 font-medium mt-1">Completed: {format(new Date(r.response_date), 'MMMM do, yyyy h:mm a')}</p>
                               </div>
                               <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Filed Securely</span>
                            </div>
                         ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Entry Modal */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col outline outline-4 outline-white/20 scale-in-95 animate-in zoom-in slide-in-from-bottom-8">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Daily Reflection</h3>
                  <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em]">{format(parseISO(selectedDate), 'EEEE, MMMM do, yyyy')}</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="h-6 w-6 text-slate-400" /></button>
             </div>

             <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-slate-50/50">
                {loadingModal ? (
                  <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>
                ) : (
                  <form id="journal-form" onSubmit={handleSaveEntry} className="space-y-10">
                    
                    {/* Mood Tracker */}
                    <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm">
                       <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-4 flex items-center"><Heart className="h-4 w-4 mr-2 text-rose-400 align-text-bottom"/> How were you feeling?</h4>
                       <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                         {emojis.map(e => (
                           <button 
                             key={e.level}
                             type="button"
                             disabled={!isEditable}
                             onClick={() => setEntryData({...entryData, mood_level: e.level})}
                             className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                               entryData.mood_level === e.level 
                                 ? `scale-110 shadow-lg ${e.color}` 
                                 : !isEditable 
                                   ? 'bg-slate-50 border-slate-100 text-slate-300 opacity-20 pointer-events-none' 
                                   : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 grayscale hover:grayscale-0'
                             }`}
                           >
                             <span className="text-4xl mb-2 filter drop-shadow-sm">{e.icon}</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest">{e.label}</span>
                           </button>
                         ))}
                       </div>

                       {/* Mood Note Input */}
                       <div className="space-y-3 pt-6 border-t border-slate-50">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center ml-2"><MessageCircle className="h-3 w-3 mr-2 text-rose-400"/> Mood Notes</label>
                          <input 
                             type="text"
                             readOnly={!isEditable}
                             className={`w-full px-6 py-4 border rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300 ${!isEditable ? 'bg-slate-100 border-slate-100 italic' : 'bg-slate-50 border-slate-100 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-300'}`}
                             placeholder={isEditable ? "Briefly describe your current state..." : "No mood notes for this day."}
                             value={entryData.note}
                             onChange={e => setEntryData({...entryData, note: e.target.value})}
                          />
                       </div>
                    </div>

                    {/* Journal Entry */}
                    <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center ml-2"><Book className="h-4 w-4 mr-2 text-indigo-400"/> Personal Journal</h4>
                       <textarea 
                         readOnly={!isEditable}
                         className={`w-full p-6 border rounded-3xl outline-none transition-all font-medium text-slate-700 min-h-[250px] shadow-inner text-lg leading-relaxed resize-y placeholder:text-slate-300 ${!isEditable ? 'bg-slate-50 border-slate-100 italic' : 'bg-white border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400'}`}
                         placeholder={isEditable ? "Start writing your thoughts for the day..." : "No journal entry for this day."}
                         value={entryData.entry}
                         onChange={e => setEntryData({...entryData, entry: e.target.value})}
                       ></textarea>
                       <p className="text-right text-xs font-bold text-slate-300">{entryData.entry.length} characters</p>
                    </div>

                  </form>
                )}
             </div>

             <div className={`p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex ${isEditable ? 'justify-end' : 'justify-center'} space-x-3`}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-10 py-3 font-black rounded-xl transition-all uppercase tracking-widest text-xs ${isEditable ? 'text-slate-500 hover:bg-slate-50' : 'bg-slate-900 text-white shadow-xl hover:bg-slate-800'}`}>
                  {isEditable ? 'Cancel' : 'Done Reading'}
                </button>
                {isEditable && (
                  <button 
                    type="submit" 
                    form="journal-form"
                    disabled={savingModal || loadingModal}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-200 transition-all flex items-center tracking-widest uppercase text-xs"
                  >
                    {savingModal ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    Save Reflection
                  </button>
                )}
             </div>
           </div>
        </div>
      )}

      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-bold text-sm tracking-tight">{notification.message}</span>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookAppointmentModal 
          isOpen={isBookingOpen} 
          onClose={() => {
            setIsBookingOpen(false);
            fetchAppointments();
          }} 
          professionalId={selectedDoctor.id}
          professionalName={selectedDoctor.username}
        />
      )}

      {/* Video Consult Room */}
      {activeVideoRoom && (
        <VideoConsultRoom
          roomName={activeVideoRoom.roomName}
          displayName={activeVideoRoom.displayName}
          onClose={() => {
            // Find the matching appointment and prompt for feedback
            const appt = appointments.find(a => `mindeezy-consult-${a.id}` === activeVideoRoom.roomName);
            setActiveVideoRoom(null);
            if (appt && !feedbackGiven.has(appt.id)) {
              setTimeout(() => setFeedbackTarget(appt), 400);
            }
          }}
        />
      )}

      {/* Feedback Modal */}
      {feedbackTarget && (
        <FeedbackModal
          appointment={feedbackTarget}
          patientId={user?.id}
          onClose={() => {
            setFeedbackTarget(null);
            fetchAppointments(); // Refresh to update reviewed state
          }}
        />
      )}

      {/* Payment Modal (Mock) */}
      {paymentTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col scale-in-95 animate-in zoom-in slide-in-from-bottom-8">
              <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative">
                 <button onClick={() => setPaymentTarget(null)} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"><X className="h-5 w-5" /></button>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight">Secure Checkout</h3>
                       <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">MindEezy Patient Billing</p>
                    </div>
                 </div>
                 <div className="p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold opacity-80">Consultation with {paymentTarget.professional_name}</span>
                       <span className="text-xl font-black">LKR {paymentTarget.amount}</span>
                    </div>
                    <p className="text-[10px] font-medium opacity-60">Professional Share (80%) + System Maintenance (20%)</p>
                 </div>
              </div>

              <div className="p-10 space-y-8 bg-slate-50/50">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Card Holder Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input 
                             type="text" 
                             className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold" 
                             placeholder="E.G. Savindu Manahara" 
                             value={cardForm.holder}
                             onChange={e => setCardForm({...cardForm, holder: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Card Details</label>
                       <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input 
                             type="text" 
                             className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold" 
                             placeholder="0000 0000 0000 0000" 
                             value={cardForm.number}
                             onChange={e => setCardForm({...cardForm, number: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <input 
                          type="text" 
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold" 
                          placeholder="MM/YY" 
                          value={cardForm.expiry}
                          onChange={e => setCardForm({...cardForm, expiry: e.target.value})}
                       />
                       <input 
                          type="password" 
                          maxlength="3" 
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold" 
                          placeholder="CVC" 
                          value={cardForm.cvc}
                          onChange={e => setCardForm({...cardForm, cvc: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <button 
                       disabled={isProcessingPayment}
                       onClick={async () => {
                          setIsProcessingPayment(true);
                          try {
                             await axios.post(`http://localhost:5000/api/payments/process/${paymentTarget.id}`, {
                                cardHolder: cardForm.holder,
                                cardNumber: cardForm.number
                             });
                             showNotification('success', 'Payment successful! Session is now confirmed.');
                             setPaymentTarget(null);
                             setCardForm({ holder: '', number: '', expiry: '', cvc: '' });
                             fetchAppointments();
                          } catch (err) {
                             showNotification('error', 'Payment processing failed.');
                          } finally {
                             setIsProcessingPayment(false);
                          }
                       }}
                       className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                       {isProcessingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4 group-hover:animate-bounce" />}
                       {isProcessingPayment ? 'Processing...' : `Pay LKR ${paymentTarget.amount} Now`}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-bold flex items-center justify-center gap-2 uppercase tracking-tight">
                       <ShieldCheck className="h-3 w-3" /> End-to-end encrypted • Student Project Demo
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
