import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Shield, Edit, Save, X, ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Profile picture upload would happen here. (Supabase Storage integration required)');
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
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
    <div className="min-h-screen bg-neutral-50 pb-12">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-neutral-500 hover:text-primary-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-2 group-hover:bg-primary-50">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Summary */}
          <div className="md:w-1/3">
            <Card className="p-6 text-center">
              <div className="relative inline-block mb-4 group">
                <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-4xl font-bold border-4 border-white shadow-md overflow-hidden">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                {/* Profile Pic Edit Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 text-white rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
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
