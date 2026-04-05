import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SearchParams, SavedTrip, UserProfile } from '../types';

interface AppContextType {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  savedTrips: SavedTrip[];
  addSavedTrip: (trip: SavedTrip) => void;
  removeSavedTrip: (id: string) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  showInsightDetails: boolean;
  setShowInsightDetails: (value: boolean) => void;
  isSharedFlight: boolean;
  setIsSharedFlight: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => {
    const saved = localStorage.getItem('savedTrips');
    return saved ? JSON.parse(saved) : [];
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const saved = localStorage.getItem('hasCompletedOnboarding');
    return saved === 'true';
  });
  const [showInsightDetails, setShowInsightDetails] = useState(false);
  const [isSharedFlight, setIsSharedFlight] = useState(false);

  useEffect(() => {
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const updateOnboardingStatus = (value: boolean) => {
    setHasCompletedOnboarding(value);
    localStorage.setItem('hasCompletedOnboarding', value.toString());
  };

  const addSavedTrip = (trip: SavedTrip) => {
    setSavedTrips(prev => [...prev, trip]);
  };

  const removeSavedTrip = (id: string) => {
    setSavedTrips(prev => prev.filter(trip => trip.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        searchParams,
        setSearchParams,
        savedTrips,
        addSavedTrip,
        removeSavedTrip,
        userProfile,
        setUserProfile,
        hasCompletedOnboarding,
        setHasCompletedOnboarding: updateOnboardingStatus,
        showInsightDetails,
        setShowInsightDetails,
        isSharedFlight,
        setIsSharedFlight,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
