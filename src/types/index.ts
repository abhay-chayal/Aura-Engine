export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
  lastUpdated: string; // ISO date string
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface FilterState {
  category: string;
  stockMin: number;
  stockMax: number;
  priceMin: number;
  priceMax: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface InventoryResponse {
  data: InventoryItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface KpiData {
  totalSkus: number;
  totalValue: number;
  outOfStock: number;
  lowStock: number;
}

export interface RestockData {
  productName: string;
  stock: number;
}

export interface CategoryDistributionData {
  category: string;
  value: number;
}

export interface DashboardResponse {
  kpis: KpiData;
  restockPriority: RestockData[];
  categoryDistribution: CategoryDistributionData[];
}
