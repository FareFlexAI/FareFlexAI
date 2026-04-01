import React from 'react';
import { Plane, Calendar, DollarSign, Sparkles, Trash2 } from 'lucide-react';
import { SavedTrip } from '../types';

interface SavedTripCardProps {
  trip: SavedTrip;
  onRemove: (id: string) => void;
  onView: (trip: SavedTrip) => void;
}

const SavedTripCard: React.FC<SavedTripCardProps> = ({ trip, onRemove, onView }) => {
  const bestPrice = trip.best_price || trip.budget;
  const returnDate = trip.return_date || trip.depart_date;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="text-blue-600" size={20} />
            <h3 className="font-bold text-lg text-gray-900">
              {trip.origin} → {trip.destination}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar size={16} />
            <span>
              {new Date(trip.depart_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}{' '}
              -{' '}
              {new Date(returnDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        <button
          onClick={() => onRemove(trip.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {bestPrice && (
        <div className="bg-blue-50 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-blue-600" size={20} />
            <span className="font-semibold text-gray-900">Current Best Price</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">${bestPrice}</p>
        </div>
      )}

      {trip.ai_summary && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-green-600" size={18} />
            <span className="font-semibold text-gray-900 text-sm">AI Recommendation</span>
          </div>
          <p className="text-sm text-gray-700">{trip.ai_summary}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onView(trip)}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          View Trip
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
          Edit Alert
        </button>
      </div>
    </div>
  );
};

export default SavedTripCard;
