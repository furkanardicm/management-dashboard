'use client';

import { useState, useEffect } from 'react';
import { PlusCircleIcon, PencilIcon, TrashIcon, DocumentTextIcon, CheckCircleIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { tenderApi } from '@/lib/services/api';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import StatCard from '@/components/StatCard';

export default function IhaleTeklifYonetimi() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tenderId: null });
  const [stats, setStats] = useState({
    totalTenders: 0,
    activeTenders: 0,
    totalBidAmount: 0,
    wonTenders: 0
  });

  useEffect(() => {
    const loadTenders = async () => {
      try {
        const data = await tenderApi.getTenders();
        setTenders(data);
        
        // İstatistikleri hesapla
        const activeTenders = data.filter(t => t.status === 'active');
        const totalBidAmount = data.reduce((sum, t) => {
          // TL ve boşlukları kaldır
          const valueWithoutCurrency = t.ourBid.replace(/[^0-9.,]/g, '');
          // Tüm noktaları kaldır, virgülü noktaya çevir
          const cleanValue = valueWithoutCurrency.replace(/\./g, '').replace(',', '.');
          return sum + parseFloat(cleanValue);
        }, 0);
        const wonTenders = data.filter(t => t.status === 'won').length;

        setStats({
          totalTenders: data.length,
          activeTenders: activeTenders.length,
          totalBidAmount,
          wonTenders
        });
      } catch (error) {
        console.error('İhaleler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenders();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, tenderId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await tenderApi.deleteTender(deleteModal.tenderId);
      setTenders(tenders.filter(tender => tender.id !== deleteModal.tenderId));
      setDeleteModal({ isOpen: false, tenderId: null });
    } catch (error) {
      console.error('İhale/Teklif silinirken hata oluştu:', error);
      alert('İhale/Teklif silinirken bir hata oluştu');
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
        <h1 className="text-2xl font-semibold text-gray-900">İhale Teklif Yönetimi</h1>
        <Link
          href="/dashboard/ihale-teklif/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Yeni İhale Teklifi Ekle
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam İhale"
          value={stats.totalTenders}
          description="Sistemde kayıtlı tüm ihaleler"
          icon={DocumentTextIcon}
          color="blue"
        />
        <StatCard
          title="Aktif İhale"
          value={stats.activeTenders}
          description="Devam eden ihaleler"
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Toplam Teklif Tutarı"
          value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalBidAmount)}
          description="Tarafımızdan verilen tekliflerin toplamı"
          icon={CurrencyDollarIcon}
          color="purple"
        />
        <StatCard
          title="Kazanılan İhale"
          value={stats.wonTenders}
          description="Kazanılan ihale sayısı"
          icon={CheckCircleIcon}
          color="green"
        />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Proje Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Kurum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tip
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Bütçe
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Son Tarih
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Rakipler
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Teklifimiz
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenders && tenders.map((tender) => (
                  <tr key={tender.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {tender.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {tender.institution}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {tender.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {tender.budget}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {tender.deadline}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {tender.competitors}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {tender.ourBid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tender.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : tender.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tender.status === 'active' ? 'Aktif' : 
                         tender.status === 'pending' ? 'Beklemede' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/dashboard/ihale-teklif/edit/${tender.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mx-2 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-900 mx-2 inline-flex items-center"
                        onClick={() => handleDeleteClick(tender.id)}
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
        onClose={() => setDeleteModal({ isOpen: false, tenderId: null })}
        onConfirm={handleDeleteConfirm}
        title="İhale Teklifi Silme"
        message="Bu ihale teklifini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 