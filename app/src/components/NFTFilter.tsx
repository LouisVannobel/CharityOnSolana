import { FC } from 'react';

type FilterOption = 'all' | 'price-asc' | 'price-desc' | 'availability';

interface NFTFilterProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  className?: string;
}

const NFTFilter: FC<NFTFilterProps> = ({ 
  currentFilter, 
  onFilterChange, 
  className = '' 
}) => {
  const filters: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All NFTs' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'availability', label: 'Availability' },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <div className="text-gray-700 font-medium">Filter by:</div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentFilter === filter.value
              ? 'bg-purple-600 text-white'
              : 'bg-[#f8fafc] text-gray-700 hover:bg-[#e2e8f0]'}`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NFTFilter;
