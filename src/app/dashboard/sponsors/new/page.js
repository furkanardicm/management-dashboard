'use client';

import { useState } from 'react';
import { sponsorsApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function NewSponsor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sponsorsApi.createSponsor(formData);
      router.push('/dashboard/sponsors');
    } catch (error) {
      console.error('Sponsor eklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Yeni Sponsor Ekle</h1>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Geri Dön
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Firma Adı
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
              placeholder="Firma adını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              İletişim Kişisi
            </label>
            <input
              type="text"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
              placeholder="İletişim kurulacak kişi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Telefon
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
              placeholder="555-555-5555"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              E-posta
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
              placeholder="ornek@firma.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">
              Adres
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
              placeholder="Firma adresini girin"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
            {loading ? 'Kaydediliyor...' : 'Sponsoru Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 