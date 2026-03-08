import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../../types';
import type { User } from '../../types';
import authService from '../../services/authService';
import notificationService, { Notification } from '../../services/notificationService';
import { Button } from './Button';
import { UtensilsCrossed, Bell, Search, Bookmark, Calendar, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
      console.error('Failed to mark all all as read', error);
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
    { name: 'Browse Restaurants', path: '/dashboard' },
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

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    
    // Check if it's a payment related notification or any other with reservation_id
    if (notification.reservation_id) {
      if (notification.title === 'Action Required' || notification.title === 'Payment Required') {
        navigate(`/payment/${notification.reservation_id}`);
      } else {
        // Just navigate to the reservations page, maybe scroll to it?
        navigate('/my-reservations');
      }
    } else {
      navigate('/my-reservations');
    }
    
    setIsNotificationsOpen(false);
  };

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Left */}
          <div className="shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-all duration-300 shadow-sm shadow-primary-200">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-neutral-900 tracking-tight">
                RESEATO
              </span>
            </Link>
          </div>

          {/* Navigation Links - Middle */}
          <div className="hidden md:flex items-center space-x-2 mx-auto">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar - Right of Center */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-4">
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-full leading-5 bg-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all duration-200"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  navigate(`/dashboard?search=${encodeURIComponent(e.target.value)}`);
                }}
              />
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2.5 rounded-xl text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
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
                        className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                          <h3 className="font-semibold text-neutral-900">Notifications</h3>
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
                            <div className="p-8 text-center">
                              <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bell className="w-6 h-6 text-neutral-300" />
                              </div>
                              <p className="text-sm text-neutral-500">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-neutral-50 hover:bg-neutral-50/80 transition-colors cursor-pointer ${
                                  !notification.isRead ? 'bg-primary-50/30' : ''
                                }`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-primary-900' : 'text-neutral-900'}`}>
                                    {notification.title}
                                  </h4>
                                  <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-600 line-clamp-2">{notification.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative pl-2">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-700 font-bold overflow-hidden hover:ring-2 hover:ring-primary-100 transition-all duration-200">
                      {(user.firstName && user.firstName.charAt(0)) || (user.email && user.email.charAt(0)) || '?'}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-neutral-50">
                          <p className="text-sm font-semibold text-neutral-900">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserIcon className="w-4 h-4 mr-3 text-neutral-400" />
                            My Profile
                          </Link>
                          {links.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors md:hidden"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <span className="w-4 h-4 mr-3" />
                              {link.name}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-neutral-50 mt-1 pt-1">
                          <button
                            onClick={() => setIsLogoutConfirmOpen(true)}
                            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
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
                  className="text-neutral-600 hover:bg-neutral-100 rounded-full px-5"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/register')}
                  className="bg-primary-600 text-white hover:bg-primary-700 rounded-full px-6 shadow-sm shadow-primary-200"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-colors"
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
              className="md:hidden py-4 space-y-1 border-t border-neutral-100"
            >
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive(link.path)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
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
    <AnimatePresence>
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-neutral-100 p-6"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Confirm Logout</h3>
            <p className="text-sm text-neutral-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500"
              >
                Log out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

