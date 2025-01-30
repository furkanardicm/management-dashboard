'use client';

import { useState, useEffect } from 'react';
import { PlusCircleIcon, PencilIcon, TrashIcon, UserGroupIcon, ChartBarIcon, CubeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { competitorApi } from '@/lib/services/api';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import StatCard from '@/components/StatCard';

export default function RakipFirmaYonetimi() {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, competitorId: null });
  const [stats, setStats] = useState({
    totalCompetitors: 0,
    activeCompetitors: 0,
    totalMarketShare: 0,
    productTypes: 0
  });

  useEffect(() => {
    const loadCompetitors = async () => {
      try {
        const data = await competitorApi.getCompetitors();
        setCompetitors(data);
        
        // İstatistikleri hesapla
        const activeCompetitors = data.filter(c => c.status === 'active');
        const totalMarketShare = data.reduce((sum, c) => sum + parseFloat(c.marketShare.replace('%', '')), 0);
        const uniqueProducts = new Set(data.flatMap(c => c.products.split(', ')));

        setStats({
          totalCompetitors: data.length,
          activeCompetitors: activeCompetitors.length,
          totalMarketShare,
          productTypes: uniqueProducts.size
        });
      } catch (error) {
        console.error('Rakipler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompetitors();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, competitorId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await competitorApi.deleteCompetitor(deleteModal.competitorId);
      setCompetitors(competitors.filter(competitor => competitor.id !== deleteModal.competitorId));
      setDeleteModal({ isOpen: false, competitorId: null });
    } catch (error) {
      console.error('Rakip firma silinirken hata oluştu:', error);
      alert('Rakip firma silinirken bir hata oluştu');
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
        <h1 className="text-2xl font-semibold text-gray-900">Rakip Firma Yönetimi</h1>
        <Link
          href="/dashboard/rakip-firma/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Yeni Rakip Firma Ekle
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Rakip"
          value={stats.totalCompetitors}
          description="Sistemde kayıtlı tüm rakipler"
          icon={UserGroupIcon}
          color="blue"
        />
        <StatCard
          title="Aktif Rakip"
          value={stats.activeCompetitors}
          description="Aktif durumdaki rakipler"
          icon={BuildingOfficeIcon}
          color="green"
        />
        <StatCard
          title="Toplam Pazar Payı"
          value={`%${stats.totalMarketShare}`}
          description="Rakiplerin toplam pazar payı"
          icon={ChartBarIcon}
          color="purple"
        />
        <StatCard
          title="Ürün Çeşidi"
          value={stats.productTypes}
          description="Toplam ürün kategorisi"
          icon={CubeIcon}
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
                    Firma Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tip
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Ürünler
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Güçlü Yönler
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Zayıf Yönler
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Pazar Payı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    İletişim
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
                {competitors && competitors.map((competitor) => (
                  <tr key={competitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {competitor.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {competitor.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {competitor.products}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {competitor.strengths}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {competitor.weaknesses}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {competitor.marketShare}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{competitor.contactPerson}</div>
                      <div className="text-xs">{competitor.email}</div>
                      <div className="text-xs">{competitor.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        competitor.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {competitor.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/dashboard/rakip-firma/edit/${competitor.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                        onClick={() => handleDeleteClick(competitor.id)}
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
        onClose={() => setDeleteModal({ isOpen: false, competitorId: null })}
        onConfirm={handleDeleteConfirm}
        title="Rakip Firma Silme"
        message="Bu rakip firmayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 