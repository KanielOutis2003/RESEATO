import { supabase } from '../config/supabase';

export interface DashboardStats {
  totalUsers: number;
  totalRestaurants: number;
  totalReservations: number;
  totalRevenue: number;
}

export interface AdminReservation {
  id: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: string;
  user_first_name: string;
  user_last_name: string;
  restaurant_name: string;
  commission: number;
}

export interface AdminRestaurant {
  id: string;
  name: string;
  owner: string;
  isActive: boolean;
  completedReservations: number;
  commissionDue: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  joinedAt: string;
  reservationCount: number;
}

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const { data: usersCount } = await supabase.from('users').select('id', { count: 'exact' });
      const { data: restaurantsCount } = await supabase.from('restaurants').select('id', { count: 'exact' });
      const { data: reservations } = await supabase.from('reservations').select('id, status');
      
      const completed = (reservations || []).filter(r => r.status === 'completed' || r.status === 'confirmed').length;

      return {
        totalUsers: usersCount?.length || 0,
        totalRestaurants: restaurantsCount?.length || 0,
        totalReservations: reservations?.length || 0,
        totalRevenue: completed * 70
      };
    } catch (error: any) {
      console.error('Error getting stats:', error);
      return { totalUsers: 0, totalRestaurants: 0, totalReservations: 0, totalRevenue: 0 };
    }
  }

  async getAllReservations(status?: string, search?: string): Promise<AdminReservation[]> {
    try {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          users!customer_id(first_name, last_name),
          restaurants!restaurant_id(name)
        `);

      if (status) query = query.eq('status', status);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return (data || []).map(r => ({
        id: r.id,
        reservation_date: r.reservation_date,
        reservation_time: r.reservation_time,
        guest_count: r.guest_count,
        status: r.status,
        user_first_name: r.users?.first_name || 'Guest',
        user_last_name: r.users?.last_name || '',
        restaurant_name: r.restaurants?.name || 'Unknown',
        commission: (r.status === 'completed' || r.status === 'confirmed') ? 70 : 0
      }));
    } catch (error: any) {
      console.error('Error getting reservations:', error);
      return [];
    }
  }

  async getAllRestaurants(): Promise<AdminRestaurant[]> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, reservations(id, status)');
      
      if (error) throw error;

      return (data || []).map(r => {
        const completed = (r.reservations || []).filter((res: any) => res.status === 'completed' || res.status === 'confirmed').length;
        return {
          id: r.id,
          name: r.name,
          owner: 'Platform Manager',
          isActive: r.is_active,
          completedReservations: completed,
          commissionDue: completed * 70
        };
      });
    } catch (error: any) {
      console.error('Error getting restaurants:', error);
      return [];
    }
  }

  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, reservations(id)');
      
      if (error) throw error;

      return (data || []).map(u => ({
        id: u.id,
        email: u.email,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Anonymous',
        role: u.role || 'customer',
        isActive: u.is_active ?? true,
        joinedAt: u.created_at || new Date().toISOString(),
        reservationCount: u.reservations?.length || 0
      }));
    } catch (error: any) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async updateReservationStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
    if (error) throw error;
  }

  async toggleUserStatus(id: string): Promise<void> {
    // Logic for toggling user status if you have an is_active column in users
  }

  async markCommissionPaid(id: string): Promise<void> {
    // Logic for payouts
  }
}

export default new AdminService();
