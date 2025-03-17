import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import CharityService, { NFTTier } from '../services/CharityService';
import { useNotification } from './NotificationContext';
import { TransactionState } from '../components/TransactionStatus';

interface CharityContextType {
  nftTiers: NFTTier[];
  isLoading: boolean;
  transactionState: TransactionState;
  transactionSignature: string | undefined;
  transactionMessage: string | undefined;
  purchaseNFT: (tierId: number) => Promise<void>;
  refreshData: () => Promise<void>;
  resetTransactionState: () => void;
  getUserTokenBalance: () => Promise<number>;
  getUserNFTs: () => Promise<any[]>;
}

const CharityContext = createContext<CharityContextType | undefined>(undefined);

export const useCharity = () => {
  const context = useContext(CharityContext);
  if (context === undefined) {
    throw new Error('useCharity must be used within a CharityProvider');
  }
  return context;
};

interface CharityProviderProps {
  children: ReactNode;
}

export const CharityProvider: FC<CharityProviderProps> = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { showNotification } = useNotification();
  
  const [charityService] = useState(() => new CharityService(connection));
  const [nftTiers, setNftTiers] = useState<NFTTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionState, setTransactionState] = useState<TransactionState>('none');
  const [transactionSignature, setTransactionSignature] = useState<string | undefined>(undefined);
  const [transactionMessage, setTransactionMessage] = useState<string | undefined>(undefined);

  const fetchNFTTiers = async () => {
    try {
      setIsLoading(true);
      const tiers = await charityService.getNFTTiers();
      setNftTiers(tiers);
    } catch (error) {
      console.error('Error fetching NFT tiers:', error);
      showNotification('error', 'Failed to fetch NFT tiers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseNFT = async (tierId: number) => {
    if (!wallet.connected || !wallet.publicKey) {
      showNotification('error', 'Please connect your wallet to purchase an NFT.');
      return;
    }

    try {
      // Set transaction state to processing
      setTransactionState('processing');
      setTransactionMessage('Processing your NFT purchase...');
      setTransactionSignature(undefined);
      setIsLoading(true);
      
      // Execute purchase transaction
      const signature = await charityService.purchaseNFT(wallet, tierId);
      setTransactionSignature(signature);
      
      // Update transaction state to success
      setTransactionState('success');
      setTransactionMessage('Your NFT has been purchased successfully! Reward tokens have been sent to your wallet.');
      showNotification('success', `NFT purchased successfully! Transaction: ${signature.slice(0, 8)}...`);
      
      // Refresh data after purchase
      await fetchNFTTiers();
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      
      // Update transaction state to error
      setTransactionState('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTransactionMessage(`Failed to purchase NFT: ${errorMessage}`);
      showNotification('error', `Failed to purchase NFT: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchNFTTiers();
  };
  
  const resetTransactionState = () => {
    setTransactionState('none');
    setTransactionSignature(undefined);
    setTransactionMessage(undefined);
  };
  
  const getUserTokenBalance = async (): Promise<number> => {
    if (!wallet.publicKey) return 0;
    
    try {
      return await charityService.getTokenBalance(wallet.publicKey.toString());
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  };
  
  const getUserNFTs = async (): Promise<any[]> => {
    if (!wallet.publicKey) return [];
    
    try {
      return await charityService.getUserNFTs(wallet.publicKey.toString());
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchNFTTiers();
  }, [connection]);

  return (
    <CharityContext.Provider
      value={{
        nftTiers,
        isLoading,
        transactionState,
        transactionSignature,
        transactionMessage,
        purchaseNFT,
        refreshData,
        resetTransactionState,
        getUserTokenBalance,
        getUserNFTs,
      }}
    >
      {children}
    </CharityContext.Provider>
  );
};

export default CharityProvider;
