'use client';

import { useState } from 'react';
import { expensesApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DocumentPlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

export default function NewExpense() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
    document: null
  });
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          setFormData({ ...formData, document: file });
          setFileError('');
        } else {
          setFileError('Dosya boyutu 5MB\'dan küçük olmalıdır');
          e.target.value = null;
        }
      } else {
        setFileError('Sadece PDF dosyaları kabul edilmektedir');
        e.target.value = null;
      }
    }
  };

  const handleAmountChange = (e) => {
    let value = e.target.value;
    
    // Virgülü noktaya çevir
    value = value.replace(',', '.');
    
    // Sadece sayı ve tek bir nokta karakterine izin ver
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, amount: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.document) {
      setFileError('Lütfen bir PDF dosyası yükleyin');
      return;
    }

    setLoading(true);
    try {
      // Normalde bir FormData oluşturup backend'e gönderilir
      const formDataToSend = new FormData();
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('expenseDate', formData.expenseDate);
      formDataToSend.append('document', formData.document);

      await expensesApi.createExpense(formDataToSend);
      router.push('/dashboard/expenses');
    } catch (error) {
      console.error('Gider belgesi oluşturulurken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Yeni Gider Belgesi</h1>
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
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Tutar (₺)
            </label>
            <input
              type="text"
              id="amount"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 font-medium placeholder-gray-400 focus:border-indigo-500"
              value={formData.amount}
              onChange={handleAmountChange}
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>

          <div>
            <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700">
              Gider Tarihi
            </label>
            <input
              type="date"
              id="expenseDate"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 font-medium focus:border-indigo-500"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Açıklama
          </label>
          <textarea
            id="description"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 font-medium placeholder-gray-400 focus:border-indigo-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Gider açıklaması..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Belge (PDF)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-200">
            <div className="space-y-1 text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="document" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>PDF Dosyası Yükle</span>
                  <input
                    id="document"
                    name="document"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Sadece PDF, maksimum 5MB
              </p>
              {formData.document && (
                <p className="text-sm font-medium text-green-600">
                  Seçilen dosya: {formData.document.name}
                </p>
              )}
              {fileError && (
                <p className="text-sm font-medium text-red-600">
                  {fileError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentPlusIcon className="mr-2 h-4 w-4" />
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </form>
    </div>
  );
} 