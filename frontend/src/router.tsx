import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from '../../shared/types';
import authService from './services/authService';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { VendorLayout } from './layouts/VendorLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { HomePage } from './pages/customer/HomePage';
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { RestaurantDetailPage } from './pages/customer/RestaurantDetailPage';
import { MyReservationsPage } from './pages/customer/MyReservationsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VendorDashboardPage } from './pages/vendor/DashboardPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PaymentPage } from './pages/customer/PaymentPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { AboutPage } from './pages/customer/AboutPage';
import { TermsPage } from './pages/customer/TermsPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const user = authService.getStoredUser();

  if (!authService.isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <CustomerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="restaurant/:id" element={<RestaurantDetailPage />} />
          <Route
            path="my-reservations"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <MyReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment/:reservationId"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="about" element={<AboutPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VENDOR]}>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<VendorDashboardPage />} />
          <Route
            path="reservations"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Manage Reservations</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Restaurant Settings</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="restaurants"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Manage Restaurants</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="users"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};