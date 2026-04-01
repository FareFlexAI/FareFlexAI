/*
  # Complete Travel App Schema

  This migration creates the complete database schema for the travel booking app
  with all tables, triggers, indexes, and Row Level Security policies.

  ## Tables Created

  1. **user_profiles**
     - User profile information and preferences
     - One profile per auth.users record
     - Stores home airport, travel preferences, notification settings

  2. **saved_trips**
     - User-saved trips for tracking and monitoring
     - Includes trip parameters (origin, destination, dates, travelers)
     - Stores pricing information and AI-generated summaries
     - Support for flexible date searches

  3. **alerts**
     - Price alerts and booking recommendations
     - Linked to saved trips
     - Three alert types: price_below_target, significant_price_change, book_now_recommendation

  4. **ai_recommendations**
     - AI-generated travel guidance for trips
     - Stores summary, confidence level, and detailed recommendations in JSONB

  5. **price_snapshots**
     - Historical price tracking for trips
     - Supports flight, hotel, and package pricing
     - Used for price trend analysis

  ## Security

  - All tables have RLS enabled
  - Users can only access their own data
  - price_snapshots access is based on saved_trips ownership
*/

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- UPDATED_AT HELPER FUNCTION
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- =========================================================
-- USER PROFILES
-- One profile per authenticated user
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  home_airport text,
  nearby_airports_enabled boolean NOT NULL DEFAULT true,
  flexibility_default text NOT NULL DEFAULT 'Exact'
    CHECK (flexibility_default IN ('Exact', '±1 day', '±3 days', 'Entire month')),
  preferred_currency text NOT NULL DEFAULT 'USD',
  traveler_type text NOT NULL DEFAULT 'Solo'
    CHECK (traveler_type IN ('Solo', 'Couple', 'Group')),
  alerts_enabled boolean NOT NULL DEFAULT true,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================
-- SAVED TRIPS
-- Stores trips a user wants to track
-- =========================================================
CREATE TABLE IF NOT EXISTS public.saved_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin text NOT NULL,
  destination text NOT NULL,
  depart_date date NOT NULL,
  return_date date,
  flexibility text NOT NULL DEFAULT 'Exact'
    CHECK (flexibility IN ('Exact', '±1 day', '±3 days', 'Entire month')),
  travelers integer NOT NULL DEFAULT 1 CHECK (travelers > 0),
  cabin_class text NOT NULL DEFAULT 'Economy'
    CHECK (cabin_class IN ('Economy', 'Premium Economy', 'Business', 'First')),
  needs_hotel boolean NOT NULL DEFAULT false,
  budget numeric(10,2),
  best_price numeric(10,2),
  ai_summary text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_saved_trips_updated_at ON public.saved_trips;
CREATE TRIGGER set_saved_trips_updated_at
BEFORE UPDATE ON public.saved_trips
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_saved_trips_user_id ON public.saved_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trips_user_created_at ON public.saved_trips(user_id, created_at DESC);

-- =========================================================
-- ALERTS
-- Alerts tied to saved trips
-- =========================================================
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES public.saved_trips(id) ON DELETE CASCADE,
  alert_type text NOT NULL
    CHECK (
      alert_type IN (
        'price_below_target',
        'significant_price_change',
        'book_now_recommendation'
      )
    ),
  target_price numeric(10,2),
  is_active boolean NOT NULL DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_alerts_updated_at ON public.alerts;
CREATE TRIGGER set_alerts_updated_at
BEFORE UPDATE ON public.alerts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_trip_id ON public.alerts(trip_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON public.alerts(is_active);

-- =========================================================
-- AI RECOMMENDATIONS
-- Stores AI-generated travel guidance for a trip
-- =========================================================
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES public.saved_trips(id) ON DELETE CASCADE,
  summary text NOT NULL,
  confidence text NOT NULL DEFAULT 'Medium'
    CHECK (confidence IN ('Low', 'Medium', 'High')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_ai_recommendations_updated_at ON public.ai_recommendations;
CREATE TRIGGER set_ai_recommendations_updated_at
BEFORE UPDATE ON public.ai_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON public.ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_trip_id ON public.ai_recommendations(trip_id);

-- =========================================================
-- PRICE SNAPSHOTS
-- Helpful for future price history / book-now-vs-wait logic
-- =========================================================
CREATE TABLE IF NOT EXISTS public.price_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.saved_trips(id) ON DELETE CASCADE,
  supplier text NOT NULL,
  product_type text NOT NULL
    CHECK (product_type IN ('flight', 'hotel', 'package')),
  total_price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  observed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_snapshots_trip_id ON public.price_snapshots(trip_id);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_trip_observed_at ON public.price_snapshots(trip_id, observed_at DESC);

-- =========================================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_snapshots ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- RLS POLICIES: USER PROFILES
-- =========================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = id);

-- =========================================================
-- RLS POLICIES: SAVED TRIPS
-- =========================================================
DROP POLICY IF EXISTS "Users can view their own saved trips" ON public.saved_trips;
CREATE POLICY "Users can view their own saved trips"
ON public.saved_trips
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved trips" ON public.saved_trips;
CREATE POLICY "Users can insert their own saved trips"
ON public.saved_trips
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own saved trips" ON public.saved_trips;
CREATE POLICY "Users can update their own saved trips"
ON public.saved_trips
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved trips" ON public.saved_trips;
CREATE POLICY "Users can delete their own saved trips"
ON public.saved_trips
FOR DELETE
USING (auth.uid() = user_id);

-- =========================================================
-- RLS POLICIES: ALERTS
-- =========================================================
DROP POLICY IF EXISTS "Users can view their own alerts" ON public.alerts;
CREATE POLICY "Users can view their own alerts"
ON public.alerts
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own alerts" ON public.alerts;
CREATE POLICY "Users can insert their own alerts"
ON public.alerts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own alerts" ON public.alerts;
CREATE POLICY "Users can update their own alerts"
ON public.alerts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.alerts;
CREATE POLICY "Users can delete their own alerts"
ON public.alerts
FOR DELETE
USING (auth.uid() = user_id);

-- =========================================================
-- RLS POLICIES: AI RECOMMENDATIONS
-- =========================================================
DROP POLICY IF EXISTS "Users can view their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view their own AI recommendations"
ON public.ai_recommendations
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can insert their own AI recommendations"
ON public.ai_recommendations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can update their own AI recommendations"
ON public.ai_recommendations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can delete their own AI recommendations"
ON public.ai_recommendations
FOR DELETE
USING (auth.uid() = user_id);

-- =========================================================
-- RLS POLICIES: PRICE SNAPSHOTS
-- Access based on ownership of linked saved_trip
-- =========================================================
DROP POLICY IF EXISTS "Users can view their own price snapshots" ON public.price_snapshots;
CREATE POLICY "Users can view their own price snapshots"
ON public.price_snapshots
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.saved_trips st
    WHERE st.id = price_snapshots.trip_id
      AND st.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert their own price snapshots" ON public.price_snapshots;
CREATE POLICY "Users can insert their own price snapshots"
ON public.price_snapshots
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.saved_trips st
    WHERE st.id = price_snapshots.trip_id
      AND st.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their own price snapshots" ON public.price_snapshots;
CREATE POLICY "Users can update their own price snapshots"
ON public.price_snapshots
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.saved_trips st
    WHERE st.id = price_snapshots.trip_id
      AND st.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.saved_trips st
    WHERE st.id = price_snapshots.trip_id
      AND st.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete their own price snapshots" ON public.price_snapshots;
CREATE POLICY "Users can delete their own price snapshots"
ON public.price_snapshots
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.saved_trips st
    WHERE st.id = price_snapshots.trip_id
      AND st.user_id = auth.uid()
  )
);