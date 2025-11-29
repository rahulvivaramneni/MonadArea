// Staking Contract ABI
// This ABI defines the interface for the staking contract
// Update this when you deploy your actual contract
export const STAKING_CONTRACT_ABI = [
  {
    name: "stake",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "hackathonId", type: "string" },
      { name: "projectId", type: "string" },
      { name: "outcome", type: "uint8" }, // 0 = winPrize, 1 = finalist, 2 = vcMeeting
      { name: "projectOwnerAddress", type: "address" },
    ],
    outputs: [],
  },
  {
    name: "getStake",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "hackathonId", type: "string" },
      { name: "projectId", type: "string" },
      { name: "outcome", type: "uint8" },
    ],
    outputs: [{ name: "amount", type: "uint256" }],
  },
  {
    name: "getTotalStaked",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "hackathonId", type: "string" },
      { name: "projectId", type: "string" },
      { name: "outcome", type: "uint8" },
    ],
    outputs: [{ name: "total", type: "uint256" }],
  },
  {
    name: "setWinners",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "hackathonId", type: "string" },
      { name: "winPrizeProjectIds", type: "string[]" },
      { name: "finalistProjectIds", type: "string[]" },
      { name: "vcMeetingProjectIds", type: "string[]" },
    ],
    outputs: [],
  },
  {
    name: "claimRewards",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "hackathonId", type: "string" }],
    outputs: [],
  },
  {
    name: "claimProjectOwnerReward",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "hackathonId", type: "string" },
      { name: "projectId", type: "string" },
      { name: "outcome", type: "uint8" },
    ],
    outputs: [],
  },
  {
    name: "getClaimableReward",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "hackathonId", type: "string" },
    ],
    outputs: [{ name: "amount", type: "uint256" }],
  },
  {
    name: "getProjectOwnerReward",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "hackathonId", type: "string" },
      { name: "projectId", type: "string" },
      { name: "outcome", type: "uint8" },
    ],
    outputs: [{ name: "amount", type: "uint256" }],
  },
  {
    name: "winnersSet",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "hackathonId", type: "string" }],
    outputs: [{ name: "set", type: "bool" }],
  },
] as const;

// Contract address - UPDATE THIS with your deployed contract address
export const STAKING_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS ||
  ("0x0000000000000000000000000000000000000000" as `0x${string}`);

// Outcome mapping
export const OUTCOME_MAP = {
  winPrize: 0,
  finalist: 1,
  vcMeeting: 2,
} as const;
