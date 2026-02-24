import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import authService from '../../services/authService';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, RefreshCcw, ArrowLeft } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const email = params.get('email') || '';
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('Missing email address. Please register again.');
      navigate('/register');
      return;
    }
    try {
      setLoading(true);
      await authService.resendConfirmation(email);
      toast.success('Verification email sent. Check your inbox and spam folder.');
    } catch (e: any) {
      toast.error(e.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary-700" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Confirm your email</h1>
        <p className="text-neutral-600">
          {email
            ? `We sent a verification link to ${email}. Please check your inbox to activate your account.`
            : 'We sent a verification email. Please check your inbox to activate your account.'}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={handleResend} disabled={loading} className="inline-flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Resend Email
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Button>
          </Link>
        </div>

        <p className="text-sm text-neutral-500 mt-6">
          Didn&apos;t receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
};

