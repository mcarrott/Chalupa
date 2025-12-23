import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Season, SeasonPlacement, Manager } from '../types/database';
import { Trophy, Award, Frown, Medal, ArrowUpDown, AlertCircle } from 'lucide-react';

interface SeasonWithDetails extends Season {
  champion?: Manager;
  runner_up?: Manager;
  sacko?: Manager;
  placements: (SeasonPlacement & { manager?: Manager })[];
}

type SortColumn = 'name' | 'legacy_points' | 'lp_avg' | 'total_seasons' | 'championships' | 'last_place_finishes';

export default function Legacy() {
  const [seasons, setSeasons] = useState<SeasonWithDetails[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<SortColumn>('legacy_points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadSeasons();
  }, []);

  async function loadSeasons() {
    try {
      const [seasonsRes, placementsRes, managersRes] = await Promise.all([
        supabase.from('seasons').select('*').order('year', { ascending: false }),
        supabase.from('season_placements').select('*'),
        supabase.from('managers').select('*'),
      ]);

      if (seasonsRes.data && placementsRes.data && managersRes.data) {
        const enrichedSeasons = seasonsRes.data.map(season => ({
          ...season,
          champion: managersRes.data.find(m => m.id === season.champion_id),
          runner_up: managersRes.data.find(m => m.id === season.runner_up_id),
          sacko: managersRes.data.find(m => m.id === season.sacko_id),
          placements: placementsRes.data
            .filter(p => p.season_id === season.id)
            .map(p => ({
              ...p,
              manager: managersRes.data.find(m => m.id === p.manager_id),
            }))
            .sort((a, b) => a.placement - b.placement),
        }));

        setSeasons(enrichedSeasons);
        setManagers(managersRes.data);
      }
    } catch (error) {
      console.error('Error loading seasons:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortedManagers = () => {
    return [...managers].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortColumn) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'legacy_points':
          aValue = a.legacy_points;
          bValue = b.legacy_points;
          break;
        case 'lp_avg':
          aValue = a.total_seasons > 0 ? a.legacy_points / a.total_seasons : 0;
          bValue = b.total_seasons > 0 ? b.legacy_points / b.total_seasons : 0;
          break;
        case 'total_seasons':
          aValue = a.total_seasons;
          bValue = b.total_seasons;
          break;
        case 'championships':
          aValue = a.championships;
          bValue = b.championships;
          break;
        case 'last_place_finishes':
          aValue = a.last_place_finishes;
          bValue = b.last_place_finishes;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  const getPlacementColor = (placement: number) => {
    if (placement === 1) return 'text-amber-500';
    if (placement === 2) return 'text-slate-400';
    if (placement === 3) return 'text-orange-600';
    return 'text-slate-300';
  };

  const getPlacementIcon = (placement: number) => {
    if (placement === 1) return <Trophy className="h-5 w-5" />;
    if (placement === 2) return <Medal className="h-5 w-5" />;
    if (placement === 3) return <Award className="h-5 w-5" />;
    return null;
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-slate-300">This application needs to be configured with Supabase credentials to work properly.</p>
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

  const sortedManagers = getSortedManagers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="h-10 w-10 text-amber-500" />
            <h1 className="text-5xl font-bold text-white">League Legacy</h1>
            <Trophy className="h-10 w-10 text-amber-500" />
          </div>
          <p className="text-xl text-slate-300">A complete history of champions, challengers, and the fallen</p>
        </div>

        {managers.length > 0 && (
          <div className="mb-12">
            <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Power Rankings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700">
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors font-semibold"
                        >
                          <span>Manager</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSort('legacy_points')}
                          className="flex items-center justify-center space-x-2 text-slate-300 hover:text-white transition-colors font-semibold mx-auto"
                        >
                          <span>Legacy Points</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSort('lp_avg')}
                          className="flex items-center justify-center space-x-2 text-slate-300 hover:text-white transition-colors font-semibold mx-auto"
                        >
                          <span>LP Avg</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSort('total_seasons')}
                          className="flex items-center justify-center space-x-2 text-slate-300 hover:text-white transition-colors font-semibold mx-auto"
                        >
                          <span>Seasons</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSort('championships')}
                          className="flex items-center justify-center space-x-2 text-slate-300 hover:text-white transition-colors font-semibold mx-auto"
                        >
                          <span>Chips</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSort('last_place_finishes')}
                          className="flex items-center justify-center space-x-2 text-slate-300 hover:text-white transition-colors font-semibold mx-auto"
                        >
                          <span>Mannies</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedManagers.map((manager, index) => {
                      const lpAvg = manager.total_seasons > 0
                        ? (manager.legacy_points / manager.total_seasons).toFixed(2)
                        : '0.00';

                      return (
                        <tr
                          key={manager.id}
                          className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                            index === 0 ? 'bg-amber-500/10' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-slate-400 font-semibold text-lg">#{index + 1}</span>
                              <span className="text-white font-semibold">{manager.name}</span>
                              {index === 0 && <Trophy className="h-5 w-5 text-amber-500" />}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-white font-bold">
                            {manager.legacy_points}
                          </td>
                          <td className="px-6 py-4 text-center text-white font-semibold">
                            {lpAvg}
                          </td>
                          <td className="px-6 py-4 text-center text-white">
                            {manager.total_seasons}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold ${manager.championships > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                              {manager.championships}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold ${manager.last_place_finishes > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                              {manager.last_place_finishes}
                            </span>
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

        {seasons.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700">
            <Trophy className="h-20 w-20 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No seasons recorded yet. History awaits!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {seasons.map((season) => (
              <div
                key={season.id}
                className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-600">
                  <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                    <span>{season.year} Season</span>
                    {season.champion && (
                      <span className="text-amber-500 text-xl">
                        👑 {season.champion.name}
                      </span>
                    )}
                  </h2>
                  {season.notes && (
                    <p className="text-slate-300 mt-2">{season.notes}</p>
                  )}
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {season.champion && (
                      <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg p-4 border border-amber-500/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <Trophy className="h-5 w-5 text-amber-500" />
                          <span className="text-sm font-semibold text-amber-500">CHAMPION</span>
                        </div>
                        <p className="text-xl font-bold text-white">{season.champion.name}</p>
                      </div>
                    )}

                    {season.runner_up && (
                      <div className="bg-gradient-to-br from-slate-600/20 to-slate-500/20 rounded-lg p-4 border border-slate-500/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <Medal className="h-5 w-5 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-400">RUNNER-UP</span>
                        </div>
                        <p className="text-xl font-bold text-white">{season.runner_up.name}</p>
                      </div>
                    )}

                    {season.sacko && (
                      <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg p-4 border border-red-500/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <Frown className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-semibold text-red-500">LAST PLACE</span>
                        </div>
                        <p className="text-xl font-bold text-white">{season.sacko.name}</p>
                      </div>
                    )}
                  </div>

                  {season.placements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Final Standings</h3>
                      <div className="space-y-2">
                        {season.placements.map((placement) => (
                          <div
                            key={placement.id}
                            className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-900/70 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`flex items-center space-x-2 font-bold text-xl ${getPlacementColor(placement.placement)} min-w-[60px]`}>
                                {getPlacementIcon(placement.placement)}
                                <span>#{placement.placement}</span>
                              </div>
                              <div>
                                <p className="text-white font-semibold">
                                  {placement.manager?.name || 'Unknown'}
                                </p>
                                <p className="text-slate-400 text-sm">
                                  {placement.regular_season_wins}-{placement.regular_season_losses}
                                  {' • '}
                                  {placement.points_for.toFixed(2)} PF
                                </p>
                              </div>
                            </div>
                            <div className="text-right text-sm text-slate-400">
                              <div>Points Against: {placement.points_against.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
