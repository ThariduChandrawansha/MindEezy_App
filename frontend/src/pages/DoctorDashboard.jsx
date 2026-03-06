import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format, parseISO, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, subMonths, addMonths, isSameDay } from 'date-fns';
import { 
  User, Calendar as CalendarIcon, Clock, CheckCircle2, 
  X, AlertCircle, Camera, Loader2, HeartPulse, UserCircle,
  ClipboardList, Plus, Search, HelpCircle, Trash2, Video, Star,
  FileText, ChevronLeft, ChevronRight, Book,
  Wallet, Banknote, CreditCard, ArrowDownCircle, PieChart, Landmark
} from 'lucide-react';
import VideoConsultRoom from '../components/VideoConsultRoom';
import BlogManagement from './BlogManagement';

const PatientProgressModal = ({ isOpen, onClose, patient, doctorId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [entryData, setEntryData] = useState(null);
  const [loadingEntry, setLoadingEntry] = useState(false);
  
  // AI Summary State
  const [mentalSummary, setMentalSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [patientBio, setPatientBio] = useState(null);

  useEffect(() => {
    if (isOpen && patient) {
      fetchMonthData(currentDate);
      fetchMentalSummary();
      fetchPatientBio();
      // Auto-select today
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      handleDateClick(todayStr);
    }
  }, [isOpen, currentDate, patient]);

  const fetchPatientBio = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${patient.user_id}`);
      setPatientBio(res.data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMonthData = async (date) => {
    setLoading(true);
    try {
      const year = format(date, 'yyyy');
      const month = format(date, 'MM');
      const res = await axios.get(`http://localhost:5000/api/journals/professional/${doctorId}/patient/${patient.user_id}/month?year=${year}&month=${month}`);
      setMonthData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentalSummary = async () => {
    setLoadingSummary(true);
    try {
      const dbRes = await axios.get(`http://localhost:5000/api/journals/professional/${doctorId}/patient/${patient.user_id}/all`);
      const entries = dbRes.data.filter(e => e.entry && e.entry.trim() !== '');
      
      if (entries.length === 0) {
        setMentalSummary({ emotion: 'Insufficient Data', description: 'Patient has not written enough journal entries for AI analysis.', color: 'bg-slate-100 text-slate-500 border-slate-200' });
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

      const emotion = aiRes.data.emotion.toLowerCase();
      const result = emotionTextConfig[emotion] || { text: 'Neutral / Unknown', color: 'text-slate-500 bg-slate-50 border-slate-200' };
      setMentalSummary({ ...result, guide: aiRes.data.guide, detectedEmotion: emotion });
    } catch (err) {
      console.error(err);
      setMentalSummary({ emotion: 'Analysis Pending', description: 'Could not generate summary at this time.', color: 'text-rose-500 bg-rose-50 border-rose-200' });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleDateClick = async (dateStr) => {
    setSelectedDate(dateStr);
    setLoadingEntry(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/journals/professional/${doctorId}/patient/${patient.user_id}/date/${dateStr}`);
      // Ensure we set entryData even if empty to show the details side correctly
      setEntryData(res.data || { mood_level: 0, note: '', entry: '' });
    } catch (err) {
      console.error(err);
      setEntryData({ mood_level: 0, note: 'Error loading data', entry: '' });
    } finally {
      setLoadingEntry(false);
    }
  };

  if (!isOpen) return null;

  // Calendar builder
  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                <HeartPulse className="h-6 w-6" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-800">Clinical Progress View</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patient: {patient?.patient_name}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="h-6 w-6 text-slate-400" /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-8">
          {/* AI SUMMARY ROW */}
          <div className="mb-8 p-6 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl">
                   <h4 className="font-black text-slate-800 text-lg flex items-center gap-2 mb-2">
                      <span className="text-2xl">🤖</span> AI Clinical Sentiment Analysis
                   </h4>
                   {loadingSummary ? (
                     <div className="flex items-center gap-3 text-emerald-600 font-bold">
                        <Loader2 className="h-5 w-5 animate-spin" /> Performing linguistic analysis...
                     </div>
                   ) : mentalSummary ? (
                      <div className="space-y-3">
                         <div className={`inline-flex px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest shadow-sm ${mentalSummary.color}`}>
                            Current State: {mentalSummary.text || mentalSummary.emotion}
                         </div>
                         <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-indigo-200 pl-4 bg-white/50 p-3 rounded-r-xl">
                           {mentalSummary.guide || mentalSummary.description}
                         </p>
                      </div>
                   ) : null}
                </div>
               
             </div>
          </div>

          {/* BIO DETAILS ROW */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Bio Details</p>
                <p className="text-sm font-bold text-slate-800">{patientBio?.age || '?'} Yrs • <span className="capitalize">{patientBio?.gender || 'Unknown'}</span></p>
             </div>
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Marital Status</p>
                <p className="text-sm font-bold text-slate-800">{patientBio?.marital_status || 'Not set'}</p>
             </div>
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Employment</p>
                <p className="text-sm font-bold text-slate-800">{patientBio?.employment_status || 'Not set'}</p>
             </div>
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Journal Activity</p>
                <p className="text-sm font-bold text-slate-800">High Consistency</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Side */}
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900 text-white p-5 rounded-3xl shadow-xl">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                <span className="font-black uppercase tracking-[0.2em] text-xs">{format(currentDate, 'MMMM yyyy')}</span>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><ChevronRight className="h-5 w-5" /></button>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</div>)}
                {days.map((d, i) => {
                  const dateStr = format(d, 'yyyy-MM-dd');
                  const isCurrMonth = isSameMonth(d, currentDate);
                  const dayData = monthData[dateStr];
                  const isSelected = selectedDate === dateStr;

                  return (
                    <div 
                      key={i} 
                      onClick={() => isCurrMonth && handleDateClick(dateStr)}
                      className={`h-14 flex items-center justify-center rounded-2xl text-xs font-black cursor-pointer transition-all border-2 
                        ${!isCurrMonth ? 'opacity-10 pointer-events-none' : 'hover:border-indigo-400 hover:scale-105'}
                        ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200' : 'bg-slate-50 border-slate-100'}
                        ${dayData?.hasMood ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
                        ${dayData?.hasJournal ? 'relative after:content-[""] after:absolute after:bottom-2 after:h-1 after:w-4 after:bg-emerald-400 after:rounded-full' : ''}
                      `}
                    >
                      {format(d, 'd')}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <div className="h-3 w-3 rounded-full bg-amber-400 shadow-sm shadow-amber-200"></div> Mood Logged
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <div className="h-1 w-4 bg-emerald-400 rounded-full shadow-sm shadow-emerald-200"></div> Journal Entry
                </div>
              </div>
            </div>

            {/* Details Side */}
            <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 min-h-[500px] shadow-inner">
              {loadingEntry ? (
                <div className="h-full flex flex-col items-center justify-center text-indigo-400">
                  <Loader2 className="h-12 w-12 animate-spin mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Accessing patient archives...</p>
                </div>
              ) : selectedDate ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex justify-between items-start">
                     <div>
                       <h4 className="font-black text-slate-800 text-2xl tracking-tight leading-none mb-1">
                         {format(parseISO(selectedDate), 'MMMM do')}
                       </h4>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{format(parseISO(selectedDate), 'yyyy')}</p>
                     </div>
                     {entryData?.mood_level > 0 && (
                       <div className={`px-4 py-2 border rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 ${
                         entryData.mood_level <= 1.5 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                         entryData.mood_level <= 2.5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                         entryData.mood_level <= 3.5 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                         entryData.mood_level <= 4.5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                         'bg-teal-50 text-teal-800 border-teal-200'
                       }`}>
                         <span className="text-xl">📊</span> Wellness Score: {
                           entryData.mood_level <= 1.5 ? 'Very Low' : 
                           entryData.mood_level <= 2.5 ? 'Low' : 
                           entryData.mood_level <= 3.5 ? 'Moderate' : 
                           entryData.mood_level <= 4.5 ? 'Positive' : 'Excellent'
                         } ({entryData.mood_level}/5)
                       </div>
                     )}
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-2 group-hover:text-amber-500 transition-colors">Patient Mood Notes</label>
                        {entryData?.sentiment_score !== null && (
                           <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              AI Sentiment: {entryData.sentiment_score}
                           </span>
                        )}
                      </div>
                      <div className="p-5 bg-white rounded-3xl border border-slate-100 text-sm font-bold text-slate-600 leading-relaxed italic shadow-sm group-hover:shadow-md transition-all">
                        {entryData?.note ? `"${entryData.note}"` : "Patient recorded a mood level but did not provide supplementary notes for this day."}
                      </div>
                      {entryData?.note_created_at && (
                         <p className="text-[9px] font-bold text-slate-300 mt-2 pl-2">Logged at: {format(parseISO(entryData.note_created_at), 'hh:mm a')}</p>
                      )}
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 pl-2 group-hover:text-emerald-500 transition-colors">Daily Journal Record</label>
                      <div className="p-8 bg-white rounded-[32px] border border-slate-100 text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-line shadow-sm min-h-[250px] group-hover:shadow-md transition-all">
                        {entryData?.entry || "No journal entry was logged for this date. The patient may have focused on mood tracking only."}
                      </div>
                      {entryData?.entry_updated_at && (
                         <p className="text-[9px] font-bold text-slate-300 mt-2 pl-2">Last Modified: {format(parseISO(entryData.entry_updated_at), 'MMM d, hh:mm a')}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                  <Book className="h-20 w-20 mb-6 text-slate-400" />
                  <h5 className="text-xl font-black text-slate-800 mb-2">Patient Archive</h5>
                  <p className="text-sm font-bold text-slate-500 max-w-xs">Select a date from the clinical calendar on the left to review specific patient history.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'profile'
  const [notification, setNotification] = useState(null);
  
  // Doctor Profile State
  const [profDetails, setProfDetails] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    qualification: '', specialty: '', category: '', experience_years: '', license_number: '', bio: '',
    session_fee: 0, bank_account: '', bank_name: '', bank_branch: '', bank_holder_name: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Financial State
  const [earningsStats, setEarningsStats] = useState({ total_earned: 0, available_balance: 0, total_withdrawn: 0 });
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Appointments State
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [activeVideoRoom, setActiveVideoRoom] = useState(null); // { roomName, displayName }
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  // Assessments State
  const [assessments, setAssessments] = useState([]);
  const [patientResponses, setPatientResponses] = useState([]);
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    name: '', description: '', questions: [{ text: '', type: 'rating' }]
  });

  // Feedbacks State
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (user) {
      if (activeTab === 'appointments') fetchAppointments();
      if (activeTab === 'profile') fetchProfProfile();
      if (activeTab === 'assessments') {
        fetchAssessments();
        fetchResponses();
      }
      if (activeTab === 'feedbacks') fetchFeedbacks();
      if (activeTab === 'financials') fetchEarnings();
    }
  }, [activeTab, user]);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payments/doctor/earnings/${user.id}`);
      setEarningsStats(res.data);
      const wRes = await axios.get(`http://localhost:5000/api/payments/doctor/withdrawals?doctorId=${user.id}`);
      setWithdrawals(wRes.data);
    } catch (err) { console.error(err); }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount <= 0) return;
    setIsWithdrawing(true);
    try {
      await axios.post('http://localhost:5000/api/payments/doctor/withdraw', { doctorId: user.id, amount: withdrawAmount });
      showNotification('success', 'Withdrawal request submitted!');
      setWithdrawAmount('');
      fetchEarnings();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAppointments = async () => {
    setLoadingAppts(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/public/appointments/${user.id}/doctor`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAppts(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/public/appointments/${id}/status`, { status: newStatus });
      showNotification('success', `Appointment marked as ${newStatus}`);
      fetchAppointments();
    } catch (err) {
      showNotification('error', 'Failed to update status');
    }
  };

  const fetchProfProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile/professional/${user.id}`);
      if (res.data) {
        setProfDetails(res.data);
        setProfileForm({
          qualification: res.data.qualification || '',
          specialty: res.data.specialty || '',
          category: res.data.category || '',
          experience_years: res.data.experience_years || '',
          license_number: res.data.license_number || '',
          bio: res.data.bio || '',
          session_fee: res.data.session_fee || 0,
          bank_account: res.data.bank_account || '',
          bank_name: res.data.bank_name || '',
          bank_branch: res.data.bank_branch || '',
          bank_holder_name: res.data.bank_holder_name || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axios.put(`http://localhost:5000/api/profile/professional/${user.id}`, profileForm);
      showNotification('success', 'Professional details updated');
      setIsEditingProfile(false);
      fetchProfProfile();
    } catch (err) {
      showNotification('error', 'Failed to update professional details');
    } finally {
      setSavingProfile(false);
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
      const res = await axios.post(`http://localhost:5000/api/profile/professional/${user.id}/upload-pic`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showNotification('success', 'Profile picture updated!');
      
      if (updateUser) updateUser({...user, profile_pic_path: res.data.profile_pic_path});
      fetchProfProfile();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/assessments/doctor/${user.id}`);
      const parsed = res.data.map(a => ({
        ...a,
        questions: (typeof a.questions === 'string' && a.questions) ? JSON.parse(a.questions) : (a.questions || [])
      }));
      setAssessments(parsed);
    } catch (err) { console.error(err); }
  };
  
  const fetchResponses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/assessments/doctor/${user.id}/responses`);
      const parsed = res.data.map(r => ({
        ...r,
        responses: (typeof r.responses === 'string' && r.responses) ? JSON.parse(r.responses) : (r.responses || [])
      }));
      setPatientResponses(parsed);
    } catch (err) { console.error(err); }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/feedbacks/doctor/${user.id}`);
      setFeedbacks(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    if (assessmentForm.questions.length === 0) return showNotification('error', 'Add at least one question');
    try {
      await axios.post(`http://localhost:5000/api/assessments`, {
        ...assessmentForm,
        professional_id: user.id
      });
      showNotification('success', 'Custom assessment deployed');
      setIsCreatingAssessment(false);
      setAssessmentForm({ name: '', description: '', questions: [{ text: '', type: 'rating' }] });
      fetchAssessments();
    } catch (err) {
      showNotification('error', 'Failed to create assessment');
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...assessmentForm.questions];
    newQuestions[index][field] = value;
    setAssessmentForm({ ...assessmentForm, questions: newQuestions });
  };
  
  const removeQuestion = (index) => {
    const newQuestions = assessmentForm.questions.filter((_, i) => i !== index);
    setAssessmentForm({ ...assessmentForm, questions: newQuestions });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-emerald-600 to-teal-700 relative">
          <div className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-black uppercase tracking-widest border border-white/30">
            Professional Account
          </div>
          <div className="absolute -bottom-12 left-8 border-[6px] border-slate-50 rounded-full bg-white shadow-xl group/dp">
            <div className="h-24 w-24 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 relative">
               {isUploadingImage ? (
                 <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
               ) : user?.profile_pic_path ? (
                 <img src={`http://localhost:5000${user?.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
               ) : (
                 <span className="text-4xl font-black text-emerald-600">{user?.username?.charAt(0).toUpperCase()}</span>
               )}

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
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Dr. {user?.username}</h1>
              <div className="flex items-center gap-2 mt-1">
                {profDetails?.category && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-black rounded-lg border border-emerald-200">
                    {profDetails.category}
                  </span>
                )}
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Licensed Professional • Ready to help</p>
              </div>
            </div>
            {activeTab === 'profile' && (
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all text-sm uppercase tracking-widest"
              >
                {isEditingProfile ? 'Cancel Edit' : 'Edit Bio'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
            <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4 p-2">Workspace</h3>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'appointments' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <div className="flex items-center space-x-3"><CalendarIcon className="h-5 w-5" /> <span>Schedule</span></div>
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <UserCircle className="h-5 w-5" /> <span>Professional Bio</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all font-bold">
                <HeartPulse className="h-5 w-5" /> <span>Patient Cases</span>
              </button>
              <button 
                onClick={() => setActiveTab('assessments')}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'assessments' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <ClipboardList className="h-5 w-5" /> <span>Assessments</span>
              </button>
              <button 
                onClick={() => setActiveTab('feedbacks')}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'feedbacks' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <Star className="h-5 w-5" /> <span>Patient Feedback</span>
              </button>
              <button 
                onClick={() => setActiveTab('articles')}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'articles' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <FileText className="h-5 w-5" /> <span>My Articles</span>
              </button>
              <button 
                onClick={() => setActiveTab('financials')}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'financials' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <Wallet className="h-5 w-5" /> <span>Financials</span>
              </button>
            </nav>
          </div>
        </div>

        {/* View Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4">Professional Information</h3>
              
              {isEditingProfile || !profDetails ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Category</label>
                       <select 
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400 font-bold"
                         value={profileForm.category} 
                         onChange={e => setProfileForm({...profileForm, category: e.target.value})}
                       >
                         <option value="">Select Category</option>
                         <option value="Psychiatrist">Psychiatrist</option>
                         <option value="Psychologist">Psychologist</option>
                         <option value="Counselor">Counselor</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Specialty</label>
                       <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="e.g. Anxiety & OCD" value={profileForm.specialty} onChange={e => setProfileForm({...profileForm, specialty: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qualifications</label>
                       <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="e.g. Ph.D., Psy.D." value={profileForm.qualification} onChange={e => setProfileForm({...profileForm, qualification: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience (Years)</label>
                       <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="10" value={profileForm.experience_years} onChange={e => setProfileForm({...profileForm, experience_years: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">License Number</label>
                       <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="BOP-12345" value={profileForm.license_number} onChange={e => setProfileForm({...profileForm, license_number: e.target.value})} />
                    </div>
                  </div>

                  {/* FINANCIAL DETAILS */}
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                     <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard className="h-4 w-4"/> Fee & Settlement Details
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Session Fee (LKR)</label>
                          <input type="number" className="w-full px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl outline-none focus:ring-4 focus:border-rose-400 font-bold text-rose-700" placeholder="e.g. 3500" value={profileForm.session_fee} onChange={e => setProfileForm({...profileForm, session_fee: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Holder Name</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="e.g. John Doe" value={profileForm.bank_holder_name} onChange={e => setProfileForm({...profileForm, bank_holder_name: e.target.value})} />
                       </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Name</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="e.g. Bank of Ceylon" value={profileForm.bank_name} onChange={e => setProfileForm({...profileForm, bank_name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Branch</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="e.g. Colombo 07" value={profileForm.bank_branch} onChange={e => setProfileForm({...profileForm, bank_branch: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Number</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400" placeholder="e.g. 0001234567" value={profileForm.bank_account} onChange={e => setProfileForm({...profileForm, bank_account: e.target.value})} />
                       </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Bio</label>
                     <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-emerald-400 min-h-[120px]" placeholder="Brief professional description..." value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})}></textarea>
                  </div>

                  <div className="flex justify-end pt-4">
                     <button type="submit" disabled={savingProfile} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-70">
                       {savingProfile ? 'Saving...' : 'Save Details'}
                     </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Professional Category<span className="text-emerald-700 text-base normal-case font-bold">{profDetails?.category || '-'}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Clinical Specialty<span className="text-slate-800 text-base normal-case font-bold">{profDetails?.specialty || '-'}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Qualifications<span className="text-slate-800 text-base normal-case font-bold">{profDetails?.qualification || '-'}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">Years of Experience<span className="text-slate-800 text-base normal-case font-bold">{profDetails?.experience_years ? `${profDetails.experience_years} Years` : '-'}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1">License No.<span className="text-slate-800 text-base normal-case font-bold">{profDetails?.license_number || '-'}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex flex-col gap-1">Session Fee<span className="text-rose-600 text-base normal-case font-black">LKR {profDetails?.session_fee || '0.00'}</span></p>
                  </div>
                  <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-50 mt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Landmark className="h-3 w-3" /> Settlement Bank Details</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-400">Bank</p>
                        <p className="text-xs font-bold text-slate-700">{profDetails?.bank_name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-400">Branch</p>
                        <p className="text-xs font-bold text-slate-700">{profDetails?.bank_branch || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-400">Account</p>
                        <p className="text-xs font-bold text-slate-700">{profDetails?.bank_account || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-400">Holder</p>
                        <p className="text-xs font-bold text-slate-700">{profDetails?.bank_holder_name || '-'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-50 mt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Professional Biography</p>
                    <p className="text-slate-700 font-medium text-sm leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">
                      {profDetails?.bio || 'Biography not yet fully documented.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SCHEDULE */}
          {activeTab === 'appointments' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-3 text-emerald-500" /> Appointment Inbox
                  </h3>
                </div>

                {loadingAppts ? (
                  <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto" /></div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-bold mb-2">Schedule completely clear</p>
                    <p className="text-slate-400 text-sm">No patients have scheduled therapy sessions at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Separate pending vs confirmed? Let's just list them. */}
                    {appointments.map(app => (
                      <div key={app.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-emerald-200 transition-colors shadow-sm relative overflow-hidden">
                        
                        {/* Status Ribbon */}
                        <div className={`absolute top-0 left-0 w-2 h-full ${
                          app.status === 'pending' ? 'bg-amber-400' :
                          app.status === 'confirmed' ? 'bg-emerald-500' :
                          app.status === 'completed' ? 'bg-slate-400' : 'bg-rose-500'
                        }`}></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                          
                          {/* Patient Details */}
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl overflow-hidden shadow-inner border border-emerald-50">
                              {app.patient_pic ? (
                                <img src={`http://localhost:5000${app.patient_pic}`} className="h-full w-full object-cover" alt="" />
                              ) : (
                                app.patient_name?.charAt(0) || 'P'
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-slate-800">{app.patient_name}</h4>
                              <p className="text-slate-500 font-bold text-xs mt-0.5">{app.patient_email}</p>
                              {app.age && <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Age: {app.age} • {app.gender}</p>}
                            </div>
                          </div>

                          {/* Time & Quick Actions */}
                          <div className="flex flex-col md:items-end gap-3">
                            <div className="flex bg-white shadow-sm border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 items-center">
                               <Clock className="h-4 w-4 mr-2 text-slate-400" />
                               {format(new Date(app.appointment_datetime), 'EEEE, MMM do, h:mm a')}
                            </div>

                               <div className="flex gap-2 w-full md:w-auto mt-2 flex-wrap justify-end">
                                 {app.status === 'pending' && (
                                   <>
                                     <button onClick={() => updateStatus(app.id, 'confirmed')} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all">Confirm</button>
                                     <button onClick={() => updateStatus(app.id, 'cancelled')} className="flex-1 px-4 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">Reject</button>
                                     <button 
                                       onClick={() => {
                                         setSelectedPatient(app);
                                         setIsProgressModalOpen(true);
                                       }}
                                       className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                                     >
                                        Progress
                                     </button>
                                   </>
                                 )}
                               {app.status === 'confirmed' && (
                                 <div className="flex gap-2 w-full md:w-auto flex-wrap">
                                   <button
                                     onClick={() => setActiveVideoRoom({
                                       roomName: `mindeezy-consult-${app.id}`,
                                       displayName: `Dr. ${user?.username}`
                                     })}
                                     className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                                   >
                                     <Video className="h-3.5 w-3.5" /> Join Video
                                   </button>
                                   <button onClick={() => updateStatus(app.id, 'completed')} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all">Complete</button>
                                   <button onClick={() => updateStatus(app.id, 'cancelled')} className="flex-1 px-4 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
                                   <button 
                                     onClick={() => {
                                       setSelectedPatient(app);
                                       setIsProgressModalOpen(true);
                                     }}
                                     className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                                   >
                                      <Book className="h-3.5 w-3.5" /> Progress
                                   </button>
                                 </div>
                               )}
                               {(app.status === 'completed' || app.status === 'cancelled') && (
                                 <div className="flex items-center gap-2">
                                   <span className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                     Session Status: {app.status}
                                   </span>
                                   {app.status === 'completed' && (
                                      <button 
                                        onClick={() => {
                                          setSelectedPatient(app);
                                          setIsProgressModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                                      >
                                          Progress
                                      </button>
                                   )}
                                 </div>
                               )}
                            </div>
                          </div>

                        </div>

                        {/* Any Notes */}
                        {app.notes && (
                           <div className="mt-6 pl-4 pt-4 border-t border-slate-100">
                             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Reason / Notes provided</p>
                             <p className="text-slate-600 text-sm font-medium italic">"{app.notes}"</p>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              
              {/* Assessments Header/Creator */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
                     <ClipboardList className="h-6 w-6 mr-3 text-indigo-500" /> Clinical Assessments
                   </h3>
                   {!isCreatingAssessment && (
                     <button onClick={() => setIsCreatingAssessment(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg text-sm transition-all flex items-center">
                        <Plus className="h-4 w-4 mr-2" /> New Assessment
                     </button>
                   )}
                 </div>

                 {isCreatingAssessment ? (
                   <form onSubmit={handleAssessmentSubmit} className="space-y-6 border-t border-slate-100 pt-6">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assessment Name</label>
                           <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400 font-bold" placeholder="e.g. PTSD Screener" value={assessmentForm.name} onChange={e => setAssessmentForm({...assessmentForm, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description / Instructions</label>
                           <textarea required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:border-indigo-400 min-h-[80px]" placeholder="Brief instructions for the patient..." value={assessmentForm.description} onChange={e => setAssessmentForm({...assessmentForm, description: e.target.value})}></textarea>
                        </div>

                        {/* Questions Builder */}
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Questions Buildout</label>
                              <button type="button" onClick={() => setAssessmentForm({...assessmentForm, questions: [...assessmentForm.questions, { text: '', type: 'rating' }]})} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center">
                                 <Plus className="h-3 w-3 mr-1" /> Add Question
                              </button>
                           </div>

                           {assessmentForm.questions.map((q, i) => (
                             <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                                <div className="flex-1 space-y-2">
                                   <input type="text" required placeholder={`Question ${i + 1}`} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-indigo-400 text-sm" value={q.text} onChange={(e) => updateQuestion(i, 'text', e.target.value)} />
                                </div>
                                <div className="w-40 space-y-2 shrink-0">
                                   <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-indigo-400 text-sm" value={q.type} onChange={(e) => updateQuestion(i, 'type', e.target.value)}>
                                     <option value="rating">Rating (1-5)</option>
                                     <option value="text">Free Text</option>
                                     <option value="boolean">Yes / No</option>
                                   </select>
                                </div>
                                <button type="button" onClick={() => removeQuestion(i)} className="p-2 text-rose-400 hover:bg-rose-100 hover:text-rose-600 rounded-xl transition-colors shrink-0">
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex justify-end pt-6 space-x-3">
                        <button type="button" onClick={() => setIsCreatingAssessment(false)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-xs uppercase tracking-widest">Cancel</button>
                        <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-lg shadow-indigo-200 transition-all text-xs uppercase tracking-widest">Deploy Assessment</button>
                     </div>
                   </form>
                 ) : (
                   /* List Built Assessments */
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {assessments.length === 0 ? (
                        <div className="col-span-full py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl"><p className="text-slate-500 font-bold text-sm">No custom assessments created yet.</p></div>
                     ) : assessments.map(a => (
                        <div key={a.id} className="p-5 border border-slate-200 rounded-2xl hover:border-indigo-300 transition-colors bg-white shadow-sm">
                           <h4 className="font-black text-slate-800 text-lg mb-1 truncate">{a.name}</h4>
                           <p className="text-slate-500 text-xs mb-4 line-clamp-2">{a.description}</p>
                           <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg w-max">
                              <HelpCircle className="h-3 w-3 mr-1" /> {a.questions?.length || 0} Questions
                           </div>
                        </div>
                     ))}
                   </div>
                 )}
              </div>

              {/* Patient Responses Viewer */}
              {!isCreatingAssessment && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Patient Submissions</h3>
                  {patientResponses.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-500 font-bold mb-1">No responses yet</p>
                      <p className="text-slate-400 text-sm">When patients complete your assessments, they will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patientResponses.map(r => (
                        <div key={r.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h4 className="font-bold text-slate-800">{r.patient_name}</h4>
                                 <p className="text-xs font-black uppercase text-indigo-600 tracking-widest">Assessment: {r.assessment_name}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-200">
                                 {format(new Date(r.response_date), 'MMM d, yyyy')}
                              </span>
                           </div>
                           
                           <div className="space-y-3 pt-4 border-t border-slate-200">
                             {r.responses && r.responses.length > 0 ? r.responses.map((resp, i) => (
                               <div key={i} className="bg-white p-3 rounded-xl border border-slate-100">
                                  <p className="text-xs font-bold text-slate-600 mb-1">{resp.question}</p>
                                  <p className="text-sm font-black text-indigo-900">{resp.answer}</p>
                               </div>
                             )) : <p className="text-xs text-slate-400 italic">No structured data</p>}
                           </div>

                           {r.notes && (
                             <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                               <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Patient Comments</p>
                               <p className="text-xs font-bold text-slate-700">"{r.notes}"</p>
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: FEEDBACKS */}
          {activeTab === 'feedbacks' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 flex items-center">
                  <Star className="h-6 w-6 mr-3 text-amber-400 fill-amber-400" /> Patient Feedback
                </h3>

                {/* Average Rating Banner */}
                {feedbacks.length > 0 && (() => {
                  const avg = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);
                  return (
                    <div className="flex items-center gap-4 mb-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                      <div className="text-5xl font-black text-amber-500">{avg}</div>
                      <div>
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`h-6 w-6 ${s <= Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-sm font-bold text-slate-600">{feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''} from patients</p>
                      </div>
                    </div>
                  );
                })()}

                {feedbacks.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Star className="h-12 w-12 text-slate-200 fill-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold mb-1">No feedback yet</p>
                    <p className="text-slate-400 text-sm">Patient reviews will appear here after sessions.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map(f => (
                      <div key={f.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-amber-100 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800">{f.patient_name}</h4>
                            <p className="text-xs text-slate-400 font-bold">{format(new Date(f.created_at), 'MMM d, yyyy')}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`h-5 w-5 ${s <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        {f.comment && (
                          <p className="text-sm text-slate-600 font-medium bg-white p-4 rounded-xl border border-slate-100 italic">&#8220;{f.comment}&#8221;</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: ARTICLES (BLOGS) */}
          {activeTab === 'articles' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[600px]">
               <BlogManagement authorId={user.id} isEmbedded={true} />
            </div>
          )}

          {/* TAB: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-emerald-600 p-6 rounded-[32px] text-white shadow-xl shadow-emerald-200">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2 flex items-center gap-2"><PieChart className="h-3 w-3"/> Total Gross Sales</p>
                    <h3 className="text-3xl font-black tracking-tight">LKR {Number(earningsStats.total_earned / 0.8 || 0).toLocaleString()}</h3>
                    <p className="text-[10px] font-bold mt-2 opacity-70">Before 20% system fees</p>
                 </div>
                 <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><ArrowDownCircle className="h-3 w-3 text-emerald-500"/> Total My Earnings</p>
                    <h3 className="text-3xl font-black tracking-tight text-slate-800">LKR {Number(earningsStats.total_earned).toLocaleString()}</h3>
                    <p className="text-[10px] font-bold mt-2 text-emerald-600">Pure 80% doctor share</p>
                 </div>
                 <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-200">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2 flex items-center gap-2"><Landmark className="h-3 w-3"/> Withdrawable Balance</p>
                    <h3 className="text-3xl font-black tracking-tight">LKR {Number(earningsStats.available_balance).toLocaleString()}</h3>
                    <p className="text-[10px] font-bold mt-2 opacity-70">Available for settlement</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Withdrawal Form */}
                 <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h4 className="text-lg font-black text-slate-800 tracking-tight mb-6 flex items-center gap-3">
                       <Banknote className="h-5 w-5 text-indigo-500" /> Request Withdrawal
                    </h4>
                    <form onSubmit={handleWithdrawal} className="space-y-4">
                       <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-4">
                          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Target Account</p>
                          <p className="text-sm font-bold text-indigo-700 truncate">{profDetails?.bank_name || 'No Bank Set'} - {profDetails?.bank_account || 'N/A'}</p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Amount to Withdraw (LKR)</label>
                          <input 
                             type="number" 
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-black text-slate-800"
                             placeholder="Min LKR 1000"
                             value={withdrawAmount}
                             onChange={e => setWithdrawAmount(e.target.value)}
                          />
                       </div>
                       <button 
                          type="submit"
                          disabled={isWithdrawing || !withdrawAmount || Number(withdrawAmount) > earningsStats.available_balance}
                          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                       >
                          {isWithdrawing ? <Loader2 className="h-4 w-4 animate-spin mx-auto"/> : 'Proceed Withdrawal'}
                       </button>
                    </form>
                 </div>

                 {/* Settlement History */}
                 <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h4 className="text-lg font-black text-slate-800 tracking-tight mb-6 flex items-center gap-3">
                       <Clock className="h-5 w-5 text-slate-400" /> Withdrawal History
                    </h4>
                    {withdrawals.length === 0 ? (
                       <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <p className="text-slate-400 font-bold">No previous settlements found</p>
                       </div>
                    ) : (
                       <div className="space-y-3">
                          {withdrawals.map(w => (
                             <div key={w.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                                <div>
                                   <p className="text-xs font-black text-slate-800 tracking-tight">LKR {Number(w.amount).toLocaleString()}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(w.created_at), 'MMM d, yyyy')}</p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                   w.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                   w.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                   {w.status}
                                </span>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-bold text-sm tracking-tight">{notification.message}</span>
        </div>
      )}

      {/* Progress Modal */}
      <PatientProgressModal 
        isOpen={isProgressModalOpen} 
        onClose={() => setIsProgressModalOpen(false)}
        patient={selectedPatient}
        doctorId={user?.id}
      />

      {/* Video Consult Room */}
      {activeVideoRoom && (
        <VideoConsultRoom
          roomName={activeVideoRoom.roomName}
          displayName={activeVideoRoom.displayName}
          onClose={() => setActiveVideoRoom(null)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
