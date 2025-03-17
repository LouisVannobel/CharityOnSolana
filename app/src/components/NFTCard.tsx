import { FC } from 'react';
import { NFTTier } from '../services/CharityService';

interface NFTCardProps {
  nft: NFTTier;
  onPurchase: () => void;
  disabled: boolean;
  className?: string;
}

const NFTCard: FC<NFTCardProps> = ({ nft, onPurchase, disabled, className = '' }) => {
  const { name, price, available, total, imageUrl, description } = nft;
  
  // Calculate availability percentage for progress bar
  const availabilityPercentage = (available / total) * 100;
  
  return (
    <div className={`nft-card group ${className}`}>
      {/* Badge for availability */}
      {available === 0 ? (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Sold Out
        </div>
      ) : available <= 3 ? (
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Only {available} left!
        </div>
      ) : null}
      
      {/* Image container with hover effect */}
      <div className="nft-image-container pb-[75%] relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="nft-image absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay with info on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm mb-2 line-clamp-3">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{name}</h3>
          <div className="flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-lg px-3 py-1">
            {price} SOL
          </div>
        </div>
        
        {/* Availability indicator */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Availability</span>
            <span className="text-gray-800 font-medium">{available}/{total}</span>
          </div>
          
          {/* Progress bar with gradient */}
          <div className="w-full bg-[#f8fafc] rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500" 
              style={{ width: `${availabilityPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Purchase button */}
        <button
          onClick={onPurchase}
          disabled={disabled}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
            disabled 
              ? 'bg-[#f8fafc] text-gray-400 cursor-not-allowed border border-gray-200' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {available === 0 ? 'Sold Out' : 'Purchase NFT'}
        </button>
      </div>
    </div>
  );
};

export default NFTCard;
