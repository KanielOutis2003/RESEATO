import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle, XCircle, Users, 
  TrendingUp, PieChart, LayoutDashboard, ClipboardList, 
  Table as TableIcon, Search, Bell, ChevronRight,
  DollarSign, Activity, Utensils, LogOut, User
} from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types';
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


const BEST_SELLERS: Record<string, { title: string; price: string; image: string }[]> = {
  'cabalen': [
    { title: 'Kare-Kare', price: '₱450', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
    { title: 'Crispy Pata', price: '₱950', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80' },
    { title: 'Sisig', price: '₱280', image: 'https://images.unsplash.com/photo-1631515243349-e19729527ed2?w=800&q=80' }
  ],
  'seoul black': [
    { title: 'Samgyeopsal Set', price: '₱799', image: 'https://images.unsplash.com/photo-1592736001263-0a0e67d5d0bb?w=800&q=80' },
    { title: 'Kimchi Jjigae', price: '₱320', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' },
    { title: 'Japchae', price: '₱280', image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&q=80' }
  ],
  'sachi ramen': [
    { title: 'Tonkotsu Ramen', price: '₱360', image: 'https://images.unsplash.com/photo-1543353071-873f17a7a5c9?w=800&q=80' },
    { title: 'Gyoza', price: '₱180', image: 'https://images.unsplash.com/photo-1604908177352-90a6626900ac?w=800&q=80' },
    { title: 'Chashu Don', price: '₱240', image: 'https://images.unsplash.com/photo-1605478574498-6e6b2b09e534?w=800&q=80' }
  ],
  'boy belly': [
    { title: 'Lechon Belly', price: '₱950', image: 'https://images.unsplash.com/photo-1555992336-03a23c69e0d2?w=800&q=80' },
    { title: 'Pork BBQ', price: '₱180', image: 'https://images.unsplash.com/photo-1550547660-247e04e22e96?w=800&q=80' },
    { title: 'Chicken Inasal', price: '₱220', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' }
  ],
  'chika-an cebuano kitchen': [
    { title: 'Bulalo', price: '₱520', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
    { title: 'Kinilaw', price: '₱280', image: 'https://images.unsplash.com/photo-1497888329096-51c27beffacd?w=800&q=80' },
    { title: 'Sinigang', price: '₱320', image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80' }
  ],
  'kuya j': [
    { title: 'Halo-Halo', price: '₱150', image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80' },
    { title: 'Crispy Pata', price: '₱950', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80' },
    { title: 'Lumpia', price: '₱160', image: 'https://images.unsplash.com/photo-1604908177453-016a08d33a6d?w=800&q=80' }
  ],
  'mesa restaurant philippines': [
    { title: 'Baked Scallops', price: '₱480', image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb43?w=800&q=80' },
    { title: 'Kare-Kare', price: '₱450', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
    { title: 'Crispy Boneless Pata', price: '₱990', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80' }
  ],
  'seafood & ribs warehouse': [
    { title: 'Seafood Platter', price: '₱1200', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80' },
    { title: 'Baby Back Ribs', price: '₱850', image: 'https://images.unsplash.com/photo-1543353071-873f17a7a5c9?w=800&q=80' },
    { title: 'Garlic Butter Shrimp', price: '₱650', image: 'https://images.unsplash.com/photo-1544025162-0a7b1d2be0dd?w=800&q=80' }
  ],
  'somac korean restaurant': [
    { title: 'Korean Fried Chicken', price: '₱420', image: 'https://images.unsplash.com/photo-1605478574498-6e6b2b09e534?w=800&q=80' },
    { title: 'Bibimbap', price: '₱320', image: 'https://images.unsplash.com/photo-1597309434845-a0660d11fb1f?w=800&q=80' },
    { title: 'Samgyeopsal Set', price: '₱799', image: 'https://images.unsplash.com/photo-1592736001263-0a0e67d5d0bb?w=800&q=80' }
  ],
  'superbowl of china': [
    { title: 'Sweet & Sour Pork', price: '₱380', image: 'https://images.unsplash.com/photo-1591951425328-48c1bfb6c8b3?w=800&q=80' },
    { title: 'Yang Chow Fried Rice', price: '₱250', image: 'https://images.unsplash.com/photo-1632150575176-661f57d452e0?w=800&q=80' },
    { title: 'Lemon Chicken', price: '₱360', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' }
  ],
  '__filipino': [
    { title: 'Crispy Pata', price: '₱950', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80' },
    { title: 'Sisig', price: '₱280', image: 'https://images.unsplash.com/photo-1631515243349-e19729527ed2?w=800&q=80' },
    { title: 'Kare-Kare', price: '₱450', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' }
  ],
  '__korean': [
    { title: 'Samgyeopsal Set', price: '₱799', image: 'https://images.unsplash.com/photo-1592736001263-0a0e67d5d0bb?w=800&q=80' },
    { title: 'Bibimbap', price: '₱320', image: 'https://images.unsplash.com/photo-1597309434845-a0660d11fb1f?w=800&q=80' },
    { title: 'Kimchi Jjigae', price: '₱320', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' }
  ],
  '__japanese': [
    { title: 'Tonkotsu Ramen', price: '₱360', image: 'https://images.unsplash.com/photo-1543353071-873f17a7a5c9?w=800&q=80' },
    { title: 'Gyoza', price: '₱180', image: 'https://images.unsplash.com/photo-1604908177352-90a6626900ac?w=800&q=80' },
    { title: 'Tempura', price: '₱260', image: 'https://images.unsplash.com/photo-1605478574498-6e6b2b09e534?w=800&q=80' }
  ],
  '__seafood': [
    { title: 'Seafood Platter', price: '₱1200', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80' },
    { title: 'Garlic Butter Shrimp', price: '₱650', image: 'https://images.unsplash.com/photo-1544025162-0a7b1d2be0dd?w=800&q=80' },
    { title: 'Grilled Salmon', price: '₱720', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' }
  ],
  '__chinese': [
    { title: 'Sweet & Sour Pork', price: '₱380', image: 'https://images.unsplash.com/photo-1591951425328-48c1bfb6c8b3?w=800&q=80' },
    { title: 'Yang Chow Fried Rice', price: '₱250', image: 'https://images.unsplash.com/photo-1632150575176-661f57d452e0?w=800&q=80' },
    { title: 'Lemon Chicken', price: '₱360', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' }
  ],
  '__default': [
    { title: 'Chef Special', price: '₱499', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
    { title: 'House Salad', price: '₱299', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
    { title: 'Signature Steak', price: '₱1200', image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&q=80' }
  ]
};

export const VendorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const user = authService.getStoredUser();

  const [searchQuery, setSearchBarQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
    loadDashboardData();
    loadNotifications();
  }, [selectedDate]);

  const loadNotifications = async () => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to load notifications');
    }
  };

  const filteredReservations = reservations.filter(r => 
    `${r.users?.first_name} ${r.users?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const restaurantData = await restaurantService.getMyRestaurant();
      setRestaurant(restaurantData);

      if (restaurantData) {
        // Fetch reservations for the selected date
        const reservationData = await reservationService.getRestaurantReservations(
          restaurantData.id,
          selectedDate
        );
        setReservations(reservationData);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
    try {
      await reservationService.updateReservationStatus(reservationId, status);
      toast.success(`Reservation ${status}`);
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update reservation');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.updateProfile({
        firstName: profileData.firstName,
        lastName: 'Manager', // Force lastname to be Manager as per user request
        phone: profileData.phone
      });
      toast.success('Profile updated successfully');
      setIsProfileModalOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === ReservationStatus.PENDING).length,
    confirmed: reservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
    completed: reservations.filter(r => r.status === ReservationStatus.COMPLETED).length,
    revenue: (reservations.filter(r => r.status === ReservationStatus.COMPLETED || r.status === ReservationStatus.CONFIRMED).length) * 30,
    tablesUsed: new Set(reservations.filter(r => r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.COMPLETED).map(r => r.tableId)).size
  };

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#fcd34d' },
    { name: 'Confirmed', value: stats.confirmed, color: '#34d399' },
    { name: 'Completed', value: stats.completed, color: '#a78bfa' },
  ].filter(item => item.value > 0);

  // Generate chart data based on last 7 days of reservations if we had that data, 
  // for now using mock but structured data
  const chartData = [
    { name: 'Mon', bookings: 12 },
    { name: 'Tue', bookings: 19 },
    { name: 'Wed', bookings: 15 },
    { name: 'Thu', bookings: 22 },
    { name: 'Fri', bookings: 30 },
    { name: 'Sat', bookings: 45 },
    { name: 'Sun', bookings: 38 },
  ];

  const getBestSellers = () => {
    const name = (restaurant?.name || '').toLowerCase();
    const cuisine = (restaurant?.cuisineType || restaurant?.cuisine || '').toLowerCase();
    if (BEST_SELLERS[name]) return BEST_SELLERS[name];
    if (cuisine.includes('filipino') || cuisine.includes('buffet')) return BEST_SELLERS['__filipino'];
    if (cuisine.includes('korean')) return BEST_SELLERS['__korean'];
    if (cuisine.includes('japanese') || cuisine.includes('ramen')) return BEST_SELLERS['__japanese'];
    if (cuisine.includes('seafood')) return BEST_SELLERS['__seafood'];
    if (cuisine.includes('chinese')) return BEST_SELLERS['__chinese'];
    return BEST_SELLERS['__default'];
  };

  const renderDashboardContent = () => (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        <StatCard icon={<Calendar className="text-emerald-400" size={20} />} label="Today" value={stats.total} color="bg-emerald-500/20" />
        <StatCard icon={<TableIcon className="text-blue-400" size={20} />} label="Used" value={stats.tablesUsed} color="bg-blue-500/20" />
        <StatCard icon={<Clock className="text-purple-400" size={20} />} label="Pending" value={stats.pending} color="bg-purple-500/20" />
        <StatCard icon={<CheckCircle className="text-orange-400" size={20} />} label="Confirmed" value={stats.confirmed} color="bg-orange-500/20" />
        <StatCard icon={<DollarSign className="text-pink-400" size={20} />} label="Commissions" value={`₱${stats.revenue}`} color="bg-pink-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Sales Details - Donut Chart */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 lg:p-8 flex flex-col h-[350px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-base lg:text-lg font-bold text-white">Status</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-2 lg:px-3 py-1 text-[10px] lg:text-xs text-white/60 outline-none">
              <option>Monthly</option>
            </select>
          </div>
          <div className="flex-1 relative min-h-[150px] lg:min-h-[200px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/20 text-xs">No data available</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl lg:text-3xl font-bold text-white">{stats.total}</span>
              <span className="text-[8px] lg:text-[10px] text-white/40 uppercase tracking-widest font-bold">Total</span>
            </div>
          </div>
          <div className="mt-6 lg:mt-8 grid grid-cols-2 gap-2 lg:block lg:space-y-3">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-2 lg:w-2.5 h-2 lg:h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] lg:text-sm text-white/60 truncate">{item.name}</span>
                </div>
                <span className="text-[10px] lg:text-sm font-bold text-white">{stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Chart - Bar Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 lg:p-8 flex flex-col h-[350px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-base lg:text-lg font-bold text-white">Booking Trends</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-2 lg:px-3 py-1 text-[10px] lg:text-xs text-white/60 outline-none">
              <option>Weekly</option>
            </select>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="bookings" 
                  fill="#8b4e4e" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h3 className="text-lg lg:text-xl font-bold text-white">Best Seller</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white/60"><ChevronRight className="rotate-180" size={16} /></button>
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white/60"><ChevronRight size={16} /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {getBestSellers().map((item, index) => (
            <TrendingCard key={index} title={item.title} price={item.price} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderReservationsContent = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-white">Reservation List</h2>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/80 outline-none focus:border-primary-500 transition-all"
        />
      </div>
      
      {filteredReservations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 lg:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary-500/20 rounded-2xl flex flex-col items-center justify-center text-primary-400 border border-primary-500/20 shrink-0">
                  <span className="text-lg lg:text-xl font-black leading-none">{reservation.guestCount}</span>
                  <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-tighter mt-1 opacity-60">Guests</span>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <h4 className="text-base lg:text-lg font-bold text-white truncate">
                      {reservation.users?.first_name} {reservation.users?.last_name}
                    </h4>
                    <span className="text-[8px] lg:text-[10px] font-bold text-white/20 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest w-fit">
                      ID: {reservation.id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs lg:text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-400/80 font-medium">
                      <Clock size={14} /> {reservation.reservationTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400/80 font-medium">
                      <TableIcon size={14} /> Table {reservation.tables?.table_number || 'TBD'}
                    </span>
                    {reservation.special_notes && (
                      <span className="flex items-center gap-1.5 text-purple-400/80 italic text-[10px] lg:text-xs">
                        <ClipboardList size={14} /> "{reservation.special_notes}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row lg:flex-row items-center justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-right">
                  <span className={`px-3 lg:px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    reservation.status === ReservationStatus.PENDING ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    reservation.status === ReservationStatus.CONFIRMED ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    reservation.status === ReservationStatus.AWAITING_PAYMENT ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-white/5 text-white/40 border border-white/10'
                  }`}>
                    {reservation.status.replace('_', ' ')}
                  </span>
                </div>
                
                {(reservation.status === ReservationStatus.PENDING || reservation.status === ReservationStatus.AWAITING_PAYMENT) && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(reservation.id, ReservationStatus.CONFIRMED)}
                      className="h-10 lg:h-11 px-4 lg:px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 text-xs lg:text-sm"
                    >
                      <CheckCircle size={16} />
                      <span>Accept</span>
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(reservation.id, ReservationStatus.REJECTED)}
                      className="h-10 lg:h-11 px-3 lg:px-4 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-xl font-bold transition-all border border-white/10 hover:border-red-500/20 flex items-center gap-2 text-xs lg:text-sm"
                    >
                      <XCircle size={16} />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-white/10 text-white/20">
          <Calendar size={48} className="mb-4" />
          <p>No reservations found for this date</p>
        </div>
      )}
    </div>
  );

  const renderTablesContent = () => {
    const tableConfigs = [
      { id: '2-4', label: '2-4 Persons', total: 15, min: 2, max: 4 },
      { id: '3-4', label: '3-4 Persons', total: 12, min: 3, max: 4 },
      { id: '5-6', label: '5-6 Persons', total: 10, min: 5, max: 6 },
      { id: '7-8', label: '7-8 Persons', total: 8, min: 7, max: 8 },
      { id: '9-10', label: '9-10 Persons', total: 6, min: 9, max: 10 },
      { id: '11-12', label: '11-12 Persons', total: 2, min: 11, max: 12 },
    ];

    return (
      <div className="flex flex-col xl:flex-row gap-8 h-full animate-in fade-in duration-500">
        {/* Main Grid Area */}
        <div className="flex-1 space-y-8 overflow-y-auto pr-0 xl:pr-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Table Reservation</h2>
              <p className="text-white/40 text-sm font-medium mt-1">{format(new Date(selectedDate), 'MMMM d, yyyy')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Regular', 'VIP', 'Outdoor', 'Private'].map(tab => (
                <button key={tab} className={`px-4 lg:px-6 py-2 rounded-full text-xs lg:text-sm font-bold border transition-all ${tab === 'Regular' ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-900/20' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-12 pt-8">
            {tableConfigs.flatMap(config => 
              Array.from({ length: config.total }).map((_, i) => {
                const tableId = `${config.id}-${i+1}`;
                const reservation = reservations.find(r => 
                  (r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.PENDING) && 
                  r.guestCount >= config.min && r.guestCount <= config.max &&
                  // Mock logic to distribute reservations across tables if no table_id assigned
                  (r.tableId === tableId || (!r.tableId && i === 0)) 
                );
                const isBooked = !!reservation;

                return (
                  <div 
                    key={tableId}
                    onClick={() => setSelectedTable(reservation || { tableId, capacity: config.label })}
                    className="relative group cursor-pointer"
                  >
                    {/* Chairs Visualization */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-4">
                      <div className="w-6 h-6 bg-white/10 rounded-full group-hover:bg-primary-500/40 transition-colors" />
                      <div className="w-6 h-6 bg-white/10 rounded-full group-hover:bg-primary-500/40 transition-colors" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                      <div className="w-6 h-6 bg-white/10 rounded-full group-hover:bg-primary-500/40 transition-colors" />
                      <div className="w-6 h-6 bg-white/10 rounded-full group-hover:bg-primary-500/40 transition-colors" />
                    </div>
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                      <div className="w-6 h-6 bg-white/10 rounded-full group-hover:bg-primary-500/40 transition-colors" />
                    </div>
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                      <div className="w-6 h-6 bg-white/10 rounded-full group-hover:bg-primary-500/40 transition-colors" />
                    </div>

                    {/* Table Surface */}
                    <div className={`
                      aspect-square bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl transition-all relative z-10
                      ${isBooked ? 'ring-4 ring-primary-500/50 scale-95' : 'hover:scale-105'}
                    `}>
                      {isBooked && (
                        <div className="absolute top-2 right-2 bg-primary-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter rotate-12 shadow-lg">
                          Booked
                        </div>
                      )}
                      <span className="text-neutral-900 font-black text-lg block">Table {tableId}</span>
                      <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mt-1">capacity {config.max}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar - Details */}
        <div className="w-full xl:w-96 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 lg:p-8 flex flex-col space-y-8 sticky top-0 h-fit">
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Reservation Data</h3>
            {selectedTable?.id ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-white">{selectedTable.users?.first_name} {selectedTable.users?.last_name}</p>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-widest mt-1">#{selectedTable.id.slice(0, 8)}</p>
                  </div>
                  <button className="text-primary-400 text-xs font-bold hover:underline">Edit</button>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <DetailRow label="Date" value={format(new Date(selectedTable.reservation_date), 'dd/MM/yyyy')} />
                  <DetailRow label="Time" value={selectedTable.reservation_time} />
                  <DetailRow label="Table" value={selectedTable.tableId} />
                  <DetailRow label="Request" value={selectedTable.special_notes || '-'} />
                  <DetailRow label="Contact" value={selectedTable.users?.phone || '-'} />
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-sm font-medium">Status</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Confirmed</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-primary-900/20 mt-4">
                  View detail
                </button>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                  <TableIcon size={32} />
                </div>
                <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Select a booked table to view details</p>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Reservation per Week</h4>
                <p className="text-4xl font-black text-white mt-2">83%</p>
              </div>
            </div>
            <p className="text-xs text-white/20 font-medium leading-relaxed">customers who make reservations within a week</p>
            <div className="flex items-end justify-between h-32 mt-8 gap-2">
              {[40, 70, 50, 90, 60, 100, 45].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full bg-white/5 rounded-full relative overflow-hidden flex-1">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="absolute bottom-0 left-0 right-0 bg-primary-500/40 group-hover:bg-primary-500 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/20 uppercase">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

const DetailRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-white/40 text-sm font-medium">{label}</span>
    <span className="text-white font-bold text-sm">{value}</span>
  </div>
);

  const renderContent = () => {
    switch(activeTab) {
      case 'reservations': return renderReservationsContent();
      case 'tables': return renderTablesContent();
      default: return renderDashboardContent();
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return <div className="min-h-screen bg-[#1a0f0f] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#1a0f0f] text-white flex flex-col lg:flex-row font-sans relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${restaurant?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80'})`,
          filter: 'brightness(0.3) blur(12px)'
        }}
      />
      
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 px-4 flex items-center justify-between bg-black/60 backdrop-blur-xl border-b border-white/10 z-[60]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">RESEATO</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white/60 hover:text-white"
        >
          <LayoutDashboard size={24} />
        </button>
      </div>

      {/* Sidebar - Mobile Slide-over / Desktop Fixed */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-black/80 backdrop-blur-3xl border-r border-white/10 flex flex-col p-6 z-[70] transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close Button Mobile */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-6 right-6 p-2 text-white/40 hover:text-white"
        >
          <XCircle size={24} />
        </button>

        <div className="flex items-center space-x-3 mb-12 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">RESEATO</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={<ClipboardList size={20} />} 
            label="Reservation List" 
            active={activeTab === 'reservations'} 
            onClick={() => { setActiveTab('reservations'); setIsSidebarOpen(false); }} 
          />
          <SidebarLink 
            icon={<TableIcon size={20} />} 
            label="Tables" 
            active={activeTab === 'tables'} 
            onClick={() => { setActiveTab('tables'); setIsSidebarOpen(false); }} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={() => { setIsProfileModalOpen(true); setIsSidebarOpen(false); }}
            className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4 flex items-center space-x-3 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform text-white">
              {restaurant?.name?.[0] || user?.firstName?.[0] || 'V'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold truncate text-white">{restaurant?.name || user?.firstName || 'Vendor'}</p>
              <p className="text-xs text-white/40 truncate">Edit Profile</p>
            </div>
            <User size={16} className="text-white/20 group-hover:text-white transition-colors" />
          </button>
          
          <button 
            onClick={() => { setIsLogoutConfirmOpen(true); setIsSidebarOpen(false); }}
            className="w-full mt-4 flex items-center space-x-3 px-4 py-3 text-white/40 hover:text-red-400 transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-x-hidden pt-16 lg:pt-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 lg:h-24 px-4 lg:px-8 flex items-center justify-between bg-white/5 backdrop-blur-xl border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-[10px] lg:text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Welcome back,</h2>
            <p className="text-lg lg:text-2xl font-bold text-white flex items-center gap-2">
              {restaurant?.name || user?.firstName} 👋
            </p>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-6">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search reservations..." 
                value={searchQuery}
                onChange={(e) => setSearchBarQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64 transition-all text-white placeholder:text-white/20 font-medium"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 lg:p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all relative group"
              >
                <Bell size={20} />
                {notifications.some(n => !n.is_read) && (
                  <span className="absolute top-2 right-2 lg:top-2.5 lg:right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-[#1a0f0f] group-hover:scale-110 transition-transform" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-72 lg:w-80 bg-[#1a0f0f]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 py-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-6 mb-4 flex items-center justify-between">
                    <h4 className="text-white font-bold">Notifications</h4>
                    <button className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Mark all read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className="px-4 lg:px-6 py-4 hover:bg-white/5 border-b border-white/5 last:border-0 cursor-pointer">
                        <p className="text-sm font-bold text-white mb-1">{n.title}</p>
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-white/20 mt-2 uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString()}</p>
                      </div>
                    )) : (
                      <div className="px-6 py-8 text-center text-white/20">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center space-x-2 lg:space-x-4 bg-white/5 border border-white/10 rounded-2xl py-2 pl-2 pr-2 lg:pr-6 hover:bg-white/10 transition-all cursor-pointer group shrink-0"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-black group-hover:scale-105 transition-transform">
                {user?.firstName?.[0] || 'V'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-black text-white leading-tight">{user?.firstName} Manager</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Vendor Profile</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[65]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-500/20 to-transparent pointer-events-none" />
              
              <div className="relative">
                <h3 className="text-2xl font-black text-white mb-2">Edit Profile</h3>
                <p className="text-white/40 text-sm mb-8 font-medium">Update your manager details and contact info</p>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Manager Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      placeholder="Manager Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/40 outline-none cursor-not-allowed font-bold"
                    />
                    <p className="text-[10px] text-white/20 font-medium ml-1 italic">* Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="09XX XXX XXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(false)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-primary-500 hover:bg-primary-400 disabled:bg-primary-500/50 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary-900/20"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[24px] p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
              <p className="text-white/70 mb-6">Are you sure you want to log out?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarLink: React.FC<{ icon: any, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40' 
        : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </button>
);

const StatCard: React.FC<{ icon: any, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-[28px] flex flex-col justify-between h-40 group transition-all"
  >
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black mb-1">{value}</p>
      <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const TrendingCard: React.FC<{ title: string, price: string, image: string }> = ({ title, price, image }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';
  };

  return (
    <div className="group relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/10">
      <img 
        src={image} 
        onError={handleImageError}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        alt={title} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h4 className="text-lg font-bold mb-1 text-white">{title}</h4>
        <p className="text-sm text-white/60">Price : {price}</p>
      </div>
    </div>
  );
};
