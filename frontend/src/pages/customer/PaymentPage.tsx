import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, Wallet, XCircle, ArrowLeft } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TermsModal } from '../../components/common/TermsModal';
import reservationService from '../../services/reservationService';
import paymentService from '../../services/paymentService';
import toast, { Toaster } from 'react-hot-toast';

export const PaymentPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [reservation, setReservation] = useState<any>(null);

  React.useEffect(() => {
    const fetchReservation = async () => {
      console.log('Fetching reservation for ID:', reservationId);
      if (!reservationId) return;
      try {
        setLoading(true);
        const data = await reservationService.getReservationById(reservationId);
        console.log('Reservation data received:', data);
        setReservation(data);
      } catch (error) {
        console.error('Error fetching reservation:', error);
        toast.error('Could not load reservation details');
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [reservationId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Loader />
    </div>
  );

  if (!reservation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Reservation Not Found</h2>
          <p className="text-neutral-600 mb-6">We couldn't find the reservation details. It may have been expired or cancelled.</p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!reservationId) return;

    if (!agreedToTerms) {
      setTermsError('You must agree to the Terms and Conditions to proceed with payment.');
      return;
    }
    setTermsError('');

    try {
      setLoading(true);
      
      // 1. Create payment record in Supabase (the ₱100 fee)
      await paymentService.createPayment(reservationId, 100, paymentMethod);
      
      // 2. Update reservation status to 'pending'
      await reservationService.updateReservationStatus(reservationId, 'pending');
      
      toast.success('Payment successful! Your reservation is now awaiting restaurant confirmation.');
      navigate('/my-reservations');
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservationId) return;
    if (!confirm('Are you sure you want to cancel this reservation process?')) return;

    try {
      setLoading(true);
      await reservationService.cancelReservation(reservationId);
      toast.success('Reservation cancelled successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Cancel error:', error);
      toast.error(error.message || 'Failed to cancel reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Secure Payment</h1>
          <p className="text-neutral-600 mt-2">Complete your reservation for {reservation.restaurantName}</p>
        </div>

        <Card className="shadow-2xl overflow-hidden p-0 border-none">
          <div className="bg-primary-50 px-6 py-6 border-b border-primary-100 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-primary-800 font-medium block text-sm">Reservation Fee</span>
                <span className="text-neutral-500 text-xs">{reservation.guestCount} guests • {reservation.reservationTime}</span>
              </div>
              <span className="text-3xl font-bold text-primary-600">₱100.00</span>
            </div>
          </div>

          <div className="p-6 pt-0 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-4">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`
                    p-4 rounded-xl border-2 flex items-center space-x-4 transition-all
                    ${paymentMethod === 'card'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-100 hover:border-neutral-200 text-neutral-600'
                    }
                  `}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-400'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Credit / Debit Card</span>
                    <span className="text-xs opacity-70 italic">Visa, Mastercard, JCB</span>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`
                    p-4 rounded-xl border-2 flex items-center space-x-4 transition-all
                    ${paymentMethod === 'wallet'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-100 hover:border-neutral-200 text-neutral-600'
                    }
                  `}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'wallet' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-400'}`}>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">E-Wallet</span>
                    <span className="text-xs opacity-70 italic">GCash, Maya, ShopeePay</span>
                  </div>
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 animate-fade-in bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1 uppercase tracking-widest">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                    <CreditCard className="w-5 h-5 text-neutral-300 absolute left-3 top-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 mb-1 uppercase tracking-widest">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 mb-1 uppercase tracking-widest">CVC</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                      <Lock className="w-4 h-4 text-neutral-300 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="bg-neutral-50 p-5 rounded-2xl text-center animate-fade-in border border-neutral-100">
                <p className="text-neutral-600 text-sm leading-relaxed">
                  You will be redirected to the secure payment gateway to complete your transaction.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setTermsError('');
                  }}
                  className="mt-1 w-5 h-5 rounded-lg border-neutral-300 text-primary-600 focus:ring-primary-500 transition-all"
                />
                <span className="text-sm text-neutral-600 leading-snug group-hover:text-neutral-900 transition-colors">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(true)}
                    className="text-primary-700 hover:text-primary-800 font-bold underline decoration-primary-200 underline-offset-4"
                  >
                    Terms and Conditions
                  </button>
                  .
                </span>
              </label>
              <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
              {termsError && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-bold text-red-500 flex items-center gap-1"
                >
                  <XCircle className="w-3 h-3" /> {termsError}
                </motion.p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePayment}
                isLoading={loading}
                leftIcon={<Lock className="w-4 h-4" />}
                className="py-5 shadow-xl shadow-primary-500/20"
              >
                Pay ₱100.00
              </Button>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleCancel}
                disabled={loading}
                className="border-neutral-200 text-neutral-500 hover:bg-neutral-50 font-semibold"
              >
                Cancel Reservation
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Secure encrypted transaction</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
