import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Store, Users, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { TermsModal } from '../../components/common/TermsModal';
import authService from '../../services/authService';
import { UserRole } from '../../../../shared/types';
import toast, { Toaster } from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: UserRole.CUSTOMER as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getStoredUser();
      if (user?.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!agreedToTerms) newErrors.terms = 'You must agree to the Terms and Conditions to continue';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
      });
      
      toast.success('Registration successful!');
      
      // Redirect based on role
      if (formData.role === UserRole.VENDOR) {
        navigate('/vendor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4 py-12 relative">
      <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 p-3 rounded-full bg-white/50 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-md text-neutral-600 hover:text-primary-600 transition-all duration-300 group">
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </Link>
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">RESEATO</span>
            </Link>
            <h3 className="text-3xl font-bold text-neutral-900 mb-2">Create Account</h3>
            <p className="text-neutral-600">Join us and start reserving tables today</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-neutral-700 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange('role', UserRole.CUSTOMER)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  ${formData.role === UserRole.CUSTOMER
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <Users className={`w-8 h-8 mx-auto mb-2 ${formData.role === UserRole.CUSTOMER ? 'text-primary-600' : 'text-neutral-400'}`} />
                <div className={`font-semibold ${formData.role === UserRole.CUSTOMER ? 'text-primary-600' : 'text-neutral-700'}`}>
                  Customer
                </div>
                <div className="text-xs text-neutral-500 mt-1">Reserve tables</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleChange('role', UserRole.VENDOR)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  ${formData.role === UserRole.VENDOR
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <Store className={`w-8 h-8 mx-auto mb-2 ${formData.role === UserRole.VENDOR ? 'text-primary-600' : 'text-neutral-400'}`} />
                <div className={`font-semibold ${formData.role === UserRole.VENDOR ? 'text-primary-600' : 'text-neutral-700'}`}>
                  Restaurant Owner
                </div>
                <div className="text-xs text-neutral-500 mt-1">Manage bookings</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                leftIcon={<User className="w-5 h-5" />}
              />
              
              <Input
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                leftIcon={<User className="w-5 h-5" />}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              leftIcon={<Phone className="w-5 h-5" />}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-5 h-5" />}
            />

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setErrors({ ...errors, terms: '' });
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
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
