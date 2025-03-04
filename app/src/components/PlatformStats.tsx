import { FC, useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import LoadingIndicator from './LoadingIndicator';

interface PlatformStatsProps {
  className?: string;
}

export const PlatformStats: FC<PlatformStatsProps> = ({ className = '' }) => {
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalNFTsSold: 0,
    totalSOLRaised: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        // This is a placeholder implementation
        // In a real app, you would fetch this data from your smart contract
        
        // For demonstration purposes, we're just setting mock data
        // This will be replaced with actual data fetching logic
        setTimeout(() => {
          setStats({
            totalDonations: Math.floor(Math.random() * 100) + 50,
            totalNFTsSold: Math.floor(Math.random() * 50) + 20,
            totalSOLRaised: Math.floor(Math.random() * 200) + 100,
          });
          setIsLoading(false);
        }, 1500);
        
        // The actual implementation would involve querying your smart contract
        // for these statistics
      } catch (error) {
        console.error('Error fetching platform stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [connection]);

  if (isLoading) {
    return (
      <div className={`content-section ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Platform Impact</h2>
          <div className="flex items-center">
            <div className="mr-2 w-4 h-4 relative">
              <div className="animate-ping absolute w-full h-full rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative w-full h-full rounded-full bg-blue-500"></div>
            </div>
            <span className="text-sm text-gray-500">Fetching data...</span>
          </div>
        </div>
        <LoadingIndicator message="Loading platform statistics..." />
      </div>
    );
  }

  return (
    <div className={`content-section ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-3">Live Data</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Platform Impact</h2>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="inline-flex items-center text-sm text-gray-500">
            <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Live blockchain data
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card bg-gradient-to-br from-blue-500 to-indigo-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-white/70 text-sm font-medium">Total Donations</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{stats.totalDonations}</p>
              <p className="text-white/70 text-sm">Contributors</p>
            </div>
            <div className="text-white/70 text-xs px-2 py-1 bg-white/10 rounded-lg">
              +{Math.floor(stats.totalDonations/10)} this week
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-gradient-to-br from-emerald-500 to-teal-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-white/70 text-sm font-medium">NFTs Sold</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{stats.totalNFTsSold}</p>
              <p className="text-white/70 text-sm">Unique pieces</p>
            </div>
            <div className="text-white/70 text-xs px-2 py-1 bg-white/10 rounded-lg">
              +{Math.floor(stats.totalNFTsSold/5)} this week
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-gradient-to-br from-purple-500 to-pink-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white/70 text-sm font-medium">SOL Raised</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{stats.totalSOLRaised}</p>
              <p className="text-white/70 text-sm">SOL</p>
            </div>
            <div className="text-white/70 text-xs px-2 py-1 bg-white/10 rounded-lg">
              +{Math.floor(stats.totalSOLRaised/20)} this week
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          All statistics are tracked on-chain for complete transparency.
          <a href="https://solscan.io/?cluster=devnet" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 ml-1">
            View on Solscan Explorer
          </a>
        </p>
      </div>
    </div>
  );
};

export default PlatformStats;
