"use client";

import { useState, useMemo } from 'react';
import { ChevronLeft, Trophy, Calendar, Users, Coins, TrendingUp, Clock, Search } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { YouTubeVideo } from './YouTubeVideo';
import { getHackathonById, getProjectsForHackathon } from '@/utils/dataLoader';

interface HackathonDetailsProps {
  hackathonId: string;
  onViewProject: (projectId: string) => void;
  onBack: () => void;
}

export function HackathonDetails({ hackathonId, onViewProject, onBack }: HackathonDetailsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load hackathon and projects from JSON files
  const hackathon = useMemo(() => getHackathonById(hackathonId), [hackathonId]);
  const allProjects = useMemo(() => getProjectsForHackathon(hackathonId), [hackathonId]);

  if (!hackathon) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <p className="text-white mb-4">Hackathon not found</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all"
          >
            Back to Hackathons
          </button>
        </div>
      </div>
    );
  }

  const projects = allProjects.filter(project => 
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeRemaining = () => {
    const now = new Date();
    const endTime = new Date(hackathon.endDate);
    const diffMs = endTime.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor((diffMs % 86400000) / 3600000);
    return { days: diffDays, hours: diffHours };
  };

  const timeLeft = getTimeRemaining();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 lg:pb-8">
      {/* Back Navigation */}
      <div className="mb-4 md:mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 md:gap-3 text-slate-400 hover:text-white transition-colors group"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800/80 backdrop-blur-sm group-hover:bg-slate-800 flex items-center justify-center transition-colors border border-slate-700/50 group-hover:border-slate-600">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-sm md:text-base">Back to Hackathons</div>
            <div className="text-xs text-slate-500 hidden md:block">Explore more events</div>
          </div>
        </button>
      </div>

      {/* Hackathon Hero */}
      <div className="relative aspect-[21/9] md:aspect-[3/1] rounded-xl md:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/50 mb-6 md:mb-8">
        {hackathon.videoUrl ? (
          <YouTubeVideo 
            videoUrl={hackathon.videoUrl}
            className="w-full h-full"
            title={hackathon.name}
          />
        ) : (
          <>
            <ImageWithFallback 
              src={hackathon.thumbnail}
              alt={hackathon.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          </>
        )}
        
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
          <div className="text-slate-400 text-sm md:text-base mb-2">{hackathon.organizer}</div>
          <h1 className="text-white text-2xl md:text-4xl mb-2 md:mb-3">{hackathon.name}</h1>
          <p className="text-purple-300 text-base md:text-xl mb-4">{hackathon.tagline}</p>
          
          <div className="flex flex-wrap gap-2">
            {hackathon.categories.map((category, i) => (
              <span 
                key={i}
                className="bg-slate-800/80 backdrop-blur-sm text-slate-200 text-xs md:text-sm px-3 py-1.5 rounded-lg border border-slate-700/50"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            <span className="text-xs md:text-sm">Prize Pool</span>
          </div>
          <div className="text-white text-xl md:text-3xl">${(hackathon.totalPrizePool / 1000).toFixed(0)}K</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            <span className="text-xs md:text-sm">Projects</span>
          </div>
          <div className="text-white text-xl md:text-3xl">{hackathon.totalProjects}</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Coins className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            <span className="text-xs md:text-sm">Total Staked</span>
          </div>
          <div className="text-white text-xl md:text-3xl">{(hackathon.totalStaked / 1000).toFixed(0)}K</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
            <span className="text-xs md:text-sm">Time Left</span>
          </div>
          <div className="text-white text-xl md:text-3xl">{timeLeft.days}d {timeLeft.hours}h</div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 md:mb-8">
        <div className="relative">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-white text-xl md:text-2xl mb-2">Competing Projects</h2>
        <p className="text-slate-400 text-sm md:text-base">Explore and stake on your favorite projects</p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onView={onViewProject} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-slate-600 text-6xl mb-4">🔍</div>
          <p className="text-slate-400 text-lg mb-2">No projects found</p>
          <p className="text-slate-500">Try adjusting your search term</p>
        </div>
      )}
    </div>
  );
}
