'use client';

import { useState, useEffect } from 'react';
import { medicalApi } from '@/lib/services/api';
import { 
  PlusCircleIcon, 
  PencilIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function MedicalCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, customerId: null });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await medicalApi.getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error loading customers:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    try {
      await medicalApi.deleteCustomer(customerId);
      setCustomers(customers.filter(customer => customer.id !== customerId));
      setDeleteModal({ isOpen: false, customerId: null });
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Medical Customers</h1>
        <Link href="/dashboard/medical-customers/new" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600">
          <PlusCircleIcon className="h-5 w-5" />
          New Customer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">{customer.type}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserIcon className="h-4 w-4" />
                    <span>{customer.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {customer.city}, {customer.district}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Bed Count:</span> {customer.bedCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Annual Patients:</span> {customer.annualPatientCount}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Link href={`/dashboard/medical-customers/${customer.id}`} className="text-blue-600 hover:text-blue-900">
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, customerId: customer.id })}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Last Visit:</span> {new Date(customer.lastVisitDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Next Visit:</span> {new Date(customer.nextVisitDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Notes:</span> {customer.notes}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, customerId: null })}
        onConfirm={() => handleDelete(deleteModal.customerId)}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
} 