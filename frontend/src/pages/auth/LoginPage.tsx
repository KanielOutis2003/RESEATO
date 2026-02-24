import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { TermsModal } from '../../components/common/TermsModal';
import authService from '../../services/authService';
import toast, { Toaster } from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ email: string; password: string; terms?: string }>({ email: '', password: '' });

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getStoredUser();
    if (user && authService.isAuthenticated()) {
      redirectUser(user);
    }
  }, []);

  const redirectUser = (user: any) => {
    if (user?.role === 'vendor') {
      navigate('/vendor/dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: { email: string; password: string; terms?: string } = { email: '', password: '' };
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!agreedToTerms) newErrors.terms = 'You must agree to the Terms and Conditions to continue';

    if (newErrors.email || newErrors.password || newErrors.terms) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await authService.login({ email, password });
      toast.success('Login successful!');
      
      const user = authService.getStoredUser();
      redirectUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.error('Forgot password functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 p-3 rounded-sm bg-white/80 hover:bg-white border border-primary-100/50 shadow-sm text-neutral-600 hover:text-primary-700 transition-all duration-300 group">
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </Link>
      <Toaster position="top-center" />
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-primary-700 rounded-sm flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-display font-semibold text-primary-800 tracking-wide">RESEATO</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-semibold text-neutral-900 leading-tight">
                Welcome back to
                <br />
                <span className="text-primary-700">seamless dining</span>
              </h2>
              <p className="text-lg text-neutral-600">
                Your favorite restaurants are just a click away.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              {[
                'Reserve tables in seconds',
                'Skip the waiting lines',
                'Manage all your bookings',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-primary-100/50 p-6 md:p-12">
            <div className="mb-6 md:mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Sign In</h3>
              <p className="text-sm md:text-base text-neutral-600">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: '' });
                }}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5" />}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: '' });
                }}
                error={errors.password}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="text-sm text-neutral-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary-700 hover:text-primary-800 font-medium focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-600">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setTermsModalOpen(true); }}
                    className="text-primary-700 hover:text-primary-800 font-medium underline"
                  >
                    Terms and Conditions
                  </button>
                </span>
              </label>
              <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
              {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-700 hover:text-primary-800 font-semibold">
                  Sign up for free
                </Link>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};
