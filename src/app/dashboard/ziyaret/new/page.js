'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { visitApi, healthApi } from '@/lib/services/api';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function YeniZiyaret() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
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
    status: 'planned'
  });

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await healthApi.getInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error('Kurumlar yüklenirken hata oluştu:', error);
      }
    };

    loadInstitutions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Kurum seçildiğinde otomatik olarak departman ve iletişim kişisini doldur
    if (name === 'institution') {
      const selectedInstitution = institutions.find(i => i.name === value);
      if (selectedInstitution) {
        setFormData(prev => ({
          ...prev,
          department: selectedInstitution.department,
          contactPerson: selectedInstitution.contact
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await visitApi.createVisit(formData);
      router.push('/dashboard/ziyaret');
      router.refresh();
    } catch (error) {
      console.error('Ziyaret eklenirken hata oluştu:', error);
      alert('Ziyaret eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Yeni Ziyaret Ekle</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Kurum
              </label>
              <select
                name="institution"
                id="institution"
                required
                value={formData.institution}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              >
                <option value="">Seçiniz</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.name}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              />
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              />
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              />
            </div>

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
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600 py-2.5 px-3"
              />
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              >
                <option value="">Seçiniz</option>
                <option value="Ürün Tanıtımı">Ürün Tanıtımı</option>
                <option value="Satış Görüşmesi">Satış Görüşmesi</option>
                <option value="Teknik Destek">Teknik Destek</option>
                <option value="Periyodik Ziyaret">Periyodik Ziyaret</option>
              </select>
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              />
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              />
            </div>

            <div>
              <label htmlFor="result" className="block text-sm font-medium text-gray-700">
                Sonuç
              </label>
              <select
                name="result"
                id="result"
                value={formData.result}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              >
                <option value="">Seçiniz</option>
                <option value="Olumlu">Olumlu</option>
                <option value="Olumsuz">Olumsuz</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Tamamlandı">Tamamlandı</option>
              </select>
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-600"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 