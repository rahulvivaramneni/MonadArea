import { createConfig, http } from "wagmi";
import { monadTestnet } from "./chains";
import { injected } from "wagmi/connectors";

// WalletConnect can be added if you have a project ID
// Get one at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected(),
    // Removed metaMask() connector to avoid MetaMaskSDK constructor issues
    // MetaMask will still work through injected() connector
    // Uncomment when you have a WalletConnect project ID
    // ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
