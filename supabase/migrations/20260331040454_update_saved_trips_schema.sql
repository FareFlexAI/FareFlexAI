/*
  # Update Saved Trips Schema

  1. Changes to saved_trips table
    - Add missing columns for full trip management
    - Add flexibility (text)
    - Add travelers (integer)
    - Add cabin_class (text)
    - Add needs_hotel (boolean)
    - Add budget (numeric)
    - Add best_price (numeric)
    - Add ai_summary (text)

  2. Notes
    - Uses IF NOT EXISTS pattern to safely add new columns
    - Preserves existing data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'travelers'
  ) THEN
    ALTER TABLE saved_trips ADD COLUMN travelers integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'flexibility'
  ) THEN
    ALTER TABLE saved_trips ADD COLUMN flexibility text DEFAULT 'exact';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'cabin_class'
  ) THEN
    ALTER TABLE saved_trips ADD COLUMN cabin_class text DEFAULT 'economy';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'needs_hotel'
  ) THEN
    ALTER TABLE saved_trips ADD COLUMN needs_hotel boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'best_price'
  ) THEN
    ALTER TABLE saved_trips ADD COLUMN best_price numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_trips' AND column_name = 'ai_summary'
  ) THEN
    ALTER TABLE saved_trips ADD COLUMN ai_summary text;
  END IF;
END $$;
