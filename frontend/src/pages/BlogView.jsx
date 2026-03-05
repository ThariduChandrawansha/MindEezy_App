import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Calendar, User, FolderTree, Loader2, ArrowLeft } from 'lucide-react';

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>;
  }

  if (!blog) return null;

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
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 font-bold text-sm">
          <div className="flex items-center"><User className="h-4 w-4 mr-2 text-blue-400"/> By {blog.author_name}</div>
          <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-400"/> {new Date(blog.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
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
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="prose prose-lg prose-slate max-w-none relative z-10 prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 prose-a:font-bold prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </div>

        {/* Supplemental Images */}
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

    </article>
  );
};

export default BlogView;
