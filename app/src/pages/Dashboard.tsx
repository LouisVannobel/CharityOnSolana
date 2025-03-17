import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletStatus from '../components/WalletStatus';
import TokenInfo from '../components/TokenInfo';

interface UserNFT {
  id: string;
  name: string;
  image: string;
  description: string;
  attributes: { trait_type: string; value: string }[];
}

export const Dashboard: FC = () => {
  const { connected } = useWallet();
  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // No need to redirect, we'll handle this in the render method

  // Fetch user's NFTs (mock data for now)
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!connected) return;

      setIsLoading(true);
      
      // This is a mock implementation
      // In a real app, you would fetch the user's NFTs from the blockchain
      setTimeout(() => {
        // Mock data
        const mockNFTs: UserNFT[] = [
          {
            id: '1',
            name: 'Charity Panda #001',
            image: 'https://via.placeholder.com/300x300?text=Charity+NFT+1',
            description: 'A rare panda NFT supporting wildlife conservation',
            attributes: [
              { trait_type: 'Rarity', value: 'Rare' },
              { trait_type: 'Cause', value: 'Wildlife' },
            ],
          },
          {
            id: '2',
            name: 'Charity Tiger #042',
            image: 'https://via.placeholder.com/300x300?text=Charity+NFT+2',
            description: 'A unique tiger NFT supporting endangered species',
            attributes: [
              { trait_type: 'Rarity', value: 'Uncommon' },
              { trait_type: 'Cause', value: 'Endangered Species' },
            ],
          },
        ];

        setUserNFTs(mockNFTs);
        setIsLoading(false);
      }, 1500);
    };

    fetchUserNFTs();
  }, [connected]);

  if (!connected) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Wallet Status */}
        <div className="lg:col-span-1">
          <WalletStatus />
        </div>
        
        {/* Right Column - Token Info */}
        <div className="lg:col-span-2">
          <TokenInfo />
        </div>
      </div>
      
      {/* User's NFT Collection */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your NFT Collection</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No NFTs Found</h3>
            <p className="text-gray-600 mb-6">You don't own any charity NFTs yet. Visit our gallery to purchase your first NFT and support our cause.</p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'nft-gallery' }))}
              className="btn-primary inline-flex items-center"
            >
              Browse NFT Gallery
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNFTs.map((nft) => (
              <div key={nft.id} className="nft-card group">
                <div className="nft-image-container">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="nft-image w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-white font-medium">{nft.name}</span>
                    <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {nft.attributes[0].value}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{nft.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{nft.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {nft.attributes.map((attr, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                      >
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Donation History Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Donation History</h2>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-200">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">NFT</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-purple-100">
                  <td className="py-3 px-4 text-sm text-gray-600">2023-05-15</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Charity Panda #001</td>
                  <td className="py-3 px-4 text-sm text-gray-600">2.5 SOL</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-gray-600">2023-06-02</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Charity Tiger #042</td>
                  <td className="py-3 px-4 text-sm text-gray-600">1.8 SOL</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-4">Thank you for your generous donations! Your contributions are making a real difference.</p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">4.3</p>
                <p className="text-xs text-gray-500">Total SOL</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">2</p>
                <p className="text-xs text-gray-500">NFTs Purchased</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">43</p>
                <p className="text-xs text-gray-500">Tokens Earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
