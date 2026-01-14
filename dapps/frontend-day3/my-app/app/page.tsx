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
import { formatUnits } from 'viem'; // Tambahkan ini untuk memformat saldo

// --- CONFIG ---
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

  // Get Balance for UI (Task 4)
  const { data: balance } = useBalance({ address });

  // READ Contract
  const { data: value, refetch, isLoading: isReading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  // WRITE Contract
  const { data: hash, writeContract, isPending: isConfirming, error: writeError } = useWriteContract();

  // Wait for Transaction (Task 4)
  const { isLoading: isPendingBlock, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isTxSuccess) {
      refetch();
      setInputValue('');
    }
  }, [isTxSuccess, refetch]);

  // Helper: Shorten Address (Task 4)
  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Helper: Format Balance dengan aman
  const displayBalance = () => {
    if (!balance) return "0.000";
    const formatted = formatUnits(balance.value, balance.decimals);
    return formatted.slice(0, 6);
  };

  const handleSetValue = () => {
    if (chainId !== avalancheFuji.id) return alert("Switch to Fuji Network!");
    if (!inputValue) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
    });
  };

  return (
    <main className="relative min-h-screen bg-[#0a0b0d] text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background Blobs (Sesuai style CSS kamu) */}
      <div className="absolute top-[-100px] right-[-50px] w-[300px] h-[300px] bg-red-600/10 blur-[50px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] bg-blue-500/5 blur-[50px] rounded-full animate-pulse delay-700"></div>

      {/* Main Container (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-[400px] bg-white/5 backdrop-blur-[20px] border border-white/10 p-8 rounded-[24px] shadow-2xl text-center">
        
        <header className="mb-6">
          <div className="text-4xl mb-2 text-red-500">❄️</div>
          <h1 className="text-2xl font-bold tracking-wider">Avalanche Portal</h1>
          <p className="text-zinc-400 text-sm">Secure Web3 Connection</p>
        </header>

        {/* Status Badge */}
        <div className="inline-flex items-center px-4 py-1.5 bg-black/30 rounded-full text-xs mb-6 border border-white/5">
          <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#4cd137]' : 'bg-zinc-500'}`}></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>

        {/* Action Button */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full py-3.5 bg-[#e84142] hover:bg-[#ff4d4d] rounded-xl font-bold transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Core Wallet'}
          </button>
        ) : (
          <div className="space-y-4 text-left">
            {/* Wallet Info Card */}
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Wallet Address</label>
                <p className="font-mono text-sm font-semibold">{shortenAddress(address!)}</p>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-3">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Network</label>
                  <p className="text-sm font-semibold text-red-400">
                    {chainId === avalancheFuji.id ? 'Avalanche Fuji' : 'Wrong Network'}
                  </p>
                </div>
                <div className="text-right">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Balance</label>
                  <p className="text-sm font-bold">
                    {displayBalance()} <span className="text-red-500">AVAX</span>
                  </p>
                </div>
              </div>
              <button onClick={() => disconnect()} className="text-[10px] text-zinc-500 underline hover:text-red-400 transition-colors">Disconnect</button>
            </div>

            {/* Interaction Card (Storage) */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="text-center bg-black/20 py-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Contract Value</label>
                <p className="text-3xl font-black text-white mt-1">{isReading ? '...' : (value?.toString() || '0')}</p>
                <button onClick={() => refetch()} className="text-[10px] text-zinc-600 hover:text-white mt-2 block w-full text-center">↻ Refresh Value</button>
              </div>

              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Enter value..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                />
                <button
                  onClick={handleSetValue}
                  disabled={isConfirming || isPendingBlock || !inputValue}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-all disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed shadow-lg"
                >
                  {isConfirming ? 'Check Wallet...' : isPendingBlock ? 'Updating...' : 'Set New Value'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message (Task 5) */}
        {writeError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[11px]">
            {writeError.message.includes('rejected') ? 'User rejected the request.' : 'Transaction failed.'}
          </div>
        )}

        {/* Success Feedback */}
        {isTxSuccess && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-[11px]">
            ✓ Transaction confirmed on Fuji!
          </div>
        )}

        <footer className="mt-8 pt-6 border-t border-white/5 opacity-40">
          <p className="text-xs font-bold tracking-widest uppercase">Rahmat Eka Satria</p>
          <p className="text-[10px] mt-1 font-mono">231011402890</p>
        </footer>
      </div>
    </main>
  );
}