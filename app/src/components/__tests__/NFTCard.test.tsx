import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NFTCard from '../NFTCard';
import { NFTTier } from '../../services/CharityService';

describe('NFTCard Component', () => {
  const mockNFT: NFTTier = {
    id: 1,
    name: 'Test NFT',
    price: 2.5,
    available: 10,
    total: 20,
    imageUrl: 'https://example.com/image.jpg',
    description: 'Test description',
  };

  const mockPurchase = vi.fn();

  beforeEach(() => {
    mockPurchase.mockClear();
  });

  it('renders NFT card with correct information', () => {
    render(<NFTCard nft={mockNFT} onPurchase={mockPurchase} disabled={false} />);
    
    expect(screen.getByText('Test NFT')).toBeDefined();
    expect(screen.getByText('Test description')).toBeDefined();
    expect(screen.getByText('2.5 SOL')).toBeDefined();
    expect(screen.getByText('10/20')).toBeDefined();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    const purchaseButton = screen.getByRole('button', { name: 'Purchase NFT' });
    expect(purchaseButton).toBeDefined();
    expect(purchaseButton.hasAttribute('disabled')).toBe(false);
  });

  it('calls onPurchase when purchase button is clicked', () => {
    render(<NFTCard nft={mockNFT} onPurchase={mockPurchase} disabled={false} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Purchase NFT' }));
    expect(mockPurchase).toHaveBeenCalledTimes(1);
  });

  it('disables purchase button when disabled prop is true', () => {
    render(<NFTCard nft={mockNFT} onPurchase={mockPurchase} disabled={true} />);
    
    const purchaseButton = screen.getByRole('button', { name: 'Purchase NFT' });
    expect(purchaseButton.hasAttribute('disabled')).toBe(true);
  });

  it('shows "Sold Out" when available is 0', () => {
    const soldOutNFT = { ...mockNFT, available: 0 };
    render(<NFTCard nft={soldOutNFT} onPurchase={mockPurchase} disabled={true} />);
    
    expect(screen.getByRole('button', { name: 'Sold Out' })).toBeDefined();
    const soldOutButton = screen.getByRole('button', { name: 'Sold Out' });
    expect(soldOutButton.hasAttribute('disabled')).toBe(true);
  });
});
