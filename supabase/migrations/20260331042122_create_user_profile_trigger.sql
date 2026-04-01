/*
  # Create User Profile Trigger

  This migration adds an automatic trigger to create a user profile whenever
  a new user signs up through Supabase Auth.

  ## Changes

  1. **Function: handle_new_user()**
     - Automatically creates a user_profiles record when auth.users record is created
     - Extracts full_name from user metadata if available
     - Sets sensible defaults for all fields
     - Uses ON CONFLICT to handle edge cases safely

  2. **Trigger: on_auth_user_created**
     - Fires AFTER INSERT on auth.users table
     - Calls handle_new_user() for each new user
     - Ensures every authenticated user has a profile

  ## Security

  - Function uses SECURITY DEFINER to run with elevated privileges
  - Search path explicitly set to public schema for safety
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    full_name,
    home_airport,
    nearby_airports_enabled,
    flexibility_default,
    preferred_currency,
    traveler_type,
    alerts_enabled,
    onboarding_completed
  )
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    null,
    true,
    'Exact',
    'USD',
    'Solo',
    true,
    false
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();