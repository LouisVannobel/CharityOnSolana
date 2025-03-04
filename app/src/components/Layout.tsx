import { FC, ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Layout: FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <div className="container mx-auto px-4 py-4 mt-2">
        <Navigation activePage={activePage} onNavigate={onNavigate} className="mb-6" />
      </div>
      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="fade-in">
          {children}
        </div>
      </main>
      <footer className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">S</span>
                </div>
                <span className="text-xl font-bold">CharityOnSolana</span>
              </div>
              <p className="text-purple-200 text-sm">Supporting charitable causes through Solana blockchain technology</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-purple-200 text-sm mb-1">© {new Date().getFullYear()} CharityOnSolana</p>
              <p className="text-purple-200 text-sm flex items-center justify-center md:justify-end">
                Powered by <img src="https://solana.com/src/img/branding/solanaLogoMark.svg" alt="Solana" className="h-4 ml-2" />
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
