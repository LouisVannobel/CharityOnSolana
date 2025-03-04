import { FC, useState } from 'react';
import { useCharity } from '../contexts/CharityContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNotification } from '../contexts/NotificationContext';
import NFTCard from '../components/NFTCard';
import NFTFilter from '../components/NFTFilter';
import LoadingIndicator from '../components/LoadingIndicator';
import PurchaseModal from '../components/PurchaseModal';
import TransactionStatus from '../components/TransactionStatus';
import { NFTTier } from '../services/CharityService';

type FilterOption = 'all' | 'price-asc' | 'price-desc' | 'availability';

const NFTGallery: FC = () => {
  const { 
    nftTiers, 
    isLoading, 
    purchaseNFT, 
    transactionState, 
    transactionSignature, 
    transactionMessage, 
    resetTransactionState 
  } = useCharity();
  const { connected } = useWallet();
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState<FilterOption>('all');
  const [selectedNFT, setSelectedNFT] = useState<NFTTier | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Handle purchase button click
  const handlePurchaseClick = (nft: NFTTier) => {
    if (!connected) {
      showNotification('warning', 'Please connect your wallet to purchase an NFT');
      return;
    }
    setSelectedNFT(nft);
    setIsPurchaseModalOpen(true);
  };
  
  // Handle purchase confirmation
  const handlePurchaseConfirm = async () => {
    if (selectedNFT) {
      setIsPurchaseModalOpen(false);
      await purchaseNFT(selectedNFT.id);
    }
  };
  
  // Handle purchase modal close
  const handlePurchaseModalClose = () => {
    setIsPurchaseModalOpen(false);
  };
  
  // Handle transaction status close
  const handleTransactionStatusClose = () => {
    resetTransactionState();
  };

  // Apply filters to NFT tiers
  const filteredNFTs = () => {
    let filtered = [...nftTiers];
    
    switch (filter) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'availability':
        filtered.sort((a, b) => b.available - a.available);
        break;
      default:
        // Default sorting by tier ID
        filtered.sort((a, b) => a.id - b.id);
    }
    
    return filtered;
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-2">NFT Gallery</h1>
        <p className="text-xl text-white">
          Browse and purchase unique NFTs to support our charitable cause
        </p>
      </section>

      <NFTFilter currentFilter={filter} onFilterChange={setFilter} />

      {isLoading && transactionState === 'none' ? (
        <div className="flex justify-center py-12">
          <LoadingIndicator size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs().map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onPurchase={() => handlePurchaseClick(nft)}
              disabled={!connected || nft.available === 0}
            />
          ))}
        </div>
      )}

      {nftTiers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No NFTs available at the moment. Please check back later.</p>
        </div>
      )}
      
      {/* Purchase Confirmation Modal */}
      {selectedNFT && (
        <PurchaseModal
          nft={selectedNFT}
          isOpen={isPurchaseModalOpen}
          isProcessing={isLoading}
          onClose={handlePurchaseModalClose}
          onConfirm={handlePurchaseConfirm}
        />
      )}
      
      {/* Transaction Status Modal */}
      <TransactionStatus
        state={transactionState}
        message={transactionMessage}
        txSignature={transactionSignature}
        onClose={handleTransactionStatusClose}
      />
    </div>
  );
};

export default NFTGallery;
