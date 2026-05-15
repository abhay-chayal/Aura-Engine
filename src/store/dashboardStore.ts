/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { DashboardResponse } from '@/types';

interface DashboardStore {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  
  fetchDashboardData: () => Promise<void>;
}

import { inventoryService } from '@/services/inventoryService';

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await inventoryService.getDashboardAnalytics();
      set({ data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
