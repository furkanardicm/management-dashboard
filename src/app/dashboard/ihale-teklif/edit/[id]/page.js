'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tenderApi } from '@/lib/services/api';

export default function IhaleTeklifDuzenle({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    type: '',
    budget: '',
    deadline: '',
    competitors: '',
    ourBid: '',
    status: ''
  });

  useEffect(() => {
    const loadTender = async () => {
      try {
        const data = await tenderApi.getTenders();
        const tender = data.find(t => t.id === parseInt(params.id));
        if (!tender) {
          alert('İhale/Teklif bulunamadı');
          router.push('/dashboard/ihale-teklif');
          return;
        }
        setFormData(tender);
      } catch (error) {
        console.error('İhale/Teklif yüklenirken hata oluştu:', error);
        alert('İhale/Teklif yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadTender();
  }, [params.id, router]);

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
      await tenderApi.updateTender(params.id, formData);
      router.push('/dashboard/ihale-teklif');
    } catch (error) {
      console.error('İhale/Teklif güncellenirken hata oluştu:', error);
      alert('İhale/Teklif güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">İhale/Teklif Düzenle</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Proje Adı */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Proje Adı
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

            {/* Kurum */}
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Kurum
              </label>
              <input
                type="text"
                name="institution"
                id="institution"
                required
                value={formData.institution}
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
                <option value="Donanım İhalesi">Donanım İhalesi</option>
                <option value="Yazılım İhalesi">Yazılım İhalesi</option>
                <option value="Yazılım + Donanım">Yazılım + Donanım</option>
              </select>
            </div>

            {/* Bütçe */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Bütçe
              </label>
              <input
                type="text"
                name="budget"
                id="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Son Tarih */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Son Tarih
              </label>
              <input
                type="date"
                name="deadline"
                id="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Rakipler */}
            <div>
              <label htmlFor="competitors" className="block text-sm font-medium text-gray-700">
                Rakipler
              </label>
              <input
                type="text"
                name="competitors"
                id="competitors"
                required
                value={formData.competitors}
                onChange={handleChange}
                placeholder="Virgülle ayırarak giriniz"
                className={inputClasses}
              />
            </div>

            {/* Teklifimiz */}
            <div>
              <label htmlFor="ourBid" className="block text-sm font-medium text-gray-700">
                Teklifimiz
              </label>
              <input
                type="text"
                name="ourBid"
                id="ourBid"
                required
                value={formData.ourBid}
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
                <option value="pending">Beklemede</option>
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
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 