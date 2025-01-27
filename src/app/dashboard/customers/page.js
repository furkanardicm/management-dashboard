'use client';

import { useState, useEffect } from 'react';
import { customersApi } from '@/lib/services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await customersApi.getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Müşteriler</h1>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">İsim</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Telefon</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Toplam Sipariş</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-3 py-4 text-sm text-gray-500">{customer.name}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{customer.email}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{customer.phone}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{customer.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 