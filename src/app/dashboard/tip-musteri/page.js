'use client';

import { useState, useEffect } from 'react';
import { PlusCircleIcon, PencilIcon, TrashIcon, UserGroupIcon, BuildingOfficeIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { medicalApi } from '@/lib/services/api';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import StatCard from '@/components/StatCard';

export default function TipMusteriYonetimi() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, customerId: null });
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalBudget: 0,
    plannedVisits: 0
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await medicalApi.getCustomers();
        setCustomers(data);
        
        // İstatistikleri hesapla
        const activeCustomers = data.filter(c => c.status === 'active');
        const totalBudget = data.reduce((sum, c) => sum + Number(c.equipmentBudget), 0);
        const plannedVisits = data.filter(c => c.nextVisitDate && new Date(c.nextVisitDate) > new Date()).length;

        setStats({
          totalCustomers: data.length,
          activeCustomers: activeCustomers.length,
          totalBudget,
          plannedVisits
        });
      } catch (error) {
        console.error('Müşteriler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, customerId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await medicalApi.deleteCustomer(deleteModal.customerId);
      setCustomers(customers.filter(customer => customer.id !== deleteModal.customerId));
      setDeleteModal({ isOpen: false, customerId: null });
    } catch (error) {
      console.error('Müşteri silinirken hata oluştu:', error);
      alert('Müşteri silinirken bir hata oluştu');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Tıp Müşteri Yönetimi</h1>
        <Link
          href="/dashboard/tip-musteri/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Yeni Tıp Müşterisi Ekle
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Müşteri"
          value={stats.totalCustomers}
          description="Sistemde kayıtlı tüm müşteriler"
          icon={UserGroupIcon}
          color="blue"
        />
        <StatCard
          title="Aktif Müşteri"
          value={stats.activeCustomers}
          description="Aktif durumdaki müşteriler"
          icon={BuildingOfficeIcon}
          color="green"
        />
        <StatCard
          title="Toplam Bütçe"
          value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalBudget)}
          description="Toplam ekipman bütçesi"
          icon={CurrencyDollarIcon}
          color="purple"
        />
        <StatCard
          title="Planlanan Ziyaret"
          value={stats.plannedVisits}
          description="Gelecek ziyaret planları"
          icon={CalendarIcon}
          color="yellow"
        />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Kurum Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tip
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Şehir/İlçe
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Yatak/Hasta Sayısı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Ekipman Bütçesi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    İletişim
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Satın Alma
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Son/Gelecek Ziyaret
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Notlar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers && customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {customer.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {customer.city}/{customer.district}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>Yatak: {customer.bedCount}</div>
                      <div className="text-xs">Yıllık Hasta: {customer.annualPatientCount}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(customer.equipmentBudget)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{customer.contactPerson}</div>
                      <div className="text-xs">{customer.title}</div>
                      <div className="text-xs">{customer.phone}</div>
                      <div className="text-xs">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{customer.purchasingManager}</div>
                      <div className="text-xs">{customer.purchasingManagerPhone}</div>
                      <div className="text-xs">{customer.purchasingManagerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>Son: {customer.lastVisitDate}</div>
                      <div>Gelecek: {customer.nextVisitDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {customer.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/dashboard/tip-musteri/edit/${customer.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                        onClick={() => handleDeleteClick(customer.id)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, customerId: null })}
        onConfirm={handleDeleteConfirm}
        title="Tıp Müşterisi Silme"
        message="Bu tıp müşterisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 