import { PaginationState, FilterState, SortingState, InventoryResponse, DashboardResponse, InventoryItem } from '@/types';

class InventoryService {
  /**
   * Fetches the paginated and filtered inventory list.
   */
  async getInventory(
    pagination: PaginationState,
    filters: FilterState,
    searchQuery: string,
    sorting: SortingState
  ): Promise<InventoryResponse> {
    const params = new URLSearchParams({
      page: (pagination.pageIndex + 1).toString(),
      limit: pagination.pageSize.toString(),
      search: searchQuery,
      sort: sorting.id,
      order: sorting.desc ? 'desc' : 'asc',
    });

    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters.stockMin !== undefined) params.append('minStock', filters.stockMin.toString());
    if (filters.stockMax !== undefined) params.append('maxStock', filters.stockMax.toString());
    if (filters.priceMin !== undefined) params.append('minPrice', filters.priceMin.toString());
    if (filters.priceMax !== undefined) params.append('maxPrice', filters.priceMax.toString());

    const res = await fetch(`/api/inventory?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  }

  /**
   * Fetches the dashboard analytics KPIs and chart data.
   */
  async getDashboardAnalytics(): Promise<DashboardResponse> {
    const res = await fetch('/api/export'); // Using the mock export endpoint to aggregate data
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    const inventory: InventoryItem[] = await res.json();

    const totalSkus = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0);
    const outOfStock = inventory.filter((item) => item.stock === 0).length;
    const lowStock = inventory.filter((item) => item.stock > 0 && item.stock < 50).length;

    const restockPriority = [...inventory]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10)
      .map((item) => ({ productName: item.productName, stock: item.stock }));

    const categories = inventory.reduce((acc: Record<string, number>, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.price * item.stock;
      return acc;
    }, {});

    const categoryDistribution = Object.entries(categories)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);

    return {
      kpis: { totalSkus, totalValue, outOfStock, lowStock },
      restockPriority,
      categoryDistribution,
    };
  }

  /**
   * Fetches all filtered inventory items for exporting.
   */
  async exportFilteredInventory(
    filters: FilterState,
    searchQuery: string,
    sorting: SortingState
  ): Promise<InventoryItem[]> {
    const params = new URLSearchParams({
      search: searchQuery,
      sort: sorting.id,
      order: sorting.desc ? 'desc' : 'asc',
    });

    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters.stockMin !== undefined) params.append('minStock', filters.stockMin.toString());
    if (filters.stockMax !== undefined) params.append('maxStock', filters.stockMax.toString());
    if (filters.priceMin !== undefined) params.append('minPrice', filters.priceMin.toString());
    if (filters.priceMax !== undefined) params.append('maxPrice', filters.priceMax.toString());

    const res = await fetch(`/api/export?${params.toString()}`);
    if (!res.ok) throw new Error('Export failed');
    return res.json();
  }
}

export const inventoryService = new InventoryService();
