'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { visitApi } from '@/lib/services/api';

export default function ZiyaretDuzenle({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    institution: '',
    department: '',
    contactPerson: '',
    visitDate: '',
    visitTime: '',
    visitType: '',
    salesPerson: '',
    notes: '',
    result: '',
    nextVisit: '',
    status: ''
  });

  useEffect(() => {
    const loadVisit = async () => {
      try {
        const data = await visitApi.getVisitById(params.id);
        setFormData({
          institution: data.institution,
          department: data.department,
          contactPerson: data.contactPerson,
          visitDate: data.visitDate,
          visitTime: data.visitTime,
          visitType: data.visitType,
          salesPerson: data.salesPerson,
          notes: data.notes || '',
          result: data.result || '',
          nextVisit: data.nextVisit || '',
          status: data.status
        });
      } catch (error) {
        console.error('Ziyaret yüklenirken hata:', error);
        alert('Ziyaret bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadVisit();
  }, [params.id]);

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
      await visitApi.updateVisit(params.id, formData);
      router.push('/dashboard/ziyaret');
      router.refresh();
    } catch (error) {
      console.error('Ziyaret güncellenirken hata:', error);
      alert('Ziyaret güncellenirken bir hata oluştu');
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

  return (
    <div className="max-w-[1400px] mx-auto py-6">
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ziyaret Düzenle</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ziyaret bilgilerini güncelleyebilirsiniz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>

          {/* Departman */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Departman
            </label>
            <input
              type="text"
              name="department"
              id="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>

          {/* İlgili Kişi */}
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
              İlgili Kişi
            </label>
            <input
              type="text"
              name="contactPerson"
              id="contactPerson"
              required
              value={formData.contactPerson}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>

          {/* Ziyaret Tarihi */}
          <div>
            <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">
              Ziyaret Tarihi
            </label>
            <input
              type="date"
              name="visitDate"
              id="visitDate"
              required
              value={formData.visitDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>

          {/* Ziyaret Saati */}
          <div>
            <label htmlFor="visitTime" className="block text-sm font-medium text-gray-700">
              Ziyaret Saati
            </label>
            <input
              type="time"
              name="visitTime"
              id="visitTime"
              required
              value={formData.visitTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>

          {/* Ziyaret Tipi */}
          <div>
            <label htmlFor="visitType" className="block text-sm font-medium text-gray-700">
              Ziyaret Tipi
            </label>
            <select
              name="visitType"
              id="visitType"
              required
              value={formData.visitType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            >
              <option value="">Seçiniz</option>
              <option value="initial">İlk Ziyaret</option>
              <option value="followup">Takip Ziyareti</option>
              <option value="presentation">Ürün Sunumu</option>
              <option value="negotiation">Görüşme</option>
              <option value="technical">Teknik Destek</option>
            </select>
          </div>

          {/* Satış Temsilcisi */}
          <div>
            <label htmlFor="salesPerson" className="block text-sm font-medium text-gray-700">
              Satış Temsilcisi
            </label>
            <input
              type="text"
              name="salesPerson"
              id="salesPerson"
              required
              value={formData.salesPerson}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            >
              <option value="">Seçiniz</option>
              <option value="planned">Planlandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>

          {/* Sonraki Ziyaret */}
          <div>
            <label htmlFor="nextVisit" className="block text-sm font-medium text-gray-700">
              Sonraki Ziyaret Tarihi
            </label>
            <input
              type="date"
              name="nextVisit"
              id="nextVisit"
              value={formData.nextVisit}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            placeholder="Ziyaret ile ilgili notlarınızı buraya yazabilirsiniz..."
          />
        </div>

        {/* Sonuç */}
        <div className="col-span-2">
          <label htmlFor="result" className="block text-sm font-medium text-gray-700">
            Ziyaret Sonucu
          </label>
          <textarea
            name="result"
            id="result"
            rows={3}
            value={formData.result}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            placeholder="Ziyaret sonucunu buraya yazabilirsiniz..."
          />
        </div>

        {/* Butonlar */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 