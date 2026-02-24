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
      const response = await api.get('/notifications');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
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
