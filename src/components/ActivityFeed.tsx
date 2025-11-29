"use client";

import { useEffect, useState } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { useWatchContractEvent, useLogs } from 'wagmi';
import { formatUnits } from 'viem';
import { STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI, OUTCOME_MAP } from '@/config/contracts';

interface ActivityItem {
  user: string;
  outcome: string;
  amount: number;
  odds: number;
  timestamp: number;
}

interface ActivityFeedProps {
  hackathonId?: string;
  projectId?: string;
}

export function ActivityFeed({ hackathonId, projectId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Watch for new StakePlaced events
  useWatchContractEvent({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    eventName: 'StakePlaced',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const eventHackathonId = log.args.hackathonId as string;
        const eventProjectId = log.args.projectId as string;
        
        // Only show activity for the current hackathon/project if specified
        if (hackathonId && eventHackathonId !== hackathonId) return;
        if (projectId && eventProjectId !== projectId) return;
        
        // For Monad Biliz 2 Bengaluru (hackathon ID "6"), only show real activity from blockchain
        // No mocked data for this hackathon
        if (hackathonId === "6" || eventHackathonId === "6") {
          const amount = parseFloat(formatUnits(log.args.amount as bigint, 18));
          const outcomeValue = log.args.outcome as number;
          const outcomeLabels = ['Win Prize', 'Finalist', 'VC Meeting'];
          const outcome = outcomeLabels[outcomeValue] || 'Unknown';
          
          // Get odds from project data (we'll need to pass this or fetch it)
          // For now, use default odds
          const defaultOdds = [2.0, 1.5, 2.0];
          const odds = defaultOdds[outcomeValue] || 2.0;
          
          const userAddress = log.args.user as string;
          const user = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
          const timestamp = Number(log.args.timestamp) * 1000; // Convert to milliseconds
          
          const newActivity: ActivityItem = {
            user,
            outcome,
            amount,
            odds,
            timestamp,
          };
          
          setActivities(prev => {
            // Avoid duplicates
            const exists = prev.some(
              a => a.user === user && a.timestamp === timestamp && a.amount === amount
            );
            if (exists) return prev;
            return [newActivity, ...prev].slice(0, 20); // Keep last 20 activities
          });
        }
      });
    },
  });

  // For Monad Biliz 2 Bengaluru (hackathon ID "6"), only show real activity
  // No mocked data will be shown for this hackathon

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getOutcomeColor = (outcome: string) => {
    if (outcome === 'Win Prize') return 'text-yellow-400';
    if (outcome === 'Finalist') return 'text-purple-400';
    return 'text-blue-400';
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-400" />
          <h3 className="text-white text-xl">Recent Activity</h3>
        </div>
        {activities.length > 0 && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-xs">Live</span>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No recent activity</p>
            <p className="text-slate-500 text-xs mt-1">Be the first to stake on this project!</p>
          </div>
        ) : (
          activities.map((activity, i) => (
          <div 
            key={i}
            className="group flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-all border border-slate-700/30 hover:border-slate-600/50"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-purple-400 truncate">{activity.user}</span>
                <span className="text-slate-500 text-sm">staked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white">{activity.amount.toLocaleString()}</span>
                <span className="text-slate-400 text-sm">$MON on</span>
                <span className={`text-sm ${getOutcomeColor(activity.outcome)}`}>
                  {activity.outcome}
                </span>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="flex items-center gap-1 justify-end mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{activity.odds}x</span>
              </div>
              <span className="text-slate-500 text-xs">{getTimeAgo(activity.timestamp)}</span>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
