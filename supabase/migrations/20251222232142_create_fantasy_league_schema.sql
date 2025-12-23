/*
  # Chalupa Batman Fantasy Football League Schema

  ## Overview
  Complete database schema for a fantasy football league website tracking managers, seasons, rivalries, bets, and media.

  ## New Tables
  
  ### 1. managers
  Core table for league members
  - `id` (uuid, primary key)
  - `name` (text) - Manager's display name
  - `profile_image_url` (text) - URL to profile picture
  - `quote` (text) - Personal quote/motto
  - `championships` (integer) - Total championship wins
  - `total_seasons` (integer) - Seasons participated
  - `total_wins` (integer) - All-time regular season wins
  - `total_losses` (integer) - All-time regular season losses
  - `playoff_appearances` (integer) - Number of playoff appearances
  - `last_place_finishes` (integer) - Sacko count
  - `sleeper_user_id` (text) - Optional Sleeper app integration
  - `created_at` (timestamptz)

  ### 2. seasons
  Historical record of each league season
  - `id` (uuid, primary key)
  - `year` (integer) - Season year
  - `champion_id` (uuid) - FK to managers
  - `runner_up_id` (uuid) - FK to managers
  - `sacko_id` (uuid) - Last place finisher
  - `regular_season_winner_id` (uuid) - FK to managers
  - `notes` (text) - Season highlights/notes
  - `created_at` (timestamptz)

  ### 3. season_placements
  Detailed placement records for each season
  - `id` (uuid, primary key)
  - `season_id` (uuid) - FK to seasons
  - `manager_id` (uuid) - FK to managers
  - `placement` (integer) - Final standing (1-10)
  - `regular_season_wins` (integer)
  - `regular_season_losses` (integer)
  - `points_for` (numeric) - Total points scored
  - `points_against` (numeric) - Total points allowed
  - `created_at` (timestamptz)

  ### 4. rivalries
  Track head-to-head rivalries between managers
  - `id` (uuid, primary key)
  - `manager1_id` (uuid) - FK to managers
  - `manager2_id` (uuid) - FK to managers
  - `rivalry_name` (text) - Custom rivalry title
  - `manager1_wins` (integer) - Head-to-head wins
  - `manager2_wins` (integer) - Head-to-head wins
  - `created_at` (timestamptz)

  ### 5. bets
  Record of all wagers and side bets
  - `id` (uuid, primary key)
  - `season_id` (uuid) - FK to seasons
  - `description` (text) - What the bet is about
  - `participants` (text[]) - Manager IDs involved
  - `stakes` (text) - What's being wagered
  - `winner_id` (uuid) - FK to managers (null if ongoing)
  - `status` (text) - 'active', 'completed', 'cancelled'
  - `created_at` (timestamptz)
  - `resolved_at` (timestamptz)

  ### 6. highlights
  Featured content for the homepage
  - `id` (uuid, primary key)
  - `title` (text) - Highlight title
  - `description` (text) - Details
  - `image_url` (text) - Optional image
  - `date` (timestamptz) - When it happened
  - `is_pinned` (boolean) - Pin to top
  - `created_at` (timestamptz)

  ### 7. events
  Upcoming league events
  - `id` (uuid, primary key)
  - `title` (text) - Event name
  - `description` (text) - Event details
  - `event_date` (timestamptz) - When it happens
  - `location` (text) - Where it happens
  - `created_at` (timestamptz)

  ### 8. media_folders
  Links to external media storage
  - `id` (uuid, primary key)
  - `title` (text) - Folder name
  - `description` (text) - What's in the folder
  - `folder_url` (text) - Google Drive or other link
  - `thumbnail_url` (text) - Preview image
  - `season_year` (integer) - Optional year association
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access (league members can view all data)
  - Authenticated write access (admin/authenticated users can modify)
*/

-- Create managers table
CREATE TABLE IF NOT EXISTS managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  profile_image_url text,
  quote text,
  championships integer DEFAULT 0,
  total_seasons integer DEFAULT 0,
  total_wins integer DEFAULT 0,
  total_losses integer DEFAULT 0,
  playoff_appearances integer DEFAULT 0,
  last_place_finishes integer DEFAULT 0,
  sleeper_user_id text,
  created_at timestamptz DEFAULT now()
);

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer UNIQUE NOT NULL,
  champion_id uuid REFERENCES managers(id),
  runner_up_id uuid REFERENCES managers(id),
  sacko_id uuid REFERENCES managers(id),
  regular_season_winner_id uuid REFERENCES managers(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create season_placements table
CREATE TABLE IF NOT EXISTS season_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES seasons(id) ON DELETE CASCADE NOT NULL,
  manager_id uuid REFERENCES managers(id) NOT NULL,
  placement integer NOT NULL,
  regular_season_wins integer DEFAULT 0,
  regular_season_losses integer DEFAULT 0,
  points_for numeric(10,2) DEFAULT 0,
  points_against numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(season_id, manager_id),
  UNIQUE(season_id, placement)
);

-- Create rivalries table
CREATE TABLE IF NOT EXISTS rivalries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manager1_id uuid REFERENCES managers(id) NOT NULL,
  manager2_id uuid REFERENCES managers(id) NOT NULL,
  rivalry_name text,
  manager1_wins integer DEFAULT 0,
  manager2_wins integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CHECK (manager1_id != manager2_id)
);

-- Create bets table
CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES seasons(id),
  description text NOT NULL,
  participants text[] NOT NULL,
  stakes text NOT NULL,
  winner_id uuid REFERENCES managers(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create highlights table
CREATE TABLE IF NOT EXISTS highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  date timestamptz DEFAULT now(),
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Create media_folders table
CREATE TABLE IF NOT EXISTS media_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  folder_url text NOT NULL,
  thumbnail_url text,
  season_year integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rivalries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for all league data
CREATE POLICY "Public read access for managers"
  ON managers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for seasons"
  ON seasons FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for season_placements"
  ON season_placements FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for rivalries"
  ON rivalries FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for bets"
  ON bets FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for highlights"
  ON highlights FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for events"
  ON events FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for media_folders"
  ON media_folders FOR SELECT
  TO anon
  USING (true);

-- Authenticated users can insert/update/delete (for admin functionality)
CREATE POLICY "Authenticated users can modify managers"
  ON managers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify seasons"
  ON seasons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify season_placements"
  ON season_placements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify rivalries"
  ON rivalries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify bets"
  ON bets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify highlights"
  ON highlights FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify events"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify media_folders"
  ON media_folders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_season_placements_season ON season_placements(season_id);
CREATE INDEX IF NOT EXISTS idx_season_placements_manager ON season_placements(manager_id);
CREATE INDEX IF NOT EXISTS idx_bets_season ON bets(season_id);
CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_highlights_pinned ON highlights(is_pinned);
CREATE INDEX IF NOT EXISTS idx_seasons_year ON seasons(year);