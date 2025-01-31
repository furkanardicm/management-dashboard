'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentRequestsApi, sponsorsApi, projectsApi } from '@/lib/services/api';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function OdemeTalebiDuzenle({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    company: '',
    project: '',
    requestDate: '',
    status: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentRequest, companiesData, projectsData] = await Promise.all([
          paymentRequestsApi.getPaymentRequest(params.id),
          sponsorsApi.getSponsors(),
          projectsApi.getProjects()
        ]);

        setFormData({
          description: paymentRequest.description || '',
          amount: paymentRequest.amount || '',
          company: paymentRequest.company || '',
          project: paymentRequest.project || '',
          requestDate: paymentRequest.requestDate || '',
          status: paymentRequest.status || 'pending'
        });
        setCompanies(companiesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
        alert(error.message || 'Veriler yüklenirken bir hata oluştu');
        router.push('/dashboard/payment-requests');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.description || !formData.amount || !formData.company || !formData.project) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      await paymentRequestsApi.updatePaymentRequest(params.id, formData);
      router.push('/dashboard/payment-requests');
    } catch (error) {
      console.error('Ödeme talebi güncellenirken hata:', error);
      alert(error.message || 'Ödeme talebi güncellenirken bir hata oluştu');
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
    <div className="max-w-[1400px] mx-auto py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Ödeme Talebi Düzenle
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Ödeme talebi bilgilerini güncellemek için formu kullanın
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Açıklama
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="description"
                  id="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus-visible:outline-none sm:text-sm sm:leading-6"
                  placeholder="Ödeme açıklaması"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
                Tutar
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus-visible:outline-none sm:text-sm sm:leading-6"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                Firma
              </label>
              <div className="mt-2">
                <select
                  name="company"
                  id="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus-visible:outline-none sm:text-sm sm:leading-6 cursor-pointer"
                >
                  <option value="">Firma Seçin</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="project" className="block text-sm font-medium leading-6 text-gray-900">
                Proje
              </label>
              <div className="mt-2">
                <select
                  name="project"
                  id="project"
                  required
                  value={formData.project}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus-visible:outline-none sm:text-sm sm:leading-6 cursor-pointer"
                >
                  <option value="">Proje Seçin</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Durum
              </label>
              <div className="mt-2">
                <select
                  name="status"
                  id="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus-visible:outline-none sm:text-sm sm:leading-6 cursor-pointer"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="approved">Onaylandı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-x-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            <XMarkIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 