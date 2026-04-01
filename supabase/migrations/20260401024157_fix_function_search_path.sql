/*
  # Fix Function Search Path Mutability

  1. Security Improvement
    - Set immutable search_path for handle_updated_at function
    - Prevents search_path manipulation attacks
    
  2. Changes
    - Drop and recreate the function with SECURITY INVOKER and explicit search_path
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;

-- Recreate with immutable search_path
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers for all tables that use this function
DROP TRIGGER IF EXISTS set_updated_at ON saved_trips;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON saved_trips
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON ai_recommendations;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON ai_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON alerts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON user_profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();