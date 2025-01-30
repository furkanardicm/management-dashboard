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
import { CalendarIcon, UserGroupIcon, BuildingOfficeIcon, DocumentTextIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { calendarApi } from '@/lib/services/api';
import StatCard from '@/components/StatCard';

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

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === 'PROJECT_MANAGER' ? (
          <>
            <StatCard
              title="Toplam Kullanıcı"
              value={stats?.totalUsers || 0}
              description="Sistemde kayıtlı tüm kullanıcılar"
              icon={UserGroupIcon}
              color="blue"
            />
            <StatCard
              title="Aktif Projeler"
              value={stats?.activeProjects || 0}
              description="Devam eden proje sayısı"
              icon={DocumentTextIcon}
              color="green"
            />
            <StatCard
              title="Sponsor Firmalar"
              value={stats?.totalSponsors || 0}
              description="Toplam sponsor firma sayısı"
              icon={BuildingOfficeIcon}
              color="purple"
            />
            <StatCard
              title="Bekleyen Siparişler"
              value={stats?.pendingOrders || 0}
              description="İşlem bekleyen sipariş sayısı"
              icon={CalendarIcon}
              color="yellow"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Toplam Gider"
              value={`₺${stats?.totalExpenses?.toLocaleString() || 0}`}
              description="Toplam gider tutarı"
              icon={CurrencyDollarIcon}
              color="red"
            />
            <StatCard
              title="Bekleyen Ödemeler"
              value={stats?.pendingPayments || 0}
              description="Bekleyen ödeme sayısı"
              icon={DocumentTextIcon}
              color="yellow"
            />
            <StatCard
              title="Aylık Gelir"
              value={`₺${stats?.monthlyRevenue?.toLocaleString() || 0}`}
              description="Bu ayki toplam gelir"
              icon={CurrencyDollarIcon}
              color="green"
            />
            <StatCard
              title="Toplam Müşteri"
              value={stats?.totalCustomers || 0}
              description="Kayıtlı müşteri sayısı"
              icon={UserGroupIcon}
              color="blue"
            />
          </>
        )}
      </div>

      {/* Etkinlik Türleri Açıklaması */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Etkinlik Türleri</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#3730A3]"></div>
            <span className="text-sm text-gray-600">Toplantılar</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#BE185D]"></div>
            <span className="text-sm text-gray-600">Doğum Günleri</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#B91C1C]"></div>
            <span className="text-sm text-gray-600">Son Teslim Tarihleri</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#065F46]"></div>
            <span className="text-sm text-gray-600">Kongreler</span>
          </div>
        </div>
      </div>

      {/* Takvim */}
      <div className="bg-white p-6 rounded-lg shadow">
        <style jsx global>{`
          .rbc-calendar {
            height: auto !important;
          }
          .rbc-month-view {
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            flex: none !important;
            height: auto !important;
          }
          .rbc-month-row {
            min-height: 60px !important;
            max-height: 60px !important;
          }
          .rbc-row-content {
            min-height: 60px !important;
            max-height: 60px !important;
          }
          .rbc-row-bg {
            min-height: 60px !important;
            max-height: 60px !important;
          }
          .rbc-date-cell {
            padding: 4px 8px !important;
            text-align: center !important;
          }
          .rbc-date-cell > a {
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #000000 !important;
          }
          .rbc-button-link {
            color: #000000 !important;
          }
          .rbc-off-range .rbc-button-link {
            color: #9CA3AF !important;
          }
          .rbc-off-range-bg {
            background-color: #f9fafb !important;
          }
          .rbc-header {
            padding: 8px !important;
            font-weight: 600;
            color: #000000 !important;
            font-size: 14px !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          .rbc-today {
            background-color: #eef2ff !important;
          }
          .rbc-event {
            padding: 0 !important;
            border-radius: 50% !important;
            cursor: pointer;
            position: relative;
            width: 18px !important;
            height: 18px !important;
            margin: 2px auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 10px !important;
            color: white !important;
            border: none !important;
          }
          .rbc-toolbar {
            margin-bottom: 20px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          @media (min-width: 640px) {
            .rbc-toolbar {
              flex-direction: row;
              align-items: center;
              gap: 0;
            }
          }
          .rbc-toolbar-label {
            color: #111827;
            font-weight: 600;
            font-size: 1.1rem;
            text-align: center;
            order: -1;
            margin-bottom: 8px;
          }
          @media (min-width: 640px) {
            .rbc-toolbar-label {
              order: 0;
              margin-bottom: 0;
            }
          }
          .rbc-btn-group {
            display: flex;
            gap: 8px;
            justify-content: center;
          }
          .rbc-toolbar button {
            color: #1f2937;
            border: 1px solid #e5e7eb;
            padding: 8px;
            border-radius: 8px;
            background: white;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 40px;
            transition: all 0.2s;
          }
          .rbc-toolbar button:hover {
            background-color: #f3f4f6;
            border-color: #d1d5db;
          }
          .rbc-toolbar button.rbc-active {
            background-color: #4F46E5;
            color: white;
            border-color: #4F46E5;
          }
          .rbc-toolbar button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
        <div className="h-[450px] flex flex-col">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
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
            components={{
              toolbar: (toolbarProps) => {
                return (
                  <div className="rbc-toolbar">
                    <span className="rbc-btn-group">
                      <button
                        type="button"
                        onClick={() => toolbarProps.onNavigate('PREV')}
                        title="Önceki ay"
                      >
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toolbarProps.onNavigate('TODAY')}
                        title="Bugün"
                      >
                        <CalendarDaysIcon className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toolbarProps.onNavigate('NEXT')}
                        title="Sonraki ay"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </span>
                    <span className="rbc-toolbar-label">
                      {format(toolbarProps.date, 'MMMM yyyy', { locale: tr })}
                    </span>
                  </div>
                );
              },
              event: (props) => {
                let backgroundColor, label;
                switch (props.event.type) {
                  case 'birthday':
                    backgroundColor = '#BE185D';
                    label = 'D';
                    break;
                  case 'meeting':
                    backgroundColor = '#3730A3';
                    label = 'T';
                    break;
                  case 'deadline':
                    backgroundColor = '#B91C1C';
                    label = 'S';
                    break;
                  case 'congress':
                    backgroundColor = '#065F46';
                    label = 'K';
                    break;
                  default:
                    backgroundColor = '#3730A3';
                    label = 'E';
                }
                return (
                  <div
                    className="rbc-event"
                    style={{
                      backgroundColor,
                      opacity: 1
                    }}
                  >
                    {label}
                  </div>
                );
              }
            }}
          />
        </div>
      </div>

      {/* Etkinlik Listesi */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bu Aydaki Etkinlikler</h3>
        <div className="space-y-2.5">
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm">Bu ay için planlanmış etkinlik bulunmuyor.</p>
          ) : (
            events.map((event) => {
              let bgColor, textColor, dotColor;
              switch (event.type) {
                case 'birthday':
                  bgColor = 'bg-pink-50';
                  textColor = 'text-pink-700';
                  dotColor = 'bg-pink-700';
                  break;
                case 'meeting':
                  bgColor = 'bg-indigo-50';
                  textColor = 'text-indigo-700';
                  dotColor = 'bg-indigo-700';
                  break;
                case 'deadline':
                  bgColor = 'bg-red-50';
                  textColor = 'text-red-700';
                  dotColor = 'bg-red-700';
                  break;
                case 'congress':
                  bgColor = 'bg-emerald-50';
                  textColor = 'text-emerald-700';
                  dotColor = 'bg-emerald-700';
                  break;
                default:
                  bgColor = 'bg-gray-50';
                  textColor = 'text-gray-700';
                  dotColor = 'bg-gray-700';
              }

              return (
                <div key={event.id} className={`flex items-center justify-between p-2.5 rounded-lg ${bgColor} hover:bg-opacity-80 transition-colors duration-200`}>
                  <div className="flex items-center min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full ${dotColor} opacity-80 flex-shrink-0`}></div>
                    <div className="ml-2.5 truncate">
                      <h4 className={`font-medium ${textColor} text-sm truncate`}>{event.title}</h4>
                      <p className="text-xs text-gray-600">
                        {format(event.start, 'dd MMMM yyyy', { locale: tr })}
                        {event.start.getHours() !== 0 && (
                          <span> • {format(event.start, 'HH:mm', { locale: tr })}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} flex-shrink-0`}>
                    {event.type === 'birthday' && 'Doğum Günü'}
                    {event.type === 'meeting' && 'Toplantı'}
                    {event.type === 'deadline' && 'Son Tarih'}
                    {event.type === 'congress' && 'Kongre'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 