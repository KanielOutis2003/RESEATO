// frontend/src/services/reservationService.ts
import { supabase } from '../config/supabase'

class ReservationService {
  async createReservation(data: any) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    // Find available table
    const { data: availableTables } = await supabase
      .from('tables')
      .select('id')
      .eq('restaurant_id', data.restaurantId)
      .gte('capacity', data.guestCount)
      .eq('is_available', true)
      .limit(1)

    if (!availableTables?.length) {
      throw new Error('No tables available')
    }

    // Create reservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        customer_id: user.id,
        restaurant_id: data.restaurantId,
        table_id: availableTables[0].id,
        reservation_date: data.reservationDate,
        reservation_time: data.reservationTime,
        guest_count: data.guestCount,
        special_notes: data.specialNotes,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return reservation
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
    return data
  }

  async getAvailableTimeSlots(restaurantId: string, date: string, guestCount: number) {
    // Get restaurant hours
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('opening_time, closing_time')
      .eq('id', restaurantId)
      .single()

    if (!restaurant) throw new Error('Restaurant not found')

    // Generate time slots (simplified - you can make this more complex)
    const slots = []
    const opening = parseInt(restaurant.opening_time.split(':')[0])
    const closing = parseInt(restaurant.closing_time.split(':')[0])

    for (let hour = opening; hour < closing; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true,
        tablesAvailable: 3 // Simplified - you'd query actual availability
      })
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:30`,
        available: true,
        tablesAvailable: 3
      })
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