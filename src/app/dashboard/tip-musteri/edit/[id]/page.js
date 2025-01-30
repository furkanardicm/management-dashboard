'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { medicalApi } from '@/lib/services/api';

export default function TipMusteriDuzenle({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    city: '',
    district: '',
    bedCount: '',
    departments: '',
    annualPatientCount: '',
    equipmentBudget: '',
    contactPerson: '',
    title: '',
    phone: '',
    email: '',
    purchasingManager: '',
    purchasingManagerPhone: '',
    purchasingManagerEmail: '',
    lastVisitDate: '',
    nextVisitDate: '',
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await medicalApi.getCustomerById(params.id);
        setFormData(data);
      } catch (error) {
        console.error('Müşteri yüklenirken hata oluştu:', error);
        alert('Müşteri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
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
      await medicalApi.updateCustomer(params.id, formData);
      router.push('/dashboard/tip-musteri');
    } catch (error) {
      console.error('Müşteri güncellenirken hata oluştu:', error);
      alert('Müşteri güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-600";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Tıp Müşterisi Düzenle</h1>
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
                <option value="Özel Hastane">Özel Hastane</option>
                <option value="Tıp Merkezi">Tıp Merkezi</option>
                <option value="Dal Merkezi">Dal Merkezi</option>
                <option value="Poliklinik">Poliklinik</option>
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

            {/* Yıllık Hasta Sayısı */}
            <div>
              <label htmlFor="annualPatientCount" className="block text-sm font-medium text-gray-700">
                Yıllık Hasta Sayısı
              </label>
              <input
                type="number"
                name="annualPatientCount"
                id="annualPatientCount"
                required
                value={formData.annualPatientCount}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Ekipman Bütçesi */}
            <div>
              <label htmlFor="equipmentBudget" className="block text-sm font-medium text-gray-700">
                Ekipman Bütçesi
              </label>
              <input
                type="number"
                name="equipmentBudget"
                id="equipmentBudget"
                required
                value={formData.equipmentBudget}
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

            {/* Satın Alma Sorumlusu */}
            <div>
              <label htmlFor="purchasingManager" className="block text-sm font-medium text-gray-700">
                Satın Alma Sorumlusu
              </label>
              <input
                type="text"
                name="purchasingManager"
                id="purchasingManager"
                required
                value={formData.purchasingManager}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Satın Alma Sorumlusu Telefon */}
            <div>
              <label htmlFor="purchasingManagerPhone" className="block text-sm font-medium text-gray-700">
                Satın Alma Sorumlusu Telefon
              </label>
              <input
                type="tel"
                name="purchasingManagerPhone"
                id="purchasingManagerPhone"
                required
                value={formData.purchasingManagerPhone}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Satın Alma Sorumlusu E-posta */}
            <div>
              <label htmlFor="purchasingManagerEmail" className="block text-sm font-medium text-gray-700">
                Satın Alma Sorumlusu E-posta
              </label>
              <input
                type="email"
                name="purchasingManagerEmail"
                id="purchasingManagerEmail"
                required
                value={formData.purchasingManagerEmail}
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