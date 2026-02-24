// frontend/src/services/restaurantService.ts
import { supabase } from '../config/supabase'

class RestaurantService {
  async getAllRestaurants(filters?: any) {
    let query = supabase
      .from('restaurants')
      .select('*, restaurant_images(*)')
      .eq('is_active', true)

    if (filters?.cuisine) {
      query = query.eq('cuisine_type', filters.cuisine)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.rating) {
      query = query.gte('rating', filters.rating)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }

  async getRestaurantById(id: string) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*, restaurant_images(*)')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}

export default new RestaurantService()