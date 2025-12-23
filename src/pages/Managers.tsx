import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Manager } from '../types/database';
import { Trophy, TrendingUp, Target, Award, Frown, Star, AlertCircle } from 'lucide-react';

export default function Managers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagers();
  }, []);

  async function loadManagers() {
    try {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .order('championships', { ascending: false });

      if (error) throw error;
      if (data) setManagers(data);
    } catch (error) {
      console.error('Error loading managers:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">League Managers</h1>
          <p className="text-xl text-slate-300">The competitors who make it all happen</p>
        </div>

        {managers.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700">
            <p className="text-slate-400 text-lg">No managers found. Time to recruit!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {managers.map((manager) => {
              const winPercentage = manager.total_seasons > 0
                ? ((manager.total_wins / (manager.total_wins + manager.total_losses)) * 100).toFixed(1)
                : '0.0';

              return (
                <div
                  key={manager.id}
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105"
                >
                  <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800">
                    {manager.profile_image_url ? (
                      <img
                        src={manager.profile_image_url}
                        alt={manager.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                          <span className="text-4xl font-bold text-white">
                            {manager.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    {manager.championships > 0 && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 font-bold shadow-lg">
                        <Trophy className="h-4 w-4" />
                        <span>{manager.championships}x</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-3">{manager.name}</h2>

                    {manager.quote && (
                      <div className="mb-4 p-3 bg-slate-900/50 rounded-lg border-l-4 border-amber-500">
                        <p className="text-slate-300 italic">"{manager.quote}"</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Trophy className="h-5 w-5 text-amber-500" />
                          <span>Championships</span>
                        </div>
                        <span className="text-white font-bold">{manager.championships}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span>Win Percentage</span>
                        </div>
                        <span className="text-white font-bold">{winPercentage}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Target className="h-5 w-5 text-blue-500" />
                          <span>Total Seasons</span>
                        </div>
                        <span className="text-white font-bold">{manager.total_seasons}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Award className="h-5 w-5 text-purple-500" />
                          <span>Playoff Appearances</span>
                        </div>
                        <span className="text-white font-bold">{manager.playoff_appearances}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span>Legacy Points</span>
                        </div>
                        <span className="text-white font-bold">{manager.legacy_points}</span>
                      </div>

                      {manager.last_place_finishes > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Frown className="h-5 w-5 text-red-500" />
                            <span>Mannies</span>
                          </div>
                          <span className="text-white font-bold">{manager.last_place_finishes}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-slate-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Career Record</span>
                          <span className="text-white font-bold">
                            {manager.total_wins}-{manager.total_losses}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
