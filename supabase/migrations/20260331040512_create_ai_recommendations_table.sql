/*
  # Create AI Recommendations Table

  1. New Tables
    - `ai_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `trip_id` (uuid, references saved_trips)
      - `summary` (text)
      - `confidence` (numeric)
      - `details` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on ai_recommendations table
    - Add policies for authenticated users to view their own recommendations
*/

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id uuid REFERENCES saved_trips(id) ON DELETE CASCADE,
  summary text NOT NULL,
  confidence numeric DEFAULT 0.8,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI recommendations"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI recommendations"
  ON ai_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI recommendations"
  ON ai_recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_trip_id ON ai_recommendations(trip_id);
