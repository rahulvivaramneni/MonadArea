import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/components/providers/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MonadArena - Predict. Stake. Win.",
  description: "MonadArena is a prediction and staking platform for hackathons. Predict outcomes, stake your tokens, and win rewards.",
  keywords: ["hackathon", "prediction", "staking", "blockchain", "monad"],
  authors: [{ name: "MonadArena" }],
  openGraph: {
    title: "MonadArena - Predict. Stake. Win.",
    description: "MonadArena is a prediction and staking platform for hackathons.",
    type: "website",
    siteName: "MonadArena",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonadArena - Predict. Stake. Win.",
    description: "MonadArena is a prediction and staking platform for hackathons.",
  },
};

// Force dynamic rendering for wallet integration
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            {children}
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

