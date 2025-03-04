import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title = 'CharityOnSolana' }) => {
  const { connected } = useWallet();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-2xl font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {connected && (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Connected</span>
            </div>
          )}
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
