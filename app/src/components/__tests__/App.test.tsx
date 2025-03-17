import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Mock the wallet connection provider
vi.mock('../WalletConnectionProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="wallet-provider">{children}</div>,
}));

// Mock the charity context
vi.mock('../../contexts/CharityContext', () => ({
  CharityProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="charity-provider">{children}</div>,
}));

// Mock the notification context
vi.mock('../../contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="notification-provider">{children}</div>,
}));

// Mock Layout component
vi.mock('../Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

// Mock Home page
vi.mock('../../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

// Mock wallet adapter hooks
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    publicKey: null,
    connected: false,
    wallet: null,
    wallets: [],
  }),
  useConnection: () => ({
    connection: {},
  }),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('wallet-provider')).toBeDefined();
    expect(screen.getByTestId('notification-provider')).toBeDefined();
    expect(screen.getByTestId('charity-provider')).toBeDefined();
    expect(screen.getByTestId('layout')).toBeDefined();
    expect(screen.getByTestId('home-page')).toBeDefined();
  });
});
