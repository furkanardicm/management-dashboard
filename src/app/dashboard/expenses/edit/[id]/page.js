'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { expensesApi } from '@/lib/services/api';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function GiderBelgesiDuzenle({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    status: ''
  });

  useEffect(() => {
    const loadExpense = async () => {
      try {
        const data = await expensesApi.getExpense(params.id);
        if (!data) {
          throw new Error('Gider belgesi bulunamadı');
        }
        setFormData({
          description: data.description || '',
          amount: data.amount || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          status: data.status || 'pending'
        });
      } catch (error) {
        console.error('Gider belgesi yüklenirken hata:', error);
        alert(error.message || 'Gider belgesi yüklenirken bir hata oluştu');
        router.push('/dashboard/expenses');
      } finally {
        setLoading(false);
      }
    };

    loadExpense();
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
      if (!formData.description || !formData.amount || !formData.date || !formData.status) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      await expensesApi.updateExpense(params.id, formData);
      router.push('/dashboard/expenses');
    } catch (error) {
      console.error('Gider belgesi güncellenirken hata:', error);
      alert(error.message || 'Gider belgesi güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Gider Belgesi Düzenle
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Gider belgesi bilgilerini güncellemek için formu kullanın
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Açıklama
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="description"
                  id="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Gider açıklaması"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
                Tutar
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                Tarih
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
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
                  className="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus-visible:outline-none sm:text-sm sm:leading-6 cursor-pointer"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="approved">Onaylandı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            <XMarkIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 