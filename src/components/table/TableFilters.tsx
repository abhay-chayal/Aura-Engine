'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';

export const TableFilters = React.memo(() => {
  const { filters, setFilters, setSearchQuery, resetFilters } = useInventoryStore();
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleCategoryChange = useCallback((category: string) => {
    setFilters({ category });
  }, [setFilters]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
  }, []);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-[#1e293b]/50 p-4 rounded-lg border border-[#334155]">
      <div className="flex flex-1 items-center gap-4">
        <SearchBar value={localSearch} onChange={handleSearchChange} />
        <FilterPanel 
          category={filters.category} 
          onCategoryChange={handleCategoryChange} 
          onReset={resetFilters} 
        />
      </div>
    </div>
  );
});

TableFilters.displayName = 'TableFilters';
