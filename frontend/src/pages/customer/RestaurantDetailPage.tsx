import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Phone, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { Restaurant, Table } from '../../types';
import restaurantService from '../../services/restaurantService';
import reservationService from '../../services/reservationService';
import authService from '../../services/authService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { GuestSelector } from '../../components/reservation/GuestSelector';
import { TimeSlotPicker } from '../../components/reservation/TimeSlotPicker';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Reservation form state
  const [reservationDate, setReservationDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTime, setSelectedTime] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadRestaurant();
    }
  }, [id]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getRestaurantById(id!);
      setRestaurant(data);
    } catch (error) {
      toast.error('Failed to load restaurant');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async () => {
    if (!authService.isAuthenticated()) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setSubmitting(true);
      const reservation = await reservationService.createReservation({
        restaurantId: id!,
        reservationDate,
        reservationTime: selectedTime,
        guestCount,
        specialNotes,
      });

      toast.success('Reservation initiated! Proceed to payment.');
      navigate(`/payment/${reservation.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="h-96 bg-neutral-200 shimmer"></div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-12 bg-neutral-200 rounded shimmer"></div>
              <div className="h-32 bg-neutral-200 rounded shimmer"></div>
            </div>
            <div className="h-96 bg-neutral-200 rounded shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  const primaryImage = restaurant.images?.find(img => img.isPrimary)?.imageUrl 
    || restaurant.images?.[0]?.imageUrl 
    || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80';
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <Toaster position="top-center" />

      {/* Hero Header with Glassmorphism */}
      <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={primaryImage}
          alt={restaurant.name}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Navigation Overlays */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-white hover:bg-white/20 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-xs md:text-base">Back</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 md:space-y-4"
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <span className="px-3 py-1 bg-primary-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-primary-600/20">
                  {restaurant.cuisineType}
                </span>
                <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10">
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs md:text-sm font-bold text-white">{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-6xl font-display font-bold text-white tracking-tight">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap items-center text-white/90 gap-4 md:gap-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                  <span className="text-xs md:text-sm font-medium">{restaurant.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                  <span className="text-xs md:text-sm font-medium">{restaurant.openingTime.slice(0, 5)} - {restaurant.closingTime.slice(0, 5)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: About & Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 border-none shadow-xl shadow-neutral-200/50 rounded-3xl">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-1 h-8 bg-primary-600 rounded-full" />
                <h2 className="text-2xl font-display font-bold text-neutral-900">About the Restaurant</h2>
              </div>
              <p className="text-neutral-600 leading-relaxed text-lg italic">
                "{restaurant.description}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-neutral-100">
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Contact Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 group">
                      <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-neutral-700 font-medium">{restaurant.phone || 'Contact not available'}</span>
                    </div>
                    <div className="flex items-center space-x-4 group">
                      <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-neutral-700 font-medium">{restaurant.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Location</h3>
                  <div className="flex items-start space-x-4 group">
                    <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-neutral-700 font-medium leading-relaxed">
                      {restaurant.name.includes('Chika-an') || restaurant.name.includes('Sachi') || restaurant.address?.includes('SM City Cebu') 
                        ? 'Cebu Port Center, North Reclamation Area, Juan Luna Ave. cor. Cabahug and Kaoshiung Streets, Mabolo, Cebu City, 6000 Cebu, Philippines'
                        : restaurant.address}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Visual Gallery Placeholder */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {restaurant.images?.slice(1, 4).map((img, i) => (
                <div key={i} className="aspect-square rounded-3xl overflow-hidden shadow-md">
                  <img src={img.imageUrl} alt="Interior" onError={handleImageError} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Reservation Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="p-8 border-none shadow-2xl shadow-primary-900/10 rounded-[32px] bg-white ring-1 ring-neutral-100">
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">Book a Table</h3>
                  <p className="text-neutral-500 text-sm">Secure your spot in seconds</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Select Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                      <input
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-neutral-900 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <GuestSelector 
                    guestCount={guestCount}
                    onGuestCountChange={setGuestCount}
                  />
                  
                  <TimeSlotPicker
                    restaurantId={restaurant.id}
                    date={reservationDate}
                    guestCount={guestCount}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                  />

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Special Requests</label>
                    <textarea
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g., Birthday celebration, window seat..."
                      className="w-full p-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 focus:ring-2 focus:ring-primary-500 transition-all h-32 resize-none text-sm"
                    />
                  </div>

                  <Button
                    onClick={handleReservation}
                    isLoading={submitting}
                    disabled={!selectedTime}
                    className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                  
                  <p className="text-center text-[10px] text-neutral-400 font-medium">
                    No payment required now. You'll pay at the restaurant.
                  </p>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};