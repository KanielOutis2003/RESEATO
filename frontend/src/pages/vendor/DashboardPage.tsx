import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle, XCircle, Users, 
  TrendingUp, PieChart, LayoutDashboard, ClipboardList, 
  Table as TableIcon, Search, Bell, ChevronRight,
  DollarSign, Activity, Utensils, LogOut
} from 'lucide-react';
import { Reservation, ReservationStatus } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import reservationService from '../../services/reservationService';
import authService from '../../services/authService';
import { ReservationCard } from '../../components/reservation/ReservationCard';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

export const VendorDashboardPage: React.FC = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = authService.getStoredUser();

  useEffect(() => {
    loadDashboardData();
  }, [selectedDate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const restaurantData = await restaurantService.getMyRestaurant();
      setRestaurant(restaurantData);

      if (restaurantData) {
        const reservationData = await reservationService.getRestaurantReservations(
          restaurantData.id,
          selectedDate
        );
        setReservations(reservationData);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-[#1a0f0f] flex items-center justify-center"><Loader /></div>;

  const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
    try {
      await reservationService.updateReservationStatus(reservationId, status);
      toast.success(`Reservation ${status}`);
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update reservation');
    }
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === ReservationStatus.PENDING).length,
    confirmed: reservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
    completed: reservations.filter(r => r.status === ReservationStatus.COMPLETED).length,
    revenue: reservations.filter(r => r.status === ReservationStatus.COMPLETED || r.status === ReservationStatus.CONFIRMED).length * 70,
    tablesUsed: new Set(reservations.filter(r => r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.PENDING).map(r => r.tableId)).size
  };

  const tableConfigs = [
    { range: '2-4 Persons', available: 10, total: 10, capacity: 4 },
    { range: '5-7 Persons', available: 8, total: 8, capacity: 7 },
    { range: '8-9 Persons', available: 6, total: 6, capacity: 9 },
    { range: '10-11 Persons', available: 4, total: 4, capacity: 11 },
    { range: '12 Persons', available: 2, total: 2, capacity: 12 },
  ];

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#fcd34d' },
    { name: 'Confirmed', value: stats.confirmed, color: '#34d399' },
    { name: 'Completed', value: stats.completed, color: '#a78bfa' },
  ].filter(item => item.value > 0);

  const chartData = [
    { name: 'Mon', bookings: 12 },
    { name: 'Tue', bookings: 19 },
    { name: 'Wed', bookings: 15 },
    { name: 'Thu', bookings: 22 },
    { name: 'Fri', bookings: 30 },
    { name: 'Sat', bookings: 45 },
    { name: 'Sun', bookings: 38 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'reservations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8 bg-black/20 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10">
              <h2 className="text-3xl font-black">Reservation List</h2>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-md"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {reservations.length === 0 ? (
                <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[32px] p-16 text-center">
                  <p className="text-white/40 font-medium text-lg">No reservations for this date</p>
                </div>
              ) : (
                reservations.map((res: any) => (
                  <div key={res.id} className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-bold border border-white/10">
                        {res.users?.first_name?.[0] || 'G'}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl">{res.users?.first_name} {res.users?.last_name}</h4>
                        <div className="flex items-center space-x-6 mt-2 text-sm text-white/40">
                          <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><Clock size={16} className="text-primary-400" /> {res.reservation_time}</span>
                          <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><Users size={16} className="text-primary-400" /> {res.guest_count} Persons</span>
                          <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><TableIcon size={16} className="text-primary-400" /> Table {res.tables?.table_number || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                        res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        res.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        res.status === 'completed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {res.status}
                      </span>
                      
                      {res.status === 'pending' && (
                        <div className="flex gap-3 ml-4">
                          <button 
                            onClick={() => handleStatusUpdate(res.id, ReservationStatus.CONFIRMED)}
                            className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                          >
                            <CheckCircle size={22} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(res.id, ReservationStatus.CANCELLED)}
                            className="p-3 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500/20 transition-all border border-red-500/20"
                          >
                            <XCircle size={22} />
                          </button>
                        </div>
                      )}

                      {res.status === 'confirmed' && (
                        <button 
                          onClick={() => handleStatusUpdate(res.id, ReservationStatus.COMPLETED)}
                          className="ml-4 px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold text-sm hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/40"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'tables':
        return (
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 mb-8">
              <h2 className="text-3xl font-black">Table Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tableConfigs.map((config, index) => {
                const bookedCount = reservations.filter(r => 
                  (r.status === 'confirmed' || r.status === 'pending') && 
                  r.guest_count <= config.capacity && 
                  (index === 0 || r.guest_count > tableConfigs[index-1].capacity)
                ).length;
                const available = Math.max(0, config.total - bookedCount);

                return (
                  <div key={config.range} className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 text-center group hover:bg-white/5 transition-all">
                    <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform border border-white/10 shadow-2xl">
                      <TableIcon className="text-primary-400" size={48} />
                    </div>
                    <h4 className="font-bold text-3xl mb-3">{config.range}</h4>
                    <p className="text-sm text-white/30 uppercase tracking-[0.2em] font-bold mb-8">Total: {config.total} Tables</p>
                    <div className="flex items-center justify-center gap-4 bg-white/5 py-4 rounded-3xl border border-white/5">
                      <div className={`w-3 h-3 rounded-full ${available > 0 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'}`}></div>
                      <span className={`text-xl font-bold ${available > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {available} Available
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard icon={<Calendar className="text-emerald-400" />} label="Today's Bookings" value={stats.total} color="bg-emerald-500/10" />
              <StatCard icon={<TableIcon className="text-blue-400" />} label="Tables Used" value={stats.tablesUsed} color="bg-blue-500/10" />
              <StatCard icon={<DollarSign className="text-purple-400" />} label="Total Commissions" value={`₱${stats.revenue}`} color="bg-purple-500/10" />
              <StatCard icon={<CheckCircle className="text-orange-400" />} label="Confirmed" value={stats.confirmed} color="bg-orange-500/10" />
              <StatCard icon={<Clock className="text-pink-400" />} label="Pending" value={stats.pending} color="bg-pink-500/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sales Details - Donut Chart */}
              <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-bold">Reservation Status</h3>
                  <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/50 outline-none backdrop-blur-md">
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="h-72 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black">{stats.total}</span>
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Total</span>
                  </div>
                </div>
                <div className="mt-10 space-y-4">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-white/60">{item.name}</span>
                      </div>
                      <span className="text-sm font-black">{stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Chart - Bar Chart */}
              <div className="lg:col-span-2 bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-bold">Booking Trends</h3>
                  <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/50 outline-none backdrop-blur-md">
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 'bold' }} 
                        dy={15}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                      />
                      <Bar 
                        dataKey="bookings" 
                        fill="#8b4e4e" 
                        radius={[10, 10, 0, 0]} 
                        barSize={40}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 5 ? '#fcd34d' : '#8b4e4e'} 
                            className="drop-shadow-[0_0_10px_rgba(139,78,78,0.3)]"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Live Restaurant Activity Section */}
              <div className="lg:col-span-3 bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                      <Activity className="text-primary-400" size={24} />
                    </div>
                    Live Restaurant Activity
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ActivityCard 
                    title="Most Popular Table" 
                    subtitle="Table T-4 (Window View)" 
                    value="12 Bookings Today" 
                    image="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80" 
                  />
                  <ActivityCard 
                    title="Top Returning Guest" 
                    subtitle="Maria Santos" 
                    value="5 Visits this month" 
                    image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" 
                  />
                  <ActivityCard 
                    title="Peak Reservation Time" 
                    subtitle="7:30 PM - 8:30 PM" 
                    value="100% Occupancy" 
                    image="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80" 
                  />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen text-white flex overflow-hidden font-sans relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={restaurant?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80'} 
          className="w-full h-full object-cover"
          alt="background"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <Toaster position="top-center" />
      
      {/* Sidebar */}
      <aside className="w-72 bg-black/20 backdrop-blur-3xl border-r border-white/10 flex flex-col p-8 relative z-40 m-4 rounded-[32px]">
        <div className="flex items-center space-x-3 mb-12 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">RESEATO</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarLink 
            icon={<ClipboardList size={20} />} 
            label="Reservation List" 
            active={activeTab === 'reservations'} 
            onClick={() => setActiveTab('reservations')} 
          />
          <SidebarLink 
            icon={<TableIcon size={20} />} 
            label="Tables" 
            active={activeTab === 'tables'} 
            onClick={() => setActiveTab('tables')} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3 backdrop-blur-md border border-white/5">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold shadow-lg">
              {restaurant?.name?.[0] || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{restaurant?.name || 'Vendor'}</p>
              <p className="text-xs text-white/40 truncate">Restaurant Manager</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm tracking-wide">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-0 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Internal Header Section */}
          <div className="flex items-center justify-between bg-black/20 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10">
            <div>
              <h2 className="text-sm text-white/40 font-medium uppercase tracking-widest">Welcome back,</h2>
              <p className="text-3xl font-black text-white flex items-center gap-3">
                {user?.firstName} 👋
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search reservations..." 
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-80 transition-all backdrop-blur-md"
                />
              </div>
              <button className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all relative backdrop-blur-md">
                <Bell size={22} />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black/20"></span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ icon: any, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40 translate-x-1' 
        : 'text-white/50 hover:text-white hover:bg-white/10'
    }`}
  >
    {icon}
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </button>
);

const StatCard: React.FC<{ icon: any, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-black/20 backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] flex flex-col justify-between h-44 group transition-all"
  >
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">{label}</p>
    </div>
  </motion.div>
);

const ActivityCard: React.FC<{ title: string, subtitle: string, value: string, image: string }> = ({ title, subtitle, value, image }) => (
  <div className="group relative rounded-[32px] overflow-hidden aspect-[4/3] border border-white/10 bg-black/20 backdrop-blur-md">
    <img src={image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" alt="" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <p className="text-[10px] text-primary-400 font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
      <h4 className="text-xl font-bold mb-1">{subtitle}</h4>
      <p className="text-sm text-white/50">{value}</p>
    </div>
  </div>
);