import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, FileText, X, Star, MessageSquare } from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types';
import { Button } from '../common/Button';
import { format } from 'date-fns';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
  onFeedback?: (reservation: Reservation) => void;
  showRestaurant?: boolean;
  showCustomer?: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onFeedback,
  showRestaurant = true,
  showCustomer = false,
}) => {
  const getStatusBadge = (status: ReservationStatus) => {
    const styles = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed',
      rejected: 'status-cancelled', // Added style for rejected
    };

    return (
      <span className={`badge ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const canCancel = reservation.status === ReservationStatus.PENDING || 
                    reservation.status === ReservationStatus.CONFIRMED ||
                    reservation.status === ReservationStatus.AWAITING_PAYMENT;

  const canRebook = reservation.status === ReservationStatus.CANCELLED || 
                    reservation.status === ReservationStatus.REJECTED;

  const isAwaitingPayment = reservation.status === ReservationStatus.AWAITING_PAYMENT;
  const navigate = useNavigate();

  const handleRebook = () => {
    navigate(`/restaurant/${reservation.restaurantId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            {showRestaurant && reservation.restaurant && (
              <h3 className="text-xl font-bold text-neutral-900 mb-1">
                {reservation.restaurant.name}
              </h3>
            )}
            {showCustomer && reservation.customer && (
              <h3 className="text-xl font-bold text-neutral-900 mb-1">
                {reservation.customer.firstName} {reservation.customer.lastName}
              </h3>
            )}
            <p className="text-sm text-neutral-500">
              Booking ID: {reservation.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(reservation.status)}
            {isAwaitingPayment && (
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-tighter animate-pulse">
                Action Required
              </span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Date</div>
              <div className="font-semibold text-neutral-900">
                {format(new Date(reservation.reservationDate), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Time</div>
              <div className="font-semibold text-neutral-900">
                {reservation.reservationTime.slice(0, 5)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Guests</div>
              <div className="font-semibold text-neutral-900">
                {reservation.guestCount} {reservation.guestCount === 1 ? 'Person' : 'People'}
              </div>
            </div>
          </div>

          {reservation.table && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-xs text-neutral-500">Table</div>
                <div className="font-semibold text-neutral-900">
                  {reservation.table.tableNumber}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Special Notes */}
        {reservation.specialNotes && (
          <div className="bg-neutral-50 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-neutral-500 mb-1">Special Notes</div>
                <p className="text-sm text-neutral-700">{reservation.specialNotes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Address */}
        {showRestaurant && reservation.restaurant && (
          <div className="flex items-start space-x-2 text-sm text-neutral-600 mb-4">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{reservation.restaurant.address}</span>
          </div>
        )}

        {/* Customer Contact */}
        {showCustomer && reservation.customer && (
          <div className="space-y-2 mb-4">
            <div className="text-sm text-neutral-600">
              Email: {reservation.customer.email}
            </div>
            {reservation.customer.phone && (
              <div className="text-sm text-neutral-600">
                Phone: {reservation.customer.phone}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {(canCancel && onCancel) || (reservation.status === ReservationStatus.COMPLETED && onFeedback) || isAwaitingPayment || canRebook ? (
          <div className="pt-4 border-t border-neutral-200 flex flex-col gap-2">
            {isAwaitingPayment && (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => navigate(`/payment/${reservation.id}`)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest py-3"
              >
                Complete Payment
              </Button>
            )}
            {canRebook && (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleRebook}
                leftIcon={<Calendar className="w-4 h-4" />}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Rebook Now
              </Button>
            )}
            {canCancel && onCancel && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onCancel(reservation.id)}
                leftIcon={<X className="w-4 h-4" />}
              >
                {isAwaitingPayment ? 'Cancel Booking' : 'Cancel Reservation'}
              </Button>
            )}
            {reservation.status === ReservationStatus.COMPLETED && onFeedback && (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onFeedback(reservation)}
                leftIcon={<Star className="w-4 h-4" />}
              >
                Give Feedback
              </Button>
            )}
          </div>
        ) : null}

        {/* Payment Info */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Restaurant</span>
            <span className="font-semibold text-neutral-900">{reservation.restaurantName || 'Loading...'}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-neutral-600">Location</span>
            <span className="text-neutral-900 text-right">{reservation.restaurantAddress || 'Loading...'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};