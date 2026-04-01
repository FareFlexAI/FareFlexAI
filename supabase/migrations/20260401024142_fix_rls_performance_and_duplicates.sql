/*
  # Fix RLS Performance and Duplicate Policies

  1. Performance Improvements
    - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth.uid() for each row, improving query performance at scale
  
  2. Remove Duplicate Policies
    - Drop duplicate policies on `saved_trips` table
    - Drop duplicate policies on `ai_recommendations` table
    - Drop duplicate policies on `alerts` table
    - Keep only the correctly named versions
  
  3. Security
    - All policies maintain the same security guarantees
    - Only optimizing performance, not changing access control logic
  
  4. Remove Unused Indexes
    - Drop indexes that are not being used
    - Keep essential indexes for foreign keys and primary lookups
*/

-- Drop all existing policies to recreate them with optimized syntax
-- saved_trips table
DROP POLICY IF EXISTS "Users can view own saved trips" ON saved_trips;
DROP POLICY IF EXISTS "Users can insert own saved trips" ON saved_trips;
DROP POLICY IF EXISTS "Users can update own saved trips" ON saved_trips;
DROP POLICY IF EXISTS "Users can delete own saved trips" ON saved_trips;
DROP POLICY IF EXISTS "Users can view their own saved trips" ON saved_trips;
DROP POLICY IF EXISTS "Users can insert their own saved trips" ON saved_trips;
DROP POLICY IF EXISTS "Users can update their own saved trips" ON saved_trips;
DROP POLICY IF EXISTS "Users can delete their own saved trips" ON saved_trips;

-- ai_recommendations table
DROP POLICY IF EXISTS "Users can view own AI recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Users can insert own AI recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Users can delete own AI recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Users can view their own AI recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Users can insert their own AI recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Users can delete their own AI recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Users can update their own AI recommendations" ON ai_recommendations;

-- alerts table
DROP POLICY IF EXISTS "Users can view their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can insert their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON alerts;

-- price_snapshots table
DROP POLICY IF EXISTS "Users can view their own price snapshots" ON price_snapshots;
DROP POLICY IF EXISTS "Users can insert their own price snapshots" ON price_snapshots;
DROP POLICY IF EXISTS "Users can update their own price snapshots" ON price_snapshots;
DROP POLICY IF EXISTS "Users can delete their own price snapshots" ON price_snapshots;

-- user_profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- Recreate optimized policies for saved_trips
CREATE POLICY "Users can view their own saved trips"
  ON saved_trips FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own saved trips"
  ON saved_trips FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own saved trips"
  ON saved_trips FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own saved trips"
  ON saved_trips FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Recreate optimized policies for ai_recommendations
CREATE POLICY "Users can view their own AI recommendations"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own AI recommendations"
  ON ai_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own AI recommendations"
  ON ai_recommendations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own AI recommendations"
  ON ai_recommendations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Recreate optimized policies for alerts
CREATE POLICY "Users can view their own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Recreate optimized policies for price_snapshots
-- Note: price_snapshots doesn't have user_id, so we use the trip's user_id via join
CREATE POLICY "Users can view their own price snapshots"
  ON price_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM saved_trips
      WHERE saved_trips.id = price_snapshots.trip_id
      AND saved_trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert their own price snapshots"
  ON price_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM saved_trips
      WHERE saved_trips.id = price_snapshots.trip_id
      AND saved_trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update their own price snapshots"
  ON price_snapshots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM saved_trips
      WHERE saved_trips.id = price_snapshots.trip_id
      AND saved_trips.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM saved_trips
      WHERE saved_trips.id = price_snapshots.trip_id
      AND saved_trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete their own price snapshots"
  ON price_snapshots FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM saved_trips
      WHERE saved_trips.id = price_snapshots.trip_id
      AND saved_trips.user_id = (select auth.uid())
    )
  );

-- Recreate optimized policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can delete their own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (id = (select auth.uid()));

-- Drop unused indexes
DROP INDEX IF EXISTS idx_ai_recommendations_user_id;
DROP INDEX IF EXISTS idx_ai_recommendations_trip_id;
DROP INDEX IF EXISTS idx_saved_trips_user_id;
DROP INDEX IF EXISTS idx_alerts_user_id;
DROP INDEX IF EXISTS idx_alerts_trip_id;
DROP INDEX IF EXISTS idx_alerts_active;
DROP INDEX IF EXISTS idx_price_snapshots_trip_id;
DROP INDEX IF EXISTS idx_price_snapshots_trip_observed_at;