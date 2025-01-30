'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/services/api';
import { XMarkIcon, CheckIcon, TrashIcon, PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function SiparisDetay({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    phone: '',
    project: '',
    projectName: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    items: []
  });

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const order = await ordersApi.getOrder(params.id);
        setFormData(order);
      } catch (error) {
        console.error('Sipariş yüklenirken hata:', error);
        alert('Sipariş yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      projectName: name === 'project' ? e.target.options[e.target.selectedIndex].text : prev.projectName
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      amount: field === 'quantity' || field === 'unitPrice' 
        ? parseFloat(value || 0) * (field === 'quantity' ? newItems[index].unitPrice : newItems[index].quantity)
        : newItems[index].amount
    };
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      amount: newItems.reduce((sum, item) => sum + (item.amount || 0), 0)
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: newItems,
      amount: newItems.reduce((sum, item) => sum + (item.amount || 0), 0)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      alert('En az bir sipariş kalemi eklemelisiniz.');
      return;
    }

    if (formData.items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      alert('Lütfen tüm sipariş kalemlerini eksiksiz doldurun.');
      return;
    }

    setSaving(true);

    try {
      await ordersApi.updateOrder(params.id, formData);
      router.push('/dashboard/orders');
    } catch (error) {
      console.error('Sipariş güncellenirken hata oluştu:', error);
      alert('Sipariş güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sipariş yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sipariş Düzenle</h1>
          <p className="mt-2 text-sm text-gray-600">Sipariş bilgilerini güncellemek için formu kullanın.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="p-6">
            <div className="flex items-center gap-x-3 mb-6">
              <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Sipariş Bilgileri</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium leading-6 text-gray-900">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  name="customerName"
                  id="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Müşteri adını girin"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
                  İletişim Kişisi
                </label>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="İletişim kurulacak kişi"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="(5XX) XXX XX XX"
                />
              </div>

              <div>
                <label htmlFor="project" className="block text-sm font-medium leading-6 text-gray-900">
                  Proje
                </label>
                <select
                  name="project"
                  id="project"
                  required
                  value={formData.project}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                >
                  <option value="">Proje Seçin</option>
                  <option value="project1">E-Ticaret Platformu</option>
                  <option value="project2">Mobil Uygulama Geliştirme</option>
                  <option value="project3">Bulut Altyapı Projesi</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                  Tarih
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                  Durum
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="approved">Onaylandı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sipariş Kalemleri */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-x-3">
                <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                <h2 className="text-lg font-medium text-gray-900">Sipariş Kalemleri</h2>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusIcon className="h-4 w-4" />
                Kalem Ekle
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Ürün/Hizmet açıklaması"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                        placeholder="Adet"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birim Fiyat</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                        placeholder="₺"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Toplam</label>
                      <div className="block w-full rounded-md border-0 bg-gray-100 py-1.5 text-right text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 px-3">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount)}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors duration-200"
                        title="Kalemi Sil"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {formData.items.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Henüz sipariş kalemi eklenmemiş. Yukarıdaki &quot;Kalem Ekle&quot; butonunu kullanarak sipariş kalemi ekleyebilirsiniz.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-900/10 pt-6">
              <div className="text-base font-semibold text-gray-900">
                Toplam: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(formData.amount)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4" />
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon className="h-4 w-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 