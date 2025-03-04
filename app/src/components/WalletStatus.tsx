import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletStatus: FC = () => {
  const { publicKey, wallet, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
          const bal = await connection.getBalance(publicKey);
          if (isMounted) {
            setBalance(bal);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
          if (isMounted) {
            setBalance(null);
          }
        }
      }
    };

    fetchBalance();

    return () => {
      isMounted = false;
    };
  }, [publicKey]);

  if (!connected || !publicKey) {
    return (
      <div className="content-section">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Wallet Status</h2>
        <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-700 mb-6 text-center">
            Connect your wallet to interact with the platform and support our charity cause.
          </p>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  // Format the wallet address to show only first and last few characters
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="content-section">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Wallet Status</h2>
      
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Connected with</p>
            <p className="text-lg font-semibold text-gray-800">{wallet?.adapter.name}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <span className="text-gray-600">Address</span>
            </div>
            <div className="flex items-center">
              <span className="font-mono text-gray-800 mr-2">{formatAddress(publicKey.toBase58())}</span>
              <button 
                onClick={() => {navigator.clipboard.writeText(publicKey.toBase58())}}
                className="text-purple-500 hover:text-purple-700"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-600">Balance</span>
            </div>
            <div>
              {balance !== null ? (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-800 mr-1">{(balance / LAMPORTS_PER_SOL).toFixed(4)}</span>
                  <span className="text-gray-600">SOL</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin mr-2"></div>
                  <span className="text-gray-500">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => window.dispatchEvent(new Event('navigate-to-nft-gallery'))}
            className="btn-primary inline-flex items-center"
          >
            Browse NFT Collection
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
