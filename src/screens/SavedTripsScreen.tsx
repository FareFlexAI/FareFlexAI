import React from 'react';
import { Bookmark, Plus, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useSavedTrips } from '../hooks/useSavedTrips';
import SavedTripCard from '../components/SavedTripCard';
import { SavedTrip, SearchParams } from '../types';

const SavedTripsScreen: React.FC = () => {
  const { setCurrentScreen, setSearchParams } = useApp();
  const { user } = useAuth();
  const { trips, loading, deleteTrip } = useSavedTrips(user?.id || null);

  const handleViewTrip = (trip: SavedTrip) => {
    const searchParams: SearchParams = {
      from: trip.origin,
      to: trip.destination,
      departDate: trip.depart_date,
      returnDate: trip.return_date || trip.depart_date,
      isFlexible: trip.flexibility !== 'Exact',
      flexibility: trip.flexibility,
      travelers: trip.travelers,
      cabinClass: trip.cabin_class,
      needsHotel: trip.needs_hotel,
      budget: trip.budget || 1000,
    };
    setSearchParams(searchParams);
    setCurrentScreen('results');
  };

  const handleRemoveTrip = async (id: string) => {
    await deleteTrip(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bookmark className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">Saved Trips</h1>
          </div>
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <Loader2 className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map((trip) => (
              <SavedTripCard
                key={trip.id}
                trip={trip}
                onRemove={handleRemoveTrip}
                onView={handleViewTrip}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <Bookmark className="mx-auto mb-4 text-gray-300" size={64} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No saved trips yet</h2>
            <p className="text-gray-600 mb-6">
              Start tracking a trip to get savings alerts and AI recommendations.
            </p>
            <button
              onClick={() => setCurrentScreen('home')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Search for Trips
            </button>
          </div>
        )}

        {trips.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Price Alerts Active</h3>
            <p className="text-blue-100 text-sm">
              We'll notify you when prices drop or when it's the best time to book your saved trips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTripsScreen;
