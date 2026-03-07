import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../../../shared/types';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();

  const primaryImage =
    restaurant.images?.find((img) => img.isPrimary)?.imageUrl ||
    restaurant.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
  };

  const reviewCount = restaurant.totalReviews ?? restaurant.reviewCount ?? 0;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-neutral-100 hover:border-primary-100 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={primaryImage}
          alt={restaurant.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold text-neutral-900">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>

        {/* Cuisine */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-primary-800/90 text-white px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wide">
            {restaurant.cuisineType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-800 transition-colors">
          {restaurant.name}
        </h3>

        <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
          {restaurant.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-neutral-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
            <span className="text-sm line-clamp-1">{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <Clock className="w-4 h-4 shrink-0 text-primary-500" />
            <span className="text-sm">
              {restaurant.openingTime?.slice(0, 5)} – {restaurant.closingTime?.slice(0, 5)}
            </span>
          </div>
          {reviewCount > 0 && (
            <p className="text-xs text-neutral-500">
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-neutral-100">
          <span className="inline-flex items-center gap-2 text-primary-700 font-medium text-sm group-hover:text-primary-800">
            Reserve table
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
