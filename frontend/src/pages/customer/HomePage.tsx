import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import authService from '../../services/authService';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { TermsModal } from '../../components/common/TermsModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  useEffect(() => {
    const user = authService.getStoredUser();
    if (authService.isAuthenticated() && user?.role === UserRole.CUSTOMER) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-neutral-900 overflow-hidden">
      {/* Hero: single viewport, no scroll */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 min-w-[120%] min-h-[120%] -left-[10%] -top-[10%] w-[120%] h-[120%]">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover hero-bg-motion"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-primary-900/30" />

        {/* Logo + name (left), Sign In + Get Started (right) - in main context */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-6 md:px-12 py-5">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-all duration-300">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-white tracking-wide">
              RESEATO
            </span>
          </Link>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-white hover:bg-white/10 border border-white/30 rounded-xl"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/register')}
              className="bg-white text-primary-800 hover:bg-white/95 rounded-xl"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Centered headline and tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight drop-shadow-lg max-w-4xl mx-auto">
            Restaurants in Cebu City
          </h1>
          <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-white/95 font-light tracking-wide max-w-2xl mx-auto">
            Book the Best Tables at Top Rated Restaurants, Skip the Line, Enjoy the Dine and Suggest What&apos;s Best.
          </p>
        </motion.div>

        {/* Bottom: About, Terms and Conditions */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center items-center gap-6 py-4 text-white/80 text-sm">
          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <span className="text-white/40">|</span>
          <button
            type="button"
            onClick={() => setTermsModalOpen(true)}
            className="hover:text-white transition-colors"
          >
            Terms and Conditions
          </button>
        </div>
        <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      </div>
    </div>
  );
};
