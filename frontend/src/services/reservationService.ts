// frontend/src/services/reservationService.ts
import { supabase } from '../config/supabase'

class ReservationService {
  async createReservation(data: CreateReservationDTO): Promise<Reservation> {
    try {
      // 1. Find a suitable table first
      const { data: tables, error: tableError } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', data.restaurantId)
        .gte('capacity', data.guestCount)
        .eq('is_available', true)
        .order('capacity', { ascending: true });

      if (tableError) throw new Error(tableError.message);
      
      // If no real tables found in DB, try a demo check (fallback)
      let tableId = tables && tables.length > 0 ? tables[0].id : null;
      
      if (!tableId) {
        // If it's a demo restaurant, we allow it for UI purposes
        if (data.restaurantId.startsWith('demo-')) {
          tableId = '00000000-0000-0000-0000-000000000000';
        } else {
          throw new Error('No tables available for the selected number of guests.');
        }
      }

      const { data: reservation, error } = await supabase
        .from('reservations')
        .insert([{
          customer_id: (await supabase.auth.getUser()).data.user?.id,
          restaurant_id: data.restaurantId,
          table_id: tableId,
          reservation_date: data.reservationDate,
          reservation_time: data.reservationTime,
          guest_count: data.guestCount,
          special_notes: data.specialNotes,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return reservation;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getMyReservations() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('reservations')
      .select('*, restaurants(*), tables(*)')
      .eq('customer_id', user.id)
      .order('reservation_date', { ascending: false })

    if (error) throw new Error(error.message)
    
    return (data || []).map(r => ({
      id: r.id,
      userId: r.customer_id,
      restaurantId: r.restaurant_id,
      tableId: r.table_id,
      reservationDate: r.reservation_date,
      reservationTime: r.reservation_time,
      guestCount: r.guest_count,
      status: r.status,
      specialNotes: r.special_notes,
      createdAt: r.created_at,
      updatedAt: r.created_at,
      restaurantName: r.restaurants?.name,
      restaurantAddress: r.restaurants?.address,
      tableNumber: r.tables?.table_number,
      restaurant: r.restaurants ? {
        ...r.restaurants,
        cuisineType: r.restaurants.cuisine_type,
        openingTime: r.restaurants.opening_time,
        closingTime: r.restaurants.closing_time,
      } : undefined
    }))
  }

  async getAvailableTimeSlots(restaurantId: string, date: string, guestCount: number) {
    // 1. Get restaurant hours
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('opening_time, closing_time')
      .eq('id', restaurantId)
      .single()

    if (!restaurant) throw new Error('Restaurant not found')

    // 2. Get all tables for this restaurant that can fit the guest count
    const { data: allTables } = await supabase
      .from('tables')
      .select('id, capacity')
      .eq('restaurant_id', restaurantId)
      .gte('capacity', guestCount)
      .eq('is_available', true);

    const totalSuitableTables = allTables?.length || 0;

    // 3. Get existing reservations for this date
    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('reservation_time, table_id')
      .eq('restaurant_id', restaurantId)
      .eq('reservation_date', date)
      .in('status', ['confirmed', 'pending']);

    // Generate time slots
    const slots = []
    const opening = parseInt(restaurant.opening_time.split(':')[0])
    const closing = parseInt(restaurant.closing_time.split(':')[0])

    for (let hour = opening; hour < closing; hour++) {
      const timePoints = [`${hour.toString().padStart(2, '0')}:00`, `${hour.toString().padStart(2, '0')}:30`];
      
      for (const time of timePoints) {
        // Count how many tables are already booked for this specific time
        const bookedTableIds = (existingReservations || [])
          .filter(r => r.reservation_time.startsWith(time))
          .map(r => r.table_id);
        
        const tablesLeft = totalSuitableTables - bookedTableIds.length;

        slots.push({
          time,
          available: tablesLeft > 0,
          tablesAvailable: Math.max(0, tablesLeft)
        })
      }
    }

    return slots
  }

  async cancelReservation(id: string) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async getReservationById(id: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, restaurants(*), tables(*)')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    
    const r = data;
    return {
      id: r.id,
      userId: r.customer_id,
      restaurantId: r.restaurant_id,
      tableId: r.table_id,
      reservationDate: r.reservation_date,
      reservationTime: r.reservation_time,
      guestCount: r.guest_count,
      status: r.status,
      specialNotes: r.special_notes,
      createdAt: r.created_at,
      updatedAt: r.created_at,
      restaurantName: r.restaurants?.name,
      restaurantAddress: r.restaurants?.address,
      tableNumber: r.tables?.table_number,
      restaurant: r.restaurants ? {
        ...r.restaurants,
        cuisineType: r.restaurants.cuisine_type,
        openingTime: r.restaurants.opening_time,
        closingTime: r.restaurants.closing_time,
      } : undefined
    }
  }

  // Vendor methods
  async getRestaurantReservations(restaurantId: string, date?: string) {
    let query = supabase
      .from('reservations')
      .select('*, users(*), tables(*)')
      .eq('restaurant_id', restaurantId)

    if (date) {
      query = query.eq('reservation_date', date)
    }

    const { data, error } = await query.order('reservation_time', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  }

  async updateReservationStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}

export default new ReservationService()