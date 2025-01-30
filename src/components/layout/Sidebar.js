'use client';

import { useAuth } from '../providers/AuthProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Menü yapılandırması
const PROJECT_MANAGER_MENU = {
  'Sistem': [
    { name: 'Anasayfa', path: '/dashboard', icon: HomeIcon },
    { name: 'Kullanıcılar', path: '/dashboard/users', icon: UsersIcon },
  ],
  'Satışlar / Siparişler': [
    {
      name: 'Siparişler',
      icon: ShoppingCartIcon,
      submenu: [
        { name: 'Sipariş Listesi', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
        { name: 'Yeni Sipariş', path: '/dashboard/orders/new', icon: PlusCircleIcon },
        { name: 'Satış Raporu', path: '/dashboard/orders/report', icon: ChartBarIcon },
      ]
    },
    { name: 'Sponsor Firmalar', path: '/dashboard/sponsors', icon: BuildingOfficeIcon },
  ],
  'Satış Pazarlama': [
    { name: 'Tip Müşteri Yönetimi', path: '/dashboard/tip-musteri', icon: UserGroupIcon },
    { name: 'Kamu Müşteri Yönetimi', path: '/dashboard/kamu-musteri', icon: BuildingOfficeIcon },
    { name: 'Rakip Firma Takibi', path: '/dashboard/rakip-firma', icon: ChartBarIcon },
    { name: 'İhale / Teklif Yönetimi', path: '/dashboard/ihale-teklif', icon: DocumentTextIcon },
    { name: 'Ziyaret Yönetimi', path: '/dashboard/ziyaret', icon: ClipboardDocumentListIcon },
  ]
};

const ACCOUNTANT_MENU = {
  'Sistem': [
    { name: 'Anasayfa', path: '/dashboard', icon: HomeIcon },
  ],
  'Satınalma': [
    { name: 'Gider Belgelerini Listele', path: '/dashboard/expenses', icon: DocumentTextIcon },
    { name: 'Ödeme Talebi Listele', path: '/dashboard/payment-requests', icon: CurrencyDollarIcon },
  ],
  'Satış': [
    {
      name: 'Siparişler',
      icon: ShoppingCartIcon,
      submenu: [
        { name: 'Sipariş Listesi', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
        { name: 'Yeni Sipariş', path: '/dashboard/orders/new', icon: PlusCircleIcon },
        { name: 'Satış Raporu', path: '/dashboard/orders/report', icon: ChartBarIcon },
      ]
    },
    { name: 'Müşteriler', path: '/dashboard/customers', icon: UserGroupIcon },
  ],
  'Destek': [
    { name: 'Destek Talebi', path: '/dashboard/support', icon: QuestionMarkCircleIcon },
  ]
};

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const menu = user?.role === 'PROJECT_MANAGER' ? PROJECT_MANAGER_MENU : ACCOUNTANT_MENU;
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Sadece ilk yüklemede sidebar'ı otomatik aç
      if (typeof window !== 'undefined' && !localStorage.getItem('sidebarState')) {
        setIsOpen(!isMobileView);
        localStorage.setItem('sidebarState', (!isMobileView).toString());
      }
    };

    // Sayfa yüklendiğinde localStorage'dan sidebar durumunu al
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      setIsOpen(savedState === 'true');
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarState', newState.toString());
  };

  const toggleSubmenu = (groupName, itemName) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [`${groupName}-${itemName}`]: !prev[`${groupName}-${itemName}`]
    }));
  };

  return (
    <>
      {/* Overlay - Mobilde sidebar açıkken arka planı karartır */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className="flex h-full">
        <aside
          className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0 w-[240px]' : '-translate-x-[240px] w-[240px]'
          }`}
        >
          {/* Toggle Butonu - Sidebar'ın Kenarında */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-7 top-20 z-50 p-1.5 rounded-r-md bg-white border border-l-0 border-gray-200 hover:bg-gray-100 text-gray-600 shadow-sm"
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>

          <div className="flex flex-col h-full">
            {/* Logo Alanı */}
            <div className="flex items-center h-16 px-4 border-b border-gray-200">
              <h1 className="text-lg font-semibold text-gray-800">Yönetim Paneli</h1>
            </div>

            {/* Menü */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {Object.entries(menu).map(([group, items]) => (
                <div key={group} className="mb-4">
                  <h3 className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {group}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const isSubmenuOpen = openSubmenus[`${group}-${item.name}`];

                      if (item.submenu) {
                        return (
                          <div key={item.name}>
                            <button
                              onClick={() => toggleSubmenu(group, item.name)}
                              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out text-gray-900 hover:bg-gray-50"
                            >
                              <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="flex-1 text-left">{item.name}</span>
                              <svg
                                className={`w-3 h-3 ml-2 transform transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {isSubmenuOpen && (
                              <div className="ml-3 mt-1 space-y-1">
                                {item.submenu.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  const isActive = pathname === subItem.path;
                                  return (
                                    <Link
                                      key={subItem.path}
                                      href={subItem.path}
                                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                                        isActive
                                          ? 'bg-indigo-50 text-indigo-700'
                                          : 'text-gray-900 hover:bg-gray-50'
                                      }`}
                                    >
                                      <SubIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                      {subItem.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
} 