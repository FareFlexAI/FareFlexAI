import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export class AuthService {
  async signUp(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      console.log('Attempting signup for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('No user returned from signup');
        throw new Error('No user returned from signup');
      }

      console.log('Signup successful for user:', data.user.id);
      console.log('User confirmation status:', data.user.confirmed_at ? 'Confirmed' : 'Needs confirmation');

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          createdAt: data.user.created_at,
        },
        error: null,
      };
    } catch (error) {
      console.error('Signup catch block error:', error);
      return { user: null, error: error as Error };
    }
  }

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          createdAt: data.user.created_at,
        } : null,
        error: null,
      };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        createdAt: user.created_at,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          createdAt: session.user.created_at,
        });
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
