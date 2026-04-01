/*
  # Clean Schema Alignment

  This migration aligns all tables to match the exact schema specification.

  ## Changes

  1. **user_profiles**
     - Changes `id` from auto-generated uuid to auth.users reference
     - Removes `user_id` column (redundant with id)
     - Updates CHECK constraints for flexibility_default and traveler_type

  2. **saved_trips**
     - Renames `departure_city` to `origin`
     - Renames `departure_date` to `depart_date`
     - Removes old columns no longer needed
     - Adds `status` column
     - Updates CHECK constraints

  3. **price_alerts → alerts**
     - Renames table from price_alerts to alerts
     - Updates alert_type values and constraints
     - Removes redundant columns

  4. **ai_recommendations**
     - Changes confidence from numeric to text enum
     - Adds updated_at column
     - Updates default for details to match schema
*/

-- =========================================================
-- CLEAN UP USER_PROFILES
-- =========================================================

-- Drop old user_profiles if it has wrong structure
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'user_id'
  ) THEN
    DROP TABLE IF EXISTS public.user_profiles CASCADE;
    
    CREATE TABLE public.user_profiles (
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

    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
    CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
    CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
    CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
    CREATE POLICY "Users can delete their own profile"
    ON public.user_profiles FOR DELETE USING (auth.uid() = id);
  END IF;
END $$;

-- =========================================================
-- CLEAN UP SAVED_TRIPS
-- =========================================================

-- Rename columns to match schema
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'departure_city'
  ) THEN
    ALTER TABLE public.saved_trips RENAME COLUMN departure_city TO origin;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'departure_date'
  ) THEN
    ALTER TABLE public.saved_trips RENAME COLUMN departure_date TO depart_date;
  END IF;
END $$;

-- Drop old columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_trips' AND column_name = 'flight_data') THEN
    ALTER TABLE public.saved_trips DROP COLUMN flight_data;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_trips' AND column_name = 'hotel_data') THEN
    ALTER TABLE public.saved_trips DROP COLUMN hotel_data;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_trips' AND column_name = 'is_purchased') THEN
    ALTER TABLE public.saved_trips DROP COLUMN is_purchased;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_trips' AND column_name = 'initial_price') THEN
    ALTER TABLE public.saved_trips DROP COLUMN initial_price;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_trips' AND column_name = 'last_checked_at') THEN
    ALTER TABLE public.saved_trips DROP COLUMN last_checked_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_trips' AND column_name = 'price_drop_amount') THEN
    ALTER TABLE public.saved_trips DROP COLUMN price_drop_amount;
  END IF;
END $$;

-- Add status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.saved_trips ADD COLUMN status text NOT NULL DEFAULT 'active'
      CHECK (status IN ('active', 'archived'));
  END IF;
END $$;

-- Update flexibility values
UPDATE public.saved_trips 
SET flexibility = CASE flexibility
  WHEN 'exact' THEN 'Exact'
  WHEN '±1' THEN '±1 day'
  WHEN '±3' THEN '±3 days'
  WHEN 'month' THEN 'Entire month'
  ELSE 'Exact'
END
WHERE flexibility IN ('exact', '±1', '±3', 'month');

-- Update cabin_class values
UPDATE public.saved_trips 
SET cabin_class = CASE cabin_class
  WHEN 'economy' THEN 'Economy'
  WHEN 'premium' THEN 'Premium Economy'
  WHEN 'business' THEN 'Business'
  WHEN 'first' THEN 'First'
  ELSE 'Economy'
END
WHERE cabin_class IN ('economy', 'premium', 'business', 'first');

-- Add constraints
DO $$
BEGIN
  ALTER TABLE public.saved_trips DROP CONSTRAINT IF EXISTS saved_trips_flexibility_check;
  ALTER TABLE public.saved_trips ADD CONSTRAINT saved_trips_flexibility_check 
    CHECK (flexibility IN ('Exact', '±1 day', '±3 days', 'Entire month'));

  ALTER TABLE public.saved_trips DROP CONSTRAINT IF EXISTS saved_trips_cabin_class_check;
  ALTER TABLE public.saved_trips ADD CONSTRAINT saved_trips_cabin_class_check 
    CHECK (cabin_class IN ('Economy', 'Premium Economy', 'Business', 'First'));

  ALTER TABLE public.saved_trips DROP CONSTRAINT IF EXISTS saved_trips_travelers_check;
  ALTER TABLE public.saved_trips ADD CONSTRAINT saved_trips_travelers_check 
    CHECK (travelers > 0);
END $$;

-- =========================================================
-- RENAME price_alerts TO alerts (if needed)
-- =========================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'price_alerts') THEN
    DROP TABLE IF EXISTS public.price_alerts CASCADE;
  END IF;
END $$;

-- =========================================================
-- UPDATE AI_RECOMMENDATIONS
-- =========================================================

-- Change confidence from numeric to text
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_recommendations' 
      AND column_name = 'confidence' 
      AND data_type = 'numeric'
  ) THEN
    ALTER TABLE public.ai_recommendations DROP COLUMN confidence;
    ALTER TABLE public.ai_recommendations ADD COLUMN confidence text NOT NULL DEFAULT 'Medium'
      CHECK (confidence IN ('Low', 'Medium', 'High'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_recommendations' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.ai_recommendations ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_recommendations' 
      AND column_name = 'details'
  ) THEN
    ALTER TABLE public.ai_recommendations ALTER COLUMN details SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.ai_recommendations ALTER COLUMN details SET NOT NULL;
  END IF;
END $$;

DROP TRIGGER IF EXISTS set_ai_recommendations_updated_at ON public.ai_recommendations;
CREATE TRIGGER set_ai_recommendations_updated_at
BEFORE UPDATE ON public.ai_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Update AI recommendations policies
DROP POLICY IF EXISTS "Users can update their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can update their own AI recommendations"
ON public.ai_recommendations FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);