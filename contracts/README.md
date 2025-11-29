# Staking Contract Deployment Guide

## Overview

The `StakingContract.sol` is a simple smart contract that allows users to stake MON tokens on hackathon project outcomes.

## Contract Features

- **Stake Function**: Users can stake MON tokens on project outcomes (winPrize, finalist, vcMeeting)
- **View Functions**: Query user stakes and total staked amounts
- **Events**: Emits events for all stake transactions

## Deployment Methods

Choose the deployment method that works best for you:

### Method 1: Remix IDE (Easiest - Recommended for Quick Deployment) ⭐

**Remix is a web-based IDE - no installation needed!**

1. **Open Remix IDE**: Go to [https://remix.ethereum.org](https://remix.ethereum.org)

2. **Create a new file**:

   - Click "File Explorer" in the left sidebar
   - Click the "+" icon to create a new file
   - Name it `StakingContract.sol`
   - Copy and paste the contents of `contracts/StakingContract.sol`

3. **Compile the contract**:

   - Click "Solidity Compiler" in the left sidebar
   - Select compiler version `0.8.20` or higher
   - Click "Compile StakingContract.sol"

4. **Add Monad Testnet to MetaMask** (if not already added):

   - Open MetaMask
   - Click the network dropdown
   - Click "Add Network" → "Add a network manually"
   - Enter these details:
     - **Network Name**: `Monad Testnet`
     - **RPC URL**: `https://testnet-rpc.monad.xyz`
     - **Chain ID**: `10143`
     - **Currency Symbol**: `MON`
     - **Block Explorer URL**: `https://testnet.monadexplorer.com`
   - Click "Save"

5. **Deploy to Monad Testnet**:

   - **IMPORTANT**: Make sure MetaMask is **open and unlocked** before proceeding
   - Click "Deploy & Run Transactions" in the left sidebar
   - In the "ENVIRONMENT" dropdown at the top, select **"Injected Provider - MetaMask"**
     - **DO NOT** select "Remix VM" or "JavaScript VM" - these won't work for real deployment
   - You should see a MetaMask popup asking to connect Remix to your wallet - **click "Connect"**
   - After connecting, you should see your account address appear in Remix (under "ACCOUNT" section)
   - Make sure MetaMask is switched to **Monad Testnet** network:
     - Click the network dropdown in MetaMask
     - Select "Monad Testnet" (or add it if it's not there - see step 4 above)
   - Make sure you have some MON tokens in your wallet for gas fees
   - Click "Deploy" button next to `StakingContract`
   - Confirm the transaction in MetaMask popup
   - Wait for the transaction to complete (you'll see it in the Remix console)
   - Copy the deployed contract address from the Remix console (under "Deployed Contracts" section)

   **⚠️ Troubleshooting "from is not defined" error:**

   If you see this error, it means Remix can't find your MetaMask account. Try these steps:

   1. **Check MetaMask is unlocked**: Make sure MetaMask extension is open and you're logged in

   2. **Verify environment selection**:

      - In Remix, make sure you selected **"Injected Provider - MetaMask"**
      - NOT "Remix VM" or "JavaScript VM"

   3. **Reconnect MetaMask**:

      - In Remix, change the environment dropdown to "Remix VM"
      - Then change it back to "Injected Provider - MetaMask"
      - This should trigger a new MetaMask connection popup

   4. **Check browser permissions**:

      - Make sure MetaMask extension is enabled in your browser
      - Try refreshing the Remix page (F5 or Cmd+R)
      - Make sure you're not blocking popups for remix.ethereum.org

   5. **Check network**:

      - Make sure MetaMask is connected to Monad Testnet
      - If Monad Testnet isn't in your list, add it using the steps in step 4 above

   6. **Try a different browser**: Sometimes browser extensions conflict - try Chrome or Firefox

6. **Add to your `.env.local`**:
   ```
   NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```

### Method 2: Foundry/Forge (Modern Alternative)

1. **Install Foundry**:

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Initialize a new project** (if needed):

   ```bash
   forge init --no-git
   ```

3. **Copy the contract**:

   ```bash
   cp contracts/StakingContract.sol src/StakingContract.sol
   ```

4. **Create `foundry.toml`**:

   ```toml
   [profile.default]
   src = "src"
   out = "out"
   libs = ["lib"]
   solc = "0.8.20"

   [rpc_endpoints]
   monad_testnet = "https://testnet-rpc.monad.xyz"
   ```

5. **Deploy**:
   ```bash
   forge create src/StakingContract.sol:StakingContract \
     --rpc-url https://testnet-rpc.monad.xyz \
     --private-key $PRIVATE_KEY \
     --chain-id 10143
   ```

### Method 3: Hardhat (Traditional Method)

1. **Install Dependencies**:

   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Initialize Hardhat**:

   ```bash
   npx hardhat init
   ```

3. **Configure Hardhat** (`hardhat.config.js`):

   ```javascript
   require("@nomicfoundation/hardhat-toolbox");

   module.exports = {
     solidity: "0.8.20",
     networks: {
       monadTestnet: {
         url: "https://testnet-rpc.monad.xyz",
         chainId: 10143,
         accounts: [process.env.PRIVATE_KEY],
       },
     },
   };
   ```

4. **Create deployment script** (`scripts/deploy.js`):

   ```javascript
   const hre = require("hardhat");

   async function main() {
     const StakingContract = await hre.ethers.getContractFactory(
       "StakingContract"
     );
     const staking = await StakingContract.deploy();
     await staking.waitForDeployment();
     console.log("StakingContract deployed to:", await staking.getAddress());
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error(error);
       process.exit(1);
     });
   ```

5. **Deploy**:
   ```bash
   npx hardhat run scripts/deploy.js --network monadTestnet
   ```

### Method 4: Thirdweb (No-Code Option)

1. Go to [thirdweb.com](https://thirdweb.com)
2. Connect your wallet
3. Click "Deploy" → "Deploy Contract"
4. Upload the contract source code from `contracts/StakingContract.sol`
5. Select Monad Testnet as the network
6. Deploy and get the contract address

## After Deployment

### Update Environment Variables

After deployment (using any method above), copy the contract address and add it to your `.env.local` file:

```bash
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### Restart Your Dev Server

After updating the environment variable, restart your Next.js dev server:

```bash
npm run dev
```

## Contract Address Format

The contract address should be a valid Ethereum address (0x followed by 40 hex characters).

Example:

```
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## Testing

You can test the contract using:

- Hardhat's test framework
- Foundry's `forge test`
- Direct interaction on the Monad testnet explorer
- Remix IDE's "Deploy & Run" tab

## Outcome Types

- `0` = winPrize
- `1` = finalist
- `2` = vcMeeting

## Security Notes

- This is a basic implementation for demonstration purposes
- For production, consider adding:
  - Access controls
  - Withdrawal mechanisms
  - Time-based restrictions
  - Outcome resolution logic
  - Fee mechanisms

## Getting Testnet MON Tokens

To deploy and interact with the contract, you'll need MON tokens on the testnet. Check the [Monad documentation](https://docs.monad.xyz) for testnet faucet information.
