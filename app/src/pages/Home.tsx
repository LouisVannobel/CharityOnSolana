import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import WalletStatus from '../components/WalletStatus';
import TokenInfo from '../components/TokenInfo';
import PlatformStats from '../components/PlatformStats';
import CharityCause from '../components/CharityCause';
import { useNotification } from '../contexts/NotificationContext';

export const Home: FC = () => {
  const { connected } = useWallet();
  const { showNotification } = useNotification();

  const handleDemoNotification = () => {
    showNotification('info', 'This is a demo notification. In the future, this will show transaction status.');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="hero-section overflow-hidden">
        <div className="relative py-16 md:py-24 px-6">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-400 filter blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-400 filter blur-3xl"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Support Charitable Causes with NFTs
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Make a difference by purchasing unique NFTs and earn reward tokens for your contributions
            </p>
            
            {!connected ? (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <WalletMultiButton />
                <button 
                  onClick={() => window.location.href = '#nft-gallery'}
                  className="btn-secondary"
                >
                  Learn More
                </button>
              </div>
            ) : (
              <div className="mt-8">
                <button 
                  onClick={() => window.dispatchEvent(new Event('navigate-to-nft-gallery'))}
                  className="btn-primary"
                >
                  Browse NFT Collection
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Charity Cause */}
          <CharityCause />
          
          {/* Platform Stats */}
          <PlatformStats />
          
          {/* About Platform */}
          <div className="content-section">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">About Our Platform</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Transparent Donations</h3>
                <p className="text-gray-600">
                  Every transaction is recorded on the Solana blockchain, ensuring complete transparency for all donations.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Unique NFT Collection</h3>
                <p className="text-gray-600">
                  Collect unique digital art pieces while supporting charitable causes you care about.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Reward Tokens</h3>
                <p className="text-gray-600">
                  Earn reward tokens for each donation, which can be used for future platform benefits.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Fast & Low Fees</h3>
                <p className="text-gray-600">
                  Built on Solana for lightning-fast transactions and minimal fees, maximizing your donation impact.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={handleDemoNotification}
                className="btn-secondary"
              >
                Show Demo Notification
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column - Wallet Info */}
        <div className="space-y-6">
          <WalletStatus />
          {connected && <TokenInfo />}
          
          {/* How It Works */}
          <div className="content-section">
            <h3 className="text-xl font-bold mb-4 text-gray-800">How It Works</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">1</div>
                <div>
                  <p className="text-gray-700">Connect your Solana wallet</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">2</div>
                <div>
                  <p className="text-gray-700">Browse and select an NFT from our gallery</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">3</div>
                <div>
                  <p className="text-gray-700">Purchase the NFT with SOL</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">4</div>
                <div>
                  <p className="text-gray-700">Receive your NFT and reward tokens</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">5</div>
                <div>
                  <p className="text-gray-700">Your donation helps animals in need</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
