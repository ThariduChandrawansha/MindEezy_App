import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Calendar, User, FolderTree, Loader2, ArrowLeft, Star, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className="focus:outline-none transition-transform hover:scale-125"
      >
        <Star className={`h-7 w-7 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      </button>
    ))}
  </div>
);

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState([]);
  const [ratingInfo, setRatingInfo] = useState({ count: 0, avg_rating: 0 });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  useEffect(() => {
    fetchBlog();
    fetchComments();
    fetchRating();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error(err);
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blog-comments/blog/${id}`);
      setComments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchRating = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blog-comments/blog/${id}/rating`);
      setRatingInfo(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await axios.post(`http://localhost:5000/api/blog-comments/blog/${id}`, {
        user_id: user.id,
        rating,
        comment
      });
      setSubmitMsg({ type: 'success', text: res.data.message });
      setComment('');
      setRating(5);
      fetchRating();
    } catch (err) {
      setSubmitMsg({ type: 'error', text: err.response?.data?.message || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>;
  }

  if (!blog) return null;

  const avgRating = Number(ratingInfo.avg_rating) || 0;

  return (
    <article className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in duration-700">
      
      {/* Back Button */}
      <Link to="/blogs" className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-xs transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
        <span>Back to Articles</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-6 text-center">
        <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
          {blog.category_name || 'Uncategorized'}
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight max-w-3xl mx-auto">
          {blog.title}
        </h1>
        
        {/* Rating Summary */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-5 w-5 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
            ))}
            <span className="ml-2 font-black text-slate-700">{avgRating > 0 ? avgRating.toFixed(1) : 'No ratings yet'}</span>
            <span className="text-slate-400 text-sm ml-1">({ratingInfo.count} review{ratingInfo.count !== 1 ? 's' : ''})</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 font-bold text-sm">
          <div className="flex items-center"><User className="h-4 w-4 mr-2 text-blue-400"/>By {blog.author_name}</div>
          <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-400"/>{new Date(blog.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Hero Image */}
      {blog.image_path_1 && (
        <div className="rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white bg-slate-50">
          <img 
            src={`http://localhost:5000${blog.image_path_1}`} 
            alt={blog.title} 
            className="w-full h-[50vh] min-h-[400px] object-cover hover:scale-105 transition-transform duration-1000"
          />
        </div>
      )}

      {/* Content Body */}
      <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="prose prose-lg prose-slate max-w-none relative z-10 prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 prose-a:font-bold prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </div>

        {(blog.image_path_2 || blog.image_path_3) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-slate-100 relative z-10">
            {blog.image_path_2 && (
              <div className="rounded-3xl overflow-hidden shadow-lg shadow-slate-200">
                <img src={`http://localhost:5000${blog.image_path_2}`} alt="Article content 2" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"/>
              </div>
            )}
            {blog.image_path_3 && (
              <div className="rounded-3xl overflow-hidden shadow-lg shadow-slate-200">
                <img src={`http://localhost:5000${blog.image_path_3}`} alt="Article content 3" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"/>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============ COMMENTS & RATING SECTION ============ */}
      <div className="space-y-8">
        
        {/* Submit Review */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            Leave a Review
          </h2>
          <p className="text-slate-500 text-sm font-medium mb-6">Your review will be displayed anonymously after approval.</p>

          {!user ? (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <p className="text-slate-600 font-bold mb-3">You must be logged in to leave a review.</p>
              <Link to="/login" className="inline-block px-6 py-3 bg-blue-600 text-white font-black rounded-xl text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors">
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Your Rating</label>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Your Comment (Optional)</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your thoughts about this article..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:border-blue-400 text-sm font-medium resize-none"
                />
              </div>

              {submitMsg && (
                <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold ${submitMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                  {submitMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  {submitMsg.text}
                </div>
              )}

              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 transition-all text-sm uppercase tracking-widest disabled:opacity-70">
                <Send className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>

        {/* Approved Comments List */}
        {comments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" /> Reader Reviews ({comments.length})
            </h3>
            {comments.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-sm">A</div>
                    <span className="font-bold text-slate-700 text-sm">Anonymous Reader</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= c.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    ))}
                  </div>
                </div>
                {c.comment && (
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-4 border-blue-100 pl-4">
                    "{c.comment}"
                  </p>
                )}
                <p className="text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-widest">
                  {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </article>
  );
};

export default BlogView;
