'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/services/api';

export default function YeniKamuMusteri() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    city: '',
    district: '',
    bedCount: '',
    departments: '',
    budget: '',
    procurementMethod: '',
    contactPerson: '',
    title: '',
    phone: '',
    email: '',
    lastVisitDate: '',
    nextVisitDate: '',
    notes: '',
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
      await publicApi.createInstitution(formData);
      router.push('/dashboard/kamu-musteri');
    } catch (error) {
      console.error('Kurum eklenirken hata oluştu:', error);
      alert('Kurum eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Yeni Kamu Müşterisi Ekle</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kurum Adı */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Kurum Adı
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
                <option value="Şehir Hastanesi">Şehir Hastanesi</option>
                <option value="Eğitim Araştırma Hastanesi">Eğitim Araştırma Hastanesi</option>
                <option value="Devlet Hastanesi">Devlet Hastanesi</option>
                <option value="Üniversite Hastanesi">Üniversite Hastanesi</option>
              </select>
            </div>

            {/* Şehir */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Şehir
              </label>
              <input
                type="text"
                name="city"
                id="city"
                required
                value={formData.city}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* İlçe */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                İlçe
              </label>
              <input
                type="text"
                name="district"
                id="district"
                required
                value={formData.district}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Yatak Sayısı */}
            <div>
              <label htmlFor="bedCount" className="block text-sm font-medium text-gray-700">
                Yatak Sayısı
              </label>
              <input
                type="number"
                name="bedCount"
                id="bedCount"
                required
                value={formData.bedCount}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Branşlar */}
            <div>
              <label htmlFor="departments" className="block text-sm font-medium text-gray-700">
                Branşlar
              </label>
              <input
                type="text"
                name="departments"
                id="departments"
                required
                value={formData.departments}
                onChange={handleChange}
                placeholder="Virgülle ayırarak giriniz"
                className={inputClasses}
              />
            </div>

            {/* Bütçe */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Bütçe
              </label>
              <select
                name="budget"
                id="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Seçiniz</option>
                <option value="Merkezi Bütçe">Merkezi Bütçe</option>
                <option value="Döner Sermaye">Döner Sermaye</option>
              </select>
            </div>

            {/* Alım Yöntemi */}
            <div>
              <label htmlFor="procurementMethod" className="block text-sm font-medium text-gray-700">
                Alım Yöntemi
              </label>
              <select
                name="procurementMethod"
                id="procurementMethod"
                required
                value={formData.procurementMethod}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Seçiniz</option>
                <option value="DMO">DMO</option>
                <option value="İhale">İhale</option>
                <option value="DMO + İhale">DMO + İhale</option>
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

            {/* Unvan */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Unvan
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
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

            {/* Son Ziyaret */}
            <div>
              <label htmlFor="lastVisitDate" className="block text-sm font-medium text-gray-700">
                Son Ziyaret Tarihi
              </label>
              <input
                type="date"
                name="lastVisitDate"
                id="lastVisitDate"
                value={formData.lastVisitDate}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Gelecek Ziyaret */}
            <div>
              <label htmlFor="nextVisitDate" className="block text-sm font-medium text-gray-700">
                Gelecek Ziyaret Tarihi
              </label>
              <input
                type="date"
                name="nextVisitDate"
                id="nextVisitDate"
                value={formData.nextVisitDate}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Notlar */}
            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notlar
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                value={formData.notes}
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