import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Search, Filter, Loader2, ArrowRight } from 'lucide-react';

const PublicBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get all published blogs
      const resBlogs = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(resBlogs.data.filter(b => b.status === 'published'));

      // Get categories
      const resCategories = await axios.get('http://localhost:5000/api/blogs/categories');
      setCategories(resCategories.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <BookOpen className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Articles & Insights</h1>
          <p className="text-blue-100 font-medium text-lg">Explore expert advice, mental health tips, and inspiring stories from our professionals.</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-30">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          <Filter className="h-5 w-5 text-slate-400 shrink-0" />
          <div className="flex space-x-2 shrink-0">
             <button 
               onClick={() => setSelectedCategory('All')}
               className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
             >
               All
             </button>
             {categories.map(cat => (
               <button 
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat.id.toString())}
                 className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id.toString() ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
               >
                 {cat.name}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="py-20 text-center"><Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" /></div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
           <BookOpen className="h-16 w-16 mx-auto text-slate-200 mb-6" />
           <h3 className="text-2xl font-black text-slate-800">No articles found</h3>
           <p className="text-slate-500 mt-2">Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <Link to={`/blogs/${blog.id}`} key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-50/50 hover:-translate-y-1 transition-all group flex flex-col">
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                {blog.image_path_1 ? (
                  <img src={`http://localhost:5000${blog.image_path_1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={blog.title} />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300 bg-slate-50"><BookOpen className="h-12 w-12"/></div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {blog.category_name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                  <span>By {blog.author_name}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-snug mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                {/* Parse HTML content just to get a brief text snippet without tags, then clamp it */}
                <div 
                  className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow"
                  dangerouslySetInnerHTML={{ __html: blog.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...' }}
                />

                <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
                  Read Article <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicBlogs;
