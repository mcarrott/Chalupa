const SLEEPER_API_BASE = 'https://api.sleeper.app/v1';
const LEAGUE_ID = import.meta.env.VITE_SLEEPER_LEAGUE_ID;

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_against: number;
  };
  players: string[];
}

export interface SleeperMatchup {
  roster_id: number;
  matchup_id: number;
  points: number;
  players_points?: Record<string, number>;
}

export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  settings: {
    playoff_week_start: number;
  };
}

export interface RosterWithUser extends SleeperRoster {
  user?: SleeperUser;
}

export async function getLeagueInfo(): Promise<SleeperLeague | null> {
  if (!LEAGUE_ID || LEAGUE_ID === 'your_sleeper_league_id_here') {
    return null;
  }

  try {
    const response = await fetch(`${SLEEPER_API_BASE}/league/${LEAGUE_ID}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching league info:', error);
    return null;
  }
}

export async function getLeagueRosters(): Promise<SleeperRoster[]> {
  if (!LEAGUE_ID || LEAGUE_ID === 'your_sleeper_league_id_here') {
    return [];
  }

  try {
    const response = await fetch(`${SLEEPER_API_BASE}/league/${LEAGUE_ID}/rosters`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching rosters:', error);
    return [];
  }
}

export async function getLeagueUsers(): Promise<SleeperUser[]> {
  if (!LEAGUE_ID || LEAGUE_ID === 'your_sleeper_league_id_here') {
    return [];
  }

  try {
    const response = await fetch(`${SLEEPER_API_BASE}/league/${LEAGUE_ID}/users`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getMatchups(week: number): Promise<SleeperMatchup[]> {
  if (!LEAGUE_ID || LEAGUE_ID === 'your_sleeper_league_id_here') {
    return [];
  }

  try {
    const response = await fetch(`${SLEEPER_API_BASE}/league/${LEAGUE_ID}/matchups/${week}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching matchups:', error);
    return [];
  }
}

export async function getCurrentWeek(): Promise<number> {
  try {
    const response = await fetch('https://api.sleeper.app/v1/state/nfl');
    if (!response.ok) return 1;
    const data = await response.json();
    return data.week || 1;
  } catch (error) {
    console.error('Error fetching current week:', error);
    return 1;
  }
}

export async function getStandingsWithUsers(): Promise<RosterWithUser[]> {
  const [rosters, users] = await Promise.all([
    getLeagueRosters(),
    getLeagueUsers(),
  ]);

  const rostersWithUsers = rosters.map(roster => ({
    ...roster,
    user: users.find(user => user.user_id === roster.owner_id),
  }));

  return rostersWithUsers.sort((a, b) => {
    const aWinPct = a.settings.wins / (a.settings.wins + a.settings.losses + a.settings.ties || 1);
    const bWinPct = b.settings.wins / (b.settings.wins + b.settings.losses + b.settings.ties || 1);

    if (aWinPct !== bWinPct) return bWinPct - aWinPct;
    return b.settings.fpts - a.settings.fpts;
  });
}
