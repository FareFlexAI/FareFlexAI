/*
  # Add Indexes for Foreign Keys

  1. Performance Improvements
    - Add covering indexes for all foreign key columns
    - Improves JOIN performance and foreign key constraint checking
    
  2. New Indexes
    - `idx_ai_recommendations_user_id` on ai_recommendations(user_id)
    - `idx_ai_recommendations_trip_id` on ai_recommendations(trip_id)
    - `idx_alerts_user_id` on alerts(user_id)
    - `idx_alerts_trip_id` on alerts(trip_id)
    - `idx_price_snapshots_trip_id` on price_snapshots(trip_id)
    
  3. Benefits
    - Faster JOINs with referenced tables
    - Better query performance for filtering by foreign keys
    - Improved RLS policy evaluation performance
*/

-- Add index for ai_recommendations.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id 
  ON ai_recommendations(user_id);

-- Add index for ai_recommendations.trip_id foreign key
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_trip_id 
  ON ai_recommendations(trip_id);

-- Add index for alerts.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_alerts_user_id 
  ON alerts(user_id);

-- Add index for alerts.trip_id foreign key
CREATE INDEX IF NOT EXISTS idx_alerts_trip_id 
  ON alerts(trip_id);

-- Add index for price_snapshots.trip_id foreign key
CREATE INDEX IF NOT EXISTS idx_price_snapshots_trip_id 
  ON price_snapshots(trip_id);