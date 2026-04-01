import { useState, useEffect } from 'react';
import { savedTripsService, SaveTripParams } from '../services';
import { SavedTrip } from '../services/types';

export function useSavedTrips(userId: string | null) {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      loadTrips();
    }
  }, [userId]);

  const loadTrips = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { trips: savedTrips, error: loadError } = await savedTripsService.getSavedTrips(userId);

    if (loadError) {
      setError(loadError);
    } else {
      setTrips(savedTrips);
    }

    setLoading(false);
  };

  const saveTrip = async (params: SaveTripParams) => {
    if (!userId) return { trip: null, error: new Error('User not authenticated') };

    setLoading(true);
    setError(null);

    const { trip, error: saveError } = await savedTripsService.saveTrip(userId, params);

    if (saveError) {
      setError(saveError);
    } else if (trip) {
      setTrips(prev => [trip, ...prev]);
    }

    setLoading(false);
    return { trip, error: saveError };
  };

  const deleteTrip = async (tripId: string) => {
    if (!userId) return { error: new Error('User not authenticated') };

    setLoading(true);
    setError(null);

    const { error: deleteError } = await savedTripsService.deleteTrip(userId, tripId);

    if (deleteError) {
      setError(deleteError);
    } else {
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
    }

    setLoading(false);
    return { error: deleteError };
  };

  return {
    trips,
    loading,
    error,
    saveTrip,
    deleteTrip,
    refreshTrips: loadTrips,
  };
}
