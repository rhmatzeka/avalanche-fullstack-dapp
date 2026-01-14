'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalancheFuji } from 'wagmi/chains';
import { formatUnits } from 'viem';

const CONTRACT_ADDRESS = '0x3fa731B5499253942737c2AD452Edc08bfa1c35f';
const SIMPLE_STORAGE_ABI = [
  { inputs: [], name: 'getValue', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: '_value', type: 'uint256' }], name: 'setValue', outputs: [], stateMutability: 'nonpayable', type: 'function' },
] as const;

export default function Page() {
  // Fix Hydration Error
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Lifecycle
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: balance } = useBalance({ address });
  const { data: value, refetch, isLoading: isReading } = useReadContract({
    address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'getValue',
  });

  const { data: hash, writeContract, isPending: isConfirming, error: writeError } = useWriteContract();
  const { isLoading: isPendingBlock, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isTxSuccess) {
      refetch();
      setInputValue('');
    }
  }, [isTxSuccess, refetch]);

  // Helpers
  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const displayBalance = () => {
    if (!balance) return "0.000";
    return formatUnits(balance.value, balance.decimals).slice(0, 6);
  };

  // Prevent rendering dynamic wallet content until mounted to fix Hydration Issue
  if (!mounted) return null;

  return (
    <main className="relative h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[450px] h-[450px] bg-red-600/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] bg-blue-600/10 blur-[100px] rounded-full animate-[pulse_8s_infinite_1s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg]"></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white/[0.02] backdrop-blur-[30px] border border-white/10 p-8 rounded-[30px] shadow-2xl">
        
        {/* Header Section */}
        <header className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(232,65,66,0.2)]">
            <span className="text-2xl animate-[spin_12s_linear_infinite]">❄️</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black tracking-tight leading-none italic uppercase">Nexus Portal</h1>
            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.2em] mt-1.5 uppercase">Avalanche L1 Protocol</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[9px] font-black border transition-colors ${isConnected ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}`}>
            {isConnected ? '● ONLINE' : '○ OFFLINE'}
          </div>
        </header>

        {!isConnected ? (
          <button 
            onClick={() => connect({ connector: injected() })} 
            disabled={isConnecting}
            className="w-full py-4 bg-[#e84142] hover:bg-[#ff4d4d] rounded-xl font-black text-sm tracking-widest transition-all hover:scale-[1.01] active:scale-95"
          >
            {isConnecting ? 'ESTABLISHING...' : 'CONNECT CORE WALLET'}
          </button>
        ) : (
          <div className="space-y-4">
            
            {/* Info Grid (3 Columns) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Wallet</p>
                <p className="text-[11px] font-mono font-bold">{shortenAddress(address!)}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Network</p>
                <p className={`text-[10px] font-bold ${chainId === avalancheFuji.id ? 'text-red-400' : 'text-zinc-400'}`}>
                  {chainId === avalancheFuji.id ? 'FUJI TEST' : 'WRONG NET'}
                </p>
              </div>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Balance</p>
                <p className="text-[11px] font-bold">{displayBalance()} <span className="text-red-500 text-[9px]">AVAX</span></p>
              </div>
            </div>

            {/* Contract Interaction Area */}
            <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 rounded-2xl border border-white/10 shadow-inner">
              <div className="flex justify-between items-end mb-4 px-1">
                <div>
                  <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block mb-1">Stored Value</label>
                  <p className="text-4xl font-black text-white tracking-tighter leading-none">
                    {isReading ? '...' : (value?.toString() || '0')}
                  </p>
                </div>
                <button 
                  onClick={() => refetch()} 
                  className="text-[9px] font-bold text-zinc-500 hover:text-white transition-colors"
                >
                  REFRESH ↻
                </button>
              </div>

              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="New value..." 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-[1.5] bg-black/60 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-red-500 text-sm font-bold transition-all" 
                />
                <button 
                  onClick={() => writeContract({ address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'setValue', args: [BigInt(inputValue)] })}
                  disabled={isConfirming || isPendingBlock || !inputValue}
                  className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-xl font-black text-[10px] transition-all disabled:opacity-20 uppercase"
                >
                  {isPendingBlock ? '...' : 'Update'}
                </button>
              </div>
            </div>

            {/* System Controls */}
            <div className="flex justify-between items-center px-1">
              <button onClick={() => disconnect()} className="text-[9px] font-black text-zinc-600 hover:text-red-500 transition-colors uppercase tracking-widest">
                [ Terminate Session ]
              </button>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[9px] font-bold text-green-500/60 uppercase">System Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Notifications (Overlaid-style) */}
        {(writeError || isTxSuccess) && (
          <div className={`mt-4 p-3 rounded-xl text-[10px] font-bold border flex items-center justify-between animate-in fade-in zoom-in duration-300 ${writeError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
            <span>{writeError ? '⚠️ TRANSACTION FAILED / REJECTED' : '✅ BLOCK CONFIRMED ON FUJI'}</span>
            <button onClick={() => window.location.reload()} className="opacity-50 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Branding Footer */}
        <footer className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center opacity-30">
           <div>
              <p className="text-[10px] font-black uppercase tracking-tight">Rahmat Eka Satria</p>
              <p className="text-[8px] font-mono mt-0.5">NIM: 231011402890</p>
           </div>
           <div className="text-right">
              <p className="text-[7px] border border-white/20 px-1.5 py-0.5 rounded-md font-bold uppercase">Avalanche dApp v2.0</p>
           </div>
        </footer>
      </div>
    </main>
  );
}