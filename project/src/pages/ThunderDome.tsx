import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Rivalry, Bet, Manager } from '../types/database';
import { Flame, DollarSign, Users, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function ThunderDome() {
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [rivalriesRes, betsRes, managersRes] = await Promise.all([
        supabase.from('rivalries').select('*').order('created_at', { ascending: false }),
        supabase.from('bets').select('*').order('created_at', { ascending: false }),
        supabase.from('managers').select('*'),
      ]);

      if (rivalriesRes.data) setRivalries(rivalriesRes.data);
      if (betsRes.data) setBets(betsRes.data);
      if (managersRes.data) setManagers(managersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getManagerName = (id: string) => {
    return managers.find(m => m.id === id)?.name || 'Unknown';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Flame className="h-12 w-12 text-orange-500 animate-pulse" />
            <h1 className="text-5xl font-bold text-white">Thunder Dome</h1>
            <Flame className="h-12 w-12 text-orange-500 animate-pulse" />
          </div>
          <p className="text-xl text-slate-300">Where rivalries ignite and bets are settled</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-7 w-7 text-orange-500" />
              <h2 className="text-3xl font-bold text-white">Rivalries</h2>
            </div>

            {rivalries.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
                <p className="text-slate-400">No rivalries yet. Let the trash talk begin!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rivalries.map((rivalry) => {
                  const manager1 = managers.find(m => m.id === rivalry.manager1_id);
                  const manager2 = managers.find(m => m.id === rivalry.manager2_id);
                  const totalGames = rivalry.manager1_wins + rivalry.manager2_wins;

                  return (
                    <div
                      key={rivalry.id}
                      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-all duration-300"
                    >
                      {rivalry.rivalry_name && (
                        <h3 className="text-xl font-bold text-amber-500 mb-4 text-center">
                          {rivalry.rivalry_name}
                        </h3>
                      )}

                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-center">
                          <p className="text-lg font-bold text-white mb-1">
                            {manager1?.name || 'Unknown'}
                          </p>
                          <div className="text-3xl font-bold text-amber-500">
                            {rivalry.manager1_wins}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <Flame className="h-8 w-8 text-orange-500 mb-2" />
                          <div className="text-slate-400 text-sm">
                            {totalGames} {totalGames === 1 ? 'game' : 'games'}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-lg font-bold text-white mb-1">
                            {manager2?.name || 'Unknown'}
                          </p>
                          <div className="text-3xl font-bold text-amber-500">
                            {rivalry.manager2_wins}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="h-7 w-7 text-green-500" />
              <h2 className="text-3xl font-bold text-white">Bets & Wagers</h2>
            </div>

            {bets.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
                <p className="text-slate-400">No bets recorded. Put your money where your mouth is!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bets.map((bet) => {
                  const participantNames = bet.participants
                    .map(id => getManagerName(id))
                    .join(', ');

                  return (
                    <div
                      key={bet.id}
                      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-green-500 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-white flex-1">
                          {bet.description}
                        </h3>
                        {getStatusIcon(bet.status)}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Participants: </span>
                          <span className="text-white">{participantNames}</span>
                        </div>

                        <div>
                          <span className="text-slate-400">Stakes: </span>
                          <span className="text-green-400 font-semibold">{bet.stakes}</span>
                        </div>

                        {bet.winner_id && (
                          <div>
                            <span className="text-slate-400">Winner: </span>
                            <span className="text-amber-500 font-bold">
                              {getManagerName(bet.winner_id)}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                          <span className="text-slate-500 text-xs">
                            {new Date(bet.created_at).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            bet.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            bet.status === 'active' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {bet.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
