import React, { createContext, useContext, useState, ReactNode } from 'react';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showInsightDetails, setShowInsightDetails] = useState(false);

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
        setHasCompletedOnboarding,
        showInsightDetails,
        setShowInsightDetails,
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
