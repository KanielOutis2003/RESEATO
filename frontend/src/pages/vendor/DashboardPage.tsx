import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle, XCircle, Users, 
  TrendingUp, PieChart, LayoutDashboard, ClipboardList, 
  Table as TableIcon, Search, Bell, ChevronRight,
  DollarSign, Activity, Utensils, LogOut, User
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

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
    loadDashboardData();
  }, [selectedDate]);

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
      await authService.updateProfile(profileData);
      toast.success('Profile updated successfully');
      setIsProfileModalOpen(false);
      // Update local user state if needed
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === ReservationStatus.PENDING).length,
    confirmed: reservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
    completed: reservations.filter(r => r.status === ReservationStatus.COMPLETED).length,
    revenue: (reservations.filter(r => r.status === ReservationStatus.COMPLETED || r.status === ReservationStatus.CONFIRMED).length) * 70,
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={<Calendar className="text-emerald-400" />} label="Todays Bookings" value={stats.total} color="bg-emerald-500/20" />
        <StatCard icon={<TableIcon className="text-blue-400" />} label="table Used" value={stats.tablesUsed} color="bg-blue-500/20" />
        <StatCard icon={<Clock className="text-purple-400" />} label="Pending Reservations" value={stats.pending} color="bg-purple-500/20" />
        <StatCard icon={<CheckCircle className="text-orange-400" />} label="Confirmed Bookings" value={stats.confirmed} color="bg-orange-500/20" />
        <StatCard icon={<DollarSign className="text-pink-400" />} label="Total Commisions" value={`₱${stats.revenue}`} color="bg-pink-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Details - Donut Chart */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">Reservation Status</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white/60 outline-none">
              <option>Monthly</option>
            </select>
          </div>
          <div className="flex-1 relative min-h-[200px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
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
              <div className="h-full flex items-center justify-center text-white/20">No data available</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">{stats.total}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-white/60">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Chart - Bar Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">Booking Trends</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white/60 outline-none">
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
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
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
                  radius={[6, 6, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white">Best Seller</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white/60"><ChevronRight className="rotate-180" size={18} /></button>
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white/60"><ChevronRight size={18} /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getBestSellers().map((item, index) => (
            <TrendingCard key={index} title={item.title} price={item.price} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderReservationsContent = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Reservation List</h2>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/80 outline-none focus:border-primary-500 transition-all"
        />
      </div>
      
      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold">
                  {reservation.guestCount}
                </div>
                <div>
                  <h4 className="font-bold text-white">Reservation #{reservation.id.slice(0, 8)}</h4>
                  <div className="flex items-center space-x-4 text-sm text-white/40">
                    <span className="flex items-center gap-1"><Clock size={14} /> {reservation.reservationTime}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {reservation.guestCount} guests</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  reservation.status === ReservationStatus.PENDING ? 'bg-yellow-500/20 text-yellow-400' :
                  reservation.status === ReservationStatus.CONFIRMED ? 'bg-green-500/20 text-green-400' :
                  'bg-neutral-500/20 text-neutral-400'
                }`}>
                  {reservation.status}
                </span>
                {reservation.status === ReservationStatus.PENDING && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleStatusUpdate(reservation.id, ReservationStatus.CONFIRMED)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(reservation.id, ReservationStatus.CANCELLED)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <XCircle size={18} />
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
    // Group sizes as requested: 2-4, 5-7, 8-9, 10-11, 12
    const tableConfigs = [
      { id: '2-4', label: '2-4 Persons', total: 10, capacity: 4 },
      { id: '5-7', label: '5-7 Persons', total: 8, capacity: 7 },
      { id: '8-9', label: '8-9 Persons', total: 5, capacity: 9 },
      { id: '10-11', label: '10-11 Persons', total: 3, capacity: 11 },
      { id: '12', label: '12 Persons', total: 2, capacity: 12 },
    ];

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Table Availability</h2>
            <p className="text-white/40 text-sm">Real-time status based on confirmed bookings for {format(new Date(selectedDate), 'MMMM d, yyyy')}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-xs text-white/60">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-xs text-white/60">Occupied</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tableConfigs.map((config) => {
            // Count confirmed/completed reservations for this capacity bracket
            const occupiedCount = reservations.filter(r => 
              (r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.COMPLETED) && 
              r.guestCount <= config.capacity && 
              (config.id === '2-4' ? r.guestCount >= 2 : true) &&
              (config.id === '5-7' ? r.guestCount >= 5 : true) &&
              (config.id === '8-9' ? r.guestCount >= 8 : true) &&
              (config.id === '10-11' ? r.guestCount >= 10 : true) &&
              (config.id === '12' ? r.guestCount >= 12 : true)
            ).length;

            const availableCount = Math.max(0, config.total - occupiedCount);
            const percentage = (occupiedCount / config.total) * 100;

            return (
              <div key={config.id} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-primary-400 group-hover:scale-110 transition-all">
                    <TableIcon size={28} />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white/20 uppercase tracking-widest block mb-1">Capacity</span>
                    <span className="text-xl font-bold text-white">{config.label}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-4xl font-black text-white">{availableCount}</span>
                      <span className="text-white/20 font-bold ml-2">/ {config.total}</span>
                    </div>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Available</span>
                  </div>

                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full rounded-full ${percentage > 80 ? 'bg-orange-500' : 'bg-primary-500'}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span className={availableCount > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {availableCount > 0 ? 'Optimal Status' : 'Fully Booked'}
                    </span>
                    <span className="text-white/20">{occupiedCount} Tables Occupied</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'reservations': return renderReservationsContent();
      case 'tables': return renderTablesContent();
      default: return renderDashboardContent();
    }
  };

  if (loading) return <div className="min-h-screen bg-[#1a0f0f] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="h-screen bg-[#1a0f0f] text-white flex overflow-hidden font-sans relative">
      <Toaster position="top-center" />

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${restaurant?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80'})`,
          filter: 'brightness(0.3) blur(12px)'
        }}
      />
      
      {/* Sidebar */}
      <aside className="w-72 bg-black/40 backdrop-blur-3xl border-r border-white/10 flex flex-col p-6 z-10">
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

        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
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
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="w-full mt-4 flex items-center space-x-3 px-4 py-3 text-white/40 hover:text-red-400 transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Header */}
        <header className="h-24 px-8 flex items-center justify-between bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div>
            <h2 className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Welcome back,</h2>
            <p className="text-2xl font-bold text-white flex items-center gap-2">
              {restaurant?.name || user?.firstName} 👋
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="text" 
                placeholder="Search reservations..." 
                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64 transition-all text-white placeholder:text-white/20"
              />
            </div>
            <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1a0f0f]"></span>
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-500" />
              <h3 className="text-2xl font-bold text-white mb-6">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">First Name</label>
                  <input 
                    type="text" 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Last Name</label>
                  <input 
                    type="text" 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-900/40"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
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

const TrendingCard: React.FC<{ title: string, price: string, image: string }> = ({ title, price, image }) => (
  <div className="group relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/10">
    <img src={image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h4 className="text-lg font-bold mb-1 text-white">{title}</h4>
      <p className="text-sm text-white/60">Price : {price}</p>
    </div>
  </div>
);
