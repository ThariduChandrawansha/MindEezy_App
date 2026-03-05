import React, { useState } from 'react';
import axios from 'axios';
import { Star, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

/**
 * FeedbackModal
 * Props:
 *   appointment  - { id, professional_id, professional_name, appointment_datetime }
 *   patientId    - logged-in patient's user id
 *   onClose      - callback after submit or dismiss
 */
const FeedbackModal = ({ appointment, patientId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const labels = ['', 'Poor', 'Below Average', 'Good', 'Very Good', 'Excellent'];
  const colors = ['', 'text-rose-500', 'text-orange-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a star rating.');
    setError(null);
    setSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/feedbacks', {
        appointment_id: appointment.id,
        patient_id: patientId,
        doctor_id: appointment.professional_id,
        rating,
        comment
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg outline outline-4 outline-white/20 animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-indigo-50 to-teal-50 border-b border-slate-100 relative">
          <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">How was your session?</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Session with <span className="font-bold text-indigo-600">Dr. {appointment.professional_name}</span>
          </p>
        </div>

        {submitted ? (
          // --- SUCCESS STATE ---
          <div className="p-10 flex flex-col items-center text-center animate-in fade-in duration-500">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Thank you!</h3>
            <p className="text-slate-500 font-medium mb-8">Your feedback helps us improve the experience for everyone.</p>
            <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs shadow-xl">
              Close
            </button>
          </div>
        ) : (
          // --- FORM STATE ---
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Star Rating */}
            <div className="flex flex-col items-center space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-125 active:scale-95"
                  >
                    <Star
                      className={`h-12 w-12 transition-all duration-150 drop-shadow-sm ${
                        star <= (hovered || rating) 
                          ? 'fill-amber-400 text-amber-400 scale-110' 
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(hovered || rating) > 0 && (
                <p className={`font-black text-lg tracking-tight transition-all animate-in fade-in duration-200 ${colors[hovered || rating]}`}>
                  {labels[hovered || rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Experience (Optional)</label>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none font-medium text-slate-700 placeholder:text-slate-300"
                rows="4"
                placeholder="Share your thoughts about this therapy session..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <p className="text-right text-xs text-slate-300 font-bold">{comment.length}/500</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all text-sm uppercase tracking-widest">
                Skip
              </button>
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-xl shadow-indigo-200 transition-all text-sm uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
