import type { Project, Hackathon } from "@/types";

const HACKATHONS_STORAGE_KEY = "monadarena_hackathons";
const PROJECTS_STORAGE_KEY = "monadarena_projects";
const WINNERS_STORAGE_KEY = "monadarena_winners";

// Load hackathons from localStorage
export function loadHackathons(): Record<string, Hackathon> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(HACKATHONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

// Save hackathons to localStorage
export function saveHackathons(hackathons: Record<string, Hackathon>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HACKATHONS_STORAGE_KEY, JSON.stringify(hackathons));
}

// Load projects from localStorage
export function loadProjects(): Record<string, Project> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

// Save projects to localStorage
export function saveProjects(projects: Record<string, Project>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

// Add a new project
export function addProject(project: Project) {
  const projects = loadProjects();
  projects[project.id] = project;
  saveProjects(projects);
  return projects;
}

// Add project to hackathon
export function addProjectToHackathon(
  hackathonId: string,
  projectId: string
) {
  const hackathons = loadHackathons();
  if (hackathons[hackathonId]) {
    if (!hackathons[hackathonId].projectIds.includes(projectId)) {
      hackathons[hackathonId].projectIds.push(projectId);
      hackathons[hackathonId].totalProjects += 1;
      saveHackathons(hackathons);
    }
  }
  return hackathons;
}

// Save winners for a hackathon
export function saveWinners(
  hackathonId: string,
  winners: {
    winPrize: string[];
    finalist: string[];
    vcMeeting: string[];
  }
) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(WINNERS_STORAGE_KEY);
  const allWinners = stored ? JSON.parse(stored) : {};
  allWinners[hackathonId] = winners;
  localStorage.setItem(WINNERS_STORAGE_KEY, JSON.stringify(allWinners));
}

// Load winners for a hackathon
export function loadWinners(hackathonId: string) {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(WINNERS_STORAGE_KEY);
  const allWinners = stored ? JSON.parse(stored) : {};
  return allWinners[hackathonId] || null;
}

