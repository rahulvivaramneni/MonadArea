"use client";

import { Hackathon } from "@/types";
import {
  Calendar,
  Coins,
  TrendingUp,
  Clock,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { YouTubeVideo } from "./YouTubeVideo";

interface HackathonCardProps {
  hackathon: Hackathon;
  onView: (hackathonId: string) => void;
}

export function HackathonCard({ hackathon, onView }: HackathonCardProps) {
  // Format date consistently to avoid hydration mismatches
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const getTimeDisplay = () => {
    const now = new Date();
    const startTime = new Date(hackathon.startDate);
    const endTime = new Date(hackathon.endDate);

    if (hackathon.status === "active") {
      const diffMs = endTime.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      const diffHours = Math.floor((diffMs % 86400000) / 3600000);
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {diffDays}d {diffHours}h remaining
          </span>
        </div>
      );
    } else if (hackathon.status === "upcoming") {
      const diffMs = startTime.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Starts in {diffDays} days</span>
        </div>
      );
    } else {
      return <span>Ended {formatDate(endTime)}</span>;
    }
  };

  const getStatusBadge = () => {
    if (hackathon.status === "active") {
      return (
        <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-300 text-xs">Active</span>
        </div>
      );
    } else if (hackathon.status === "upcoming") {
      return (
        <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 px-3 py-1.5 rounded-lg">
          <span className="text-blue-300 text-xs">Upcoming</span>
        </div>
      );
    } else {
      return (
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-lg">
          <span className="text-slate-400 text-xs">Ended</span>
        </div>
      );
    }
  };

  return (
    <div
      onClick={() => onView(hackathon.id)}
      className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all cursor-pointer"
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-pink-500/0 opacity-0 group-hover:opacity-10 transition-opacity"></div>

      {/* Video or Thumbnail */}
      <div className="relative aspect-[21/9] bg-slate-950 overflow-hidden">
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
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          </>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">{getStatusBadge()}</div>

        {/* Prize Pool */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-yellow-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 z-10">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400">
            ${(hackathon.totalPrizePool / 1000).toFixed(0)}K
          </span>
        </div>

        {/* Organizer at bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="text-slate-400 text-sm mb-1">
            {hackathon.organizer}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-white text-xl mb-2 group-hover:text-purple-300 transition-colors">
            {hackathon.name}
          </h3>
          <p className="text-purple-300 text-sm mb-3">{hackathon.tagline}</p>
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
            {hackathon.description}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-slate-800/50">
          {hackathon.categories.slice(0, 4).map((category, i) => (
            <span
              key={i}
              className="bg-slate-800/50 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700/50"
            >
              {category}
            </span>
          ))}
          {hackathon.categories.length > 4 && (
            <span className="text-slate-500 text-xs px-2.5 py-1">
              +{hackathon.categories.length - 4}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5" />
              Projects
            </div>
            <div className="text-white text-lg">{hackathon.totalProjects}</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              Staked
            </div>
            <div className="text-white text-lg">
              {(hackathon.totalStaked / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        {/* Time & CTA */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">{getTimeDisplay()}</div>
          <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
            <span className="text-sm">View Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
