/*
  # Add Legacy Points to Managers

  1. Changes
    - Add `legacy_points` column to `managers` table
    - Default value set to 0 for all managers
    - Field tracks cumulative legacy points earned by each manager

  2. Notes
    - Existing managers will have 0 legacy points by default
    - This is a nullable integer field with a default value
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'managers' AND column_name = 'legacy_points'
  ) THEN
    ALTER TABLE managers ADD COLUMN legacy_points integer DEFAULT 0;
  END IF;
END $$;