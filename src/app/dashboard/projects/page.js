'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi } from '@/lib/services/api';
import { PlusIcon, PencilIcon, TrashIcon, FolderIcon, CheckCircleIcon, ClockIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import StatCard from '@/components/StatCard';
import exportToPdf from '@/components/PdfExport';
import Link from 'next/link';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function Projeler() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsApi.getProjects();
      setProjects(data);
      
      // İstatistikleri hesapla
      const statistics = data.reduce((acc, project) => {
        acc.total++;
        acc[project.status]++;
        return acc;
      }, { total: 0, active: 0, completed: 0, pending: 0 });
      
      setStats(statistics);
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
      alert('Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await projectsApi.deleteProject(id);
      await loadProjects();
      setDeleteModal({ isOpen: false, projectId: null });
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      alert('Proje silinirken bir hata oluştu');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      default:
        return status;
    }
  };

  const handleExportPdf = () => {
    const headers = ['Proje Adı', 'Açıklama', 'Proje Sorumlusu', 'Firma', 'Durum'];
    const data = projects.map(project => [
      project.name,
      project.description,
      project.manager,
      project.company,
      project.status === 'active' ? 'Aktif' :
      project.status === 'completed' ? 'Tamamlandı' :
      project.status === 'pending' ? 'Beklemede' : project.status
    ]);

    exportToPdf({
      title: 'Projeler Listesi',
      filename: 'projeler.pdf',
      headers,
      data,
      fontSize: 8
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-6 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Projeler
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 gap-x-3">
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 border border-gray-300"
          >
            <DocumentArrowDownIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            PDF İndir
          </button>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Yeni Proje
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Toplam Proje"
          value={stats.total}
          icon={FolderIcon}
          trend={{ value: stats.total, text: 'toplam' }}
          color="indigo"
        />
        <StatCard
          title="Aktif Projeler"
          value={stats.active}
          icon={ClockIcon}
          trend={{ value: stats.active, text: 'aktif' }}
          color="green"
        />
        <StatCard
          title="Tamamlanan Projeler"
          value={stats.completed}
          icon={CheckCircleIcon}
          trend={{ value: stats.completed, text: 'tamamlandı' }}
          color="blue"
        />
        <StatCard
          title="Bekleyen Projeler"
          value={stats.pending}
          icon={ClockIcon}
          trend={{ value: stats.pending, text: 'beklemede' }}
          color="yellow"
        />
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Proje Adı
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Açıklama
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Sorumlu
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Firma
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Durum
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {project.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {project.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {project.manager}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {project.company}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => router.push(`/dashboard/projects/edit/${project.id}`)}
                            className="inline-flex items-center gap-x-1.5 text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Düzenle
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, projectId: project.id })}
                            className="inline-flex items-center gap-x-1.5 text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-3 py-4 text-sm text-gray-500 text-center">
                        Henüz hiç proje eklenmemiş
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, projectId: null })}
        onConfirm={() => handleDelete(deleteModal.projectId)}
        title="Proje Silme"
        message="Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 