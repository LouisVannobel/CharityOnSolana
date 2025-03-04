import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Create a mock function for useWallet
const mockUseWallet = vi.fn();

// Mock the wallet adapter hook
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => mockUseWallet(),
}));

// Mock the wallet adapter UI components
vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button data-testid="wallet-button">Connect Wallet</button>,
}));

describe('Header Component', () => {
  it('renders with default title', () => {
    mockUseWallet.mockReturnValue({
      connected: false,
    });
    
    render(<Header />);
    expect(screen.getByText('Charity NFT Platform')).toBeDefined();
    expect(screen.getByTestId('wallet-button')).toBeDefined();
  });

  it('renders with custom title', () => {
    mockUseWallet.mockReturnValue({
      connected: false,
    });
    
    render(<Header title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeDefined();
  });

  it('shows connected status when wallet is connected', () => {
    mockUseWallet.mockReturnValue({
      connected: true,
    });
    
    render(<Header />);
    expect(screen.getByText('Connected')).toBeDefined();
  });
});
