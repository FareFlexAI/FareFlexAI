import { supabase } from '../lib/supabase';
import { SavedTrip, FlexibilityOption, CabinClass } from '../types';

export interface SaveTripParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string | null;
  flexibility: FlexibilityOption;
  travelers: number;
  cabinClass: CabinClass;
  needsHotel: boolean;
  budget: number | null;
  bestPrice?: number | null;
  aiSummary?: string | null;
}

export class SavedTripsService {
  async getSavedTrips(userId: string): Promise<{ trips: SavedTrip[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const trips: SavedTrip[] = (data || []).map(trip => ({
        id: trip.id,
        user_id: trip.user_id,
        origin: trip.origin,
        destination: trip.destination,
        depart_date: trip.depart_date,
        return_date: trip.return_date,
        flexibility: trip.flexibility,
        travelers: trip.travelers,
        cabin_class: trip.cabin_class,
        needs_hotel: trip.needs_hotel,
        budget: trip.budget,
        best_price: trip.best_price,
        ai_summary: trip.ai_summary,
        status: trip.status,
        created_at: trip.created_at,
        updated_at: trip.updated_at,
      }));

      return { trips, error: null };
    } catch (error) {
      return { trips: [], error: error as Error };
    }
  }

  async saveTrip(userId: string, params: SaveTripParams): Promise<{ trip: SavedTrip | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('saved_trips')
        .insert({
          user_id: userId,
          origin: params.origin,
          destination: params.destination,
          depart_date: params.departDate,
          return_date: params.returnDate,
          flexibility: params.flexibility,
          travelers: params.travelers,
          cabin_class: params.cabinClass,
          needs_hotel: params.needsHotel,
          budget: params.budget,
          best_price: params.bestPrice || params.budget,
          ai_summary: params.aiSummary,
          status: 'active',
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { trip: null, error: new Error('Failed to save trip') };
      }

      const trip: SavedTrip = {
        id: data.id,
        user_id: data.user_id,
        origin: data.origin,
        destination: data.destination,
        depart_date: data.depart_date,
        return_date: data.return_date,
        flexibility: data.flexibility,
        travelers: data.travelers,
        cabin_class: data.cabin_class,
        needs_hotel: data.needs_hotel,
        budget: data.budget,
        best_price: data.best_price,
        ai_summary: data.ai_summary,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return { trip, error: null };
    } catch (error) {
      return { trip: null, error: error as Error };
    }
  }

  async deleteTrip(userId: string, tripId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('saved_trips')
        .delete()
        .eq('id', tripId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async updateTripPrice(tripId: string, newPrice: number): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('saved_trips')
        .update({
          best_price: newPrice,
        })
        .eq('id', tripId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
}

export const savedTripsService = new SavedTripsService();
