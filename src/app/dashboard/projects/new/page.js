'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi, sponsorsApi } from '@/lib/services/api';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function YeniProje() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    company: '',
    status: 'active'
  });

  useEffect(() => {
    // Sponsorları yükle
    const loadCompanies = async () => {
      try {
        const data = await sponsorsApi.getSponsors();
        setCompanies(data);
      } catch (error) {
        console.error('Firmalar yüklenirken hata:', error);
      }
    };

    loadCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await projectsApi.createProject(formData);
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Proje eklenirken hata oluştu:', error);
      alert('Proje eklenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto py-6 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Yeni Proje
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Yeni bir proje oluşturmak için formu doldurun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Proje Adı
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Proje adını girin"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Açıklama
              </label>
              <div className="mt-2">
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full resize-none"
                  placeholder="Proje açıklamasını girin"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="manager" className="block text-sm font-medium leading-6 text-gray-900">
                Proje Sorumlusu
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="manager"
                  id="manager"
                  required
                  value={formData.manager}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Proje sorumlusunun adını girin"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                Firma
              </label>
              <div className="mt-2">
                <select
                  name="company"
                  id="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full bg-white"
                >
                  <option value="">Firma seçin</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Durum
              </label>
              <div className="mt-2">
                <select
                  name="status"
                  id="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full bg-white"
                >
                  <option value="active">Aktif</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="pending">Beklemede</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 hover:bg-gray-50 border border-gray-300"
          >
            <XMarkIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 