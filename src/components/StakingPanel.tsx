"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types";
import {
  Trophy,
  Award,
  Handshake,
  TrendingUp,
  ArrowRight,
  Info,
  Loader2,
  X,
} from "lucide-react";
import {
  useAccount,
  useBalance,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  STAKING_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ABI,
  OUTCOME_MAP,
} from "@/config/contracts";
import { useStakedAmounts } from "@/hooks/useStakedAmounts";

interface StakingPanelProps {
  project: Project;
  userBalance: number;
  hackathonId: string;
  onPlaceStake: (
    projectId: string,
    outcome: "winPrize" | "finalist" | "vcMeeting",
    amount: number,
    potentialWin: number
  ) => void;
}

type Outcome = "winPrize" | "finalist" | "vcMeeting";

export function StakingPanel({
  project,
  userBalance,
  hackathonId,
  onPlaceStake,
}: StakingPanelProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStake, setPendingStake] = useState<{
    outcome: Outcome;
    amount: number;
    potentialWin: number;
  } | null>(null);

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const actualBalance = balance
    ? parseFloat(formatUnits(balance.value, balance.decimals))
    : 0;

  const displayBalance = isConnected ? actualBalance : userBalance;

  // Get real-time staked amounts from contract
  const realTimeStaked = useStakedAmounts(
    hackathonId,
    project.id,
    STAKING_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
  );

  // Use real-time data if available, otherwise fall back to project data
  const outcomes = [
    {
      id: "winPrize" as Outcome,
      label: "Win Prize",
      description: "Takes 1st place",
      icon: Trophy,
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/10 to-amber-500/10",
      borderColor: "border-yellow-500/30",
      glowColor: "shadow-yellow-500/20",
      odds: project.outcomes.winPrize.odds,
      staked:
        realTimeStaked.winPrize > 0
          ? realTimeStaked.winPrize
          : project.outcomes.winPrize.staked,
    },
    {
      id: "finalist" as Outcome,
      label: "Finalist",
      description: "Top 3 placement",
      icon: Award,
      color: "text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30",
      glowColor: "shadow-purple-500/20",
      odds: project.outcomes.finalist.odds,
      staked:
        realTimeStaked.finalist > 0
          ? realTimeStaked.finalist
          : project.outcomes.finalist.staked,
    },
    {
      id: "vcMeeting" as Outcome,
      label: "VC Meeting",
      description: "Secures investor interest",
      icon: Handshake,
      color: "text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      glowColor: "shadow-blue-500/20",
      odds: project.outcomes.vcMeeting.odds,
      staked:
        realTimeStaked.vcMeeting > 0
          ? realTimeStaked.vcMeeting
          : project.outcomes.vcMeeting.staked,
    },
  ];

  // Use real-time total if available
  const totalStaked =
    realTimeStaked.total > 0 ? realTimeStaked.total : project.totalStaked;

  const selectedOutcomeData = outcomes.find((o) => o.id === selectedOutcome);
  const potentialWin =
    selectedOutcomeData && stakeAmount
      ? parseFloat(stakeAmount) * selectedOutcomeData.odds
      : 0;

  const handleStake = async () => {
    if (!selectedOutcome || !stakeAmount || !isConnected || !address) return;
    const amount = parseFloat(stakeAmount);
    if (amount <= 0 || amount > actualBalance) return;

    // Check if contract is configured
    if (
      STAKING_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000"
    ) {
      alert(
        "Staking contract not deployed yet. Please:\n1. Deploy the contract from contracts/StakingContract.sol\n2. Set NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS in your .env.local file\n3. Restart the dev server"
      );
      return;
    }

    try {
      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid stake amount");
        return;
      }

      const amountWei = parseUnits(stakeAmount, 18);
      const outcomeValue = OUTCOME_MAP[selectedOutcome];

      // Validate outcome
      if (outcomeValue === undefined) {
        alert("Invalid outcome selected");
        return;
      }

      // Validate we have enough balance
      if (amountWei > (balance?.value || BigInt(0))) {
        alert("Insufficient balance");
        return;
      }

      // Store pending stake data before transaction
      setPendingStake({
        outcome: selectedOutcome,
        amount: amount,
        potentialWin: potentialWin,
      });

      console.log("Staking with params:", {
        hackathonId,
        projectId: project.id,
        outcome: outcomeValue,
        amountWei: amountWei.toString(),
        amount: stakeAmount,
        contractAddress: STAKING_CONTRACT_ADDRESS,
      });

      // Get project owner address (default to connected wallet if not set)
      const projectOwnerAddr =
        project.projectOwnerAddress &&
        project.projectOwnerAddress !==
          "0x0000000000000000000000000000000000000000"
          ? (project.projectOwnerAddress as `0x${string}`)
          : (address as `0x${string}`);

      // Write to contract - this will trigger wallet approval
      writeContract({
        address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: STAKING_CONTRACT_ABI,
        functionName: "stake",
        args: [hackathonId, project.id, outcomeValue, projectOwnerAddr],
        value: amountWei,
        gas: BigInt(500000), // Set a gas limit to help with estimation
      });
    } catch (err: any) {
      console.error("Staking error:", err);
      setPendingStake(null);

      // Show user-friendly error message
      const errorMessage = err?.message || err?.toString() || "Unknown error";
      if (
        errorMessage.includes("user rejected") ||
        errorMessage.includes("User denied")
      ) {
        // User cancelled - don't show error
        return;
      }
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash && pendingStake) {
      // Only call the callback after transaction is confirmed on-chain
      onPlaceStake(
        project.id,
        pendingStake.outcome,
        pendingStake.amount,
        pendingStake.potentialWin
      );
      setShowConfirmation(true);
      setStakeAmount("");
      setSelectedOutcome(null);
      setPendingStake(null);

      // Auto-hide confirmation after 30 seconds (increased from 5)
      setTimeout(() => setShowConfirmation(false), 30000);
    }
  }, [isConfirmed, hash, pendingStake, project.id, onPlaceStake]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 xl:sticky xl:top-28">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <h2 className="text-white text-lg md:text-xl">Place Your Stake</h2>
      </div>

      {STAKING_CONTRACT_ADDRESS ===
        "0x0000000000000000000000000000000000000000" && (
        <div className="mb-4 md:mb-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
          <p className="text-yellow-300 text-sm md:text-base">
            ⚠️ Contract Not Deployed
          </p>
          <p className="text-yellow-400/70 text-xs md:text-sm mt-1">
            Please deploy the staking contract and set
            NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS in your .env.local file
          </p>
        </div>
      )}

      {!isConnected && (
        <div className="mb-4 md:mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
          <p className="text-blue-300 text-sm md:text-base">
            Connect your wallet to stake
          </p>
          <p className="text-blue-400/70 text-xs md:text-sm mt-1">
            You need a wallet connected to place stakes
          </p>
        </div>
      )}

      {(isPending || isConfirming || showConfirmation) && (
        <div className="mb-4 md:mb-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg md:rounded-xl p-3 md:p-4 relative">
          {showConfirmation && !isPending && !isConfirming && (
            <button
              onClick={() => setShowConfirmation(false)}
              className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <p className="text-emerald-300 text-sm md:text-base">
            {isPending
              ? "⏳ Confirm in wallet..."
              : isConfirming
              ? "⏳ Transaction pending..."
              : "✓ Stake placed successfully!"}
          </p>
          <p className="text-emerald-400/70 text-xs md:text-sm mt-1">
            {isPending
              ? "Please approve the transaction in your wallet"
              : isConfirming
              ? "Waiting for blockchain confirmation"
              : "Your prediction has been recorded on-chain"}
          </p>
          {hash && (
            <a
              href={`https://testnet.monadexplorer.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 text-xs mt-2 inline-block underline"
            >
              View on Explorer
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 md:mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
          <p className="text-red-300 text-sm md:text-base">
            Transaction failed
          </p>
          <p className="text-red-400/70 text-xs md:text-sm mt-1">
            {error.message}
          </p>
        </div>
      )}

      {/* Outcome Selection */}
      <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
        {outcomes.map((outcome) => {
          const Icon = outcome.icon;
          const isSelected = selectedOutcome === outcome.id;
          const percentage =
            totalStaked > 0 ? (outcome.staked / totalStaked) * 100 : 0;

          return (
            <button
              key={outcome.id}
              onClick={() => setSelectedOutcome(outcome.id)}
              className={`relative w-full border rounded-lg md:rounded-xl p-3 md:p-4 transition-all overflow-hidden group ${
                isSelected
                  ? `${outcome.borderColor} bg-gradient-to-br ${outcome.bgGradient} border-2 shadow-lg ${outcome.glowColor}`
                  : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
              }`}
            >
              {/* Background percentage bar */}
              <div
                className="absolute inset-0 bg-slate-700/10 transition-all"
                style={{ width: `${percentage}%` }}
              ></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-1.5 md:mb-2">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Icon
                      className={`w-4 h-4 md:w-5 md:h-5 ${outcome.color}`}
                    />
                    <div className="text-left">
                      <div className="text-white text-sm md:text-base">
                        {outcome.label}
                      </div>
                      <div className="text-slate-400 text-xs hidden sm:block">
                        {outcome.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg md:text-xl ${outcome.color}`}>
                      {outcome.odds}x
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-slate-400">
                    {(outcome.staked / 1000).toFixed(1)}K staked
                  </span>
                  <span className="text-slate-500">
                    {percentage.toFixed(0)}% of pool
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stake Amount Input */}
      <div className="mb-4 md:mb-6">
        <label className="block text-slate-400 text-xs md:text-sm mb-2 md:mb-3">
          Stake Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 pr-16 md:pr-20 text-white text-base md:text-lg placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all"
            disabled={!selectedOutcome}
          />
          <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-slate-300 text-sm md:text-base">$MON</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 md:gap-2 mt-2 md:mt-3">
          {[100, 500, 1000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => setStakeAmount(amount.toString())}
              disabled={
                !selectedOutcome || amount > displayBalance || !isConnected
              }
              className="bg-slate-800/50 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700/50 rounded-md md:rounded-lg px-1.5 md:px-2 py-2 md:py-2.5 text-slate-300 text-xs md:text-sm transition-colors"
            >
              {amount >= 1000 ? `${amount / 1000}K` : amount}
            </button>
          ))}
        </div>
      </div>

      {/* Potential Win Display */}
      {selectedOutcome && stakeAmount && parseFloat(stakeAmount) > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg md:rounded-xl p-4 md:p-5 mb-4 md:mb-6">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div className="flex-1">
              <div className="text-slate-400 text-xs md:text-sm mb-1">
                Potential Return
              </div>
              <div className="flex items-baseline gap-1.5 md:gap-2">
                <span className="text-white text-xl md:text-2xl">
                  {potentialWin.toFixed(2)}
                </span>
                <span className="text-slate-400 text-sm md:text-base">
                  $MON
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-xs md:text-sm mb-1">ROI</div>
              <div className="text-emerald-400 text-lg md:text-xl">
                +
                {((potentialWin / parseFloat(stakeAmount) - 1) * 100).toFixed(
                  0
                )}
                %
              </div>
            </div>
          </div>
          <div className="pt-2 md:pt-3 border-t border-purple-500/20">
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-slate-400">Your stake</span>
              <span className="text-white">
                {parseFloat(stakeAmount).toFixed(2)} $MON
              </span>
            </div>
            <div className="flex justify-between text-xs md:text-sm mt-1">
              <span className="text-slate-400">Profit if correct</span>
              <span className="text-emerald-400">
                +{(potentialWin - parseFloat(stakeAmount)).toFixed(2)} $MON
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Place Stake Button */}
      <button
        onClick={handleStake}
        disabled={
          STAKING_CONTRACT_ADDRESS ===
            "0x0000000000000000000000000000000000000000" ||
          !isConnected ||
          !selectedOutcome ||
          !stakeAmount ||
          parseFloat(stakeAmount) <= 0 ||
          parseFloat(stakeAmount) > displayBalance ||
          isPending ||
          isConfirming
        }
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-3 md:py-4 rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:shadow-none text-sm md:text-base"
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            {isPending ? "Confirm in wallet..." : "Processing..."}
          </>
        ) : (
          <>
            Place Stake
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </>
        )}
      </button>

      {parseFloat(stakeAmount) > displayBalance && (
        <p className="text-red-400 text-xs md:text-sm mt-2 md:mt-3 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Insufficient balance
        </p>
      )}

      {/* Info Box */}
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-800/50">
        <div className="flex items-start gap-2 mb-2 md:mb-3">
          <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500 mt-0.5" />
          <div className="text-slate-400 text-xs leading-relaxed">
            Stakes are locked until voting ends. Winners share the prize pool
            proportionally.
          </div>
        </div>
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Pool size</span>
            <span className="text-slate-400">
              {(totalStaked / 1000).toFixed(1)}K $MON
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Your balance</span>
            <span className="text-slate-400">
              {displayBalance.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              $MON
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
