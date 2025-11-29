"use client";

import { Project } from '@/types';
import { Coins, TrendingUp, ExternalLink, Github, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { YouTubeVideo } from './YouTubeVideo';

interface ProjectCardProps {
  project: Project;
  onView: (projectId: string) => void;
}

export function ProjectCard({ project, onView }: ProjectCardProps) {

  const topOutcome = Object.entries(project.outcomes).reduce((top, [key, value]) => 
    value.staked > top.staked ? { key, staked: value.staked, odds: value.odds } : top
  , { key: '', staked: 0, odds: 0 });

  const getOutcomeLabel = (key: string) => {
    if (key === 'winPrize') return 'Win Prize';
    if (key === 'finalist') return 'Finalist';
    return 'VC Meeting';
  };

  return (
    <div 
      onClick={() => onView(project.id)}
      className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all cursor-pointer"
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-pink-500/0 opacity-0 group-hover:opacity-10 transition-opacity"></div>
      
      {/* Video or Thumbnail */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden rounded-t-2xl">
        {project.videoUrl ? (
          <YouTubeVideo 
            videoUrl={project.videoUrl}
            className="w-full h-full"
            title={project.projectName}
          />
        ) : (
          <>
            <ImageWithFallback 
              src={project.thumbnail}
              alt={project.projectName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
          </>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 px-3 py-1.5 rounded-lg z-10">
          <span className="text-slate-300 text-xs">{project.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="text-slate-400 text-sm mb-1">{project.teamName}</div>
              <h3 className="text-white text-xl mb-1 truncate">{project.projectName}</h3>
              <p className="text-purple-300 text-sm mb-2">{project.tagline}</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map((tech, i) => (
            <span 
              key={i}
              className="bg-slate-800/50 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700/50"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-slate-500 text-xs px-2.5 py-1">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/50">
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Users className="w-4 h-4" />
            <span>{project.teamMembers.length} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-white">{(project.totalStaked / 1000).toFixed(1)}K</span>
            <span className="text-slate-400 text-sm">staked</span>
          </div>
        </div>

        {/* Top Prediction */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">
            Top Prediction
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300 text-xs">{getOutcomeLabel(topOutcome.key)}</span>
            <span className="text-purple-400 text-sm">{topOutcome.odds}x</span>
          </div>
        </div>

        {/* Links */}
        {(project.githubUrl || project.demoUrl) && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800/50">
            {project.githubUrl && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.githubUrl, '_blank');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 py-2 rounded-lg transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                Code
              </button>
            )}
            {project.demoUrl && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.demoUrl, '_blank');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 py-2 rounded-lg transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Demo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
