import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ cartCount }) => {
  return (
    <div className="font-sans antialiased text-[#1d1d1f] bg-white min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
