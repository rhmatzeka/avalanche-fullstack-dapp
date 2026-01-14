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
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [inputValue, setInputValue] = useState('');

  const { data: balance } = useBalance({ address });
  const { data: value, refetch, isLoading: isReading } = useReadContract({
    address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'getValue',
  });

  const { data: hash, writeContract, isPending: isConfirming, error: writeError } = useWriteContract();
  const { isLoading: isPendingBlock, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isTxSuccess) { refetch(); setInputValue(''); }
  }, [isTxSuccess, refetch]);

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const displayBalance = () => {
    if (!balance) return "0.000";
    return formatUnits(balance.value, balance.decimals).slice(0, 6);
  };

  return (
    <main className="relative h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- PREMIUM ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 blur-[100px] rounded-full animate-[pulse_6s_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full animate-[pulse_8s_infinite_1s]"></div>
        {/* Dynamic Light Streaks */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent rotate-45"></div>
      </div>

      {/* Glass Card Container */}
      <div className="relative z-10 w-full max-w-[500px] bg-white/[0.02] backdrop-blur-[25px] border border-white/10 p-7 rounded-[28px] shadow-2xl transition-all">
        
        {/* Compact Header */}
        <header className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(232,65,65,0.2)]">
            <span className="text-2xl animate-[spin_10s_linear_infinite]">❄️</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black tracking-tight leading-none uppercase italic">Nexus Portal</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mt-1">AVAX FUJI TESTNET</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[9px] font-bold border ${isConnected ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}`}>
            {isConnected ? '● CONNECTED' : '○ OFFLINE'}
          </div>
        </header>

        {!isConnected ? (
          <button 
            onClick={() => connect({ connector: injected() })} 
            disabled={isConnecting}
            className="w-full py-4 bg-[#e84142] hover:bg-[#ff4d4d] rounded-xl font-black text-sm tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-red-900/20"
          >
            {isConnecting ? 'INITIALIZING...' : 'CONNECT CORE WALLET'}
          </button>
        ) : (
          <div className="space-y-4">
            
            {/* Horizontal Info Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Wallet', val: shortenAddress(address!) },
                { label: 'Network', val: chainId === avalancheFuji.id ? 'FUJI' : 'WRONG', color: 'text-red-400' },
                { label: 'Balance', val: `${displayBalance()} AVAX` }
              ].map((item, i) => (
                <div key={i} className="bg-black/40 border border-white/5 p-2.5 rounded-xl text-center">
                  <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">{item.label}</p>
                  <p className={`text-[11px] font-bold truncate ${item.color || 'text-zinc-200'}`}>{item.val}</p>
                </div>
              ))}
            </div>

            {/* Smart Interaction Area */}
            <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Stored Value</span>
                <span className="text-3xl font-black text-white tracking-tighter">
                  {isReading ? '...' : (value?.toString() || '0')}
                </span>
              </div>

              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="New Value" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-[1.5] bg-black/50 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-red-500 text-sm font-bold placeholder:text-zinc-800" 
                />
                <button 
                  onClick={() => writeContract({ address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'setValue', args: [BigInt(inputValue)] })}
                  disabled={isConfirming || isPendingBlock || !inputValue}
                  className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-xl font-black text-[11px] transition-all disabled:opacity-20 shadow-xl"
                >
                  {isPendingBlock ? '...' : 'UPDATE'}
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center px-1">
              <button onClick={() => disconnect()} className="text-[9px] font-bold text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-widest">
                [ Terminate Session ]
              </button>
              <button onClick={() => refetch()} className="text-[9px] font-bold text-zinc-400 hover:text-white transition-colors">
                REFRESH DATA ↻
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Status Notification */}
        {(writeError || isTxSuccess) && (
          <div className={`mt-4 p-3 rounded-xl text-[10px] font-bold border flex items-center gap-2 animate-in fade-in zoom-in duration-300 ${writeError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${writeError ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <p className="flex-1">{writeError ? 'TX REJECTED' : 'BLOCK CONFIRMED'}</p>
            {isTxSuccess && <span className="opacity-50">✓</span>}
          </div>
        )}

        {/* Compact Student Footer */}
        <footer className="mt-6 pt-4 border-t border-white/5 flex justify-between items-end opacity-30">
           <div className="leading-tight">
              <p className="text-[9px] font-black uppercase tracking-tight">Rahmat Eka Satria</p>
              <p className="text-[8px] font-mono">231011402890</p>
           </div>
           <p className="text-[7px] border border-white/20 px-1.5 py-0.5 rounded italic">Stable Build</p>
        </footer>
      </div>
    </main>
  );
}