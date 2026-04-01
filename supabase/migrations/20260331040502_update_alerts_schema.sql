/*
  # Update Price Alerts Schema

  1. Changes to price_alerts table
    - Add trip_id reference if not exists
    - Add alert_type field
    - Rename fields to match new requirements

  2. Notes
    - Safe column additions with IF NOT EXISTS
    - Maintains backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'price_alerts' AND column_name = 'trip_id'
  ) THEN
    ALTER TABLE price_alerts ADD COLUMN trip_id uuid REFERENCES saved_trips(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'price_alerts' AND column_name = 'alert_type'
  ) THEN
    ALTER TABLE price_alerts ADD COLUMN alert_type text DEFAULT 'price_drop';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'price_alerts' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE price_alerts ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_price_alerts_trip_id ON price_alerts(trip_id);
