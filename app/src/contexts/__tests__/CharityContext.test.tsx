import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CharityProvider, useCharity } from '../CharityContext';
import { NFT_TIERS } from '../../services/CharityService';

// Mock the necessary dependencies
vi.mock('@solana/wallet-adapter-react', () => ({
  useConnection: vi.fn().mockReturnValue({
    connection: {},
  }),
  useWallet: vi.fn().mockReturnValue({
    connected: false,
    publicKey: null,
  }),
}));

vi.mock('../../services/CharityService', () => ({
  default: vi.fn().mockImplementation(() => ({
    getNFTTiers: vi.fn().mockResolvedValue([
      { id: 1, name: 'Test Tier', price: 1, available: 10, total: 10, imageUrl: '', description: '' },
    ]),
    purchaseNFT: vi.fn().mockResolvedValue('mockSignature'),
  })),
  NFT_TIERS: [
    { id: 1, name: 'Test Tier', price: 1, available: 10, total: 10, imageUrl: '', description: '' },
  ],
}));

vi.mock('../NotificationContext', () => ({
  useNotification: vi.fn().mockReturnValue({
    showNotification: vi.fn(),
  }),
}));

// Test component that uses the charity context
const TestComponent = () => {
  const { nftTiers, isLoading } = useCharity();
  
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>NFT Tiers: {nftTiers.length}</p>
          {nftTiers.map(tier => (
            <p key={tier.id}>{tier.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};

describe('CharityContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('provides NFT tiers and loading state', async () => {
    render(
      <CharityProvider>
        <TestComponent />
      </CharityProvider>
    );
    
    // Initially loading
    expect(screen.getByText('Loading...')).toBeDefined();
    
    // After loading
    await waitFor(() => {
      expect(screen.getByText('NFT Tiers: 1')).toBeDefined();
      expect(screen.getByText('Test Tier')).toBeDefined();
    });
  });
});
