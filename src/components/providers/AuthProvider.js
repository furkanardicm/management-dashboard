'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ordersApi } from '@/lib/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı bilgisini kontrol et
    const userFromCookie = Cookies.get('user');
    if (userFromCookie) {
      try {
        setUser(JSON.parse(userFromCookie));
      } catch (e) {
        console.error('Cookie parse error:', e);
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Test kullanıcıları
      const testUsers = {
        'project_manager': {
          id: 1,
          username: 'project_manager',
          fullName: 'Proje Yöneticisi',
          role: 'PROJECT_MANAGER'
        },
        'accountant': {
          id: 2,
          username: 'accountant',
          fullName: 'Muhasebeci',
          role: 'ACCOUNTANT'
        }
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = testUsers[username];
      if (user && password === '123456') {
        setUser(user);
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        router.replace('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: 'Geçersiz kullanıcı adı veya şifre' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Bir hata oluştu' };
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    router.replace('/login');
  };

  if (loading) {
    return null; // veya loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 