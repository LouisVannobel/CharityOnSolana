import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface NavigationProps {
  className?: string;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: FC<NavigationProps> = ({ className = '', activePage, onNavigate }) => {
  const { connected } = useWallet();

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', enabled: true },
    { id: 'nft-gallery', label: 'NFT Gallery', icon: '🖼️', enabled: true },
    { id: 'my-collection', label: 'My Collection', icon: '🎁', enabled: connected },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', enabled: connected },
  ];

  return (
    <nav className={`bg-white rounded-xl shadow-md ${className}`}>
      <ul className="flex flex-wrap p-1.5">
        {tabs.map((tab) => (
          <li key={tab.id} className="mr-2">
            <button
              className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-200 ${
                activePage === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : tab.enabled
                  ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  : 'text-gray-400 cursor-not-allowed opacity-60'
              }`}
              onClick={() => tab.enabled && onNavigate(tab.id)}
              disabled={!tab.enabled}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
              {!tab.enabled && connected === false && (
                <span className="ml-1 text-xs opacity-70">(Connect Wallet)</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
