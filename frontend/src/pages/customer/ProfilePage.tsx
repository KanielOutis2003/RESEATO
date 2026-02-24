import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Shield, Edit, Save, X } from 'lucide-react';
import authService from '../../services/authService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loader } from '../../components/common/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile();
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
          <p className="text-neutral-600 mt-2">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                  <Card className="text-center h-full">
                    <div className="relative w-32 h-32 mx-auto mb-4 group">
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
                        {(user.firstName && user.firstName.charAt(0)) || (user.email && user.email.charAt(0)) || '?'}{(user.lastName && user.lastName.charAt(0)) || ''}
                      </div>
                      <button 
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed"
                        title="Profile picture upload coming soon"
                      >
                        <Edit className="w-8 h-8 text-white" />
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-primary-600 font-medium capitalize mt-1">
                      {user.role} Account
                    </p>
                  </Card>
                </div>

          {/* Details Card */}
          <div className="md:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Personal Information</h3>
                {!isEditing ? (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleUpdate}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <Mail className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Email Address</p>
                        <p className="text-neutral-900 font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <Phone className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Phone Number</p>
                        <p className="text-neutral-900 font-medium">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <Shield className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Account Role</p>
                        <p className="text-neutral-900 font-medium capitalize">{user.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Member Since</p>
                        <p className="text-neutral-900 font-medium">
                          {user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
