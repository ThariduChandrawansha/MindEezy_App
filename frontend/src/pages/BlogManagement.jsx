import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Search,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BlogManagement = ({ authorId = null, isEmbedded = false }) => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    content: '',
    status: 'draft',
    image_path_1: '',
    image_path_2: '',
    image_path_3: '',
    author_id: 1 // Defaulting to first user (Admin) for now
  });

  const [notification, setNotification] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const url = authorId 
        ? `http://localhost:5000/api/blogs?authorId=${authorId}`
        : 'http://localhost:5000/api/blogs';
      const res = await axios.get(url);
      setBlogs(res.data);
    } catch (err) {
      showNotification('error', 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blogs/categories');
      setCategories(res.data);
    } catch (err) {}
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/users/upload', data);
      setFormData({ ...formData, [field]: res.data.filePath });
      showNotification('success', 'Image uploaded');
    } catch (err) {
      showNotification('error', 'Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, content: editorRef.current ? editorRef.current.getContent() : formData.content };
    try {
      if (formMode === 'create') {
        await axios.post('http://localhost:5000/api/blogs', payload);
        showNotification('success', 'Blog created');
      } else {
        await axios.put(`http://localhost:5000/api/blogs/${formData.id}`, payload);
        showNotification('success', 'Blog updated');
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Operation failed';
      showNotification('error', `Error: ${errorMessage}`);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, { status: newStatus });
      showNotification('success', `Article set to ${newStatus}`);
      fetchBlogs();
    } catch (err) {
      showNotification('error', 'Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        showNotification('success', 'Blog deleted');
        fetchBlogs();
      } catch (err) {
        showNotification('error', 'Delete failed');
      }
    }
  };

  const handleOpenEdit = (blog) => {
    setFormMode('edit');
    setFormData(blog);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData({
      title: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      content: '',
      status: 'draft',
      image_path_1: '',
      image_path_2: '',
      image_path_3: '',
      author_id: user?.id || 1
    });
    setIsModalOpen(true);
  };

  const handleOpenView = (blog) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`${isEmbedded ? 'space-y-4' : 'space-y-6'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`${isEmbedded ? 'text-xl' : 'text-2xl'} font-black text-slate-800 tracking-tight`}>
            {authorId ? 'My Articles' : 'Blog Posts'}
          </h1>
          <p className="text-slate-500 text-sm">
            {authorId ? 'Manage your published medical articles.' : 'Write and manage clinical articles.'}
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Title & Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></td></tr>
              ) : filteredBlogs.map(blog => (
                <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 tracking-tight">{blog.title}</div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase">{blog.category_name || 'Uncategorized'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{blog.author_name}</td>
                   <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      blog.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 
                      blog.status === 'pending' ? 'bg-indigo-100 text-indigo-600' : 
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(blog.publish_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                       {user?.role === 'admin' && blog.status === 'pending' && (
                         <button 
                            onClick={() => handleStatusChange(blog.id, 'published')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1 font-bold text-[10px] uppercase"
                            title="Approve & Publish"
                         >
                            <CheckCircle2 className="h-4 w-4"/> Approve
                         </button>
                       )}
                       <button onClick={() => handleOpenView(blog)} className="p-1.5 text-slate-400 hover:text-blue-600"><Eye className="h-4 w-4"/></button>
                       <button onClick={() => handleOpenEdit(blog)} className="p-1.5 text-slate-400 hover:text-amber-600"><Edit className="h-4 w-4"/></button>
                       <button onClick={() => handleDelete(blog.id)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 className="h-4 w-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-black text-slate-800 uppercase tracking-tight">{formMode === 'create' ? 'Compose Article' : 'Edit Article'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-grow custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Article Title</label>
                   <input 
                     type="text" required
                     placeholder="The Future of Mental Health Care"
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold"
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold appearance-none cursor-pointer"
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Uncategorized</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Story Content</label>
                <div className="min-h-[400px] border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                  <Editor
                    apiKey="y4te3ib8ij5s0bom8bkvx8ghqajczsihl4mb3adu6ipjhanh" // TinyMCE default or specific user key if they have one
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={formData.content}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic underline | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[1, 2, 3].map(num => (
                   <div key={num} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Image {num}</label>
                      <div className="flex items-center space-x-3">
                         <div className="h-12 w-12 rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                           {formData[`image_path_${num}`] ? <img src={`http://localhost:5000${formData[`image_path_${num}`]}`} className="h-full w-full object-cover" alt=""/> : <ImageIcon className="h-4 w-4 text-slate-300"/>}
                         </div>
                         <input type="file" onChange={e => handleImageUpload(e, `image_path_${num}`)} className="text-[10px] file:px-2 file:py-1 file:bg-slate-100 file:border-0 file:rounded-md cursor-pointer"/>
                      </div>
                   </div>
                 ))}
              </div>

               <div className="flex items-center space-x-4 pt-6">
                  <label className="text-sm font-bold text-slate-700">Submission Status</label>
                  <select 
                     className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest"
                     value={formData.status}
                     onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="pending">Submit for Review</option>
                    {user?.role === 'admin' && <option value="published">Direct Publish</option>}
                  </select>
               </div>

              <div className="flex justify-end space-x-3 pt-6 bg-white sticky bottom-0 py-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all">Discard</button>
                 <button type="submit" className="px-10 py-3 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center tracking-widest uppercase text-xs">
                   <BookOpen className="h-4 w-4 mr-2" />
                   {formMode === 'create' ? 'Instate Article' : 'Renew Article'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-blue-50">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedBlog.category_name}</span>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="h-5 w-5 text-slate-400"/></button>
            </div>
            <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
               <h2 className="text-3xl font-black text-slate-800 leading-tight mb-4">{selectedBlog.title}</h2>
               <div className="flex items-center space-x-3 mb-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  <span>Author: {selectedBlog.author_name}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                  <span>{new Date(selectedBlog.publish_date).toLocaleDateString()}</span>
               </div>
               
               {selectedBlog.image_path_1 && (
                 <img src={`http://localhost:5000${selectedBlog.image_path_1}`} className="w-full h-80 object-cover rounded-2xl mb-8 shadow-lg" alt="" />
               )}

               <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedBlog.content }}></div>
               
               <div className="grid grid-cols-2 gap-4 mt-8">
                  {selectedBlog.image_path_2 && <img src={`http://localhost:5000${selectedBlog.image_path_2}`} className="w-full h-48 object-cover rounded-2xl shadow-sm" alt="" />}
                  {selectedBlog.image_path_3 && <img src={`http://localhost:5000${selectedBlog.image_path_3}`} className="w-full h-48 object-cover rounded-2xl shadow-sm" alt="" />}
               </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
