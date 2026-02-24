import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import authService from '../services/authService';

export const CustomerLayout: React.FC = () => {
  const user = authService.getStoredUser();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-neutral-50">
      {!isLanding && <Navbar user={user} />}
      <main>
        <Outlet />
      </main>
      
      {/* Footer - hidden on landing so hero bottom bar is the only CTA */}
      {!isLanding && (
      <footer className="bg-primary-800 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-display font-semibold mb-4 text-white tracking-wide">RESEATO</h3>
              <p className="text-white/80 text-sm">
                Making restaurant reservations simple and elegant for Cebu's best dining spots.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-white/75 text-sm">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Browse Restaurants</a></li>
                <li><a href="/my-reservations" className="hover:text-white transition-colors">My Reservations</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-white/75 text-sm">
                <li>SM Seaside, Cebu City</li>
                <li>support@reseato.com</li>
                <li>+63 123 456 7890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2026 RESEATO. All rights reserved.</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};