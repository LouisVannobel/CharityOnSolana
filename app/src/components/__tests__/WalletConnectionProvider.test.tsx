import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import WalletConnectionProvider from '../WalletConnectionProvider';

// Mock the wallet adapter dependencies
vi.mock('@solana/wallet-adapter-react', () => ({
  ConnectionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="connection-provider">{children}</div>
  ),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wallet-provider">{children}</div>
  ),
  WalletAdapterNetwork: { Devnet: 'devnet' },
}));

vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletModalProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wallet-modal-provider">{children}</div>
  ),
}));

vi.mock('@solana/wallet-adapter-wallets', () => ({
  PhantomWalletAdapter: vi.fn().mockImplementation(() => ({})),
  SolflareWalletAdapter: vi.fn().mockImplementation(() => ({})),
  TorusWalletAdapter: vi.fn().mockImplementation(() => ({})),
  LedgerWalletAdapter: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('@solana/web3.js', () => ({
  clusterApiUrl: vi.fn().mockReturnValue('https://api.devnet.solana.com'),
}));

describe('WalletConnectionProvider Component', () => {
  it('renders correctly with children', () => {
    const { getByTestId, getByText } = render(
      <WalletConnectionProvider>
        <div>Test Child</div>
      </WalletConnectionProvider>
    );
    
    expect(getByTestId('connection-provider')).toBeDefined();
    expect(getByTestId('wallet-provider')).toBeDefined();
    expect(getByTestId('wallet-modal-provider')).toBeDefined();
    expect(getByText('Test Child')).toBeDefined();
  });
});
