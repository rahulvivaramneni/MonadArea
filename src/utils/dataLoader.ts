import type { Hackathon, Project } from "@/types";
import hackathonsData from "@/data/hackathons.json";
import bengaluruData from "@/data/monad-biliz-2-bengaluru.json";

// This will be replaced with backend API calls later
// For now, we load from JSON files

/**
 * Load all hackathons from JSON files
 * Later this will be replaced with API calls
 */
export function loadAllHackathons(): Record<string, Hackathon> {
  const hackathons: Record<string, Hackathon> = {};

  // Load from main hackathons JSON
  if (hackathonsData.hackathons) {
    Object.assign(hackathons, hackathonsData.hackathons);
  }

  // Load from bengaluru JSON
  if (bengaluruData.hackathon) {
    hackathons[bengaluruData.hackathon.id] = bengaluruData.hackathon as Hackathon;
  }

  // Add more JSON imports here as you add more hackathons
  // Example:
  // import anotherHackathonData from '@/data/another-hackathon.json';
  // if (anotherHackathonData.hackathon) {
  //   hackathons[anotherHackathonData.hackathon.id] = anotherHackathonData.hackathon as Hackathon;
  // }

  // Also load from localStorage (user-added hackathons)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("monadarena_hackathons");
    if (stored) {
      const storedHackathons = JSON.parse(stored);
      Object.assign(hackathons, storedHackathons);
    }
  }

  return hackathons;
}

/**
 * Load all projects from JSON files
 * Later this will be replaced with API calls
 */
export function loadAllProjects(): Record<string, Project> {
  const projects: Record<string, Project> = {};

  // Load from main hackathons JSON
  if (hackathonsData.projects) {
    Object.assign(projects, hackathonsData.projects);
  }

  // Load from bengaluru JSON
  if (bengaluruData.projects) {
    Object.assign(projects, bengaluruData.projects);
  }

  // Add more JSON imports here as you add more projects
  // Example:
  // import anotherHackathonData from '@/data/another-hackathon.json';
  // if (anotherHackathonData.projects) {
  //   Object.assign(projects, anotherHackathonData.projects);
  // }

  // Also load from localStorage (user-added projects)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("monadarena_projects");
    if (stored) {
      const storedProjects = JSON.parse(stored);
      Object.assign(projects, storedProjects);
    }
  }

  return projects;
}

/**
 * Get all hackathons as an array
 */
export function getAllHackathonsArray(): Hackathon[] {
  return Object.values(loadAllHackathons());
}

/**
 * Get all projects as an array
 */
export function getAllProjectsArray(): Project[] {
  return Object.values(loadAllProjects());
}

/**
 * Get hackathon by ID
 */
export function getHackathonById(id: string): Hackathon | undefined {
  return loadAllHackathons()[id];
}

/**
 * Get project by ID
 */
export function getProjectById(id: string): Project | undefined {
  return loadAllProjects()[id];
}

/**
 * Get projects for a specific hackathon
 */
export function getProjectsForHackathon(hackathonId: string): Project[] {
  const hackathon = getHackathonById(hackathonId);
  if (!hackathon) return [];

  const allProjects = loadAllProjects();
  return hackathon.projectIds
    .map((id) => allProjects[id])
    .filter((p) => p !== undefined);
}

