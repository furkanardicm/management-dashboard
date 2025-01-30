'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { competitorApi } from '@/lib/services/api';

export default function YeniRakipFirma() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    products: '',
    strengths: '',
    weaknesses: '',
    marketShare: '',
    contactPerson: '',
    phone: '',
    email: '',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await competitorApi.createCompetitor(formData);
      router.push('/dashboard/rakip-firma');
    } catch (error) {
      console.error('Rakip firma eklenirken hata oluştu:', error);
      alert('Rakip firma eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Yeni Rakip Firma Ekle</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Firma Adı */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Firma Adı
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Tip */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tip
              </label>
              <select
                name="type"
                id="type"
                required
                value={formData.type}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Seçiniz</option>
                <option value="Medikal Cihaz">Medikal Cihaz</option>
                <option value="Yazılım">Yazılım</option>
                <option value="Medikal Cihaz + Yazılım">Medikal Cihaz + Yazılım</option>
              </select>
            </div>

            {/* Ürünler */}
            <div>
              <label htmlFor="products" className="block text-sm font-medium text-gray-700">
                Ürünler
              </label>
              <input
                type="text"
                name="products"
                id="products"
                required
                value={formData.products}
                onChange={handleChange}
                placeholder="Virgülle ayırarak giriniz"
                className={inputClasses}
              />
            </div>

            {/* Güçlü Yönler */}
            <div>
              <label htmlFor="strengths" className="block text-sm font-medium text-gray-700">
                Güçlü Yönler
              </label>
              <textarea
                name="strengths"
                id="strengths"
                required
                value={formData.strengths}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
              />
            </div>

            {/* Zayıf Yönler */}
            <div>
              <label htmlFor="weaknesses" className="block text-sm font-medium text-gray-700">
                Zayıf Yönler
              </label>
              <textarea
                name="weaknesses"
                id="weaknesses"
                required
                value={formData.weaknesses}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
              />
            </div>

            {/* Pazar Payı */}
            <div>
              <label htmlFor="marketShare" className="block text-sm font-medium text-gray-700">
                Pazar Payı
              </label>
              <select
                name="marketShare"
                id="marketShare"
                required
                value={formData.marketShare}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Seçiniz</option>
                <option value="%10">%10</option>
                <option value="%15">%15</option>
                <option value="%20">%20</option>
                <option value="%25">%25</option>
                <option value="%30">%30</option>
              </select>
            </div>

            {/* İletişim Kişisi */}
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                İletişim Kişisi
              </label>
              <input
                type="text"
                name="contactPerson"
                id="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Telefon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* E-posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Durum */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Durum
              </label>
              <select
                name="status"
                id="status"
                required
                value={formData.status}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="active">Aktif</option>
                <option value="passive">Pasif</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 