import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Highlight, Event } from '../types/database';
import { Calendar, MapPin, TrendingUp, Pin, Trophy, Target, AlertCircle } from 'lucide-react';
import { getStandingsWithUsers, getMatchups, getCurrentWeek, RosterWithUser, SleeperMatchup } from '../lib/sleeper';

interface MatchupPair {
  matchup_id: number;
  team1: SleeperMatchup & { roster?: RosterWithUser };
  team2?: SleeperMatchup & { roster?: RosterWithUser };
}

export default function Home() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [standings, setStandings] = useState<RosterWithUser[]>([]);
  const [matchups, setMatchups] = useState<MatchupPair[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [highlightsRes, eventsRes, week] = await Promise.all([
        supabase
          .from('highlights')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('date', { ascending: false })
          .limit(6),
        supabase
          .from('events')
          .select('*')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(5),
        getCurrentWeek(),
      ]);

      if (highlightsRes.data) setHighlights(highlightsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      setCurrentWeek(week);

      const [standingsData, matchupsData] = await Promise.all([
        getStandingsWithUsers(),
        getMatchups(week),
      ]);

      setStandings(standingsData);

      const matchupMap = new Map<number, MatchupPair>();
      matchupsData.forEach(matchup => {
        const roster = standingsData.find(r => r.roster_id === matchup.roster_id);
        const matchupWithRoster = { ...matchup, roster };

        if (matchupMap.has(matchup.matchup_id)) {
          const existing = matchupMap.get(matchup.matchup_id)!;
          existing.team2 = matchupWithRoster;
        } else {
          matchupMap.set(matchup.matchup_id, {
            matchup_id: matchup.matchup_id,
            team1: matchupWithRoster,
          });
        }
      });

      setMatchups(Array.from(matchupMap.values()));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-slate-300 mb-6">
            This application needs to be configured with Supabase credentials to work properly.
          </p>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-left">
            <p className="text-sm text-slate-400 mb-2">Required environment variables:</p>
            <ul className="text-sm text-amber-500 space-y-1 font-mono">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
              <li>VITE_SLEEPER_LEAGUE_ID</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Chalupa Batman</span>
          </h1>
          <p className="text-xl text-slate-300">Where legends are made and rivalries never die</p>
        </div>

        {standings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="h-7 w-7 text-amber-500" />
              <h2 className="text-3xl font-bold text-white">Current Standings</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Team</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">Record</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">Points For</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">Points Against</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((roster, index) => {
                      const winPct = roster.settings.wins / (roster.settings.wins + roster.settings.losses + roster.settings.ties || 1);
                      return (
                        <tr
                          key={roster.roster_id}
                          className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                            index === 0 ? 'bg-amber-500/10' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400 font-semibold">#{index + 1}</span>
                              {index === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white font-semibold">
                              {roster.user?.display_name || roster.user?.username || 'Unknown Team'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-white font-semibold">
                              {roster.settings.wins}-{roster.settings.losses}
                              {roster.settings.ties > 0 && `-${roster.settings.ties}`}
                            </span>
                            <span className="text-slate-400 text-sm ml-2">
                              ({(winPct * 100).toFixed(0)}%)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-white font-semibold">
                            {roster.settings.fpts.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-300">
                            {roster.settings.fpts_against.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {matchups.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-7 w-7 text-amber-500" />
              <h2 className="text-3xl font-bold text-white">Week {currentWeek} Matchups</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchups.map((matchup) => (
                <div
                  key={matchup.matchup_id}
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">
                          {matchup.team1.roster?.user?.display_name || matchup.team1.roster?.user?.username || 'Team 1'}
                        </div>
                        <div className="text-sm text-slate-400">
                          {matchup.team1.roster?.settings.wins}-{matchup.team1.roster?.settings.losses}
                        </div>
                      </div>
                      <div className="px-4">
                        <div className={`text-2xl font-bold ${
                          matchup.team2 && matchup.team1.points > matchup.team2.points
                            ? 'text-green-500'
                            : matchup.team2 && matchup.team1.points < matchup.team2.points
                            ? 'text-red-500'
                            : 'text-white'
                        }`}>
                          {matchup.team1.points.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {matchup.team2 && (
                      <>
                        <div className="border-t border-slate-700 my-3"></div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-white font-semibold mb-1">
                              {matchup.team2.roster?.user?.display_name || matchup.team2.roster?.user?.username || 'Team 2'}
                            </div>
                            <div className="text-sm text-slate-400">
                              {matchup.team2.roster?.settings.wins}-{matchup.team2.roster?.settings.losses}
                            </div>
                          </div>
                          <div className="px-4">
                            <div className={`text-2xl font-bold ${
                              matchup.team2.points > matchup.team1.points
                                ? 'text-green-500'
                                : matchup.team2.points < matchup.team1.points
                                ? 'text-red-500'
                                : 'text-white'
                            }`}>
                              {matchup.team2.points.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-7 w-7 text-amber-500" />
              <h2 className="text-3xl font-bold text-white">League Highlights</h2>
            </div>

            {highlights.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
                <p className="text-slate-400">No highlights yet. Start making history!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {highlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20"
                  >
                    {highlight.image_url && (
                      <img
                        src={highlight.image_url}
                        alt={highlight.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{highlight.title}</h3>
                        {highlight.is_pinned && (
                          <Pin className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-300 mb-3">{highlight.description}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(highlight.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="h-7 w-7 text-amber-500" />
              <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
            </div>

            {events.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700">
                <p className="text-slate-400">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500 transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                    {event.description && (
                      <p className="text-slate-300 mb-3 text-sm">{event.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
