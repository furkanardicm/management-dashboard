'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">
        {/* Sol taraf - Resim ve Başlık (Sadece masaüstünde) */}
        <div className="hidden md:flex w-1/2 max-w-md flex-col items-center justify-center p-8 md:p-12">
          <div className="relative w-full max-w-[400px] mb-8">
            <Image
              src="/indir.png"
              alt="Login"
              width={400}
              height={300}
              priority
              className="object-contain w-full h-auto"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Folio | İş Zekası Yazılımı
            </h1>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">Teknik</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">Hız</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full">Deneyim</span>
              <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full">İrade</span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">Disiplin</span>
            </div>
          </div>
        </div>

        {/* Sağ taraf - Login Formu */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
            {/* Mobil için resim ve başlık */}
            <div className="md:hidden mb-8">
              <div className="relative w-48 h-36 mx-auto mb-4">
                <Image
                  src="/indir.png"
                  alt="Login"
                  width={200}
                  height={150}
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
                Folio | İş Zekası Yazılımı
              </h1>
              <div className="flex flex-wrap justify-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">Teknik</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Hız</span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">Deneyim</span>
                <span className="px-2 py-0.5 bg-pink-50 text-pink-700 rounded-full">İrade</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Disiplin</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-center text-2xl font-bold text-gray-900">
                Giriş
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Tüm işlemler kayıt altına alınmaktadır
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Kullanıcı Adı
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı giriniz"
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Parola
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolanızı giriniz"
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    Parolanızı mı unuttunuz?
                  </a>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-medium text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Giriş yapılıyor...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Giriş Yap</span>
                      <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                      <div className="absolute inset-0 h-full w-0 bg-indigo-700 rounded-xl transition-all duration-300 group-hover:w-full"></div>
                    </>
                  )}
                </button>
              </div>

              <div className="text-sm text-center text-gray-600 space-y-1 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Test Kullanıcıları:</p>
                <p>Kullanıcı Adı: project_manager veya accountant</p>
                <p>Şifre: 123456</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center">
        <p className="text-xs text-gray-500">
          v1.0 - Son Güncelleme: 17.02.2023
        </p>
      </div>
    </div>
  );
} 