'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import StatCard from '@/components/StatCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function Users() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
      
      // İstatistikleri hesapla
      const totalUsers = data.length;
      const activeUsers = data.filter(user => user.status === 'active').length;
      const adminUsers = data.filter(user => user.role === 'admin').length;

      setStats({
        totalUsers,
        activeUsers,
        adminUsers
      });
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await usersApi.deleteUser(userId);
      await loadUsers();
      setDeleteModal({ isOpen: false, userId: null });
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      alert('Kullanıcı silinirken bir hata oluştu');
    }
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
            Kullanıcı Yönetimi
          </h1>
        </div>
        <button
          onClick={() => router.push('/dashboard/users/new')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Kullanıcı
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          description="Sistemdeki toplam kullanıcı sayısı"
          icon={UserGroupIcon}
          color="blue"
        />
        <StatCard
          title="Aktif Kullanıcılar"
          value={stats.activeUsers}
          description="Aktif durumdaki kullanıcı sayısı"
          icon={UserGroupIcon}
          color="green"
        />
        <StatCard
          title="Yönetici Sayısı"
          value={stats.adminUsers}
          description="Yönetici rolüne sahip kullanıcı sayısı"
          icon={UserGroupIcon}
          color="purple"
        />
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Kullanıcı Listesi
          </h3>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-posta
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-4">
                        <button
                          onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="w-4 h-4 mr-1" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, userId: user.id })}
                          className="inline-flex items-center text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        onConfirm={() => handleDelete(deleteModal.userId)}
        title="Kullanıcı Silme"
        message="Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
} 