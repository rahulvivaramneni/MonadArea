export interface Project {
  id: string;
  teamName: string;
  projectName: string;
  tagline: string;
  description: string;
  category: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  totalStaked: number;
  thumbnail: string;
  videoUrl?: string;
  teamMembers: string[];
  projectOwnerAddress: string; // Wallet address of the project owner
  outcomes: {
    winPrize: { odds: number; staked: number };
    finalist: { odds: number; staked: number };
    vcMeeting: { odds: number; staked: number };
  };
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  tagline: string;
  status: 'active' | 'upcoming' | 'ended';
  startDate: string;
  endDate: string;
  totalPrizePool: number;
  totalProjects: number;
  totalStaked: number;
  thumbnail: string;
  videoUrl?: string;
  organizer: string;
  categories: string[];
  projectIds: string[];
}

export interface UserStake {
  hackathonId: string;
  projectId: string;
  outcome: 'winPrize' | 'finalist' | 'vcMeeting';
  amount: number;
  potentialWin: number;
  timestamp: string;
}

