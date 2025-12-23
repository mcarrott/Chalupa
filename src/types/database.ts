export interface Manager {
  id: string;
  name: string;
  profile_image_url: string | null;
  quote: string | null;
  championships: number;
  total_seasons: number;
  total_wins: number;
  total_losses: number;
  playoff_appearances: number;
  last_place_finishes: number;
  legacy_points: number;
  sleeper_user_id: string | null;
  created_at: string;
}

export interface Season {
  id: string;
  year: number;
  champion_id: string | null;
  runner_up_id: string | null;
  sacko_id: string | null;
  regular_season_winner_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface SeasonPlacement {
  id: string;
  season_id: string;
  manager_id: string;
  placement: number;
  regular_season_wins: number;
  regular_season_losses: number;
  points_for: number;
  points_against: number;
  created_at: string;
}

export interface Rivalry {
  id: string;
  manager1_id: string;
  manager2_id: string;
  rivalry_name: string | null;
  manager1_wins: number;
  manager2_wins: number;
  created_at: string;
}

export interface Bet {
  id: string;
  season_id: string | null;
  description: string;
  participants: string[];
  stakes: string;
  winner_id: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  resolved_at: string | null;
}

export interface Highlight {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string;
  is_pinned: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  created_at: string;
}

export interface MediaFolder {
  id: string;
  title: string;
  description: string | null;
  folder_url: string;
  thumbnail_url: string | null;
  season_year: number | null;
  created_at: string;
}
