import React from 'react';
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

const AppContent: React.FC = () => {
  const { currentScreen, hasCompletedOnboarding, setHasCompletedOnboarding } = useApp();
  const { toasts, removeToast, success } = useToast();

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
