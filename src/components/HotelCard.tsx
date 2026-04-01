import React from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
      <div className="relative overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        {hotel.freeCancellation && (
          <div className="absolute top-3 right-3 bg-white rounded-xl px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle size={16} strokeWidth={2.5} />
              <span className="text-xs font-bold">Free cancellation</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug">{hotel.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
              <MapPin size={15} strokeWidth={2.5} />
              <span className="font-medium">{hotel.neighborhood}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-xl shadow-md shadow-blue-600/20">
            <Star size={14} fill="currentColor" strokeWidth={2.5} />
            <span className="text-sm font-bold">{hotel.rating}</span>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {hotel.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">${hotel.nightlyPrice}/night</p>
            <p className="text-3xl font-bold text-gray-900">${hotel.totalPrice}</p>
            <p className="text-xs text-gray-500 font-medium">total for 4 nights</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
