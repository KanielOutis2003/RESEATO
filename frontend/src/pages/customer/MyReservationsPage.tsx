import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, ArrowLeft, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reservation, ReservationStatus } from '../../types';
import reservationService from '../../services/reservationService';
import { ReservationCard } from '../../components/reservation/ReservationCard';
import { Button } from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

export const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ReservationStatus>('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(id);
      toast.success('Reservation cancelled successfully');
      loadReservations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel reservation');
    }
  };

  const handleFeedbackClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowFeedbackModal(true);
    setRating(5);
    setComment('');
  };

  const handleSubmitFeedback = async () => {
    if (!selectedReservation) return;

    try {
      setSubmittingFeedback(true);
      await reservationService.submitFeedback(selectedReservation.id, rating, comment);
      toast.success('Thank you for your feedback!');
      setShowFeedbackModal(false);
      loadReservations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const upcomingReservations = filteredReservations.filter(
    r => r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.PENDING || r.status === ReservationStatus.AWAITING_PAYMENT
  );

  const pastReservations = filteredReservations.filter(
    r => r.status === ReservationStatus.COMPLETED || r.status === ReservationStatus.CANCELLED || r.status === ReservationStatus.REJECTED
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-12">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-neutral-500 hover:text-primary-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-2 group-hover:bg-primary-50">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                My Reservations
              </h1>
              <p className="text-neutral-600">Manage your restaurant bookings</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-neutral-700">Filter by Status</span>
            </div>
            <span className="text-sm text-neutral-500">
              {filteredReservations.length} {filteredReservations.length === 1 ? 'reservation' : 'reservations'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'awaiting_payment', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${filter === status
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }
                `}
              >
                {status === 'awaiting_payment' ? 'Awaiting Payment' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="h-6 bg-neutral-200 rounded shimmer w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded shimmer w-1/2"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-neutral-200 rounded shimmer"></div>
                    <div className="h-16 bg-neutral-200 rounded shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
              No reservations found
            </h3>
            <p className="text-neutral-600 mb-8">
              {filter === 'all' 
                ? "You haven't made any reservations yet"
                : `No ${filter} reservations`
              }
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/30"
            >
              Browse Restaurants
            </a>
          </div>
        ) : (
          <>
            {/* Upcoming Reservations */}
            {upcomingReservations.length > 0 && filter === 'all' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Upcoming Reservations
                </h2>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {upcomingReservations.map((reservation) => (
                    <motion.div key={reservation.id} variants={item}>
                      <ReservationCard
                        reservation={reservation}
                        onCancel={handleCancel}
                        onFeedback={handleFeedbackClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Past Reservations */}
            {pastReservations.length > 0 && filter === 'all' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Past Reservations
                </h2>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {pastReservations.map((reservation) => (
                    <motion.div key={reservation.id} variants={item}>
                      <ReservationCard 
                        reservation={reservation} 
                        onFeedback={handleFeedbackClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Filtered Results */}
            {filter !== 'all' && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredReservations.map((reservation) => (
                  <motion.div key={reservation.id} variants={item}>
                    <ReservationCard
                      reservation={reservation}
                      onCancel={handleCancel}
                      onFeedback={handleFeedbackClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">Restaurant Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-neutral-600 mb-4">How was your experience at <span className="font-bold text-neutral-900">{selectedReservation.restaurantName}</span>?</p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star 
                      size={36} 
                      className={`${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'} transition-colors`} 
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Tell us more (optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-neutral-900 focus:ring-2 focus:ring-primary-500 transition-all h-32 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmitFeedback}
                isLoading={submittingFeedback}
              >
                Submit Feedback
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};