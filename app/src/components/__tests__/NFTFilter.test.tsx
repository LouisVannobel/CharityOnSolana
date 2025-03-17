import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NFTFilter from '../NFTFilter';

describe('NFTFilter Component', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders all filter options', () => {
    render(<NFTFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByText('All NFTs')).toBeDefined();
    expect(screen.getByText('Price: Low to High')).toBeDefined();
    expect(screen.getByText('Price: High to Low')).toBeDefined();
    expect(screen.getByText('Availability')).toBeDefined();
  });

  it('highlights the current filter option', () => {
    render(<NFTFilter currentFilter="price-asc" onFilterChange={mockOnFilterChange} />);
    
    const priceAscButton = screen.getByText('Price: Low to High');
    const allButton = screen.getByText('All NFTs');
    
    // This test assumes the active button has a different background color
    // You may need to adjust this test based on your actual styling implementation
    expect(priceAscButton.className).toContain('bg-purple-600');
    expect(allButton.className).not.toContain('bg-purple-600');
  });

  it('calls onFilterChange with correct value when a filter is clicked', () => {
    render(<NFTFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);
    
    fireEvent.click(screen.getByText('Price: High to Low'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('price-desc');
    
    fireEvent.click(screen.getByText('Availability'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('availability');
  });
});
