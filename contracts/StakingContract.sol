// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StakingContract
 * @dev Staking contract for hackathon predictions with reward distribution
 * 
 * This contract allows users to stake MON tokens on project outcomes.
 * Outcome types:
 * 0 = winPrize
 * 1 = finalist
 * 2 = vcMeeting
 * 
 * Reward Distribution:
 * - 80% of staked amount goes to winning stakers (proportional to their stake)
 * - 20% goes to project owners (winners)
 */
contract StakingContract {
    address public owner;
    
    // Mapping: hackathonId => projectId => outcome => total staked
    mapping(string => mapping(string => mapping(uint8 => uint256))) public totalStaked;
    
    // Mapping: user => hackathonId => projectId => outcome => amount staked
    mapping(address => mapping(string => mapping(string => mapping(uint8 => uint256)))) public stakes;
    
    // Mapping: hackathonId => outcome => array of winning project IDs
    mapping(string => mapping(uint8 => string[])) public winners;
    
    // Mapping: hackathonId => bool (whether winners have been set)
    mapping(string => bool) public winnersSet;
    
    // Mapping: hackathonId => projectId => outcome => project owner address
    mapping(string => mapping(string => address)) public projectOwners;
    
    // Mapping: user => hackathonId => claimable reward amount
    mapping(address => mapping(string => uint256)) public claimableRewards;
    
    // Mapping: user => hackathonId => bool (whether user has claimed)
    mapping(address => mapping(string => bool)) public hasClaimed;
    
    // Mapping: hackathonId => projectId => outcome => amount distributed to project owner
    mapping(string => mapping(string => mapping(uint8 => uint256))) public projectOwnerRewards;
    
    // Events
    event StakePlaced(
        address indexed user,
        string indexed hackathonId,
        string indexed projectId,
        uint8 outcome,
        uint256 amount,
        uint256 timestamp
    );
    
    event WinnersSet(
        string indexed hackathonId,
        uint8 outcome,
        string[] projectIds
    );
    
    event RewardsDistributed(
        string indexed hackathonId,
        uint256 totalDistributed,
        uint256 stakerRewards,
        uint256 winnerRewards
    );
    
    event RewardClaimed(
        address indexed user,
        string indexed hackathonId,
        uint256 amount
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Place a stake on a project outcome
     * @param hackathonId The ID of the hackathon
     * @param projectId The ID of the project
     * @param outcome The outcome type (0 = winPrize, 1 = finalist, 2 = vcMeeting)
     * @param projectOwnerAddress The address of the project owner
     */
    function stake(
        string memory hackathonId,
        string memory projectId,
        uint8 outcome,
        address projectOwnerAddress
    ) external payable {
        require(msg.value > 0, "Stake amount must be greater than 0");
        require(outcome < 3, "Invalid outcome type");
        require(!winnersSet[hackathonId], "Winners already set, cannot stake");
        require(projectOwnerAddress != address(0), "Invalid project owner address");
        
        // Store project owner if not already set
        if (projectOwners[hackathonId][projectId] == address(0)) {
            projectOwners[hackathonId][projectId] = projectOwnerAddress;
        }
        
        // Update user's stake
        stakes[msg.sender][hackathonId][projectId][outcome] += msg.value;
        
        // Update total staked for this outcome
        totalStaked[hackathonId][projectId][outcome] += msg.value;
        
        emit StakePlaced(
            msg.sender,
            hackathonId,
            projectId,
            outcome,
            msg.value,
            block.timestamp
        );
    }
    
    /**
     * @dev Get the stake amount for a user
     * @param user The user's address
     * @param hackathonId The ID of the hackathon
     * @param projectId The ID of the project
     * @param outcome The outcome type
     * @return The amount staked by the user
     */
    function getStake(
        address user,
        string memory hackathonId,
        string memory projectId,
        uint8 outcome
    ) external view returns (uint256) {
        return stakes[user][hackathonId][projectId][outcome];
    }
    
    /**
     * @dev Get the total staked amount for an outcome
     * @param hackathonId The ID of the hackathon
     * @param projectId The ID of the project
     * @param outcome The outcome type
     * @return The total amount staked
     */
    function getTotalStaked(
        string memory hackathonId,
        string memory projectId,
        uint8 outcome
    ) external view returns (uint256) {
        return totalStaked[hackathonId][projectId][outcome];
    }
    
    /**
     * @dev Set winners for a hackathon (only owner)
     * @param hackathonId The ID of the hackathon
     * @param winPrizeProjectIds Array of project IDs that won the prize
     * @param finalistProjectIds Array of project IDs that are finalists
     * @param vcMeetingProjectIds Array of project IDs that got VC meetings
     */
    function setWinners(
        string memory hackathonId,
        string[] memory winPrizeProjectIds,
        string[] memory finalistProjectIds,
        string[] memory vcMeetingProjectIds
    ) external onlyOwner {
        require(!winnersSet[hackathonId], "Winners already set");
        
        winners[hackathonId][0] = winPrizeProjectIds;
        winners[hackathonId][1] = finalistProjectIds;
        winners[hackathonId][2] = vcMeetingProjectIds;
        winnersSet[hackathonId] = true;
        
        emit WinnersSet(hackathonId, 0, winPrizeProjectIds);
        emit WinnersSet(hackathonId, 1, finalistProjectIds);
        emit WinnersSet(hackathonId, 2, vcMeetingProjectIds);
        
        // Automatically distribute rewards
        _distributeRewards(hackathonId);
    }
    
    /**
     * @dev Internal function to distribute rewards
     * 80% to stakers, 20% to project owners
     */
    function _distributeRewards(string memory hackathonId) internal {
        uint256 totalStakerRewards = 0;
        uint256 totalWinnerRewards = 0;
        
        // Process each outcome type
        for (uint8 outcome = 0; outcome < 3; outcome++) {
            string[] memory winningProjects = winners[hackathonId][outcome];
            
            // Calculate total staked on winning projects for this outcome
            uint256 totalWinningStaked = 0;
            for (uint256 i = 0; i < winningProjects.length; i++) {
                totalWinningStaked += totalStaked[hackathonId][winningProjects[i]][outcome];
            }
            
            if (totalWinningStaked == 0) continue;
            
            // Distribute rewards for each winning project
            for (uint256 i = 0; i < winningProjects.length; i++) {
                string memory projectId = winningProjects[i];
                uint256 projectStaked = totalStaked[hackathonId][projectId][outcome];
                
                if (projectStaked == 0) continue;
                
                // 20% goes to project owner
                uint256 ownerReward = (projectStaked * 20) / 100;
                address ownerAddr = projectOwners[hackathonId][projectId];
                if (ownerAddr != address(0)) {
                    projectOwnerRewards[hackathonId][projectId][outcome] = ownerReward;
                    totalWinnerRewards += ownerReward;
                }
                
                // 80% goes to stakers (will be calculated per user when they claim)
                // We store the total for this project+outcome combination
                // Users will claim proportional to their stake
            }
        }
        
        emit RewardsDistributed(
            hackathonId,
            totalStakerRewards + totalWinnerRewards,
            totalStakerRewards,
            totalWinnerRewards
        );
    }
    
    /**
     * @dev Calculate and claim rewards for a user
     * @param hackathonId The ID of the hackathon
     */
    function claimRewards(string memory hackathonId) external {
        require(winnersSet[hackathonId], "Winners not set yet");
        require(!hasClaimed[msg.sender][hackathonId], "Already claimed");
        
        uint256 totalReward = 0;
        
        // Calculate rewards for each outcome
        for (uint8 outcome = 0; outcome < 3; outcome++) {
            string[] memory winningProjects = winners[hackathonId][outcome];
            
            // Calculate total staked on all winning projects for this outcome
            uint256 totalWinningStaked = 0;
            for (uint256 i = 0; i < winningProjects.length; i++) {
                totalWinningStaked += totalStaked[hackathonId][winningProjects[i]][outcome];
            }
            
            if (totalWinningStaked == 0) continue;
            
            // Calculate user's reward for each winning project they staked on
            for (uint256 i = 0; i < winningProjects.length; i++) {
                string memory projectId = winningProjects[i];
                uint256 userStake = stakes[msg.sender][hackathonId][projectId][outcome];
                
                if (userStake == 0) continue;
                
                uint256 projectTotalStaked = totalStaked[hackathonId][projectId][outcome];
                uint256 projectStakerRewards = (projectTotalStaked * 80) / 100; // 80% for stakers
                
                // User's proportional share
                uint256 userReward = (projectStakerRewards * userStake) / projectTotalStaked;
                totalReward += userReward;
            }
        }
        
        require(totalReward > 0, "No rewards to claim");
        
        // Mark as claimed
        hasClaimed[msg.sender][hackathonId] = true;
        claimableRewards[msg.sender][hackathonId] = totalReward;
        
        // Transfer rewards
        payable(msg.sender).transfer(totalReward);
        
        emit RewardClaimed(msg.sender, hackathonId, totalReward);
    }
    
    /**
     * @dev Claim project owner rewards (20% of staked amount)
     * @param hackathonId The ID of the hackathon
     * @param projectId The ID of the project
     * @param outcome The outcome type
     */
    function claimProjectOwnerReward(
        string memory hackathonId,
        string memory projectId,
        uint8 outcome
    ) external {
        require(winnersSet[hackathonId], "Winners not set yet");
        require(projectOwners[hackathonId][projectId] == msg.sender, "Not the project owner");
        
        // Check if this project won this outcome
        string[] memory winningProjects = winners[hackathonId][outcome];
        bool isWinner = false;
        for (uint256 i = 0; i < winningProjects.length; i++) {
            if (keccak256(bytes(winningProjects[i])) == keccak256(bytes(projectId))) {
                isWinner = true;
                break;
            }
        }
        require(isWinner, "Project did not win this outcome");
        
        uint256 reward = projectOwnerRewards[hackathonId][projectId][outcome];
        require(reward > 0, "No reward to claim");
        
        // Reset to prevent double claiming
        projectOwnerRewards[hackathonId][projectId][outcome] = 0;
        
        // Transfer reward
        payable(msg.sender).transfer(reward);
        
        emit RewardClaimed(msg.sender, hackathonId, reward);
    }
    
    /**
     * @dev Get claimable reward amount for a user
     * @param user The user's address
     * @param hackathonId The ID of the hackathon
     * @return The claimable reward amount
     */
    function getClaimableReward(
        address user,
        string memory hackathonId
    ) external view returns (uint256) {
        if (!winnersSet[hackathonId] || hasClaimed[user][hackathonId]) {
            return 0;
        }
        
        uint256 totalReward = 0;
        
        for (uint8 outcome = 0; outcome < 3; outcome++) {
            string[] memory winningProjects = winners[hackathonId][outcome];
            uint256 totalWinningStaked = 0;
            
            for (uint256 i = 0; i < winningProjects.length; i++) {
                totalWinningStaked += totalStaked[hackathonId][winningProjects[i]][outcome];
            }
            
            if (totalWinningStaked == 0) continue;
            
            for (uint256 i = 0; i < winningProjects.length; i++) {
                string memory projectId = winningProjects[i];
                uint256 userStake = stakes[user][hackathonId][projectId][outcome];
                
                if (userStake == 0) continue;
                
                uint256 projectTotalStaked = totalStaked[hackathonId][projectId][outcome];
                uint256 projectStakerRewards = (projectTotalStaked * 80) / 100;
                uint256 userReward = (projectStakerRewards * userStake) / projectTotalStaked;
                totalReward += userReward;
            }
        }
        
        return totalReward;
    }
    
    /**
     * @dev Get project owner reward amount
     * @param hackathonId The ID of the hackathon
     * @param projectId The ID of the project
     * @param outcome The outcome type
     * @return The reward amount for the project owner
     */
    function getProjectOwnerReward(
        string memory hackathonId,
        string memory projectId,
        uint8 outcome
    ) external view returns (uint256) {
        return projectOwnerRewards[hackathonId][projectId][outcome];
    }
}

