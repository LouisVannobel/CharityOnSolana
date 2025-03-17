import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WalletDashboard from '../WalletDashboard';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCharity } from '../../contexts/CharityContext';
import { useNotification } from '../../contexts/NotificationContext';

// Mock the hooks
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: vi.fn(),
}));

vi.mock('../../contexts/CharityContext', () => ({
  useCharity: vi.fn(),
}));

vi.mock('../../contexts/NotificationContext', () => ({
  useNotification: vi.fn(),
}));

// Mock the TransactionHistory component
vi.mock('../../components/TransactionHistory', () => ({
  default: () => <div data-testid="transaction-history">Transaction History</div>,
}));

describe('WalletDashboard', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Default mock implementations
    (useWallet as any).mockReturnValue({
      connected: false,
      publicKey: null,
    });
    
    (useCharity as any).mockReturnValue({
      isLoading: false,
      getUserTokenBalance: vi.fn().mockResolvedValue(0),
      getUserNFTs: vi.fn().mockResolvedValue([]),
    });
    
    (useNotification as any).mockReturnValue({
      showNotification: vi.fn(),
    });
  });
  
  it('should display connect wallet message when wallet is not connected', () => {
    render(<WalletDashboard />);
    
    expect(screen.getByText('Please connect your wallet to view your dashboard.')).toBeInTheDocument();
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });
  
  it('should display loading indicator when loading data', async () => {
    (useWallet as any).mockReturnValue({
      connected: true,
      publicKey: { toString: () => '11111111111111111111111111111111' },
    });
    
    (useCharity as any).mockReturnValue({
      isLoading: true,
      getUserTokenBalance: vi.fn().mockResolvedValue(0),
      getUserNFTs: vi.fn().mockResolvedValue([]),
    });
    
    render(<WalletDashboard />);
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
  
  it('should display user data when wallet is connected and data is loaded', async () => {
    const mockPublicKey = '11111111111111111111111111111111';
    const mockTokenBalance = 100;
    const mockNFTs = [
      { id: '1', name: 'NFT 1', image: 'image1.jpg', tier: 1 },
      { id: '2', name: 'NFT 2', image: 'image2.jpg', tier: 2 },
    ];
    
    (useWallet as any).mockReturnValue({
      connected: true,
      publicKey: { toString: () => mockPublicKey },
    });
    
    (useCharity as any).mockReturnValue({
      isLoading: false,
      getUserTokenBalance: vi.fn().mockResolvedValue(mockTokenBalance),
      getUserNFTs: vi.fn().mockResolvedValue(mockNFTs),
    });
    
    render(<WalletDashboard />);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.getByText('Your Wallet Dashboard')).toBeInTheDocument();
    });
    
    // Check token balance
    await waitFor(() => {
      expect(screen.getByText(mockTokenBalance.toString())).toBeInTheDocument();
    });
    
    // Check wallet address
    await waitFor(() => {
      expect(screen.getByText(mockPublicKey)).toBeInTheDocument();
    });
    
    // Check NFT count
    await waitFor(() => {
      expect(screen.getByText(mockNFTs.length.toString())).toBeInTheDocument();
    });
    
    // Check transaction history component is rendered
    await waitFor(() => {
      expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    });
  });
  
  it('should display empty NFT collection message when user has no NFTs', async () => {
    (useWallet as any).mockReturnValue({
      connected: true,
      publicKey: { toString: () => '11111111111111111111111111111111' },
    });
    
    (useCharity as any).mockReturnValue({
      isLoading: false,
      getUserTokenBalance: vi.fn().mockResolvedValue(50),
      getUserNFTs: vi.fn().mockResolvedValue([]),
    });
    
    render(<WalletDashboard />);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.getByText("You don't own any NFTs yet.")).toBeInTheDocument();
    });
    
    expect(screen.getByText('Browse NFT Gallery')).toBeInTheDocument();
  });
});
