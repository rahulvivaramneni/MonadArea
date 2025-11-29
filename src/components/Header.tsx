"use client";

import { Coins, Trophy, User, Zap, Menu, X, Plus, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WalletConnect } from './WalletConnect';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

type Page = 'home' | 'project' | 'leaderboard' | 'profile' | 'add-project' | 'admin';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: mounted && !!address,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayBalance = balance && mounted
    ? parseFloat(formatUnits(balance.value, balance.decimals))
    : 0;

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                  <Zap className="w-5 h-5 md:w-7 md:h-7 text-white" fill="white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-white text-lg md:text-xl tracking-tight">MonadArena</div>
                <div className="text-xs text-purple-300">Predict. Stake. Win.</div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => handleNavigation('home')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  currentPage === 'home' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Zap className="w-4 h-4" />
                Arena
              </button>
              <button
                onClick={() => handleNavigation('leaderboard')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  currentPage === 'leaderboard' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </button>
              <button
                onClick={() => handleNavigation('profile')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  currentPage === 'profile' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => handleNavigation('add-project')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  currentPage === 'add-project' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
              <button
                onClick={() => handleNavigation('admin')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  currentPage === 'admin' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Wallet Connect */}
              <WalletConnect />
              
              {/* Balance - Hidden on small mobile, only show when connected and mounted */}
              {mounted && isConnected && (
                <div className="hidden xs:block relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg md:rounded-xl blur group-hover:blur-md transition-all"></div>
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl flex items-center gap-1.5 md:gap-2.5 border border-yellow-500/20">
                    <Coins className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <span className="text-white text-sm md:text-base tabular-nums">{displayBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span className="hidden sm:inline text-slate-400 text-xs md:text-sm">$MON</span>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-xl">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <button
                onClick={() => handleNavigation('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === 'home' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Zap className="w-5 h-5" />
                Arena
              </button>
              <button
                onClick={() => handleNavigation('leaderboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === 'leaderboard' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </button>
              <button
                onClick={() => handleNavigation('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === 'profile' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <User className="w-5 h-5" />
                Profile
              </button>
              <button
                onClick={() => handleNavigation('add-project')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === 'add-project' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
              <button
                onClick={() => handleNavigation('admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === 'admin' 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Settings className="w-5 h-5" />
                Admin
              </button>
              
              {/* Balance in mobile menu - only show when connected and mounted */}
              {mounted && isConnected && (
                <div className="xs:hidden pt-2 border-t border-slate-800/50 mt-2">
                  <div className="bg-slate-800/50 px-4 py-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-slate-400">Balance</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white">{displayBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <span className="text-slate-400 text-sm">$MON</span>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          <button
            onClick={() => handleNavigation('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
              currentPage === 'home' 
                ? 'text-white' 
                : 'text-slate-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              currentPage === 'home' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
                : 'bg-slate-800/50'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs">Arena</span>
          </button>

          <button
            onClick={() => handleNavigation('leaderboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
              currentPage === 'leaderboard' 
                ? 'text-white' 
                : 'text-slate-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              currentPage === 'leaderboard' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
                : 'bg-slate-800/50'
            }`}>
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs">Ranks</span>
          </button>

          <button
            onClick={() => handleNavigation('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
              currentPage === 'profile' 
                ? 'text-white' 
                : 'text-slate-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              currentPage === 'profile' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
                : 'bg-slate-800/50'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
}
