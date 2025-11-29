"use client";

import { useState, useEffect } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { formatUnits } from "viem";
import {
  STAKING_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ABI,
  OUTCOME_MAP,
} from "@/config/contracts";

interface StakedAmounts {
  winPrize: number;
  finalist: number;
  vcMeeting: number;
  total: number;
}

export function useStakedAmounts(
  hackathonId: string,
  projectId: string,
  enabled: boolean = true
) {
  const [stakedAmounts, setStakedAmounts] = useState<StakedAmounts>({
    winPrize: 0,
    finalist: 0,
    vcMeeting: 0,
    total: 0,
  });

  // Read staked amounts for each outcome
  const { data: winPrizeStaked, refetch: refetchWinPrize } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getTotalStaked",
    args: [hackathonId, projectId, OUTCOME_MAP.winPrize],
    query: {
      enabled:
        enabled &&
        STAKING_CONTRACT_ADDRESS !==
          "0x0000000000000000000000000000000000000000",
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const { data: finalistStaked, refetch: refetchFinalist } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getTotalStaked",
    args: [hackathonId, projectId, OUTCOME_MAP.finalist],
    query: {
      enabled:
        enabled &&
        STAKING_CONTRACT_ADDRESS !==
          "0x0000000000000000000000000000000000000000",
      refetchInterval: 5000,
    },
  });

  const { data: vcMeetingStaked, refetch: refetchVcMeeting } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getTotalStaked",
    args: [hackathonId, projectId, OUTCOME_MAP.vcMeeting],
    query: {
      enabled:
        enabled &&
        STAKING_CONTRACT_ADDRESS !==
          "0x0000000000000000000000000000000000000000",
      refetchInterval: 5000,
    },
  });

  // Watch for new StakePlaced events to update immediately
  useWatchContractEvent({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    eventName: "StakePlaced",
    onLogs(logs) {
      logs.forEach((log: any) => {
        const eventHackathonId = log.args.hackathonId as string;
        const eventProjectId = log.args.projectId as string;

        // Only refetch if this event is for our hackathon/project
        if (eventHackathonId === hackathonId && eventProjectId === projectId) {
          // Refetch all staked amounts
          refetchWinPrize();
          refetchFinalist();
          refetchVcMeeting();
        }
      });
    },
  });

  // Update state when contract data changes
  useEffect(() => {
    const winPrize = winPrizeStaked
      ? parseFloat(formatUnits(winPrizeStaked as bigint, 18))
      : 0;
    const finalist = finalistStaked
      ? parseFloat(formatUnits(finalistStaked as bigint, 18))
      : 0;
    const vcMeeting = vcMeetingStaked
      ? parseFloat(formatUnits(vcMeetingStaked as bigint, 18))
      : 0;
    const total = winPrize + finalist + vcMeeting;

    setStakedAmounts({
      winPrize,
      finalist,
      vcMeeting,
      total,
    });
  }, [winPrizeStaked, finalistStaked, vcMeetingStaked]);

  return stakedAmounts;
}
