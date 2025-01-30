'use client';

import { useState, useEffect } from 'react';
import { PlusCircleIcon, PencilIcon, TrashIcon, BuildingLibraryIcon, BuildingOfficeIcon, ShoppingCartIcon, ScaleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { publicApi } from '@/lib/services/api';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import StatCard from '@/components/StatCard';

export default function KamuMusteriYonetimi() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, institutionId: null });
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    activeInstitutions: 0,
    dmoCount: 0,
    tenderCount: 0
  });

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await publicApi.getInstitutions();
        setInstitutions(data);
        
        // İstatistikleri hesapla
        const activeInstitutions = data.filter(i => i.status === 'active');
        const dmoCount = data.filter(i => i.procurementMethod.includes('DMO')).length;
        const tenderCount = data.filter(i => i.procurementMethod.includes('İhale')).length;

        setStats({
          totalInstitutions: data.length,
          activeInstitutions: activeInstitutions.length,
          dmoCount,
          tenderCount
        });
      } catch (error) {
        console.error('Kurumlar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, institutionId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await publicApi.deleteInstitution(deleteModal.institutionId);
      setInstitutions(institutions.filter(institution => institution.id !== deleteModal.institutionId));
      setDeleteModal({ isOpen: false, institutionId: null });
    } catch (error) {
      console.error('Kurum silinirken hata oluştu:', error);
      alert('Kurum silinirken bir hata oluştu');
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
        <h1 className="text-2xl font-semibold text-gray-900">Kamu Müşteri Yönetimi</h1>
        <Link
          href="/dashboard/kamu-musteri/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Yeni Kamu Müşterisi Ekle
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Kurum"
          value={stats.totalInstitutions}
          description="Sistemde kayıtlı tüm kurumlar"
          icon={BuildingLibraryIcon}
          color="blue"
        />
        <StatCard
          title="Aktif Kurum"
          value={stats.activeInstitutions}
          description="Aktif durumdaki kurumlar"
          icon={BuildingOfficeIcon}
          color="green"
        />
        <StatCard
          title="DMO Alım"
          value={stats.dmoCount}
          description="DMO üzerinden alım yapan kurumlar"
          icon={ShoppingCartIcon}
          color="purple"
        />
        <StatCard
          title="İhale Alım"
          value={stats.tenderCount}
          description="İhale ile alım yapan kurumlar"
          icon={ScaleIcon}
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
                    Yatak Sayısı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Bütçe/Alım
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    İletişim
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
                {institutions && institutions.map((institution) => (
                  <tr key={institution.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {institution.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {institution.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {institution.city}/{institution.district}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {institution.bedCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{institution.budget}</div>
                      <div className="text-xs">{institution.procurementMethod}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{institution.contactPerson}</div>
                      <div className="text-xs">{institution.title}</div>
                      <div className="text-xs">{institution.phone}</div>
                      <div className="text-xs">{institution.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>Son: {institution.lastVisitDate}</div>
                      <div>Gelecek: {institution.nextVisitDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {institution.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        institution.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {institution.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/dashboard/kamu-musteri/edit/${institution.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                        onClick={() => handleDeleteClick(institution.id)}
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
        onClose={() => setDeleteModal({ isOpen: false, institutionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Kamu Müşterisi Silme"
        message="Bu kamu müşterisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 