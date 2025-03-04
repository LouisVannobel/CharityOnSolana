import { FC, useState, useEffect } from 'react'
import './App.css'
import WalletConnectionProvider from './components/WalletConnectionProvider'
import Layout from './components/Layout'
import Home from './pages/Home'
import NFTGallery from './pages/NFTGallery'
import Dashboard from './pages/Dashboard'
import { NotificationProvider } from './contexts/NotificationContext'
import { CharityProvider } from './contexts/CharityContext'

const App: FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Add event listener for NFT Gallery navigation
  useEffect(() => {
    const handleNFTGalleryNavigation = () => {
      setCurrentPage('nft-gallery');
    };

    window.addEventListener('navigate-to-nft-gallery', handleNFTGalleryNavigation);
    
    return () => {
      window.removeEventListener('navigate-to-nft-gallery', handleNFTGalleryNavigation);
    };
  }, []);

  // Function to handle navigation between pages
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Render the current page based on navigation state
  const renderPage = () => {
    switch (currentPage) {
      case 'nft-gallery':
        return <NFTGallery />;
      case 'my-collection':
        return <Dashboard />;
      case 'dashboard':
        return <Dashboard />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <WalletConnectionProvider>
      <NotificationProvider>
        <CharityProvider>
          <Layout activePage={currentPage} onNavigate={handleNavigate}>
            {renderPage()}
          </Layout>
        </CharityProvider>
      </NotificationProvider>
    </WalletConnectionProvider>
  )
}

export default App
