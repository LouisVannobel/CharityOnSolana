import { FC } from 'react';
import { NFTTier } from '../services/CharityService';
import LoadingIndicator from './LoadingIndicator';

interface PurchaseModalProps {
  nft: NFTTier;
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PurchaseModal: FC<PurchaseModalProps> = ({
  nft,
  isOpen,
  isProcessing,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const { name, price, imageUrl } = nft;
  const rewardTokens = price * 10; // 10 tokens per SOL

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="relative pb-[50%] overflow-hidden bg-[#f8fafc]">
          <img 
            src={imageUrl} 
            alt={name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{name}</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold text-purple-600">{price} SOL</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Reward Tokens:</span>
              <span className="font-semibold text-green-600">+{rewardTokens} CHAR</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-700 mb-2">
                By purchasing this NFT, you are supporting our charitable cause. The NFT will be sent to your wallet, and you will receive CHAR tokens as a thank you for your contribution.
              </p>
              <p className="text-sm text-gray-500">
                Note: Transaction fees will be applied by the Solana network.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 border border-transparent rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isProcessing ? (
                <>
                  <LoadingIndicator size="small" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                'Confirm Purchase'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
