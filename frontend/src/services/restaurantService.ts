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
    const rows = data || []
    
    // Debug: check what we are getting from Supabase
    console.log('Supabase raw data:', rows);

    const mapped = rows.map((r: any) => {
      let images = (r.restaurant_images || r.images || []).map((img: any) => ({
        id: img.id,
        imageUrl: img.imageUrl || img.url || img.image_url,
        isPrimary: img.isPrimary ?? img.is_primary ?? false,
      }))
      
      // Filter out problematic/expiring URLs from Supabase (like scontent)
      images = images.filter((img: any) => {
        const url = img.imageUrl || '';
        return !url.includes('scontent') && !url.includes('fbcdn');
      });

      return {
        ...r,
        images,
        cuisineType: r.cuisine_type ?? r.cuisineType,
        openingTime: r.opening_time ?? r.openingTime,
        closingTime: r.closing_time ?? r.closingTime,
        rating: typeof r.rating === 'number' ? r.rating : 0,
        totalReviews: r.total_reviews ?? r.totalReviews ?? 0,
        description: r.description || 'Welcome to our restaurant! We serve the finest dishes in town with a focus on quality and taste.',
      }
    })
    
    return mapped;
  }

  async getRestaurantById(id: string) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, restaurant_images(*)')
        .eq('id', id)
        .single()

    if (error) {
      console.error(`Supabase error fetching restaurant ${id}:`, error.message);
      throw new Error(error.message);
    }
    
    if (!data) {
      console.warn(`No restaurant found with ID: ${id}`);
      return null;
    }

      const r: any = data;
      let images = (r.restaurant_images || r.images || []).map((img: any) => ({
        id: img.id,
        imageUrl: img.imageUrl || img.url || img.image_url,
        isPrimary: img.isPrimary ?? img.is_primary ?? false,
      }))

      // Filter out problematic/expiring URLs from Supabase (like scontent)
      images = images.filter((img: any) => {
        const url = img.imageUrl || '';
        return !url.includes('scontent') && !url.includes('fbcdn');
      });

      return {
        ...r,
        images,
        cuisineType: r.cuisine_type ?? r.cuisineType,
        openingTime: r.opening_time ?? r.openingTime,
        closingTime: r.closing_time ?? r.closingTime,
        rating: typeof r.rating === 'number' ? r.rating : 0,
        totalReviews: r.total_reviews ?? r.totalReviews ?? 0,
      }
    } catch (err) {
      console.error('Error in getRestaurantById:', err);
      throw err;
    }
  }

  async getMyRestaurantByOwnerId(ownerId: string) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .single()

    if (error) {
      console.error('Error fetching restaurant by owner:', error);
      return null;
    }
    return data
  }

  async getMyRestaurant() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return this.getMyRestaurantByOwnerId(user.id)
  }
}

export default new RestaurantService()
