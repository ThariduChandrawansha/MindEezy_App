import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FolderTree, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cat_image_path: ''
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/blogs/categories');
      setCategories(res.data);
    } catch (err) {
      showNotification('error', 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append('image', file);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/users/upload', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, cat_image_path: res.data.filePath });
      showNotification('success', 'Image uploaded');
    } catch (err) {
      showNotification('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        await axios.post('http://localhost:5000/api/blogs/categories', formData);
        showNotification('success', 'Category created');
      } else {
        await axios.put(`http://localhost:5000/api/blogs/categories/${formData.id}`, formData);
        showNotification('success', 'Category updated');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      showNotification('error', 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/categories/${id}`);
        showNotification('success', 'Category deleted');
        fetchCategories();
      } catch (err) {
        showNotification('error', 'Delete failed');
      }
    }
  };

  const handleOpenEdit = (cat) => {
    setFormMode('edit');
    setFormData(cat);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData({ name: '', description: '', cat_image_path: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Blog Categories</h1>
          <p className="text-slate-500 text-sm">Organize your MindEezy articles.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          </div>
        ) : categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="h-40 bg-slate-100 relative">
              {cat.cat_image_path ? (
                <img src={`http://localhost:5000${cat.cat_image_path}`} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderTree className="h-12 w-12 text-slate-300" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(cat)} className="p-2 bg-white/90 rounded-lg text-amber-600 hover:bg-white shadow-sm">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 bg-white/90 rounded-lg text-rose-600 hover:bg-white shadow-sm">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-800 text-lg mb-1">{cat.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{cat.description || 'No description provided.'}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-tight">{formMode === 'create' ? 'Create Category' : 'Edit Category'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm min-h-[100px]"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cover Image</label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {formData.cat_image_path ? <img src={`http://localhost:5000${formData.cat_image_path}`} className="h-full w-full object-cover" alt=""/> : <ImageIcon className="h-6 w-6 text-slate-300"/>}
                  </div>
                  <input type="file" onChange={handleImageUpload} className="text-xs file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-lg file:px-3 file:py-1"/>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all uppercase text-xs tracking-widest shadow-lg shadow-blue-200"
              >
                {formMode === 'create' ? 'Create Category' : 'Save Changes'}
              </button>
            </form>
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

export default CategoryManagement;
