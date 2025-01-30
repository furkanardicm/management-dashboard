'use client';

import { useState, useEffect } from 'react';
import { ClipboardDocumentListIcon, PlusCircleIcon, PencilIcon, TrashIcon, CalendarIcon, CheckBadgeIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { visitApi } from '@/lib/services/api';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import StatCard from '@/components/StatCard';

export default function ZiyaretYonetimi() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, visitId: null });
  const [stats, setStats] = useState({
    totalVisits: 0,
    plannedVisits: 0,
    completedVisits: 0,
    thisMonthVisits: 0
  });

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const data = await visitApi.getVisits();
        setVisits(data);
        
        // İstatistikleri hesapla
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        const plannedVisits = data.filter(v => v.status === 'planned').length;
        const completedVisits = data.filter(v => v.status === 'completed').length;
        const thisMonthVisits = data.filter(v => {
          const visitDate = new Date(v.visitDate);
          return visitDate.getMonth() === thisMonth && visitDate.getFullYear() === thisYear;
        }).length;

        setStats({
          totalVisits: data.length,
          plannedVisits,
          completedVisits,
          thisMonthVisits
        });
      } catch (error) {
        console.error('Ziyaretler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, visitId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await visitApi.deleteVisit(deleteModal.visitId);
      setVisits(visits.filter(visit => visit.id !== deleteModal.visitId));
      setDeleteModal({ isOpen: false, visitId: null });
    } catch (error) {
      console.error('Ziyaret silinirken hata oluştu:', error);
      alert('Ziyaret silinirken bir hata oluştu');
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
      {/* Başlık ve Yeni Ekle Butonu */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ziyaret Yönetimi</h1>
        <Link
          href="/dashboard/ziyaret/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Yeni Ziyaret Ekle
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Ziyaret"
          value={stats.totalVisits}
          description="Sistemde kayıtlı tüm ziyaretler"
          icon={CalendarIcon}
          color="blue"
        />
        <StatCard
          title="Planlanan Ziyaret"
          value={stats.plannedVisits}
          description="Planlanan ziyaret sayısı"
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Tamamlanan Ziyaret"
          value={stats.completedVisits}
          description="Tamamlanan ziyaret sayısı"
          icon={CheckBadgeIcon}
          color="green"
        />
        <StatCard
          title="Bu Ay"
          value={stats.thisMonthVisits}
          description="Bu ayki toplam ziyaret"
          icon={CalendarDaysIcon}
          color="purple"
        />
      </div>

      {/* Ziyaret Listesi */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departman
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İlgili Kişi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ziyaret Tarihi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ziyaret Tipi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satış Temsilcisi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notlar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sonuç
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sonraki Ziyaret
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits && visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {visit.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.contactPerson}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.visitDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.visitTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.visitType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.salesPerson}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {visit.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.result}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.nextVisit || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      visit.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : visit.status === 'planned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visit.status === 'completed' ? 'Tamamlandı' : 
                       visit.status === 'planned' ? 'Planlandı' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/ziyaret/edit/${visit.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Düzenle
                    </Link>
                    <button 
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                      onClick={() => handleDeleteClick(visit.id)}
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

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, visitId: null })}
        onConfirm={handleDeleteConfirm}
        title="Ziyaret Silme"
        message="Bu ziyareti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 