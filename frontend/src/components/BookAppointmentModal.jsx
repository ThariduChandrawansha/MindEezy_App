import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Calendar, Clock, User as UserIcon, CheckCircle2, AlertCircle, Loader2, HeartPulse, X 
} from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';

const BookAppointmentModal = ({ isOpen, onClose, professionalId, professionalName }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const next14Days = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i));

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      showNotification('error', 'Please select a time slot');
      return;
    }

    setLoading(true);
    
    // Create standard ISO datetime string
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const datetimeStr = `${dateStr} ${selectedTime}:00`;

    try {
      await axios.post('http://localhost:5000/api/public/appointments', {
        userId: user.id,
        professionalId,
        appointmentDatetime: datetimeStr,
        notes
      });
      showNotification('success', 'Appointment booked successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to book appointment';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col outline outline-4 outline-white/20 scale-in-95 animate-in zoom-in slide-in-from-bottom-8">
        
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center z-10 sticky top-0">
          <div>
            <h3 className="text-2xl font-black tracking-tight flex items-center shadow-sm">
               <Calendar className="h-6 w-6 mr-3 opacity-80" />
               Book Session
            </h3>
            <p className="text-blue-100 font-medium text-sm mt-1">with {professionalName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="h-6 w-6 text-white" /></button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-slate-50">
          <form id="booking-form" onSubmit={handleBooking} className="space-y-8">
            
            {/* Date Selection */}
            <div className="space-y-4">
               <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center"><Calendar className="h-4 w-4 mr-2 text-indigo-400"/> Select Date</h4>
               <div className="flex overflow-x-auto pb-4 gap-3 snap-x custom-scrollbar">
                  {next14Days.map(date => {
                    const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                    return (
                      <button
                        key={date.toString()}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`snap-start shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all min-w-[80px] ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300'}`}
                      >
                         <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>{format(date, 'EEE')}</span>
                         <span className="text-2xl font-black">{format(date, 'd')}</span>
                      </button>
                    )
                  })}
               </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
               <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center"><Clock className="h-4 w-4 mr-2 text-indigo-400"/> Select Time Slot</h4>
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                 {timeSlots.map(time => {
                   const isSelected = selectedTime === time;
                   return (
                     <button
                       key={time}
                       type="button"
                       onClick={() => setSelectedTime(time)}
                       className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300'}`}
                     >
                       {time}
                     </button>
                   )
                 })}
               </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
               <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Private Notes (Optional)</h4>
               <textarea 
                 className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-slate-700 min-h-[120px] shadow-sm resize-y"
                 placeholder="Any specific topics you'd like to discuss..?"
                 value={notes}
                 onChange={e => setNotes(e.target.value)}
               ></textarea>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex justify-end space-x-3">
           <button type="button" onClick={onClose} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
           <button 
             type="submit" 
             form="booking-form"
             disabled={loading}
             className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-200 transition-all flex items-center tracking-widest uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <HeartPulse className="h-4 w-4 mr-2 animate-pulse" />}
             Confirm Booking
           </button>
        </div>

        {/* Local Notification */}
        {notification && (
          <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 border animate-in slide-in-from-top-4 ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookAppointmentModal;
