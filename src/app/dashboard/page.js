'use client';

import { useAuth } from '../../components/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import tr from 'date-fns/locale/tr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarIcon, UserGroupIcon, BuildingOfficeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { calendarApi } from '@/lib/services/api';

const locales = {
  'tr': tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Fake API çağrıları
const fetchProjectManagerStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalUsers: 156,
    activeProjects: 23,
    totalSponsors: 45,
    pendingOrders: 12
  };
};

const fetchAccountantStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalExpenses: 156789,
    pendingPayments: 23,
    monthlyRevenue: 234567,
    totalCustomers: 89
  };
};

const getEvents = () => {
  return [
    {
      id: 1,
      title: 'Planlama Toplantısı',
      start: new Date(2024, 2, 15, 10, 0),
      end: new Date(2024, 2, 15, 11, 30),
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Doğum Günü - Ahmet Yılmaz',
      start: new Date(2024, 2, 20),
      end: new Date(2024, 2, 20),
      type: 'birthday'
    },
    {
      id: 3,
      title: 'Görev Teslim Tarihi',
      start: new Date(2024, 2, 25),
      end: new Date(2024, 2, 25),
      type: 'deadline'
    },
    {
      id: 4,
      title: 'Kongre',
      start: new Date(2024, 2, 28),
      end: new Date(2024, 2, 30),
      type: 'congress'
    }
  ];
};

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = user?.role === 'PROJECT_MANAGER' 
          ? await fetchProjectManagerStats()
          : await fetchAccountantStats();
        setStats(data);
      } catch (error) {
        console.error('Stats yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await calendarApi.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Etkinlikler yüklenirken hata:', error);
      }
    };

    loadEvents();
  }, []);

  // Özel etkinlik stilleri
  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#4F46E5',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block'
    };

    switch (event.type) {
      case 'birthday':
        style.backgroundColor = '#EC4899';
        break;
      case 'meeting':
        style.backgroundColor = '#4F46E5';
        break;
      case 'deadline':
        style.backgroundColor = '#EF4444';
        break;
      case 'congress':
        style.backgroundColor = '#10B981';
        break;
      default:
        break;
    }

    return {
      style
    };
  };

  const messages = {
    today: 'Bugün',
    previous: 'Önceki',
    next: 'Sonraki',
    month: 'Ay',
    week: 'Hafta',
    day: 'Gün',
    agenda: 'Ajanda',
    date: 'Tarih',
    time: 'Saat',
    event: 'Etkinlik',
    allDay: 'Tüm Gün',
    work_week: 'Hafta',
    yesterday: 'Dün',
    tomorrow: 'Yarın',
    noEventsInRange: 'Bu aralıkta etkinlik yok.',
    showMore: total => `+${total} etkinlik daha`
  };

  if (!user) return null;
  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {user.role === 'PROJECT_MANAGER' ? 'Proje Yönetimi' : 'Muhasebe Yönetimi'}
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {user.role === 'PROJECT_MANAGER' ? (
          <>
            <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} />
            <StatCard title="Aktif Projeler" value={stats.activeProjects} />
            <StatCard title="Sponsor Firmalar" value={stats.totalSponsors} />
            <StatCard title="Bekleyen Siparişler" value={stats.pendingOrders} />
          </>
        ) : (
          <>
            <StatCard 
              title="Toplam Giderler" 
              value={`₺${stats.totalExpenses.toLocaleString()}`} 
            />
            <StatCard 
              title="Bekleyen Ödemeler" 
              value={stats.pendingPayments} 
            />
            <StatCard 
              title="Aylık Gelir" 
              value={`₺${stats.monthlyRevenue.toLocaleString()}`} 
            />
            <StatCard 
              title="Toplam Müşteri" 
              value={stats.totalCustomers} 
            />
          </>
        )}
      </div>

      {/* Etkinlik Türleri Açıklaması */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Etkinlik Türleri</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#4F46E5]"></div>
            <span className="text-sm text-gray-600">Toplantılar</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#EC4899]"></div>
            <span className="text-sm text-gray-600">Doğum Günleri</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <span className="text-sm text-gray-600">Son Teslim Tarihleri</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            <span className="text-sm text-gray-600">Kongreler</span>
          </div>
        </div>
      </div>

      {/* Takvim */}
      <div className="bg-white p-6 rounded-lg shadow">
        <style jsx global>{`
          .rbc-toolbar {
            margin-bottom: 20px;
            padding: 10px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .rbc-toolbar button {
            color: #1f2937;
            border: 1px solid #d1d5db;
            padding: 6px 12px;
            border-radius: 6px;
            background: white;
            font-weight: 500;
            outline: none !important;
          }
          .rbc-toolbar button:hover {
            background-color: #f3f4f6;
          }
          .rbc-toolbar button.rbc-active {
            background-color: #4F46E5;
            color: white;
          }
          .rbc-toolbar-label {
            color: #111827;
            font-weight: 600;
            font-size: 1.1rem;
          }
          .rbc-header {
            padding: 10px;
            font-weight: 600;
            color: #111827;
          }
          .rbc-today {
            background-color: #eef2ff;
          }
          .rbc-event {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
          }
          .rbc-show-more {
            color: #4F46E5;
            font-weight: 500;
          }
          .rbc-off-range-bg {
            background-color: #f9fafb;
          }
          .rbc-date-cell {
            color: #111827;
            font-weight: 500;
          }
          .rbc-day-bg + .rbc-day-bg {
            border-left: 1px solid #e5e7eb;
          }
          .rbc-month-view {
            border-radius: 8px;
            border-color: #e5e7eb;
          }
          .rbc-toolbar button:focus,
          input:focus,
          button:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          .rbc-toolbar button:active {
            background-color: #4338ca;
            color: white;
          }
          input:focus-visible,
          button:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }
        `}</style>
        <div style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['month']}
            defaultView="month"
            popup={false}
            selectable={false}
            toolbar={true}
            date={date}
            onNavigate={(newDate, view, action) => {
              setDate(newDate);
              const loadEvents = async () => {
                try {
                  const data = await calendarApi.getEvents(newDate);
                  setEvents(data);
                } catch (error) {
                  console.error('Etkinlikler yüklenirken hata:', error);
                }
              };
              loadEvents();
            }}
            formats={{
              monthHeaderFormat: (date) => format(date, 'MMMM yyyy', { locale: tr }),
              dayHeaderFormat: (date) => format(date, 'dd MMMM yyyy', { locale: tr }),
              dayRangeHeaderFormat: ({ start, end }) => {
                return `${format(start, 'dd MMMM', { locale: tr })} - ${format(end, 'dd MMMM', { locale: tr })}`;
              },
            }}
            messages={{
              next: "İleri",
              previous: "Geri",
              today: "Bugün",
              month: "Ay",
              date: "Tarih",
              noEventsInRange: "Bu aralıkta etkinlik yok.",
              showMore: total => `+${total} etkinlik daha`
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {value}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
} 