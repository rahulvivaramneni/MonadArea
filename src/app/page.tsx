"use client";

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HackathonList } from '@/components/HackathonList';
import { HackathonDetails } from '@/components/HackathonDetails';
import { ProjectViewer } from '@/components/ProjectViewer';
import { Leaderboard } from '@/components/Leaderboard';
import { UserProfile } from '@/components/UserProfile';
import { AddProjectForm } from '@/components/AddProjectForm';
import { AdminWinnersPage } from '@/components/AdminWinnersPage';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import type { Project, Hackathon, UserStake } from '@/types';
import { addProject, addProjectToHackathon, saveWinners, loadHackathons, loadProjects } from '@/utils/dataStorage';
import { loadAllHackathons, loadAllProjects, getAllHackathonsArray } from '@/utils/dataLoader';

type Page = 'home' | 'hackathon' | 'project' | 'leaderboard' | 'profile' | 'add-project' | 'admin';

export type { Project, Hackathon, UserStake };

// Force dynamic rendering since we use wagmi hooks
export const dynamic = 'force-dynamic';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [mounted, setMounted] = useState(false);
  const [hackathons, setHackathons] = useState<Record<string, Hackathon>>({});
  const [allProjects, setAllProjects] = useState<Record<string, Project>>({});
  
  // Always call hooks unconditionally
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: mounted && !!address,
    },
  });
  
  useEffect(() => {
    setMounted(true);
    // Load data from JSON files and localStorage
    const jsonHackathons = loadAllHackathons();
    const jsonProjects = loadAllProjects();
    const storedHackathons = loadHackathons();
    const storedProjects = loadProjects();
    
    // Merge JSON data with stored data (stored takes precedence)
    setHackathons({ ...jsonHackathons, ...storedHackathons });
    setAllProjects({ ...jsonProjects, ...storedProjects });
  }, []);
  
  const userBalance = balance && mounted
    ? parseFloat(formatUnits(balance.value, balance.decimals))
    : 0;

  const handleViewHackathon = (hackathonId: string) => {
    setSelectedHackathonId(hackathonId);
    setCurrentPage('hackathon');
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project');
  };

  const handleBackToHackathons = () => {
    setSelectedHackathonId(null);
    setCurrentPage('home');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setCurrentPage('hackathon');
  };

  const handlePlaceStake = (
    projectId: string, 
    outcome: 'winPrize' | 'finalist' | 'vcMeeting', 
    amount: number, 
    potentialWin: number
  ) => {
    if (amount > userBalance || !selectedHackathonId) return;
    
    // Note: Actual on-chain staking will be handled in StakingPanel
    // This is just for local state tracking
    setUserStakes(prev => [...prev, {
      hackathonId: selectedHackathonId,
      projectId,
      outcome,
      amount,
      potentialWin,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleProjectAdded = (hackathonId: string, projectData: Project) => {
    // Add project to storage
    const updatedProjects = addProject(projectData);
    setAllProjects(updatedProjects);
    
    // Add project to hackathon
    const updatedHackathons = addProjectToHackathon(hackathonId, projectData.id);
    setHackathons(updatedHackathons);
    
    // Go back to home
    setCurrentPage('home');
  };

  const handleWinnersSelected = (
    hackathonId: string,
    winners: {
      winPrize: string[];
      finalist: string[];
      vcMeeting: string[];
    }
  ) => {
    saveWinners(hackathonId, winners);
    alert("Winners saved successfully!");
  };

  // Get all hackathons from JSON files and localStorage
  const getAllHackathons = useMemo((): Hackathon[] => {
    const jsonHackathons = getAllHackathonsArray();
    const storedHackathons = Object.values(hackathons);
    // Merge JSON hackathons with stored ones (stored take precedence)
    const merged = new Map<string, Hackathon>();
    jsonHackathons.forEach((h: Hackathon) => merged.set(h.id, h));
    storedHackathons.forEach((h: Hackathon) => merged.set(h.id, h));
    return Array.from(merged.values());
  }, [hackathons]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HackathonList onViewHackathon={handleViewHackathon} />;
      case 'hackathon':
        return selectedHackathonId ? (
          <HackathonDetails 
            hackathonId={selectedHackathonId}
            onViewProject={handleViewProject}
            onBack={handleBackToHackathons}
          />
        ) : null;
      case 'project':
        return selectedProjectId && selectedHackathonId ? (
          <ProjectViewer 
            projectId={selectedProjectId}
            hackathonId={selectedHackathonId}
            userBalance={userBalance}
            onPlaceStake={handlePlaceStake}
            onBack={handleBackToProjects}
          />
        ) : null;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <UserProfile balance={userBalance} stakes={userStakes} />;
      case 'add-project':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AddProjectForm
              hackathons={getAllHackathons.filter(h => h.status === 'active')}
              onProjectAdded={handleProjectAdded}
              onClose={() => setCurrentPage('home')}
            />
          </div>
        );
      case 'admin':
        return (
          <AdminWinnersPage
            hackathons={getAllHackathons}
            projects={{ ...loadAllProjects(), ...allProjects }}
            onWinnersSelected={handleWinnersSelected}
            onBack={() => setCurrentPage('home')}
          />
        );
      default:
        return <HackathonList onViewHackathon={handleViewHackathon} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header 
        onNavigate={(page) => {
          if (page === 'home') {
            handleBackToHackathons();
          } else {
            setCurrentPage(page);
          }
        }}
        currentPage={currentPage === 'hackathon' || currentPage === 'project' ? 'home' : currentPage}
      />
      <main className="pb-20">
        {renderPage()}
      </main>
    </div>
  );
}

