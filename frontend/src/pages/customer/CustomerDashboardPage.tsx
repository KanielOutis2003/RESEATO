import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, UtensilsCrossed, Sparkles, Star, Clock, Info } from 'lucide-react';
import { Restaurant } from '../../../../shared/types';
import restaurantService from '../../services/restaurantService';
import authService from '../../services/authService';
import { Button } from '../../components/common/Button';
import { SimpleMap } from '../../components/common/SimpleMap';

const cuisineTypes = [
  { name: 'Filipino', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' },
  { name: 'Seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80' },
  { name: 'Korean', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80' },
  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80' },
  { name: 'Japanese', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80' },
  { name: 'Fast Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80' },
];

const heroImages = [
  'https://kyte.smsupermalls.com/image/view?path=mall%2Fimage%2FeQckeWBjGFhzRWRqX22TLJXswPeXlR4RsZPJOiFb.jpg',
  'https://cdn.forevervacation.com/uploads/attraction/sm-city-cebu-2209.jpg?tr=w-1235,h-354',
  'https://www.malls.com/wp-content/uploads/2024/10/47a45cdcea294333d85a9dfe2e7472bc.jpg.webp',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjd_ZFlYCdEtFE1y6vbJQJCrZsd0v-A1ll7w3ahxwh0VmyFZ808n5i3X5dNyZ5GDFwoDi8QsOw1j07IHb1aYGNhIQCjqHcBBkqFWP6g2EtaC65ypPm67uMDFQ-jM-3-b4K9mi4K-vvEAh2n/s1600/SM+Seaside+City+Cebu+NOW+OPEN+Cebu+Blogger+Cebu+Based+Blogger+Cebu+Blogging+Community.jpg'
];

export const CustomerDashboardPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchFromUrl = queryParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const user = authService.getStoredUser();

  useEffect(() => {
    setSearchTerm(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurant(data[0]);
      }
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];
    
    // Fix SM City location filter
    filtered = filtered.map(r => {
      if (r.name.includes('Chika-an') || r.name.includes('Sachi') || r.address?.includes('SM City Cebu')) {
        return {
          ...r,
          address: 'Cebu Port Center, North Reclamation Area, Juan Luna Ave. cor. Cabahug and Kaoshiung Streets, Mabolo, Cebu City, 6000 Cebu, Philippines'
        };
      }
      return r;
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(
        (r) => r.cuisineType?.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }
    setFilteredRestaurants(filtered);
  };

  useEffect(() => {
    filterRestaurants();
  }, [searchTerm, selectedCuisine, restaurants]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (75%) */}
          <div className="flex-1 lg:w-3/4">
            
            {/* Hero Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden mb-8 h-64 shadow-xl shadow-neutral-200"
            >
              <div className="absolute inset-0 w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentHeroIndex}
                    src={heroImages[currentHeroIndex]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
                <h1 className="text-4xl font-display font-bold mb-3">Welcome Folks!</h1>
                <p className="text-white/80 max-w-md text-lg font-light leading-relaxed">
                  Enjoy your order at our chosen best restaurant and get a taste of delicious food from our best menu.
                </p>
              </div>
            </motion.div>

            {/* Categories */}
            <div className="mb-10 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
              <div className="flex space-x-6 min-w-max">
                <button
                  onClick={() => setSelectedCuisine('All')}
                  className={`flex flex-col items-center group transition-all ${selectedCuisine === 'All' ? 'scale-105' : ''}`}
                >
                  <div className={`w-20 h-20 rounded-2xl overflow-hidden mb-2 border-2 transition-all shadow-sm ${selectedCuisine === 'All' ? 'border-primary-500 ring-2 ring-primary-100' : 'border-white'}`}>
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white">
                      <UtensilsCrossed className="w-8 h-8" />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${selectedCuisine === 'All' ? 'text-primary-700' : 'text-neutral-500'}`}>All</span>
                </button>
                {cuisineTypes.map((cuisine) => (
                  <button
                    key={cuisine.name}
                    onClick={() => setSelectedCuisine(cuisine.name)}
                    className={`flex flex-col items-center group transition-all ${selectedCuisine === cuisine.name ? 'scale-105' : ''}`}
                  >
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden mb-2 border-2 transition-all shadow-sm ${selectedCuisine === cuisine.name ? 'border-primary-500 ring-2 ring-primary-100' : 'border-white'}`}>
                      <img src={cuisine.image} alt={cuisine.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${selectedCuisine === cuisine.name ? 'text-primary-700' : 'text-neutral-500'}`}>{cuisine.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-neutral-900">Recommended Restaurants</h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-neutral-100 shadow-sm" />
                  ))}
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">No restaurants found</h3>
                  <p className="text-neutral-500">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredRestaurants.map((restaurant) => (
                    <motion.div
                      key={restaurant.id}
                      variants={item}
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className={`group relative bg-white rounded-3xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${selectedRestaurant?.id === restaurant.id ? 'border-primary-500 ring-4 ring-primary-50/50' : 'border-transparent'}`}
                    >
                      <div className="h-44 overflow-hidden">
                        <img 
                          src={restaurant.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'} 
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1">{restaurant.name}</h3>
                        <p className="text-xs text-neutral-500 mb-3 line-clamp-1">{restaurant.cuisineType} • {restaurant.address}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-primary-50 text-primary-700 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                            <span className="text-xs font-bold">{restaurant.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            {restaurant.openingTime?.slice(0, 5)} - {restaurant.closingTime?.slice(0, 5)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Sidebar (25%) */}
          <div className="lg:w-1/4">
            <div className="sticky top-28 space-y-6">
              
              {/* Reservation Sidebar Card */}
              <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold text-neutral-900">Reservation details</h3>
                  <div className="text-xs font-medium text-neutral-400">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>

                {selectedRestaurant ? (
                  <>
                    <div className="rounded-2xl overflow-hidden h-40 mb-5 relative group">
                      <img 
                        src={selectedRestaurant.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'} 
                        alt={selectedRestaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-neutral-900">{selectedRestaurant.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold">{selectedRestaurant.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Cuisine</p>
                          <p className="text-sm text-neutral-700 font-medium">{selectedRestaurant.cuisineType}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Address</p>
                          <p className="text-sm text-neutral-700 font-medium leading-snug">{selectedRestaurant.address}</p>
                        </div>
                        {selectedRestaurant.description && (
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Description</p>
                            <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">{selectedRestaurant.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Map */}
                    <div className="rounded-2xl overflow-hidden h-48 mb-6 border border-neutral-100 shadow-inner bg-neutral-50 relative group">
                      <SimpleMap 
                        locationName={selectedRestaurant.address || selectedRestaurant.name} 
                        className="w-full h-full grayscale-[0.5] contrast-[1.1]"
                      />
                      <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-all" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-neutral-700 shadow-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary-600" /> Location
                      </div>
                    </div>

                    <Button 
                      onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                      className="w-full py-4 bg-success-500 hover:bg-success-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-success-200 transition-all active:scale-95"
                    >
                      Book a Table
                    </Button>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="w-8 h-8 text-neutral-300" />
                    </div>
                    <p className="text-sm text-neutral-500">Select a restaurant to see details</p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

