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
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: balance } = useBalance({ address });
  const { data: value, refetch, isLoading: isReading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  const { data: hash, writeContract, isPending: isConfirming, error: writeError } = useWriteContract();
  const { isLoading: isPendingBlock, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isTxSuccess) {
      refetch();
      setInputValue('');
    }
  }, [isTxSuccess, refetch]);

  const shortenAddress = (addr: `0x${string}`) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const displayBalance = () => {
    if (!balance) return '0.0000';
    return parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-[#0c0c0c] text-white flex items-center justify-center overflow-hidden p-6">
      {/* Background minimal */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-red-950/15 via-transparent to-red-950/15" />

      {/* Ultra Compact Card – max-w-xs, padding super kecil */}
      <div className="relative z-10 w-full max-w-xs bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col p-4">
        {/* Header super kecil */}
        <header className="text-center mb-3">
          <h1 className="text-2xl font-black tracking-tight uppercase text-red-500">Nexus Portal</h1>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Avalanche Fuji</p>
        </header>

        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={isConnecting}
              className="py-2 px-6 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-600/40"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            {/* Info – vertical ultra compact */}
            <div className="space-y-1.5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5">
                <p className="text-[8px] text-zinc-400 uppercase">Wallet</p>
                <p className="text-[10px] font-mono font-bold">{shortenAddress(address!)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5">
                <p className="text-[8px] text-zinc-400 uppercase">Network</p>
                <p className={`text-[10px] font-bold ${chainId === avalancheFuji.id ? 'text-red-400' : 'text-orange-400'}`}>
                  {chainId === avalancheFuji.id ? 'Fuji' : 'Wrong'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5">
                <p className="text-[8px] text-zinc-400 uppercase">Balance</p>
                <p className="text-[10px] font-bold">{displayBalance()} AVAX</p>
              </div>
            </div>

            {/* Stored Value */}
            <div className="py-2">
              <p className="text-[10px] text-zinc-400 uppercase mb-1">Stored Value</p>
              <p className="text-3xl font-black text-red-500">
                {isReading ? '...' : (value?.toString() || '0')}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-1 text-[9px] text-zinc-400 hover:text-red-400 uppercase"
              >
                ↻ Refresh
              </button>
            </div>

            {/* Form ultra kecil */}
            <div className="space-y-2">
              <input
                type="number"
                placeholder="New value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl focus:outline-none focus:border-red-500 text-xs font-medium placeholder-zinc-500"
              />
              <button
                onClick={() => writeContract({
                  address: CONTRACT_ADDRESS,
                  abi: SIMPLE_STORAGE_ABI,
                  functionName: 'setValue',
                  args: [BigInt(inputValue || '0')],
                })}
                disabled={isConfirming || isPendingBlock || !inputValue}
                className="w-full py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 disabled:opacity-50"
              >
                {isPendingBlock ? 'Pending...' : 'Update Value'}
              </button>
              <button
                onClick={() => disconnect()}
                className="text-[9px] text-zinc-500 hover:text-red-400 uppercase"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}

        {/* Transaction Status – jika ada, muncul kecil di bawah */}
        {(writeError || isTxSuccess) && (
          <div className={`mt-2 px-3 py-1 rounded-2xl border text-[9px] font-bold uppercase ${writeError ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-green-900/20 border-green-500/30 text-green-400'}`}>
            {writeError ? 'Failed' : 'Confirmed'}
          </div>
        )}

        {/* Footer – super kecil */}
        <footer className="mt-3 pt-2 border-t border-white/10 text-center text-zinc-500 text-[8px]">
          <p className="font-bold uppercase">Rahmat Eka Satria | 231011402890</p>
          <p className="uppercase">Avalanche dApp</p>
        </footer>
      </div>
    </main>
  );
}