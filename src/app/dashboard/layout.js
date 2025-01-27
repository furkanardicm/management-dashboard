'use client';

import { useState } from 'react';
import { useAuth } from '../../components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 shadow-sm"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:relative lg:inset-0 z-30 transition duration-300 ease-in-out`}
        >
          <div className="h-full relative bg-white">
            <Sidebar />
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 -right-12 p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:pl-0">
          {/* Navbar */}
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-end items-center h-16">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900 font-medium">
                    {user.fullName}
                  </span>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 