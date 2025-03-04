import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TokenInfo from '../TokenInfo';

// Create mock functions
const mockUseWallet = vi.fn();
const mockUseConnection = vi.fn().mockReturnValue({
  connection: {},
});

// Mock the wallet adapter hooks
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => mockUseWallet(),
  useConnection: () => mockUseConnection(),
}));

// Mock the LoadingIndicator component
vi.mock('../LoadingIndicator', () => ({
  default: ({ message }: { message: string }) => <div data-testid="loading-indicator">{message}</div>,
}));

// Mock setTimeout to execute immediately
vi.useFakeTimers();

describe('TokenInfo Component', () => {
  it('renders disconnected state when wallet is not connected', () => {
    mockUseWallet.mockReturnValue({
      connected: false,
      publicKey: null,
    });
    
    render(<TokenInfo />);
    expect(screen.getByText('CHAR Token Balance')).toBeDefined();
    expect(screen.getByText('Connect your wallet to view your token balance.')).toBeDefined();
  });

  it('renders connected state with token balance', () => {
    mockUseWallet.mockReturnValue({ 
      connected: true, 
      publicKey: { toBase58: () => 'mockPublicKey' } 
    });
    
    render(<TokenInfo />);
    expect(screen.getByText('CHAR Token Balance')).toBeDefined();
    // Utiliser une fonction pour trouver le texte partiel
    expect(screen.getByText((content) => content.includes('CHAR Tokens are earned'))).toBeDefined();
  });
});
