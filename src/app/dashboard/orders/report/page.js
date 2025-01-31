'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  DocumentArrowDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { exportToPdf } from '@/components/PdfExport';

export default function OrdersReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // İstatistikler
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    averageAmount: 0,
    companyStats: [],
    projectStats: []
  });

  const calculateStats = useCallback(() => {
    let filteredOrders = [...orders];

    // Tarih filtresi uygula
    if (dateFilter.startDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.date) >= new Date(dateFilter.startDate)
      );
    }
    if (dateFilter.endDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.date) <= new Date(dateFilter.endDate)
      );
    }

    // Temel istatistikler
    const totalOrders = filteredOrders.length;
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const averageAmount = totalAmount / totalOrders || 0;

    // Şirket bazlı istatistikler
    const companyStats = filteredOrders.reduce((acc, order) => {
      const company = acc.find(c => c.name === order.customerName);
      if (company) {
        company.orderCount++;
        company.totalAmount += order.amount;
      } else {
        acc.push({
          name: order.customerName,
          orderCount: 1,
          totalAmount: order.amount
        });
      }
      return acc;
    }, []).sort((a, b) => b.totalAmount - a.totalAmount);

    // Proje bazlı istatistikler
    const projectStats = filteredOrders.reduce((acc, order) => {
      const project = acc.find(p => p.name === order.projectName);
      if (project) {
        project.orderCount++;
        project.totalAmount += order.amount;
      } else {
        acc.push({
          name: order.projectName,
          orderCount: 1,
          totalAmount: order.amount
        });
      }
      return acc;
    }, []).sort((a, b) => b.totalAmount - a.totalAmount);

    setStats({
      totalOrders,
      totalAmount,
      averageAmount,
      companyStats,
      projectStats
    });
  }, [orders, dateFilter]);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatPdfCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' TL';
  };

  const generatePDF = () => {
    // PDF başlığı için tarih filtresi bilgisi
    let titleSuffix = '';
    if (dateFilter.startDate || dateFilter.endDate) {
      titleSuffix = ` (${dateFilter.startDate ? formatDate(dateFilter.startDate) : ''} - ${dateFilter.endDate ? formatDate(dateFilter.endDate) : ''})`;
    }

    // Genel İstatistikler
    const generalStatsHeaders = ['Metrik', 'Değer'];
    const generalStatsData = [
      ['Toplam Sipariş', stats.totalOrders.toString()],
      ['Toplam Tutar', formatPdfCurrency(stats.totalAmount)],
      ['Ortalama Sipariş Tutarı', formatPdfCurrency(stats.averageAmount)]
    ];

    // Şirket Bazlı İstatistikler
    const companyStatsHeaders = ['Şirket', 'Sipariş Sayısı', 'Toplam Tutar'];
    const companyStatsData = stats.companyStats.map(company => [
      company.name || 'Belirtilmemiş',
      company.orderCount.toString(),
      formatPdfCurrency(company.totalAmount)
    ]);

    // Proje Bazlı İstatistikler
    const projectStatsHeaders = ['Proje', 'Sipariş Sayısı', 'Toplam Tutar'];
    const projectStatsData = stats.projectStats.map(project => [
      project.name || 'Belirtilmemiş',
      project.orderCount.toString(),
      formatPdfCurrency(project.totalAmount)
    ]);

    // PdfExport componentini kullanarak PDF oluştur
    exportToPdf({
      title: 'Satış Raporu' + titleSuffix,
      filename: `satis_raporu_${new Date().toISOString().split('T')[0]}.pdf`,
      headers: generalStatsHeaders,
      data: [
        ...generalStatsData,
        ['', ''], // Boş satır
        ['Şirket Bazlı İstatistikler', ''], // Alt başlık
        companyStatsHeaders,
        ...companyStatsData,
        ['', ''], // Boş satır
        ['Proje Bazlı İstatistikler', ''], // Alt başlık
        projectStatsHeaders,
        ...projectStatsData
      ],
      fontSize: 10,
      orientation: 'portrait'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Geri Dön
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Satış Raporu
          </h1>
        </div>
        <button 
          onClick={generatePDF}
          className="inline-flex items-center px-4 py-2 text-sm font-medium border text-black border-black bg-white hover:bg-black/5 rounded-md transition-colors duration-200"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          PDF İndir
        </button>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Genel İstatistikler */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Toplam Sipariş"
          value={stats.totalOrders}
          description="Sistemdeki toplam sipariş sayısı"
          icon={DocumentTextIcon}
          color="blue"
        />
        <StatCard
          title="Toplam Tutar"
          value={formatCurrency(stats.totalAmount)}
          description="Tüm siparişlerin toplam tutarı"
          icon={CurrencyDollarIcon}
          color="green"
        />
        <StatCard
          title="Ortalama Sipariş Tutarı"
          value={formatCurrency(stats.averageAmount)}
          description="Sipariş başına ortalama tutar"
          icon={ChartBarIcon}
          color="purple"
        />
      </div>

      {/* Şirket Bazlı İstatistikler */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
            Şirket Bazlı İstatistikler
          </h3>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Şirket
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş Sayısı
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam Tutar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.companyStats.map((company, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {company.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {company.orderCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(company.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Proje Bazlı İstatistikler */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Proje Bazlı İstatistikler
          </h3>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proje
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş Sayısı
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam Tutar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.projectStats.map((project, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {project.orderCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(project.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 