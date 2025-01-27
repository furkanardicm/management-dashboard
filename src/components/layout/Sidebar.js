'use client';

import { useAuth } from '../providers/AuthProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

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

  const toggleSubmenu = (groupName, itemName) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [`${groupName}-${itemName}`]: !prev[`${groupName}-${itemName}`]
    }));
  };

  return (
    <div className="w-64 bg-white h-full shadow-sm flex flex-col">
      {/* Logo Alanı */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">Yönetim Paneli</span>
        </div>
      </div>

      {/* Menü */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {Object.entries(menu).map(([group, items]) => (
          <div key={group} className="mb-6">
            <h3 className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              {group}
            </h3>
            <div className="mt-3 space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isSubmenuOpen = openSubmenus[`${group}-${item.name}`];
                
                if (item.submenu) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleSubmenu(group, item.name)}
                        className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out text-gray-900 hover:bg-gray-50`}
                      >
                        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.name}</span>
                        <svg
                          className={`w-4 h-4 ml-2 transform transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isSubmenuOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <Link
                                key={subItem.path}
                                href={subItem.path}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                                  pathname === subItem.path
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                              >
                                <SubIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                      pathname === item.path
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 