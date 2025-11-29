"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { formatUnits } from "viem";
import {
  STAKING_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ABI,
  OUTCOME_MAP,
} from "@/config/contracts";
import {
  Trophy,
  Award,
  Handshake,
  CheckCircle2,
  Loader2,
  X,
  ExternalLink,
  Coins,
} from "lucide-react";

interface ProjectOwnerRewardsProps {
  hackathonId: string;
  projectId: string;
  projectOwnerAddress: string;
}

export function ProjectOwnerRewards({
  hackathonId,
  projectId,
  projectOwnerAddress,
}: ProjectOwnerRewardsProps) {
  const { address, isConnected } = useAccount();
  const [showSuccess, setShowSuccess] = useState(false);
  const [claimedOutcomes, setClaimedOutcomes] = useState<Set<number>>(
    new Set()
  );

  // Check if connected wallet is the project owner
  const isOwner =
    isConnected && address?.toLowerCase() === projectOwnerAddress.toLowerCase();

  // Read rewards for each outcome
  const { data: winPrizeReward, refetch: refetchWinPrize } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getProjectOwnerReward",
    args: [hackathonId, projectId, OUTCOME_MAP.winPrize],
    query: {
      enabled: isOwner && hackathonId !== "" && projectId !== "",
    },
  });

  const { data: finalistReward, refetch: refetchFinalist } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getProjectOwnerReward",
    args: [hackathonId, projectId, OUTCOME_MAP.finalist],
    query: {
      enabled: isOwner && hackathonId !== "" && projectId !== "",
    },
  });

  const { data: vcMeetingReward, refetch: refetchVcMeeting } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getProjectOwnerReward",
    args: [hackathonId, projectId, OUTCOME_MAP.vcMeeting],
    query: {
      enabled: isOwner && hackathonId !== "" && projectId !== "",
    },
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      setShowSuccess(true);
      // Refetch all rewards
      refetchWinPrize();
      refetchFinalist();
      refetchVcMeeting();
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    }
  }, [isConfirmed, refetchWinPrize, refetchFinalist, refetchVcMeeting]);

  const rewards = [
    {
      outcome: OUTCOME_MAP.winPrize,
      label: "Win Prize",
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "from-yellow-500/10 to-amber-500/10",
      borderColor: "border-yellow-500/30",
      reward: winPrizeReward as bigint | undefined,
      refetch: refetchWinPrize,
    },
    {
      outcome: OUTCOME_MAP.finalist,
      label: "Finalist",
      icon: Award,
      color: "text-purple-400",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30",
      reward: finalistReward as bigint | undefined,
      refetch: refetchFinalist,
    },
    {
      outcome: OUTCOME_MAP.vcMeeting,
      label: "VC Meeting",
      icon: Handshake,
      color: "text-blue-400",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      reward: vcMeetingReward as bigint | undefined,
      refetch: refetchVcMeeting,
    },
  ];

  const handleClaim = (outcome: number) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet");
      return;
    }

    if (
      STAKING_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000"
    ) {
      alert("Contract not deployed");
      return;
    }

    writeContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_CONTRACT_ABI,
      functionName: "claimProjectOwnerReward",
      args: [hackathonId, projectId, outcome],
    });
  };

  const availableRewards = rewards.filter((r) => r.reward && r.reward > 0n);

  if (!isOwner) {
    return null;
  }

  if (availableRewards.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">
              Claim Your Project Rewards
            </h3>
            <p className="text-emerald-300/70 text-sm">
              You have {availableRewards.length} reward
              {availableRewards.length > 1 ? "s" : ""} available (20% of staked
              amount)
            </p>
          </div>
        </div>
        {showSuccess && (
          <button
            onClick={() => setShowSuccess(false)}
            className="text-emerald-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {(isPending || isConfirming || showSuccess) && (
        <div className="mb-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
          <p className="text-emerald-300 text-sm">
            {isPending
              ? "⏳ Confirm in wallet..."
              : isConfirming
              ? "⏳ Transaction pending..."
              : "✓ Reward claimed successfully!"}
          </p>
          {hash && (
            <a
              href={`https://testnet.monadexplorer.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 text-xs mt-2 inline-flex items-center gap-1 underline"
            >
              View Transaction <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-300 text-sm">
            Transaction failed: {error.message}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {availableRewards.map((reward) => {
          const Icon = reward.icon;
          const amount = reward.reward
            ? parseFloat(formatUnits(reward.reward, 18))
            : 0;

          return (
            <div
              key={reward.outcome}
              className={`bg-gradient-to-br ${reward.bgColor} border ${reward.borderColor} rounded-lg p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${reward.color}`} />
                  <div>
                    <div className="text-white font-medium">{reward.label}</div>
                    <div className={`${reward.color} text-sm`}>
                      {amount.toFixed(4)} MON available
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleClaim(reward.outcome)}
                  disabled={
                    isPending ||
                    isConfirming ||
                    showSuccess ||
                    claimedOutcomes.has(reward.outcome)
                  }
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : claimedOutcomes.has(reward.outcome) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Claimed
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      Claim
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
