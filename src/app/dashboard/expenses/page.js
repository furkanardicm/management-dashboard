'use client';

import { useState, useEffect } from 'react';
import { expensesApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import exportToPdf from '@/components/PdfExport';

export default function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, expenseId: null });
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingExpenses: 0,
    approvedExpenses: 0,
    totalAmount: 0
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await expensesApi.getExpenses();
      setExpenses(data);
      
      // İstatistikleri hesapla
      const statsData = {
        totalExpenses: data.length,
        pendingExpenses: data.filter(e => e.status === 'pending').length,
        approvedExpenses: data.filter(e => e.status === 'approved').length,
        totalAmount: data.reduce((sum, e) => sum + parseFloat(e.amount), 0)
      };
      setStats(statsData);
    } catch (error) {
      console.error('Gider belgeleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await expensesApi.deleteExpense(expenseId);
      await loadExpenses();
      setDeleteModal({ isOpen: false, expenseId: null });
    } catch (error) {
      console.error('Gider belgesi silinirken hata:', error);
      alert('Gider belgesi silinirken bir hata oluştu');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [day, month, year] = dateStr.split('-');
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('tr-TR').format(date);
    } catch (error) {
      console.error('Tarih formatlanırken hata:', error);
      return dateStr; // Hata durumunda orijinal değeri göster
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportPdf = () => {
    const headers = ['Belge No', 'Açıklama', 'Tutar', 'Tarih', 'Durum'];
    const data = expenses.map(expense => [
      `#${expense.id}`,
      expense.description,
      formatCurrency(expense.amount),
      formatDate(expense.expenseDate),
      expense.status === 'pending' ? 'Bekliyor' :
      expense.status === 'approved' ? 'Onaylandı' :
      expense.status === 'rejected' ? 'Reddedildi' : 'Bilinmiyor'
    ]);

    exportToPdf({
      title: 'Gider Belgeleri Listesi',
      filename: 'gider-belgeleri.pdf',
      headers,
      data
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Gider Belgeleri</h1>
          <p className="mt-2 text-sm text-gray-700">
            Tüm gider belgelerinin listesi ve durumları
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            PDF İndir
          </button>
          <Link
            href="/dashboard/expenses/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni Gider Belgesi
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Toplam Belge"
          value={stats.totalExpenses}
          description="Sistemdeki toplam gider belgesi"
          icon={DocumentTextIcon}
          color="blue"
        />
        <StatCard
          title="Bekleyen Belgeler"
          value={stats.pendingExpenses}
          description="Onay bekleyen belgeler"
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Onaylanan Belgeler"
          value={stats.approvedExpenses}
          description="Onaylanmış belgeler"
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Toplam Tutar"
          value={formatCurrency(stats.totalAmount)}
          description="Toplam gider tutarı"
          icon={CurrencyDollarIcon}
          color="purple"
        />
      </div>

      {/* Gider Belgeleri Tablosu */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Belge No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{expense.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                    {formatDate(expense.expenseDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(expense.status)}`}>
                      {expense.status === 'pending' ? 'Bekliyor' :
                       expense.status === 'approved' ? 'Onaylandı' :
                       expense.status === 'rejected' ? 'Reddedildi' : 'Bilinmiyor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-3">
                      <Link
                        href={`/dashboard/expenses/edit/${expense.id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, expenseId: expense.id })}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, expenseId: null })}
        onConfirm={() => handleDelete(deleteModal.expenseId)}
        title="Gider Belgesi Silme"
        message="Bu gider belgesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 