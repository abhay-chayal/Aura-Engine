/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { InventoryItem, PaginationState, FilterState, SortingState } from '@/types';

interface InventoryStore {
  inventory: InventoryItem[];
  totalCount: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  // State
  pagination: PaginationState;
  filters: FilterState;
  searchQuery: string;
  sorting: SortingState;

  // Actions
  setInventory: (data: InventoryItem[], totalCount: number, totalPages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  setPagination: (updater: (old: PaginationState) => PaginationState) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSearchQuery: (query: string) => void;
  setSorting: (sorting: SortingState) => void;
  resetFilters: () => void;
  
  fetchInventory: () => Promise<void>;
}

const initialFilters: FilterState = {
  category: 'All',
  stockMin: 0,
  stockMax: 2000,
  priceMin: 0,
  priceMax: 3000,
};

import { inventoryService } from '@/services/inventoryService';

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],
  totalCount: 0,
  totalPages: 0,
  loading: false,
  error: null,

  pagination: { pageIndex: 0, pageSize: 50 },
  filters: initialFilters,
  searchQuery: '',
  sorting: { id: 'lastUpdated', desc: true },

  setInventory: (inventory, totalCount, totalPages) => set({ inventory, totalCount, totalPages }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setPagination: (updater) => {
    set((state) => {
      const newPagination = updater(state.pagination);
      return { pagination: newPagination };
    });
    get().fetchInventory();
  },

  setFilters: (newFilters) => {
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, pageIndex: 0 } // Reset page on filter change
    }));
    get().fetchInventory();
  },

  setSearchQuery: (searchQuery) => {
    set((state) => ({ 
      searchQuery,
      pagination: { ...state.pagination, pageIndex: 0 } // Reset page on search
    }));
    get().fetchInventory();
  },

  setSorting: (sorting) => {
    set({ sorting });
    get().fetchInventory();
  },

  resetFilters: () => {
    set({ filters: initialFilters, searchQuery: '', pagination: { pageIndex: 0, pageSize: 50 } });
    get().fetchInventory();
  },

  fetchInventory: async () => {
    const { pagination, filters, searchQuery, sorting } = get();
    set({ loading: true, error: null });

    try {
      const data = await inventoryService.getInventory(pagination, filters, searchQuery, sorting);
      set({
        inventory: data.data,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
