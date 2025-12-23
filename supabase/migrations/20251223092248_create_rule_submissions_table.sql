/*
  # Create rule submissions table

  1. New Tables
    - `rule_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `title` (text) - Short title of the proposed rule
      - `description` (text) - Detailed description of the rule
      - `submitted_by` (text) - Name of the manager who submitted the rule
      - `status` (text) - Status of the submission (pending, approved, rejected)
      - `votes_for` (integer) - Number of votes in favor
      - `votes_against` (integer) - Number of votes against
      - `created_at` (timestamptz) - When the rule was submitted
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `rule_submissions` table
    - Add policy for anyone to view rule submissions
    - Add policy for anyone to create rule submissions
    - Add policy for anyone to update vote counts
*/

CREATE TABLE IF NOT EXISTS rule_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  submitted_by text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  votes_for integer DEFAULT 0 NOT NULL,
  votes_against integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CHECK (status IN ('pending', 'approved', 'rejected'))
);

ALTER TABLE rule_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rule submissions"
  ON rule_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create rule submissions"
  ON rule_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update rule submissions"
  ON rule_submissions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete rule submissions"
  ON rule_submissions
  FOR DELETE
  TO anon, authenticated
  USING (true);