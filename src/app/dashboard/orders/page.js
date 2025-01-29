'use client';

import { useState, useEffect } from 'react';
import { ordersApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { 
  PlusCircleIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
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
    const data = orders.map(order => [
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

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Siparişler</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 transition-colors duration-200"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            PDF İndir
          </button>
          <button
            onClick={() => router.push('/dashboard/orders/new')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Yeni Sipariş
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filtreler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Proje</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
            >
              <option value="">Tüm Projeler</option>
              <option value="project1">Proje 1</option>
              <option value="project2">Proje 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 sm:text-sm"
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
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
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
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{order.customerName}</span>
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
                    <button
                      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                      className="inline-flex items-center justify-center p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                      title="Sipariş Detayı"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 