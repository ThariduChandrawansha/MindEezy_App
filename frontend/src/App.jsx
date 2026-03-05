import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import BlogManagement from './pages/BlogManagement';
import CategoryManagement from './pages/CategoryManagement';
import DoctorDashboard from './pages/DoctorDashboard';
import CustomerProfile from './pages/CustomerProfile';
import PublicBlogs from './pages/PublicBlogs';
import BlogView from './pages/BlogView';
import About from './pages/About';
import Contact from './pages/Contact';
import Professionals from './pages/Professionals';
import ProfessionalProfile from './pages/ProfessionalProfile';
import EmergencyServices from './pages/EmergencyServices';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles, useDashboardLayout = false }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="h-12 w-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading MindEezy...</p>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // Wrap in DashboardLayout if requested, otherwise return as is (Outer Layout wraps it in App)
  if (useDashboardLayout) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return children;
};

// Route wrapper for Public pages with Layout
const PublicRoute = ({ children }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
          <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
          <Route path="/blogs" element={<PublicRoute><PublicBlogs /></PublicRoute>} />
          <Route path="/blogs/:id" element={<PublicRoute><BlogView /></PublicRoute>} />
          <Route path="/professionals" element={<PublicRoute><Professionals /></PublicRoute>} />
          <Route path="/professionals/:id" element={<PublicRoute><ProfessionalProfile /></PublicRoute>} />
          <Route path="/emergency" element={<PublicRoute><EmergencyServices /></PublicRoute>} />
          
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Customer Profile (Front side layout) */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'doctor', 'admin']}>
                <PublicRoute><CustomerProfile /></PublicRoute>
              </ProtectedRoute>
            } 
          />
          {/* Admin Dashboard (Dashboard Sidebar Layout - No Public Header/Footer) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']} useDashboardLayout={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']} useDashboardLayout={true}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/blogs" 
            element={
              <ProtectedRoute allowedRoles={['admin']} useDashboardLayout={true}>
                <BlogManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute allowedRoles={['admin']} useDashboardLayout={true}>
                <CategoryManagement />
              </ProtectedRoute>
            } 
          />

          {/* Doctor Dashboard (Dashboard Sidebar Layout - No Public Header/Footer) */}
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRoles={['doctor']} useDashboardLayout={true}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
