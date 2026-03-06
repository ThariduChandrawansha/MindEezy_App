import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer',
    profileData: {}
  });

  const [notification, setNotification] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      showNotification('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
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
      setFormData({
        ...formData,
        profileData: { ...formData.profileData, profile_pic_path: res.data.filePath }
      });
      showNotification('success', 'Image uploaded successfully');
    } catch (err) {
      showNotification('error', 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        showNotification('success', 'User deleted successfully');
        fetchUsers();
      } catch (err) {
        showNotification('error', 'Failed to delete user');
      }
    }
  };

  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'customer',
      profileData: {}
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (user) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      const userData = res.data;
      setFormMode('edit');
      setFormData({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        password: '', // Don't show password
        profileData: userData.profile || {}
      });
      setIsModalOpen(true);
    } catch (err) {
      showNotification('error', 'Failed to load user details');
    }
  };

  const handleOpenView = async (user) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      setSelectedUser(res.data);
      setIsViewModalOpen(true);
    } catch (err) {
      showNotification('error', 'Failed to load user details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        await axios.post('http://localhost:5000/api/users', formData);
        showNotification('success', 'User created successfully');
      } else {
        await axios.put(`http://localhost:5000/api/users/${formData.id}`, formData);
        showNotification('success', 'User updated successfully');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.category && user.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm">Create, manage, and monitor all system users.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Users</p>
          <p className="text-2xl font-black text-slate-800">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Customers</p>
          <p className="text-2xl font-black text-blue-600">{users.filter(u => u.role === 'customer').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Doctors</p>
          <p className="text-2xl font-black text-emerald-600">{users.filter(u => u.role === 'doctor' || u.role === 'professional').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Admins</p>
          <p className="text-2xl font-black text-rose-600">{users.filter(u => u.role === 'admin').length}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
             <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-200">
               <Filter className="h-4 w-4" />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Member Since</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 italic">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center not-italic">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Loading Users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black not-italic border border-slate-200 group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600 transition-all overflow-hidden">
                          {user.profile_pic_path ? (
                            <img src={`http://localhost:5000${user.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
                          ) : (
                            user.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 not-italic tracking-tight">{user.username}</div>
                          <div className="text-xs text-slate-400 not-italic">{user.email}</div>
                          {user.category && (
                            <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-1">{user.category}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 not-italic">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-rose-100 text-rose-600' : 
                        user.role === 'doctor' || user.role === 'professional' ? 'bg-emerald-100 text-emerald-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 not-italic text-sm text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right not-italic">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenView(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center not-italic">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {formMode === 'create' ? 'Add New User' : 'Edit User Settings'}
                </h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  MindEezy System {formMode === 'create' ? 'Inclusion' : 'Update'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Dr. John Watson"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="waston@mindeezy.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password {formMode === 'edit' && '(Leave blank to keep current)'}</label>
                  <input 
                    type="password" 
                    required={formMode === 'create'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">System Role</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="customer">Customer (Patient)</option>
                    <option value="doctor">Professional (Doctor)</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>

              {/* Profile Image Section */}
              {(formData.role === 'customer' || formData.role === 'doctor') && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Profile Photo</label>
                  <div className="flex items-center space-x-6">
                    <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                      {formData.profileData.profile_pic_path ? (
                        <img src={`http://localhost:5000${formData.profileData.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <Users className="h-8 w-8 text-slate-300" />
                      )}
                    </div>
                    <div className="space-y-2">
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={handleImageUpload}
                         className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                       />
                       <p className="text-[10px] text-slate-400">JPG, PNG or WEBP. Max 2MB.</p>
                       {uploading && <div className="text-blue-600 text-xs font-bold animate-pulse italic">Uploading...</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Profile Sections */}
              {formData.role === 'customer' && (
                <div className="pt-8 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                   <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 border-l-4 border-blue-600 pl-3">Customer Profile Data</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Age</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.age || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, age: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Gender</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.gender || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, gender: e.target.value}})}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Marital Status</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.marital_status || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, marital_status: e.target.value}})}
                        >
                          <option value="">Select Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="In a Relationship">In a Relationship</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Employment Status</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.employment_status || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, employment_status: e.target.value}})}
                        >
                          <option value="">Select Status</option>
                          <option value="Employed">Employed</option>
                          <option value="Unemployed">Unemployed</option>
                        </select>
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Address</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.address || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, address: e.target.value}})}
                        />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Medical History Summary</label>
                        <textarea 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm min-h-[100px]"
                          value={formData.profileData.medical_history || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, medical_history: e.target.value}})}
                        ></textarea>
                      </div>
                   </div>
                </div>
              )}

              {formData.role === 'doctor' && (
                <div className="pt-8 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                   <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-6 border-l-4 border-emerald-600 pl-3">Professional Clinical Data</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Qualifications</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Master of Clinical Psychology"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.qualification || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, qualification: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Professional Category</label>
                        <select 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold"
                          value={formData.profileData.category || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, category: e.target.value}})}
                        >
                          <option value="">Select Category</option>
                          <option value="Psychiatrist">Psychiatrist</option>
                          <option value="Psychologist">Psychologist</option>
                          <option value="Counselor">Counselor</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Clinical Specialty</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Anxiety & OCD"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.specialty || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, specialty: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">License Number</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.license_number || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, license_number: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Years of Exp.</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          value={formData.profileData.experience_years || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, experience_years: e.target.value}})}
                        />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Professional Bio</label>
                        <textarea 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm min-h-[100px]"
                          value={formData.profileData.bio || ''}
                          onChange={(e) => setFormData({...formData, profileData: {...formData.profileData, bio: e.target.value}})}
                        ></textarea>
                      </div>
                   </div>
                </div>
              )}

              {/* Submit Section */}
              <div className="pt-8 border-t border-slate-100 flex justify-end space-x-3 bg-white sticky bottom-0 py-4 mt-auto">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-200 transition-all flex items-center"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {formMode === 'create' ? 'Instate User' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-blue-100 animate-in zoom-in-95 duration-200">
            <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <div className="absolute -bottom-10 left-8 h-20 w-20 rounded-2xl bg-white shadow-xl flex items-center justify-center text-blue-600 text-4xl font-black border-4 border-white overflow-hidden">
                {selectedUser.profile?.profile_pic_path ? (
                  <img src={`http://localhost:5000${selectedUser.profile.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
                ) : (
                  selectedUser.username.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            
            <div className="pt-14 p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedUser.username}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{selectedUser.role} Account • {selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 py-4 border-y border-slate-100 uppercase">
                {selectedUser.role === 'customer' ? (
                  <>
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-400">Gender / Age</span>
                      <span className="text-blue-600">{selectedUser.profile?.gender || 'N/A'} • {selectedUser.profile?.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-400">Marital Status</span>
                      <span className="text-blue-600">{selectedUser.profile?.marital_status || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-400">Employment</span>
                      <span className="text-blue-600">{selectedUser.profile?.employment_status || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-slate-400 text-[10px] font-black">Mental History Summary</span>
                       <p className="text-slate-700 text-sm italic font-medium lowercase normal-case">{selectedUser.profile?.medical_history || 'No history provided.'}</p>
                    </div>
                  </>
                ) : selectedUser.role === 'doctor' || selectedUser.role === 'professional' ? (
                  <>
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-400">Category</span>
                      <span className="text-blue-600">{selectedUser.profile?.category || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-400">Specialty</span>
                      <span className="text-emerald-600">{selectedUser.profile?.specialty || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-400">Exp. Years</span>
                      <span className="text-emerald-600">{selectedUser.profile?.experience_years || '0'} Years</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-slate-400 text-[10px] font-black">Clinical Bio</span>
                       <p className="text-slate-700 text-sm italic font-medium lowercase normal-case">{selectedUser.profile?.bio || 'No bio provided.'}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 font-bold animate-pulse text-center py-4 italic">No extended profile for administrative roles.</p>
                )}
              </div>

              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border animate-in slide-in-from-right-8 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-bold text-sm tracking-tight">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
