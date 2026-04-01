import { useState, useEffect } from 'react';
import { profileService } from '../services';
import { UserProfile, OnboardingData } from '../types';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { profile: userProfile, error: loadError } = await profileService.getProfile(userId);

    if (loadError) {
      setError(loadError);
    } else {
      setProfile(userProfile);
    }

    setLoading(false);
  };

  const createProfile = async (data: Partial<OnboardingData>) => {
    if (!userId) return { profile: null, error: new Error('User not authenticated') };

    setLoading(true);
    setError(null);

    const { profile: newProfile, error: createError } = await profileService.createProfile(userId, data);

    if (createError) {
      setError(createError);
    } else if (newProfile) {
      setProfile(newProfile);
    }

    setLoading(false);
    return { profile: newProfile, error: createError };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return { profile: null, error: new Error('User not authenticated') };

    setLoading(true);
    setError(null);

    const { profile: updatedProfile, error: updateError } = await profileService.updateProfile(userId, updates);

    if (updateError) {
      setError(updateError);
    } else if (updatedProfile) {
      setProfile(updatedProfile);
    }

    setLoading(false);
    return { profile: updatedProfile, error: updateError };
  };

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refreshProfile: loadProfile,
  };
}
