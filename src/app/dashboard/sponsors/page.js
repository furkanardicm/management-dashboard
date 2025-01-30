'use client';

import { useState, useEffect } from 'react';
import { sponsorsApi } from '@/lib/services/api';
import Link from 'next/link';
import { BuildingOfficeIcon, PlusCircleIcon, ChartBarIcon, CheckCircleIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import StatCard from '@/components/StatCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sponsorId: null });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
  });
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    status: 'active'
  });
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const data = await sponsorsApi.getSponsors();
        setSponsors(data);
        
        // İstatistikleri hesapla
        const statsData = {
          total: data.length,
          active: data.filter(s => s.status === 'active').length,
          pending: data.filter(s => s.status !== 'active').length,
        };
        setStats(statsData);
      } catch (error) {
        console.error('Sponsorlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSponsors();
  }, []);

  const handleDelete = async (sponsorId) => {
    try {
      await sponsorsApi.deleteSponsor(sponsorId);
      setSponsors(sponsors.filter(s => s.id !== sponsorId));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        active: prev.active - (sponsors.find(s => s.id === sponsorId)?.status === 'active' ? 1 : 0),
        pending: prev.pending - (sponsors.find(s => s.id === sponsorId)?.status !== 'active' ? 1 : 0),
      }));
      setDeleteModal({ isOpen: false, sponsorId: null });
    } catch (error) {
      console.error('Sponsor silinirken hata:', error);
      alert('Sponsor silinirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await sponsorsApi.createSponsor(formData);
      router.push('/dashboard/sponsors');
    } catch (error) {
      console.error('Sponsor eklenirken hata oluştu:', error);
      alert('Sponsor eklenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sponsor Firmalar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Tüm sponsor firmaların listesi ve istatistikleri
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/sponsors/new"
            className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Yeni Sponsor Ekle
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Toplam Sponsor"
          value={stats.total}
          description="Sistemde kayıtlı tüm sponsorlar"
          icon={ChartBarIcon}
          color="blue"
        />
        <StatCard
          title="Aktif Sponsorlar"
          value={stats.active}
          description="Aktif durumdaki sponsorlar"
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Bekleyen Sponsorlar"
          value={stats.pending}
          description="Onay bekleyen sponsorlar"
          icon={ClockIcon}
          color="yellow"
        />
      </div>

      {/* Sponsor Listesi */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Sponsor Listesi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Firma Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sponsors.map((sponsor) => (
                <tr key={sponsor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{sponsor.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sponsor.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${
                      sponsor.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <span className={`h-2 w-2 rounded-full mr-2 ${
                        sponsor.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                      {sponsor.status === 'active' ? 'Aktif' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Link
                      href={`/dashboard/sponsors/edit/${sponsor.id}`}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center mx-2"
                    >
                      <PencilIcon className="h-5 w-5 mr-1" />
                      Düzenle
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, sponsorId: sponsor.id })}
                      className="text-red-600 hover:text-red-900 inline-flex items-center mx-2"
                    >
                      <TrashIcon className="h-5 w-5 mr-1" />
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Silme Modalı */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, sponsorId: null })}
        onConfirm={() => handleDelete(deleteModal.sponsorId)}
        title="Sponsor Firmayı Sil"
        message="Bu sponsor firmayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 