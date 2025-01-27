'use client';

import { useState, useEffect } from 'react';
import { paymentRequestsApi } from '@/lib/services/api';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function PaymentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await paymentRequestsApi.getPaymentRequests();
        setRequests(data);
      } catch (error) {
        console.error('Ödeme talepleri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Ödeme Talepleri</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/payment-requests/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Yeni Ödeme Talebi
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tutar</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Açıklama</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Talep Tarihi</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₺{request.amount}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.requestDate}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status === 'approved' ? 'Onaylandı' 
                           : request.status === 'rejected' ? 'Reddedildi' 
                           : 'Beklemede'}
                        </span>
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