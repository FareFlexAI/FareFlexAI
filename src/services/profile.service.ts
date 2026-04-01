import { supabase } from '../lib/supabase';
import { UserProfile, OnboardingData } from '../types';

export class ProfileService {
  async getProfile(userId: string, retries = 3, delay = 500): Promise<{ profile: UserProfile | null; error: Error | null }> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          return { profile: null, error: null };
        }

        const profile: UserProfile = {
          id: data.id,
          full_name: data.full_name,
          home_airport: data.home_airport,
          nearby_airports_enabled: data.nearby_airports_enabled,
          flexibility_default: data.flexibility_default,
          preferred_currency: data.preferred_currency,
          traveler_type: data.traveler_type,
          alerts_enabled: data.alerts_enabled,
          onboarding_completed: data.onboarding_completed,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        return { profile, error: null };
      } catch (error) {
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        return { profile: null, error: error as Error };
      }
    }
    return { profile: null, error: new Error('Failed to get profile after retries') };
  }

  async createProfile(userId: string, data: Partial<OnboardingData>): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      console.log('Creating profile for user:', userId, 'with data:', data);

      const existingProfile = await this.getProfile(userId);
      console.log('Existing profile check:', existingProfile);

      if (existingProfile.error) {
        console.error('Error getting existing profile:', existingProfile.error);
        throw existingProfile.error;
      }

      const upsertData = {
        id: userId,
        home_airport: data.homeAirport,
        nearby_airports_enabled: data.nearbyAirportsEnabled ?? true,
        flexibility_default: data.flexibilityDefault ?? 'Exact',
        preferred_currency: data.preferredCurrency ?? 'USD',
        traveler_type: data.travelerType ?? 'Solo',
        alerts_enabled: data.alertsEnabled ?? true,
        onboarding_completed: true,
      };

      console.log('Upserting profile with data:', upsertData);

      const { data: upsertedData, error } = await supabase
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'id'
        })
        .select()
        .maybeSingle();

      console.log('Upsert result:', { upsertedData, error });

      if (error) {
        console.error('Upsert error:', error);
        throw error;
      }

      if (!upsertedData) {
        return { profile: null, error: new Error('Failed to create profile') };
      }

      const profile: UserProfile = {
        id: upsertedData.id,
        full_name: upsertedData.full_name,
        home_airport: upsertedData.home_airport,
        nearby_airports_enabled: upsertedData.nearby_airports_enabled,
        flexibility_default: upsertedData.flexibility_default,
        preferred_currency: upsertedData.preferred_currency,
        traveler_type: upsertedData.traveler_type,
        alerts_enabled: upsertedData.alerts_enabled,
        onboarding_completed: upsertedData.onboarding_completed,
        created_at: upsertedData.created_at,
        updated_at: upsertedData.updated_at,
      };

      return { profile, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const updateData: Record<string, unknown> = {};

      if (updates.full_name !== undefined) updateData.full_name = updates.full_name;
      if (updates.home_airport !== undefined) updateData.home_airport = updates.home_airport;
      if (updates.nearby_airports_enabled !== undefined) updateData.nearby_airports_enabled = updates.nearby_airports_enabled;
      if (updates.flexibility_default !== undefined) updateData.flexibility_default = updates.flexibility_default;
      if (updates.preferred_currency !== undefined) updateData.preferred_currency = updates.preferred_currency;
      if (updates.traveler_type !== undefined) updateData.traveler_type = updates.traveler_type;
      if (updates.alerts_enabled !== undefined) updateData.alerts_enabled = updates.alerts_enabled;

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { profile: null, error: new Error('Failed to update profile') };
      }

      const profile: UserProfile = {
        id: data.id,
        full_name: data.full_name,
        home_airport: data.home_airport,
        nearby_airports_enabled: data.nearby_airports_enabled,
        flexibility_default: data.flexibility_default,
        preferred_currency: data.preferred_currency,
        traveler_type: data.traveler_type,
        alerts_enabled: data.alerts_enabled,
        onboarding_completed: data.onboarding_completed,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return { profile, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  }
}

export const profileService = new ProfileService();
