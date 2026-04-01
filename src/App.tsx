import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import SavedTripsScreen from './screens/SavedTripsScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { supabase } from './lib/supabase';
import { OnboardingData } from './types';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { profile, loading: profileLoading, createProfile } = useProfile(user?.id || null);
  const { toasts, removeToast, success, error } = useToast();

  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authError, setAuthError] = useState('');

  const isLoading = authLoading || profileLoading;
  const needsOnboarding = user && !profile?.onboarding_completed;

  const handleLogin = async (email: string, password: string) => {
    setAuthError('');
    const { error: loginError } = await signIn(email, password);
    if (loginError) {
      setAuthError(loginError.message);
      error('Failed to sign in. Please check your credentials.');
      throw loginError;
    }
    success('Welcome back!');
  };

  const handleSignup = async (email: string, password: string) => {
    setAuthError('');
    console.log('handleSignup called with email:', email);
    const { error: signupError } = await signUp(email, password);
    console.log('signUp returned error:', signupError);
    if (signupError) {
      setAuthError(signupError.message);
      error('Failed to create account. Please try again.');
      console.error('Signup failed:', signupError);
      throw signupError;
    }
    console.log('Signup successful, showing success message');
    success('Account created successfully!');
  };

  const handleForgotPassword = async (email: string) => {
    setAuthError('');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (resetError) throw resetError;
      success('Password reset email sent!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setAuthError(errorMessage);
      error(errorMessage);
      throw err;
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;

    const { error: profileError } = await createProfile(data);
    if (profileError) {
      error('Failed to save profile. Please try again.');
      console.error('Profile creation error:', profileError);
    } else {
      success('Profile created successfully!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        {authScreen === 'login' && (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignup={() => setAuthScreen('signup')}
            onNavigateToForgotPassword={() => setAuthScreen('forgot')}
            error={authError}
          />
        )}
        {authScreen === 'signup' && (
          <SignupScreen
            onSignup={handleSignup}
            onNavigateToLogin={() => setAuthScreen('login')}
            error={authError}
          />
        )}
        {authScreen === 'forgot' && (
          <ForgotPasswordScreen
            onResetPassword={handleForgotPassword}
            onNavigateBack={() => setAuthScreen('login')}
          />
        )}
      </>
    );
  }

  if (needsOnboarding) {
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
