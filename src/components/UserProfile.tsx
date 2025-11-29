"use client";

import { UserStake } from '@/types';
import { Coins, TrendingUp, Activity, Trophy, Award, Handshake, BarChart3, Target } from 'lucide-react';
import { ClaimRewards } from './ClaimRewards';
import { useMemo } from 'react';

interface UserProfileProps {
  balance: number;
  stakes: UserStake[];
}

export function UserProfile({ balance, stakes }: UserProfileProps) {
  const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
  const totalPotentialWin = stakes.reduce((sum, stake) => sum + stake.potentialWin, 0);

  const getOutcomeIcon = (outcome: string) => {
    if (outcome === 'winPrize') return <Trophy className="w-4 h-4 text-yellow-400" />;
    if (outcome === 'finalist') return <Award className="w-4 h-4 text-purple-400" />;
    return <Handshake className="w-4 h-4 text-blue-400" />;
  };

  const getOutcomeLabel = (outcome: string) => {
    if (outcome === 'winPrize') return 'Win Prize';
    if (outcome === 'finalist') return 'Finalist';
    return 'VC Meeting';
  };

  const getOutcomeColor = (outcome: string) => {
    if (outcome === 'winPrize') return 'text-yellow-400';
    if (outcome === 'finalist') return 'text-purple-400';
    return 'text-blue-400';
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Group stakes by hackathon for better display
  const stakesByHackathon = stakes.reduce((acc, stake) => {
    if (!acc[stake.hackathonId]) {
      acc[stake.hackathonId] = [];
    }
    acc[stake.hackathonId].push(stake);
    return acc;
  }, {} as Record<string, typeof stakes>);

  // Get unique hackathon IDs for claim rewards
  const hackathonIds = useMemo(() => {
    return Array.from(new Set(stakes.map((s) => s.hackathonId)));
  }, [stakes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 lg:pb-10">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-white text-5xl mb-3 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-slate-400 text-lg">Track your stakes and performance</p>
      </div>

      {/* Claim Rewards Section */}
      {hackathonIds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">Available Rewards</h2>
          <div className="space-y-4">
            {hackathonIds.map((hackathonId) => (
              <ClaimRewards key={hackathonId} hackathonId={hackathonId} />
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-yellow-400" />
              </div>
              <span>Balance</span>
            </div>
            <div className="text-white text-3xl mb-1">{balance.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">$MON available</div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <span>Active Stakes</span>
            </div>
            <div className="text-white text-3xl mb-1">{stakes.length}</div>
            <div className="text-slate-400 text-sm">open positions</div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <span>Total Staked</span>
            </div>
            <div className="text-white text-3xl mb-1">{totalStaked.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">$MON locked</div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <span>Potential</span>
            </div>
            <div className="text-white text-3xl mb-1">{totalPotentialWin.toLocaleString()}</div>
            <div className="text-emerald-400 text-sm">
              +{totalStaked > 0 ? ((totalPotentialWin / totalStaked - 1) * 100).toFixed(0) : 0}% ROI
            </div>
          </div>
        </div>
      </div>

      {/* Active Stakes */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden mb-8">
        <div className="px-8 py-6 bg-slate-800/30 border-b border-slate-700/50">
          <h2 className="text-white text-xl">Active Stakes</h2>
          <p className="text-slate-400 text-sm mt-1">Your current predictions</p>
        </div>

        {stakes.length === 0 ? (
          <div className="px-8 py-20 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 mb-2">No active stakes</p>
            <p className="text-slate-500 text-sm mb-6">Visit the Arena to place your first stake!</p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all">
              Explore Projects
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {stakes.map((stake, index) => (
              <div key={index} className="px-8 py-6 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {getOutcomeIcon(stake.outcome)}
                      <span className={`${getOutcomeColor(stake.outcome)}`}>
                        {getOutcomeLabel(stake.outcome)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-sm">
                        Hackathon #{stake.hackathonId} - Project #{stake.projectId}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-slate-500 text-sm mb-1">Staked</div>
                        <div className="text-white">{stake.amount} $MON</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-sm mb-1">Potential Win</div>
                        <div className="text-emerald-400">{stake.potentialWin.toFixed(2)} $MON</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-sm mb-1">ROI</div>
                        <div className="text-purple-400">
                          +{((stake.potentialWin / stake.amount - 1) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm px-3 py-1.5 rounded-lg mb-2">
                      Pending
                    </div>
                    <div className="text-slate-500 text-sm">{getTimeAgo(stake.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8">
          <h3 className="text-white text-xl mb-6">Stake Distribution</h3>
          <div className="space-y-5">
            {['Win Prize', 'Finalist', 'VC Meeting'].map(outcome => {
              const count = stakes.filter(s => getOutcomeLabel(s.outcome) === outcome).length;
              const percentage = stakes.length > 0 ? (count / stakes.length) * 100 : 0;
              const getColor = () => {
                if (outcome === 'Win Prize') return 'bg-yellow-500';
                if (outcome === 'Finalist') return 'bg-purple-500';
                return 'bg-blue-500';
              };
              
              return (
                <div key={outcome}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">{outcome}</span>
                    <span className="text-white">{count} stakes ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`${getColor()} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8">
          <h3 className="text-white text-xl mb-6">Quick Stats</h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
              <span className="text-slate-400">Average Stake</span>
              <span className="text-white text-lg">
                {stakes.length > 0 ? (totalStaked / stakes.length).toFixed(0) : 0} $MON
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
              <span className="text-slate-400">Largest Stake</span>
              <span className="text-white text-lg">
                {stakes.length > 0 ? Math.max(...stakes.map(s => s.amount)) : 0} $MON
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
              <span className="text-slate-400">Portfolio ROI</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-lg">
                  {totalStaked > 0 ? ((totalPotentialWin / totalStaked - 1) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
