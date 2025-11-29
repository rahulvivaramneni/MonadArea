"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Plus, X, Loader2 } from "lucide-react";
import type { Hackathon } from "@/types";

interface AddProjectFormProps {
  hackathons: Hackathon[];
  onProjectAdded: (hackathonId: string, projectData: any) => void;
  onClose: () => void;
}

export function AddProjectForm({
  hackathons,
  onProjectAdded,
  onClose,
}: AddProjectFormProps) {
  const { address } = useAccount();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    teamName: "",
    tagline: "",
    description: "",
    category: "",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    videoUrl: "",
    thumbnail: "",
    teamMembers: "",
    projectOwnerAddress: address || "",
  });

  const activeHackathons = hackathons.filter((h) => h.status === "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathonId || !address) {
      alert("Please select a hackathon and connect your wallet");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse tech stack and team members
      const techStackArray = formData.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);
      const teamMembersArray = formData.teamMembers
        .split(",")
        .map((member) => member.trim())
        .filter((member) => member.length > 0);

      // Generate a unique ID for the project
      const projectId = Date.now().toString();

      const projectData = {
        id: projectId,
        projectName: formData.projectName,
        teamName: formData.teamName,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        techStack: techStackArray,
        githubUrl: formData.githubUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
        teamMembers: teamMembersArray,
        projectOwnerAddress: formData.projectOwnerAddress || address,
        totalStaked: 0,
        outcomes: {
          winPrize: { odds: 2.0, staked: 0 },
          finalist: { odds: 1.5, staked: 0 },
          vcMeeting: { odds: 1.8, staked: 0 },
        },
      };

      // Call the callback to add the project
      onProjectAdded(selectedHackathonId, projectData);
      
      // Reset form
      setFormData({
        projectName: "",
        teamName: "",
        tagline: "",
        description: "",
        category: "",
        techStack: "",
        githubUrl: "",
        demoUrl: "",
        videoUrl: "",
        thumbnail: "",
        teamMembers: "",
        projectOwnerAddress: address || "",
      });
      setSelectedHackathonId("");
      
      alert("Project added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!address) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-6">
        <p className="text-slate-400 text-center">
          Please connect your wallet to add a project
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl md:text-2xl flex items-center gap-2">
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
          Add Project to Hackathon
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hackathon Selection */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Select Hackathon *
          </label>
          <select
            name="hackathonId"
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="">Choose a hackathon...</option>
            {activeHackathons.map((hackathon) => (
              <option key={hackathon.id} value={hackathon.id}>
                {hackathon.name}
              </option>
            ))}
          </select>
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Project Name *
          </label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="My Awesome Project"
          />
        </div>

        {/* Team Name */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Team Name *
          </label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="Team Awesome"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Tagline *
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="Revolutionary blockchain solution"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="Describe your project..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="">Select category...</option>
            <option value="DeFi">DeFi</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Gaming">Gaming</option>
            <option value="AI/ML">AI/ML</option>
            <option value="NFT">NFT</option>
            <option value="Social">Social</option>
            <option value="Security">Security</option>
          </select>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Tech Stack (comma-separated) *
          </label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="React, Solidity, TypeScript"
          />
        </div>

        {/* Team Members */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Team Members (comma-separated) *
          </label>
          <input
            type="text"
            name="teamMembers"
            value={formData.teamMembers}
            onChange={handleChange}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="John Doe, Jane Smith"
          />
        </div>

        {/* Project Owner Address */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Project Owner Address *
          </label>
          <input
            type="text"
            name="projectOwnerAddress"
            value={formData.projectOwnerAddress}
            onChange={handleChange}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="0x..."
          />
          <p className="text-slate-500 text-xs mt-1">
            Wallet address of the project owner (defaults to your connected wallet)
          </p>
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="https://github.com/..."
          />
        </div>

        {/* Demo URL */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Demo URL
          </label>
          <input
            type="url"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="https://demo.com"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Thumbnail Image URL
          </label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 text-white py-3 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

