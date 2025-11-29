"use client";

import {
  Users,
  Github,
  ExternalLink,
  Code2,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { StakingPanel } from "./StakingPanel";
import { ActivityFeed } from "./ActivityFeed";
import { ProjectOwnerRewards } from "./ProjectOwnerRewards";
import { Project } from "@/types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { YouTubeVideo } from "./YouTubeVideo";
import { getProjectById } from "@/utils/dataLoader";
import { useStakedAmounts } from "@/hooks/useStakedAmounts";
import { STAKING_CONTRACT_ADDRESS } from "@/config/contracts";

interface ProjectViewerProps {
  projectId: string;
  hackathonId: string;
  userBalance: number;
  onPlaceStake: (
    projectId: string,
    outcome: "winPrize" | "finalist" | "vcMeeting",
    amount: number,
    potentialWin: number
  ) => void;
  onBack: () => void;
}

// Projects are now loaded from JSON files via dataLoader utility

export function ProjectViewer({
  projectId,
  hackathonId,
  userBalance,
  onPlaceStake,
  onBack,
}: ProjectViewerProps) {
  // Load project from JSON files
  const project = getProjectById(projectId);

  // Get real-time total staked amount
  const realTimeStaked = useStakedAmounts(
    hackathonId,
    projectId,
    !!project &&
      STAKING_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
  );
  const displayTotalStaked =
    realTimeStaked.total > 0 ? realTimeStaked.total : project?.totalStaked || 0;

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <p className="text-white mb-4">Project not found</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

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
            <div className="text-sm md:text-base">Back to Projects</div>
            <div className="text-xs text-slate-500 hidden md:block">
              View all hackathon projects
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content - 2 columns */}
        <div className="xl:col-span-2 space-y-6 md:space-y-8">
          {/* Hero Video or Image */}
          <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/50">
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
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
              </>
            )}

            {/* Category */}
            <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl z-10">
              <span className="text-slate-300 text-xs md:text-sm">
                {project.category}
              </span>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-5 md:p-8">
            <div className="mb-4 md:mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="text-slate-400 text-sm md:text-base mb-2">
                    {project.teamName}
                  </div>
                  <h1 className="text-white text-2xl md:text-4xl mb-2 md:mb-3">
                    {project.projectName}
                  </h1>
                  <p className="text-purple-300 text-base md:text-xl mb-3 md:mb-4">
                    {project.tagline}
                  </p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-sm md:text-lg">
                {project.description}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="mb-4 md:mb-6">
              <div className="bg-slate-800/30 rounded-lg md:rounded-xl p-3 md:p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">Total Staked</span>
                </div>
                <div className="text-white text-lg md:text-2xl">
                  {(displayTotalStaked / 1000).toFixed(1)}K $MON
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <Code2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-slate-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <Users className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Team Members</span>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-800/50 px-3 md:px-4 py-2 rounded-lg md:rounded-xl border border-slate-700/30"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs md:text-sm">
                      {member
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-slate-200 text-sm md:text-base">
                      {member}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {(project.githubUrl || project.demoUrl) && (
              <div className="flex flex-col sm:flex-row gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 md:px-6 py-3 rounded-xl transition-colors border border-slate-700"
                  >
                    <Github className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">
                      View Repository
                    </span>
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 md:px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20"
                  >
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Live Demo</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Activity Feed - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:block">
            <ActivityFeed hackathonId={hackathonId} projectId={project.id} />
          </div>
        </div>

        {/* Staking Panel - 1 column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Project Owner Rewards - Only visible if connected wallet is the owner */}
          {project.projectOwnerAddress && (
            <ProjectOwnerRewards
              hackathonId={hackathonId}
              projectId={project.id}
              projectOwnerAddress={project.projectOwnerAddress}
            />
          )}

          <StakingPanel
            project={project}
            userBalance={userBalance}
            hackathonId={hackathonId}
            onPlaceStake={onPlaceStake}
          />
        </div>
      </div>
    </div>
  );
}
