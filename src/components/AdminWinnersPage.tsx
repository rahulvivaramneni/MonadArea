"use client";

import { useState, useEffect } from "react";
import { Trophy, Award, Handshake, Check, X, Save, Loader2, AlertCircle } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI } from "@/config/contracts";
import type { Hackathon, Project } from "@/types";

interface AdminWinnersPageProps {
  hackathons: Hackathon[];
  projects: Record<string, Project>;
  onWinnersSelected: (
    hackathonId: string,
    winners: {
      winPrize: string[];
      finalist: string[];
      vcMeeting: string[];
    }
  ) => void;
  onBack: () => void;
}

export function AdminWinnersPage({
  hackathons,
  projects,
  onWinnersSelected,
  onBack,
}: AdminWinnersPageProps) {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [selectedWinners, setSelectedWinners] = useState<{
    winPrize: string[];
    finalist: string[];
    vcMeeting: string[];
  }>({
    winPrize: [],
    finalist: [],
    vcMeeting: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if winners are already set for the selected hackathon
  const { data: winnersAlreadySet, refetch: refetchWinnersStatus } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "winnersSet",
    args: [selectedHackathonId],
    query: {
      enabled: !!selectedHackathonId && STAKING_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Show both active and ended hackathons (admin can select winners for any hackathon)
  const availableHackathons = hackathons.filter((h) => h.status === "active" || h.status === "ended");
  const selectedHackathon = hackathons.find((h) => h.id === selectedHackathonId);
  const hackathonProjects = selectedHackathon
    ? selectedHackathon.projectIds
        .map((id) => projects[id])
        .filter((p) => p !== undefined)
    : [];

  const handleHackathonSelect = (hackathonId: string) => {
    setSelectedHackathonId(hackathonId);
    // Reset winners when changing hackathon
    setSelectedWinners({
      winPrize: [],
      finalist: [],
      vcMeeting: [],
    });
  };

  const toggleWinner = (
    projectId: string,
    outcome: "winPrize" | "finalist" | "vcMeeting"
  ) => {
    setSelectedWinners((prev) => {
      const currentList = prev[outcome];
      const isSelected = currentList.includes(projectId);

      if (isSelected) {
        // Remove from list
        return {
          ...prev,
          [outcome]: currentList.filter((id) => id !== projectId),
        };
      } else {
        // Add to list
        return {
          ...prev,
          [outcome]: [...currentList, projectId],
        };
      }
    });
  };

  const handleSave = async () => {
    if (!selectedHackathonId) {
      alert("Please select a hackathon");
      return;
    }

    if (!isConnected || !address) {
      alert("Please connect your wallet to set winners");
      return;
    }

    if (STAKING_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      alert("Staking contract not deployed yet. Please deploy the contract first.");
      return;
    }

    // Check if winners are already set
    await refetchWinnersStatus();
    if (winnersAlreadySet) {
      alert("Winners have already been set for this hackathon. You cannot set them again.");
      return;
    }

    setIsSaving(true);
    try {
      // Call the contract to set winners on-chain
      writeContract({
        address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: STAKING_CONTRACT_ABI,
        functionName: "setWinners",
        args: [
          selectedHackathonId,
          selectedWinners.winPrize,
          selectedWinners.finalist,
          selectedWinners.vcMeeting,
        ],
      });
    } catch (error: any) {
      console.error("Error setting winners:", error);
      const errorMessage = error?.message || error?.shortMessage || "Unknown error";
      if (errorMessage.includes("Winners already set")) {
        alert("Winners have already been set for this hackathon. Please select a different hackathon or check the current winners.");
      } else {
        alert(`Failed to set winners: ${errorMessage}`);
      }
      setIsSaving(false);
    }
  };

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash) {
      // Save to localStorage as well
      onWinnersSelected(selectedHackathonId, selectedWinners);
      // Reset form
      setSelectedHackathonId("");
      setSelectedWinners({
        winPrize: [],
        finalist: [],
        vcMeeting: [],
      });
      setIsSaving(false);
    }
  }, [isConfirmed, hash, selectedHackathonId, selectedWinners, onWinnersSelected]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-white text-3xl md:text-4xl mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
          Select Hackathon Winners
        </h1>
        <p className="text-slate-400">
          Choose winners for ended hackathons. You can select multiple projects
          for each category. Once set, rewards will be distributed: 80% to stakers, 20% to project owners.
        </p>
        {!isConnected && (
          <div className="mt-4 bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              Please connect your wallet to set winners on-chain
            </p>
          </div>
        )}
        {selectedHackathonId && winnersAlreadySet && (
          <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 text-sm font-semibold">
                Winners Already Set
              </p>
              <p className="text-yellow-400/70 text-xs mt-1">
                Winners have already been set for this hackathon. Rewards have been distributed. You cannot modify them.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hackathon Selection */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6">
        <label className="block text-slate-400 text-sm mb-3">
          Select Hackathon *
        </label>
        <select
          value={selectedHackathonId}
          onChange={(e) => handleHackathonSelect(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
        >
          <option value="">Choose a hackathon...</option>
          {availableHackathons.map((hackathon) => (
            <option key={hackathon.id} value={hackathon.id}>
              {hackathon.name}
            </option>
          ))}
        </select>
      </div>

      {selectedHackathon && hackathonProjects.length > 0 && (
        <>
          {/* Winners Selection */}
          <div className="space-y-6">
            {/* Win Prize */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-white text-xl md:text-2xl">
                  Win Prize (1st Place)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {hackathonProjects.map((project) => {
                  const isSelected = selectedWinners.winPrize.includes(
                    project.id
                  );
                  return (
                    <button
                      key={project.id}
                      onClick={() => toggleWinner(project.id, "winPrize")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "bg-yellow-500/20 border-yellow-500/50"
                          : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">
                            {project.projectName}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {project.teamName}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finalist */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-purple-400" />
                <h2 className="text-white text-xl md:text-2xl">
                  Finalist (Top 3)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {hackathonProjects.map((project) => {
                  const isSelected = selectedWinners.finalist.includes(
                    project.id
                  );
                  return (
                    <button
                      key={project.id}
                      onClick={() => toggleWinner(project.id, "finalist")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "bg-purple-500/20 border-purple-500/50"
                          : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">
                            {project.projectName}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {project.teamName}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VC Meeting */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Handshake className="w-6 h-6 text-blue-400" />
                <h2 className="text-white text-xl md:text-2xl">
                  VC Meeting (Investor Interest)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {hackathonProjects.map((project) => {
                  const isSelected = selectedWinners.vcMeeting.includes(
                    project.id
                  );
                  return (
                    <button
                      key={project.id}
                      onClick={() => toggleWinner(project.id, "vcMeeting")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "bg-blue-500/20 border-blue-500/50"
                          : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">
                            {project.projectName}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {project.teamName}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 space-y-4">
            {(isPending || isConfirming) && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  {isPending ? "⏳ Confirm in wallet..." : "⏳ Transaction pending..."}
                </p>
                {hash && (
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block underline"
                  >
                    View Transaction
                  </a>
                )}
              </div>
            )}

            {isConfirmed && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-emerald-300 text-sm">
                  ✓ Winners set successfully! Rewards have been distributed (80% to stakers, 20% to winners).
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-semibold">Transaction Failed</p>
                    <p className="text-red-400/70 text-xs mt-1">
                      {error.message?.includes("Winners already set") || error.shortMessage?.includes("Winners already set")
                        ? "Winners have already been set for this hackathon. You cannot set them again. Please select a different hackathon."
                        : error.message || error.shortMessage || "Unknown error occurred"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving || isPending || isConfirming || !isConnected || winnersAlreadySet}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                {isSaving || isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isPending ? "Confirm in wallet..." : isConfirming ? "Processing..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Set Winners & Distribute Rewards
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {selectedHackathon && hackathonProjects.length === 0 && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-6 text-center">
          <p className="text-slate-400">
            No projects found for this hackathon.
          </p>
        </div>
      )}

      {!selectedHackathonId && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-6 text-center">
          <p className="text-slate-400">
            Please select a hackathon to view and select winners.
          </p>
        </div>
      )}
    </div>
  );
}

