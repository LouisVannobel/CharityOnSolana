import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCharity } from '../contexts/CharityContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingIndicator from '../components/LoadingIndicator';
import TransactionHistory from '../components/TransactionHistory';
import { NFTTier } from '../services/CharityService';

interface UserNFT {
  id: string;
  name: string;
  imageUrl: string;
  tier: number;
  description: string;
}

const WalletDashboard: FC = () => {
  const { connected, publicKey } = useWallet();
  const { isLoading, getUserTokenBalance, getUserNFTs } = useCharity();
  const { showNotification } = useNotification();
  
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!connected || !publicKey) return;
      
      try {
        setIsLoadingData(true);
        
        // Fetch token balance
        const balance = await getUserTokenBalance();
        setTokenBalance(balance);
        
        // Fetch user NFTs
        const nfts = await getUserNFTs();
        console.log('User NFTs:', nfts);
        setUserNFTs(nfts as UserNFT[]);
      } catch (error) {
        console.error('Error fetching user data:', error);
        showNotification('error', 'Failed to load wallet data. Please try again.');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchUserData();
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Wallet Dashboard</h1>
          <p className="text-xl text-gray-600 mb-8">Please connect your wallet to view your dashboard.</p>
          <div className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-medium">
            Connect Wallet
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-2">Your Wallet Dashboard</h1>
        <p className="text-xl text-white">
          View your NFTs, token balance, and transaction history
        </p>
      </section>
      
      {isLoading || isLoadingData ? (
        <div className="flex justify-center py-12">
          <LoadingIndicator size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token Balance Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Token Balance</h2>
            <div className="bg-green-100 rounded-full p-6 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">{tokenBalance}</div>
            <p className="text-gray-600">Charity Reward Tokens</p>
          </div>
          
          {/* Wallet Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wallet Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Connected Address</p>
                <p className="text-gray-800 font-medium break-all">
                  {publicKey?.toString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NFTs Owned</p>
                <p className="text-gray-800 font-medium">
                  {userNFTs.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Network</p>
                <p className="text-gray-800 font-medium">
                  Solana Devnet
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Contribution</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Contribution</p>
                <p className="text-3xl font-bold text-purple-600">
                  {userNFTs.reduce((total, nft) => {
                    // Calculate based on tier (this is a simplified example)
                    const tierPrices = [1, 2, 3.5, 5];
                    return total + (tierPrices[nft.tier - 1] || 0);
                  }, 0).toFixed(2)} SOL
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Impact Level</p>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                        {userNFTs.length > 10 ? 'Hero' : userNFTs.length > 5 ? 'Champion' : userNFTs.length > 2 ? 'Advocate' : 'Supporter'}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div 
                      style={{ width: `${Math.min(userNFTs.length * 10, 100)}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User NFTs Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your NFT Collection</h2>
        
        {userNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userNFTs.map((nft) => (
              <div key={nft.id} className="bg-[#f8fafc] rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="relative pb-[75%] overflow-hidden bg-[#f8fafc]">
                  {console.log('Loading image:', nft.imageUrl)}
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-100">
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error('Image failed to load:', nft.imageUrl);
                        e.currentTarget.src = 'https://via.placeholder.com/300';
                      }}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{nft.name}</h3>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Tier {nft.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#f8fafc] rounded-lg">
            <p className="text-gray-600 mb-4">You don't own any NFTs yet.</p>
            <a 
              href="/nft-gallery" 
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Browse NFT Gallery
            </a>
          </div>
        )}
      </section>
      
      {/* Transaction History Section */}
      <TransactionHistory />
    </div>
  );
};

export default WalletDashboard;
