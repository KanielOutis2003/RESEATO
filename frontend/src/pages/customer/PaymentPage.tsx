import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, Wallet, XCircle } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TermsModal } from '../../components/common/TermsModal';
import reservationService from '../../services/reservationService';
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
      if (!reservationId) return;
      try {
        setLoading(true);
        const data = await reservationService.getReservationById(reservationId);
        setReservation(data);
      } catch (error) {
        console.error('Error fetching reservation:', error);
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
      // Removed fake delay for instant experience
      
      // Update reservation status to 'pending' instantly
      // This is now the "confirmation" step without real payment
      await reservationService.updateReservationStatus(reservationId, 'pending');
      
      toast.success('Reservation successful! Awaiting restaurant confirmation.');
      navigate('/my-reservations');
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Secure Payment</h1>
          <p className="text-neutral-600 mt-2">Complete your reservation</p>
        </div>

        <Card className="shadow-2xl overflow-hidden">
          <div className="bg-primary-50 -mx-6 -mt-6 px-6 py-4 border-b border-primary-100 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-primary-800 font-medium">Reservation Fee</span>
              <span className="text-2xl font-bold text-primary-600">₱100.00</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`
                    p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all
                    ${paymentMethod === 'card'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }
                  `}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`
                    p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all
                    ${paymentMethod === 'wallet'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }
                  `}
                >
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm font-medium">GCash / Maya / InstaPay</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wide">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <CreditCard className="w-5 h-5 text-neutral-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wide">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wide">CVC</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="bg-neutral-50 p-4 rounded-lg text-center animate-fade-in">
                <p className="text-neutral-600 text-sm">
                  You will be redirected to the secure payment gateway to complete your transaction.
                </p>
              </div>
            )}

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setTermsError('');
                }}
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600">
                I have read and agree to the{' '}
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="text-primary-700 hover:text-primary-800 font-medium underline"
                >
                  Terms and Conditions
                </button>
                . By proceeding with payment, I acknowledge that the reservation is final and non-refundable.
              </span>
            </label>
            <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
            {termsError && <p className="text-sm text-red-600">{termsError}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePayment}
              isLoading={loading}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Pay ₱100.00
            </Button>

            <div className="flex items-center justify-center space-x-2 text-xs text-neutral-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Secure encrypted transaction</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
