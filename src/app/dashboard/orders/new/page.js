'use client';

import { useState } from 'react';
import { ordersApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function NewOrder() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectId: '',
    sponsorId: '',
    items: [{ description: '', quantity: 1, unitPrice: '', amount: 0 }],
    totalAmount: 0
  });
  const [loading, setLoading] = useState(false);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Miktar ve birim fiyat değiştiğinde tutarı otomatik hesapla
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = newItems[index].quantity * (parseFloat(newItems[index].unitPrice) || 0);
    }
    
    // Toplam tutarı hesapla
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);
    
    setFormData({ ...formData, items: newItems, totalAmount });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: '', amount: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);
    setFormData({ ...formData, items: newItems, totalAmount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ordersApi.createOrder(formData);
      router.push('/dashboard/orders');
    } catch (error) {
      console.error('Sipariş oluşturulurken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Yeni Sipariş</h1>
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
            <label className="block text-sm font-medium text-gray-700">
              Proje
            </label>
            <select
              required
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
            >
              <option value="">Proje Seçin</option>
              <option value="1">Proje 1</option>
              <option value="2">Proje 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sponsor Firma
            </label>
            <select
              required
              value={formData.sponsorId}
              onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
            >
              <option value="">Firma Seçin</option>
              <option value="1">ABC Şirketi</option>
              <option value="2">XYZ Limited</option>
            </select>
          </div>
        </div>

        {/* Sipariş Kalemleri */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Sipariş Kalemleri</h3>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              + Kalem Ekle
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-gray-50 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <input
                  type="text"
                  required
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Miktar
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birim Fiyat (₺)
                </label>
                <input
                  type="text"
                  required
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <p className="text-sm font-medium text-gray-700">
                  Tutar: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount)}
                </p>
              </div>

              <div className="flex justify-end">
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <p className="text-lg font-semibold text-gray-900">
              Toplam: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(formData.totalAmount)}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            {loading ? 'Kaydediliyor...' : 'Siparişi Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 