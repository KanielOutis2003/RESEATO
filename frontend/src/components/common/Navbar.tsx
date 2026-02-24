import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserRole } from '../../../../shared/types';
import authService from '../../services/authService';
import notificationService, { Notification } from '../../services/notificationService';
import { Button } from './Button';
import { UtensilsCrossed, Bell } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  const customerLinks = [
    { name: 'Browse', path: '/dashboard' },
    { name: 'My Reservations', path: '/my-reservations' },
  ];

  const vendorLinks = [
    { name: 'Dashboard', path: '/vendor/dashboard' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
  ];

  const getLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case UserRole.VENDOR:
        return vendorLinks;
      case UserRole.ADMIN:
        return adminLinks;
      default:
        return customerLinks;
    }
  };

  const links = getLinks();

  return (
    <nav className="sticky top-0 z-50 bg-primary-800 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-all duration-300">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-white tracking-wide">
              RESEATO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${isActive(link.path)
                    ? 'text-white bg-white/15'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors relative"
                  >
                    <Bell className="w-6 h-6 text-white" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-primary-900 text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-primary-100/50 flex justify-between items-center">
                          <h3 className="font-semibold text-primary-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-neutral-500 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-primary-100/30 hover:bg-primary-50/30 transition-colors ${
                                  !notification.isRead ? 'bg-primary-100/20' : ''
                                }`}
                                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-primary-800' : 'text-primary-900'}`}>
                                    {notification.title}
                                  </h4>
                                  <span className="text-xs text-neutral-400">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-600">{notification.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-semibold">
                    {(user.firstName && user.firstName.charAt(0)) || (user.email && user.email.charAt(0)) || '?'}
                    {(user.lastName && user.lastName.charAt(0)) || ''}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-white/70 capitalize">{user.role}</div>
                  </div>
                  <svg className={`w-5 h-5 text-white/80 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-primary-100 py-2 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>My Profile</span>
                        </div>
                      </Link>
                      <hr className="my-2 border-neutral-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </div>
            ) : (
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
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-1 border-t border-white/10"
            >
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block px-4 py-2 rounded-xl font-medium transition-all duration-200
                    ${isActive(link.path)
                      ? 'text-white bg-white/15'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
