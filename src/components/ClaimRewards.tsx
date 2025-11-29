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
} from "@/config/contracts";
import { Coins, CheckCircle2, Loader2, X, ExternalLink } from "lucide-react";

interface ClaimRewardsProps {
  hackathonId: string;
}

export function ClaimRewards({ hackathonId }: ClaimRewardsProps) {
  const { address, isConnected } = useAccount();
  const [showSuccess, setShowSuccess] = useState(false);

  // Read claimable reward amount
  const { data: claimableAmount, refetch: refetchClaimable } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getClaimableReward",
    args: [
      address || "0x0000000000000000000000000000000000000000",
      hackathonId,
    ],
    query: {
      enabled: isConnected && !!address && hackathonId !== "",
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
      refetchClaimable();
      // Refresh balance after claiming (balance will update automatically via wagmi)
      setTimeout(() => setShowSuccess(false), 10000); // Hide after 10 seconds
    }
  }, [isConfirmed, refetchClaimable]);

  const handleClaim = () => {
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
      functionName: "claimRewards",
      args: [hackathonId],
    });
  };

  const claimableAmountFormatted = claimableAmount
    ? parseFloat(formatUnits(claimableAmount as bigint, 18))
    : 0;

  if (!isConnected) {
    return null;
  }

  if (claimableAmountFormatted === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 md:p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">
              Claim Your Rewards
            </h3>
            <p className="text-emerald-300/70 text-sm">
              You have {claimableAmountFormatted.toFixed(4)} MON available to
              claim
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
              : "✓ Rewards claimed successfully!"}
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

      <button
        onClick={handleClaim}
        disabled={isPending || isConfirming || showSuccess}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isPending ? "Confirm in wallet..." : "Processing..."}
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Claimed!
          </>
        ) : (
          <>
            <Coins className="w-5 h-5" />
            Claim {claimableAmountFormatted.toFixed(4)} MON
          </>
        )}
      </button>
    </div>
  );
}
