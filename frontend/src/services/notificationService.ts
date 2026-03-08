import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

supabase
  .channel('schema-db-changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'notifications' }, 
    (payload) => {
      toast.success(payload.new.title + ": " + payload.new.message);
    }
  )
  .subscribe();

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  reservation_id?: string;
  createdAt: string;
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(n => ({
        id: n.id,
        userId: n.user_id,
        title: n.title,
        message: n.message,
        isRead: n.is_read,
        reservation_id: n.reservation_id,
        createdAt: n.created_at
      }));
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  }

  async markAllAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
    
    if (error) throw error;
  }
}

export default new NotificationService();
