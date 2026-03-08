import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import { TimeSlot } from '../../types';
import reservationService from '../../services/reservationService';

interface TimeSlotPickerProps {
  restaurantId: string;
  date: string;
  guestCount: number;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  restaurantId,
  date,
  guestCount,
  selectedTime,
  onTimeSelect,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurantId && date && guestCount) {
      loadTimeSlots();
    }
  }, [restaurantId, date, guestCount]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const slots = await reservationService.getAvailableTimeSlots(
        restaurantId,
        date,
        guestCount
      );
      setTimeSlots(slots);
    } catch (error) {
      console.error('Failed to load time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-neutral-700 mb-4">
          <Clock className="w-5 h-5 text-primary-500" />
          <span className="font-semibold">Loading available times...</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-12 bg-neutral-200 rounded-lg shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-600">No time slots available for selected criteria</p>
      </div>
    );
  }

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const m = minutes || '00';
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${m} ${ampm}`;
    } catch (e) {
      return time;
    }
  };

  const getTimeOfDay = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    const period = getTimeOfDay(slot.time);
    if (!acc[period]) acc[period] = [];
    acc[period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const periods = ['Morning', 'Afternoon', 'Evening'];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-neutral-700 mb-2">
        <Clock className="w-5 h-5 text-primary-500" />
        <span className="font-semibold">Select Time</span>
      </div>

      <div className="max-h-[300px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {periods.map((period) => {
          const slots = groupedSlots[period];
          if (!slots || slots.length === 0) return null;

          return (
            <div key={period}>
              <h4 className="text-sm font-semibold text-neutral-500 mb-3 uppercase tracking-wider sticky top-0 bg-white py-1 z-10">
                {period}
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  const isAvailable = slot.available;

                  return (
                    <motion.button
                      key={slot.time}
                      whileHover={isAvailable ? { scale: 1.02 } : {}}
                      whileTap={isAvailable ? { scale: 0.98 } : {}}
                      onClick={() => isAvailable && onTimeSelect(slot.time)}
                      disabled={!isAvailable}
                      className={`
                        relative px-2 py-2 rounded-lg font-medium text-sm transition-all duration-200
                        ${isSelected
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/30'
                          : isAvailable
                            ? 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-primary-50'
                            : 'bg-neutral-50 text-neutral-400 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      {isSelected && (
                        <CheckCircle className="w-3 h-3 absolute top-1 right-1" />
                      )}
                      <div>{formatTime(slot.time)}</div>
                      {isAvailable && (
                        <div className="text-[10px] opacity-80 mt-0.5">
                          {slot.tablesAvailable} tables left
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-500 mt-2">
        * Times shown are in 30-minute intervals
      </p>
    </div>
  );
};