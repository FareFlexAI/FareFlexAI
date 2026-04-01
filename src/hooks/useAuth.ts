import { useState, useEffect } from 'react';
import { authService, AuthUser } from '../services';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    const { data: subscription } = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setLoading(false);
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { user: newUser, error } = await authService.signUp(email, password);
    if (newUser) setUser(newUser);
    return { user: newUser, error };
  };

  const signIn = async (email: string, password: string) => {
    const { user: newUser, error } = await authService.signIn(email, password);
    if (newUser) setUser(newUser);
    return { user: newUser, error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) setUser(null);
    return { error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
