"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always call hooks (React rules), but enable queries only after mount
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: mounted && !!address,
    },
  });
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayBalance = balance && mounted
    ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2)
    : '0.00';

  // During SSR and initial render, show a placeholder to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 text-sm">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="relative">
        <div className="flex gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 text-sm"
            >
              <Wallet className="w-4 h-4" />
              {isPending ? 'Connecting...' : `Connect ${connector.name}`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-700/50 hover:border-purple-500/50 transition-all"
      >
        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
        <span className="text-white text-sm font-mono">{formatAddress(address)}</span>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-800 rounded-xl shadow-xl min-w-[280px] overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <div className="text-slate-400 text-xs mb-1">Connected Wallet</div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">{formatAddress(address)}</span>
                <button
                  onClick={copyAddress}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-4 border-b border-slate-800">
              <div className="text-slate-400 text-xs mb-1">Balance</div>
              <div className="text-white text-lg font-semibold">
                {displayBalance} {balance?.symbol || 'MON'}
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

