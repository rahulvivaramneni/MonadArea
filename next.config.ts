import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Set to true to prevent ESLint from blocking builds
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle optional dependencies for wagmi connectors
    // These are dynamically imported and may not be installed
    const optionalDependencies = [
      "@base-org/account",
      "@coinbase/wallet-sdk",
      "@gemini-wallet/core",
      "@metamask/sdk",
      "@safe-global/safe-apps-sdk",
      "@safe-global/safe-apps-provider",
      "@walletconnect/ethereum-provider",
      "porto",
    ];

    // Set fallback for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...optionalDependencies.reduce((acc, dep) => {
          acc[dep] = false;
          return acc;
        }, {} as Record<string, boolean>),
      };
    }

    // Add alias to prevent module resolution errors
    config.resolve.alias = {
      ...config.resolve.alias,
      ...optionalDependencies.reduce((acc, dep) => {
        acc[dep] = false;
        return acc;
      }, {} as Record<string, boolean>),
    };

    // Ignore these modules during bundling
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /@base-org\/account/ },
      { module: /@coinbase\/wallet-sdk/ },
      { module: /@gemini-wallet\/core/ },
      { module: /@metamask\/sdk/ },
      { module: /@safe-global\/safe-apps-sdk/ },
      { module: /@safe-global\/safe-apps-provider/ },
      { module: /@walletconnect\/ethereum-provider/ },
      { module: /porto/ },
    ];

    return config;
  },
};

export default nextConfig;
