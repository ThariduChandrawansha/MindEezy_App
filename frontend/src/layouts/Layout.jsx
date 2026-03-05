import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MentalHealthChat from '../components/MentalHealthChat';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <MentalHealthChat />
    </div>
  );
};

export default Layout;
