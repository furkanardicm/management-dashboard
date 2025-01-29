'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // İlk yüklemede sidebar durumunu kontrol et
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    const isMobile = window.innerWidth < 768;
    
    // Eğer localStorage'da değer varsa onu kullan, yoksa mobil durumuna göre ayarla
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    } else {
      setSidebarOpen(!isMobile);
      localStorage.setItem('sidebarState', (!isMobile).toString());
    }
    setIsInitialized(true);
  }, []);

  // sidebar durumu değiştiğinde güncelle
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sidebarState') {
        setSidebarOpen(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!user) {
    router.replace('/login');
    return null;
  }

  // İlk yükleme tamamlanana kadar loading göster
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">    
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col overflow-hidden ${
          sidebarOpen ? 'ml-[240px]' : 'ml-0'
        } transition-all duration-300`}>
          {/* Navbar */}
          <nav className="bg-white shadow-sm sticky top-0">
            <div className="max-w-[1400px] mx-auto px-4 w-full">
              <div className="flex justify-between items-center h-16">
                {/* Logo - Sidebar kapalıyken göster */}
                <div className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-0 invisible w-0' : 'opacity-100 visible w-auto'}`}>
                  <h1 className="text-lg font-semibold text-gray-800">Yönetim Paneli</h1>
                </div>

                {/* Sağ taraftaki kullanıcı bilgileri */}
                <div className="flex items-center space-x-4 ml-auto">
                  <span className="text-gray-900 font-medium">
                    {user.fullName}
                  </span>
                  <button
                    onClick={logout}
                    className="group relative inline-flex items-center px-4 py-2 text-sm font-bold overflow-hidden bg-white text-red-700 border-2 border-red-700 rounded-lg transition-all duration-300 hover:border-red-700 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)] active:scale-95"
                  >
                    <span className="absolute font-bold inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    <ArrowRightOnRectangleIcon className="relative h-5 w-5 mr-2 transition-colors duration-300 group-hover:text-white" />
                    <span className="relative transition-colors duration-300 group-hover:text-white">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4">
            <div className={`max-w-[1400px] mx-auto w-full px-4 transition-all duration-300 ${
              sidebarOpen ? '' : 'flex justify-center'
            }`}>
              <div className={`transition-all duration-300 ${
                sidebarOpen ? 'w-full' : 'max-w-[1400px] w-full'
              }`}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 