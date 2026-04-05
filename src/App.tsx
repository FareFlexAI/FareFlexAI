import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import SavedTripsScreen from './screens/SavedTripsScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { OnboardingData } from './types';
import { decodeFlightData } from './utils/shareUtils';

const AppContent: React.FC = () => {
  const { currentScreen, hasCompletedOnboarding, setHasCompletedOnboarding, setSearchParams, setCurrentScreen, setIsSharedFlight } = useApp();
  const { toasts, removeToast, success, info } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('share');

    if (shareData && hasCompletedOnboarding) {
      const decoded = decodeFlightData(shareData);
      if (decoded) {
        setSearchParams(decoded.searchParams);
        setCurrentScreen('results');
        setIsSharedFlight(true);
        info('Viewing shared flight');
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [hasCompletedOnboarding, setSearchParams, setCurrentScreen, setIsSharedFlight, info]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setHasCompletedOnboarding(true);
    success('Welcome to FlightFinder!');
  };

  if (!hasCompletedOnboarding) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-gray-50">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'results' && <SearchResultsScreen />}
        {currentScreen === 'saved' && <SavedTripsScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
        <BottomNav />
      </div>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
