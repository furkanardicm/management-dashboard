'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentRequestsApi } from '@/lib/services/api';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import StatCard from '@/components/StatCard';

export default function PaymentRequests() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0
  });

  useEffect(() => {
    loadPaymentRequests();
  }, []);

  const loadPaymentRequests = async () => {
    try {
      const data = await paymentRequestsApi.getPaymentRequests();
      setPaymentRequests(data);
      
      // İstatistikleri hesapla
      const stats = data.reduce((acc, request) => {
        acc.total++;
        acc.totalAmount += parseFloat(request.amount);
        acc[request.status]++;
        return acc;
      }, { total: 0, pending: 0, approved: 0, rejected: 0, totalAmount: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error('Ödeme talepleri yüklenirken hata:', error);
      alert('Ödeme talepleri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await paymentRequestsApi.deletePaymentRequest(id);
      setDeleteModal({ show: false, id: null });
      loadPaymentRequests();
    } catch (error) {
      console.error('Ödeme talebi silinirken hata:', error);
      alert('Ödeme talebi silinirken bir hata oluştu');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount).replace('₺', '') + ' TL';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800';
      case 'approved':
        return 'bg-green-50 text-green-800';
      case 'rejected':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
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
    <div className="max-w-[1400px] mx-auto py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Ödeme Talepleri
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Tüm ödeme taleplerini görüntüleyin ve yönetin
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={() => router.push('/dashboard/payment-requests/new')}
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Yeni Ödeme Talebi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-4 xl:gap-x-8 mb-6">
        <StatCard
          title="Toplam Talep"
          value={stats.total}
          icon={DocumentTextIcon}
          color="blue"
        />
        <StatCard
          title="Bekleyen"
          value={stats.pending}
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Onaylanan"
          value={stats.approved}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Reddedilen"
          value={stats.rejected}
          icon={XCircleIcon}
          color="red"
        />
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Açıklama
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Firma
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Proje
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Tutar
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Tarih
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                Durum
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paymentRequests.map((request) => (
              <tr key={request.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {request.description}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {request.company}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {request.project}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatCurrency(request.amount)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(request.requestDate).toLocaleDateString('tr-TR')}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/payment-requests/edit/${request.id}`)}
                    className="inline-flex items-center gap-x-1.5 text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ show: true, id: request.id })}
                    className="inline-flex items-center gap-x-1.5 text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Ödeme Talebini Sil"
        message="Bu ödeme talebini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 