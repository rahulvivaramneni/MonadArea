"use client";

import { useState, useMemo } from 'react';
import { HackathonCard } from './HackathonCard';
import { TrendingUp, Clock, CheckCircle2, Search, Calendar } from 'lucide-react';
import { getAllHackathonsArray } from '@/utils/dataLoader';

interface HackathonListProps {
  onViewHackathon: (hackathonId: string) => void;
}

export function HackathonList({ onViewHackathon }: HackathonListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load hackathons from JSON files
  const allHackathons = useMemo(() => getAllHackathonsArray(), []);

  const filteredHackathons = allHackathons.filter(hackathon => {
    const matchesFilter = filter === 'all' || hackathon.status === filter;
    const matchesSearch = hackathon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = allHackathons.filter(h => h.status === 'active').length;
  const upcomingCount = allHackathons.filter(h => h.status === 'upcoming').length;
  const endedCount = allHackathons.filter(h => h.status === 'ended').length;
  const totalPrizes = allHackathons.reduce((sum, h) => sum + h.totalPrizePool, 0);
  const totalProjects = allHackathons.reduce((sum, h) => sum + h.totalProjects, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 lg:pb-10">
      {/* Hero Section */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md animate-pulse"></div>
            <div className="relative w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-400 rounded-full"></div>
          </div>
          <span className="text-emerald-400 text-sm md:text-base">{activeCount} HACKATHONS LIVE</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-white text-3xl md:text-5xl mb-2 md:mb-3 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              Hackathon Arena
            </h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-2xl">
              Discover hackathons, explore innovative projects, and stake on winning teams.
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hackathons..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 mb-1 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              <span className="text-xs md:text-sm">Active</span>
            </div>
            <div className="text-white text-2xl md:text-3xl mb-0.5 md:mb-1">{activeCount}</div>
            <div className="text-emerald-400 text-xs md:text-sm">Live now</div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 mb-1 md:mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <span className="text-xs md:text-sm">Upcoming</span>
            </div>
            <div className="text-white text-2xl md:text-3xl mb-0.5 md:mb-1">{upcomingCount}</div>
            <div className="text-slate-400 text-xs md:text-sm">Starting soon</div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 mb-1 md:mb-2">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              <span className="text-xs md:text-sm">Total Prizes</span>
            </div>
            <div className="text-white text-2xl md:text-3xl mb-0.5 md:mb-1">${(totalPrizes / 1000).toFixed(0)}K</div>
            <div className="text-slate-400 text-xs md:text-sm">in rewards</div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl md:rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 mb-1 md:mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
              <span className="text-xs md:text-sm">Projects</span>
            </div>
            <div className="text-white text-2xl md:text-3xl mb-0.5 md:mb-1">{totalProjects}</div>
            <div className="text-slate-400 text-xs md:text-sm">submitted</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
        {(['all', 'active', 'upcoming', 'ended'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 md:px-6 py-2 md:py-2.5 capitalize rounded-lg md:rounded-xl transition-all text-sm md:text-base ${
              filter === tab
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHackathons.map(hackathon => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} onView={onViewHackathon} />
        ))}
      </div>

      {filteredHackathons.length === 0 && (
        <div className="text-center py-20">
          <div className="text-slate-600 text-6xl mb-4">🔍</div>
          <p className="text-slate-400 text-lg mb-2">No hackathons found</p>
          <p className="text-slate-500">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
}
