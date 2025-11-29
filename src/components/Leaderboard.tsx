"use client";

import { Trophy, TrendingUp, Medal, Award, Crown, Sparkles } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  username: string;
  totalWinnings: number;
  totalStaked: number;
  winRate: number;
  roi: number;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, username: 'crypto_whale', totalWinnings: 156800, totalStaked: 89000, winRate: 68, roi: 176 },
  { rank: 2, username: 'stake_master_pro', totalWinnings: 142300, totalStaked: 95000, winRate: 62, roi: 150 },
  { rank: 3, username: 'degen_king', totalWinnings: 128900, totalStaked: 78000, winRate: 71, roi: 165 },
  { rank: 4, username: 'monad_believer', totalWinnings: 98500, totalStaked: 65000, winRate: 58, roi: 152 },
  { rank: 5, username: 'vc_hunter_x', totalWinnings: 87600, totalStaked: 54000, winRate: 65, roi: 162 },
  { rank: 6, username: 'anon_trader', totalWinnings: 76200, totalStaked: 48000, winRate: 61, roi: 159 },
  { rank: 7, username: 'blockchain_bro', totalWinnings: 65800, totalStaked: 42000, winRate: 59, roi: 157 },
  { rank: 8, username: 'stake_lord', totalWinnings: 54300, totalStaked: 38000, winRate: 56, roi: 143 },
  { rank: 9, username: 'crypto_degen', totalWinnings: 48900, totalStaked: 32000, winRate: 63, roi: 153 },
  { rank: 10, username: 'monad_maxi', totalWinnings: 42100, totalStaked: 28000, winRate: 60, roi: 150 },
];

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 md:w-7 md:h-7 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />;
    return <div className="w-5 h-5 md:w-7 md:h-7 flex items-center justify-center text-slate-400 text-sm md:text-base">{rank}</div>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10';
    if (rank === 2) return 'bg-gradient-to-r from-slate-400/10 to-slate-500/10 border-slate-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/10 to-amber-700/10 border-amber-600/30';
    return 'bg-slate-800/30 border-slate-700/50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 lg:pb-10">
      {/* Header */}
      <div className="mb-6 md:mb-12">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 rounded-xl md:rounded-2xl blur-md md:blur-lg opacity-30"></div>
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Trophy className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
          <h1 className="text-white text-3xl md:text-5xl bg-gradient-to-r from-white via-yellow-100 to-amber-100 bg-clip-text text-transparent">
            Leaderboard
          </h1>
        </div>
        <p className="text-slate-400 text-sm md:text-lg">
          Top stakers ranked by total winnings this season
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Total Volume</div>
            <div className="text-white text-xl md:text-3xl mb-0.5 md:mb-1">8.4M</div>
            <div className="text-emerald-400 text-xs md:text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
              +12.5%
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Active Stakers</div>
            <div className="text-white text-xl md:text-3xl mb-0.5 md:mb-1">2,847</div>
            <div className="text-emerald-400 text-xs md:text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
              +8.3%
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Avg Win Rate</div>
            <div className="text-white text-xl md:text-3xl mb-0.5 md:mb-1">62%</div>
            <div className="text-slate-400 text-xs md:text-sm">across all users</div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Total Prizes</div>
            <div className="text-white text-xl md:text-3xl mb-0.5 md:mb-1">3.2M</div>
            <div className="text-slate-400 text-xs md:text-sm">distributed</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table - Desktop */}
      <div className="hidden md:block bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-slate-800/50 border-b border-slate-700/50">
          <div className="col-span-1 text-slate-400 text-sm">Rank</div>
          <div className="col-span-3 text-slate-400 text-sm">User</div>
          <div className="col-span-2 text-slate-400 text-sm text-right">Winnings</div>
          <div className="col-span-2 text-slate-400 text-sm text-right">Staked</div>
          <div className="col-span-2 text-slate-400 text-sm text-right">Win Rate</div>
          <div className="col-span-2 text-slate-400 text-sm text-right">ROI</div>
        </div>

        {/* User Rows */}
        <div className="divide-y divide-slate-800/50">
          {MOCK_LEADERBOARD.map((user) => (
            <div
              key={user.rank}
              className={`grid grid-cols-12 gap-4 px-8 py-5 border hover:bg-slate-800/30 transition-all ${getRankBg(user.rank)}`}
            >
              <div className="col-span-1 flex items-center">
                {getRankIcon(user.rank)}
              </div>
              <div className="col-span-3 flex items-center">
                <span className="text-white">{user.username}</span>
                {user.rank === 1 && <Sparkles className="w-4 h-4 text-yellow-400 ml-2" />}
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div>
                  <div className="text-emerald-400">{(user.totalWinnings / 1000).toFixed(1)}K</div>
                  <div className="text-slate-500 text-xs">$MON</div>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div>
                  <div className="text-white">{(user.totalStaked / 1000).toFixed(1)}K</div>
                  <div className="text-slate-500 text-xs">$MON</div>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="text-white">{user.winRate}%</div>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">{user.roi}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {MOCK_LEADERBOARD.map((user) => (
          <div
            key={user.rank}
            className={`relative border rounded-xl p-4 transition-all ${getRankBg(user.rank)}`}
          >
            {/* Top Row: Rank, User, Winnings */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white">{user.username}</span>
                    {user.rank === 1 && <Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
                  </div>
                  <div className="text-xs text-slate-500">Rank #{user.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400">{(user.totalWinnings / 1000).toFixed(1)}K</div>
                <div className="text-xs text-slate-500">$MON</div>
              </div>
            </div>

            {/* Bottom Row: Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-700/50">
              <div>
                <div className="text-xs text-slate-400 mb-1">Staked</div>
                <div className="text-white text-sm">{(user.totalStaked / 1000).toFixed(1)}K</div>
                <div className="text-xs text-slate-500">$MON</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Win Rate</div>
                <div className="text-white text-sm">{user.winRate}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1">ROI</div>
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-sm">{user.roi}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Your Rank */}
      <div className="relative mt-6 md:mt-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
        <div className="relative bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl md:rounded-2xl p-5 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <div>
              <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Your Current Rank</div>
              <div className="text-white text-2xl md:text-3xl">#247</div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Total Winnings</div>
              <div className="text-purple-400 text-2xl md:text-3xl">12.8K $MON</div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Win Rate</div>
              <div className="text-white text-2xl md:text-3xl">64%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
