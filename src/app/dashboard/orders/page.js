'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { 
  PlusCircleIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import exportToPdf from '@/components/PdfExport';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    totalAmount: 0
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null });

  const filterOrders = useCallback(() => {
    let filtered = [...orders];

    // Proje filtresi
    if (selectedProject) {
      filtered = filtered.filter(order => order.project === selectedProject);
    }

    // Tarih filtresi
    if (dateFilter.startDate) {
      filtered = filtered.filter(order => 
        new Date(order.date) >= new Date(dateFilter.startDate)
      );
    }

    if (dateFilter.endDate) {
      filtered = filtered.filter(order => 
        new Date(order.date) <= new Date(dateFilter.endDate)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedProject, dateFilter]);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
      setFilteredOrders(data);
      
      // İstatistikleri hesapla
      const statsData = {
        totalOrders: data.length,
        pendingOrders: data.filter(o => o.status === 'pending').length,
        approvedOrders: data.filter(o => o.status === 'approved').length,
        totalAmount: data.reduce((sum, o) => sum + o.amount, 0)
      };
      setStats(statsData);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedProject('');
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    return `₺ ${formatted}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Başlık alanı
    doc.setFont("helvetica");
    doc.setFillColor(63, 81, 181);
    doc.rect(0, 0, 210, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Siparis Listesi', 15, 15);
    
    doc.setFontSize(10);
    doc.text(`Olusturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 130, 15);

    // Tablo başlıkları
    const headers = [
      [
        { content: 'Siparis No', styles: { halign: 'center' } },
        { content: 'Musteri', styles: { halign: 'left' } },
        { content: 'Tarih', styles: { halign: 'center' } },
        { content: 'Tutar', styles: { halign: 'center' } },
        { content: 'Durum', styles: { halign: 'center' } }
      ]
    ];

    // Şirket ismi için Türkçe karakter dönüşümü
    const turkishToEnglish = (text) => {
      const charMap = {
        'ş': 's', 'Ş': 'S',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ü': 'u', 'Ü': 'U',
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G'
      };
      return text.replace(/[şŞıİöÖüÜçÇğĞ]/g, match => charMap[match] || match);
    };

    // Tablo verileri
    const data = filteredOrders.map(order => [
      { content: `#${order.id}`, styles: { halign: 'center' } },
      { content: turkishToEnglish(order.customerName), styles: { halign: 'left' } },
      { content: formatDate(order.date), styles: { halign: 'center' } },
      { content: formatCurrency(order.amount), styles: { halign: 'center' } },
      { 
        content: order.status === 'pending' ? 'Bekliyor' : 
                 order.status === 'approved' ? 'Onaylandi' : 
                 order.status === 'rejected' ? 'Reddedildi' : 'Bilinmiyor',
        styles: { 
          halign: 'center',
          fillColor: order.status === 'pending' ? [255, 236, 153] : 
                    order.status === 'approved' ? [198, 246, 213] : 
                    order.status === 'rejected' ? [254, 202, 202] : [229, 231, 235],
          textColor: order.status === 'pending' ? [146, 64, 14] : 
                    order.status === 'approved' ? [21, 128, 61] : 
                    order.status === 'rejected' ? [185, 28, 28] : [55, 65, 81]
        }
      }
    ]);

    // Tablo oluştur
    doc.autoTable({
      head: headers,
      body: data,
      startY: 35,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 3,
        lineColor: [233, 236, 239],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [55, 65, 81],
        fontStyle: 'bold',
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 45 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { top: 35, left: 10, right: 10 },
      didDrawPage: function(data) {
        // Sayfa numarası
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Sayfa ${data.pageNumber}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // PDF'i indir
    doc.save(`siparisler_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '_')}.pdf`);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await ordersApi.updateOrderStatus(orderId, newStatus);
      // Siparişleri yeniden yükle
      await loadOrders();
      setEditingOrder(null);
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await ordersApi.deleteOrder(orderId);
      await loadOrders();
      setDeleteModal({ isOpen: false, orderId: null });
    } catch (error) {
      console.error('Sipariş silinirken hata:', error);
      alert('Sipariş silinirken bir hata oluştu');
    }
  };

  const handleExportPdf = () => {
    const headers = ['Sipariş No', 'Müşteri', 'Proje', 'Tutar', 'Tarih', 'Durum'];
    const data = filteredOrders.map(order => [
      `#${order.id}`,
      order.customerName,
      order.projectName,
      formatCurrency(order.amount),
      formatDate(order.date),
      order.status === 'pending' ? 'Bekliyor' :
      order.status === 'approved' ? 'Onaylandı' :
      order.status === 'rejected' ? 'Reddedildi' : 'Bilinmiyor'
    ]);

    exportToPdf({
      title: 'Siparişler Listesi',
      filename: 'siparisler.pdf',
      headers,
      data,
      fontSize: 10,
      orientation: 'landscape'
    });
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-[1400px] mx-auto py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="mt-2 text-sm text-gray-700">
            Tüm siparişlerin listesi ve istatistikleri
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-x-3">
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 border border-gray-300"
          >
            <DocumentArrowDownIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            PDF İndir
          </button>
          <Link
            href="/dashboard/orders/new"
            className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5 mr-2" />
            Yeni Sipariş Ekle
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Toplam Sipariş"
          value={stats.totalOrders}
          description="Sistemde kayıtlı tüm siparişler"
          icon={DocumentTextIcon}
          color="blue"
        />
        <StatCard
          title="Bekleyen Siparişler"
          value={stats.pendingOrders}
          description="Onay bekleyen siparişler"
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Onaylanan Siparişler"
          value={stats.approvedOrders}
          description="Onaylanmış siparişler"
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Toplam Tutar"
          value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalAmount)}
          description="Tüm siparişlerin toplam tutarı"
          icon={CurrencyDollarIcon}
          color="purple"
        />
      </div>

      {/* Filtreler */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Filtreler</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proje</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="block w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
            >
              <option value="">Tüm Projeler</option>
              <option value="project1">E-Ticaret Platformu</option>
              <option value="project2">Mobil Uygulama Geliştirme</option>
              <option value="project3">Bulut Altyapı Projesi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              className="block w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              className="block w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sipariş Tablosu */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Sipariş No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proje
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Tutar
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.projectName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{formatDate(order.date)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status === 'pending' ? 'Bekliyor' : 
                       order.status === 'approved' ? 'Onaylandı' : 
                       order.status === 'rejected' ? 'Reddedildi' : 'Bilinmiyor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Link
                        href={`/dashboard/orders/edit/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center text-sm font-medium"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, orderId: order.id })}
                        className="text-red-600 hover:text-red-900 inline-flex items-center text-sm font-medium"
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
        onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
        onConfirm={() => handleDelete(deleteModal.orderId)}
        title="Sipariş Silme"
        message="Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 