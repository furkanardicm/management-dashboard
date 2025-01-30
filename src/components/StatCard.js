'use client';

export default function StatCard({ title, value, description, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  const lightColorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative overflow-hidden">
      {/* İkon Arka Planı */}
      <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full ${colorClasses[color]} opacity-10`} />
      
      {/* İkon */}
      <div className={`inline-flex items-center justify-center p-3 rounded-lg ${lightColorClasses[color]}`}>
        <Icon className="h-6 w-6" />
      </div>

      {/* İçerik */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
} 