import api, { handleApiError } from './api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      // In development, the backend might not be running
      // Returning empty array to avoid network errors in navbar
      if (process.env.NODE_ENV === 'development') {
        try {
          const response = await api.get('/notifications');
          return response.data.data;
        } catch (e) {
          console.warn('Backend not reachable for notifications, using fallback');
          return [];
        }
      }
      const response = await api.get('/notifications');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return []; // Return empty array instead of throwing to prevent UI crashes
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.put('/notifications/read-all');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new NotificationService();
