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

      // If Supabase has no valid images, try to find a fallback match by name
      if (images.length === 0) {
        const rName = r.name.toLowerCase().trim();
        const fallback = this.getFallbackData().find(f => {
          const fName = f.name.toLowerCase().trim();
          return fName === rName || rName.includes(fName) || fName.includes(rName);
        });
        if (fallback) {
          images = fallback.images;
        }
      }

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

  getFallbackData() {
    return [
      {
        id: 'demo-cabalen',
        ownerId: '',
        name: 'Cabalen',
        description: 'Authentic Filipino buffet with a focus on Kapampangan cuisine. Cabalen is famous for its Kapampangan buffet, offering a wide array of Filipino favorites from appetizers to desserts. Experience the best of home-style Filipino cooking in a festive, all-you-can-eat setting.',
        cuisine: 'Filipino',
        cuisineType: 'Buffet',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '(032) 254 9000',
        email: 'info@cabalen.ph',
        website: 'https://www.cabalen.ph',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img1', imageUrl: '/assets/images/cabalen.avif', isPrimary: true }],
        tables: [],
        rating: 5.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-seoul',
        ownerId: '',
        name: 'Seoul Black',
        description: 'Premium Korean barbecue and comfort dishes. Seoul Black offers an authentic Korean dining experience with high-quality meats, traditional side dishes, and a modern atmosphere. Perfect for groups and families who enjoy interactive grilling and hearty Korean stews.',
        cuisine: 'Korean',
        cuisineType: 'Korean',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '0927 508 6275',
        email: 'contact@seoulblack.com',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '22:00',
        images: [{ id: 'img2', imageUrl: '/assets/images/Seoul Black.jpg', isPrimary: true }],
        tables: [],
        rating: 4.8,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-sachi',
        ownerId: '',
        name: 'Sachi Ramen',
        description: 'Authentic Japanese ramen and rice bowls. Sachi Ramen specializes in rich, flavorful broths and house-made noodles. From our signature Tonkotsu to spicy Tantanmen, every bowl is crafted with passion and traditional Japanese techniques.',
        cuisine: 'Japanese',
        cuisineType: 'Ramen',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '(032) 412 4567',
        email: 'info@sachiramen.com',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img3', imageUrl: '/assets/images/Sachi Ramen.jpg', isPrimary: true }],
        tables: [],
        rating: 4.9,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-boy-belly',
        ownerId: '',
        name: 'Boy Belly',
        description: 'Cebu\'s favorite Lechon Belly and Filipino specialties. Boy Belly brings the iconic taste of Cebuano lechon to the table, along with a variety of grilled favorites and home-style Filipino dishes that celebrate local flavors.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '(032) 123 9999',
        email: 'info@boybelly.com',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img4', imageUrl: '/assets/images/Boy Belly.png', isPrimary: true }],
        tables: [],
        rating: 4.8,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-chikaan',
        ownerId: '',
        name: 'Chika-an Cebuano Kitchen',
        description: 'Cebuano classics and home-style cooking.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img5', imageUrl: '/assets/images/Chika-an Cebu Kitchen.jpg', isPrimary: true }],
        tables: [],
        rating: 4.2,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-kuya-j',
        ownerId: '',
        name: 'Kuya J',
        description: 'Filipino meals and famous halo-halo.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img6', imageUrl: '/assets/images/Kuya J.png', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-mesa',
        ownerId: '',
        name: 'Mesa Restaurant Philippines',
        description: 'Modern Filipino dishes with a twist.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img7', imageUrl: '/assets/images/Mesa Restaurant Phillippines.png', isPrimary: true }],
        tables: [],
        rating: 4.1,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-seafood-ribs',
        ownerId: '',
        name: 'Seafood & Ribs Warehouse',
        description: 'Seafood platters and hearty ribs.',
        cuisine: 'Seafood',
        cuisineType: 'Seafood',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img8', imageUrl: '/assets/images/Seafood & Ribs warehouse.webp', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-somac',
        ownerId: '',
        name: 'Somac Korean Restaurant',
        description: 'Korean favorites and grilled dishes.',
        cuisine: 'Korean',
        cuisineType: 'Korean',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '22:00',
        images: [{ id: 'img9', imageUrl: '/assets/images/SoMac.jpg', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-superbowl',
        ownerId: '',
        name: 'Superbowl of China',
        description: 'Classic Chinese dishes for the family.',
        cuisine: 'Chinese',
        cuisineType: 'Chinese',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img10', imageUrl: '/assets/images/Superbowl of China.jpg', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    return fallback
  }

  async getRestaurantById(id: string) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, restaurant_images(*)')
        .eq('id', id)
        .single()

      if (error) {
        console.warn(`Supabase error fetching restaurant ${id}:`, error.message);
        // If not found in DB, try fallback data
        const fallback = this.getFallbackData().find(r => r.id === id);
        if (fallback) return fallback;
        throw new Error(error.message);
      }
      
      if (!data) {
        const fallback = this.getFallbackData().find(r => r.id === id);
        if (fallback) return fallback;
        return null as any;
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

      // If Supabase has no valid images, try to find a fallback match by name
      if (images.length === 0) {
        const rName = r.name.toLowerCase().trim();
        const fallback = this.getFallbackData().find(f => {
          const fName = f.name.toLowerCase().trim();
          return fName === rName || rName.includes(fName) || fName.includes(rName);
        });
        if (fallback) {
          images = fallback.images;
        }
      }

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
      // Last resort fallback
      const fallback = this.getFallbackData().find(r => r.id === id);
      if (fallback) return fallback;
      throw err;
    }
  }

  private getFallbackData() {
    return [
      {
        id: 'demo-cabalen',
        ownerId: '',
        name: 'Cabalen',
        description: 'Authentic Filipino buffet with a focus on Kapampangan cuisine.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img1', imageUrl: '/assets/images/cabalen.avif', isPrimary: true }],
        tables: [],
        rating: 4.3,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-seoul',
        ownerId: '',
        name: 'Seoul Black',
        description: 'Korean barbecue and comfort dishes.',
        cuisine: 'Korean',
        cuisineType: 'Korean',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '22:00',
        images: [{ id: 'img2', imageUrl: '/assets/images/Seoul Black.jpg', isPrimary: true }],
        tables: [],
        rating: 4.1,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-sachi',
        ownerId: '',
        name: 'Sachi Ramen',
        description: 'Japanese ramen and rice bowls.',
        cuisine: 'Japanese',
        cuisineType: 'Japanese',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img3', imageUrl: '/assets/images/Sachi Ramen.jpg', isPrimary: true }],
        tables: [],
        rating: 4.2,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-boy-belly',
        ownerId: '',
        name: 'Boy Belly',
        description: 'Filipino favorites and grills.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img4', imageUrl: '/assets/images/Boy Belly.png', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-chikaan',
        ownerId: '',
        name: 'Chika-an Cebuano Kitchen',
        description: 'Cebuano classics and home-style cooking.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img5', imageUrl: '/assets/images/Chika-an Cebu Kitchen.jpg', isPrimary: true }],
        tables: [],
        rating: 4.2,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-kuya-j',
        ownerId: '',
        name: 'Kuya J',
        description: 'Filipino meals and famous halo-halo.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img6', imageUrl: '/assets/images/Kuya J.png', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-mesa',
        ownerId: '',
        name: 'Mesa Restaurant Philippines',
        description: 'Modern Filipino dishes with a twist.',
        cuisine: 'Filipino',
        cuisineType: 'Filipino',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img7', imageUrl: '/assets/images/Mesa Restaurant Phillippines.png', isPrimary: true }],
        tables: [],
        rating: 4.1,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-seafood-ribs',
        ownerId: '',
        name: 'Seafood & Ribs Warehouse',
        description: 'Seafood platters and hearty ribs.',
        cuisine: 'Seafood',
        cuisineType: 'Seafood',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img8', imageUrl: '/assets/images/Seafood & Ribs warehouse.webp', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-somac',
        ownerId: '',
        name: 'Somac Korean Restaurant',
        description: 'Korean favorites and grilled dishes.',
        cuisine: 'Korean',
        cuisineType: 'Korean',
        address: 'SM Seaside City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '22:00',
        images: [{ id: 'img9', imageUrl: '/assets/images/SoMac.jpg', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-superbowl',
        ownerId: '',
        name: 'Superbowl of China',
        description: 'Classic Chinese dishes for the family.',
        cuisine: 'Chinese',
        cuisineType: 'Chinese',
        address: 'SM City Cebu',
        city: 'Cebu',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {},
        openingTime: '10:00',
        closingTime: '21:00',
        images: [{ id: 'img10', imageUrl: '/assets/images/Superbowl of China.jpg', isPrimary: true }],
        tables: [],
        rating: 4.0,
        reviewCount: 0,
        totalReviews: 0,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  async getMyRestaurantByOwnerId(ownerId: string) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .single()

    if (error) {
      // If no real restaurant in DB, check fallback data for demo accounts
      const fallbacks = this.getFallbackData();
      const { data: { user } } = await supabase.auth.getUser();
      const demoResto = fallbacks.find(r => r.email === user?.email);
      if (demoResto) return demoResto;
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
