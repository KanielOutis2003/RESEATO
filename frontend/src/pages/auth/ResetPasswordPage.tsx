import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import authService from '../../services/authService';
import toast, { Toaster } from 'react-hot-toast';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = { password: '', confirmPassword: '' };
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(password);
      toast.success('Password reset successful! You can now log in with your new password.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <UtensilsCrossed className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-neutral-900 mb-2">Reset Password</h3>
          <p className="text-neutral-600 mb-8">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <Input
              label="New Password"
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

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: '' });
              }}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-5 h-5" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Update Password
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
