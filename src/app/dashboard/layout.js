'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">    
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <nav className="bg-white shadow-sm sticky top-0 w-full">
            <div className="max-w-[1400px] mx-auto px-4 h-16">
              <div className="flex justify-between items-center h-full">
                {/* Logo */}
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">Yönetim Paneli</h1>
                </div>

                {/* Sağ taraftaki kullanıcı bilgileri */}
                <div>
                  <button
                    onClick={logout}
                    className="group relative inline-flex items-center px-4 py-2 text-sm font-semibold overflow-hidden bg-white text-red-600 border-2 border-red-600 rounded-lg transition-all duration-300 hover:text-white active:scale-95"
                  >
                    <span className="absolute left-0 w-full h-full bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    <ArrowRightOnRectangleIcon className="relative h-4 w-4 transition-colors duration-300 group-hover:text-white" />
                    <span className="relative ml-2 transition-colors duration-300">Çıkış</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-[1400px] mx-auto px-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 