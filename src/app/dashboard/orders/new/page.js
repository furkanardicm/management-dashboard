'use client';

import { useState, useEffect } from 'react';
import { ordersApi, sponsorsApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon, 
  PlusIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function NewOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    project: '',
    items: [
      { 
        description: '', 
        quantity: 1, 
        unitPrice: '', 
        amount: 0 
      }
    ],
    totalAmount: 0
  });

  // Şirketleri yükle
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await sponsorsApi.getSponsors();
        setCompanies(data);
      } catch (error) {
        console.error('Şirketler yüklenirken hata:', error);
      }
    };
    loadCompanies();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Miktar ve birim fiyat değiştiğinde tutarı otomatik hesapla
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(newItems[index].quantity) || 0;
      const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].amount = quantity * unitPrice;
    }
    
    // Toplam tutarı hesapla
    const totalAmount = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    setFormData({ ...formData, items: newItems, totalAmount });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items, 
        { description: '', quantity: 1, unitPrice: '', amount: 0 }
      ]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Geri Dön
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Yeni Sipariş Oluştur
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Firma ve Proje Bilgileri */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
            Firma ve Proje Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Firma
              </label>
              <select
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
              >
                <option value="">Firma Seçin</option>
                {companies.map(company => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proje
              </label>
              <select
                required
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
              >
                <option value="">Proje Seçin</option>
                <option value="project1">E-Ticaret Platformu</option>
                <option value="project2">Mobil Uygulama Geliştirme</option>
                <option value="project3">Bulut Altyapı Projesi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sipariş Kalemleri */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Sipariş Kalemleri
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Kalem Ekle
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-gray-50 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    required
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
                    placeholder="Ürün/Hizmet açıklaması"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Miktar
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Birim Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tutar
                  </label>
                  <div className="mt-1 block w-full py-2 px-3 text-gray-900 sm:text-sm font-medium">
                    {formatCurrency(item.amount)}
                  </div>
                </div>

                <div className="sm:col-span-1 flex items-end justify-center">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Toplam Tutar */}
            <div className="flex justify-end pt-4 border-t">
              <div className="text-lg font-semibold text-gray-900">
                Toplam: {formatCurrency(formData.totalAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Siparişi Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 