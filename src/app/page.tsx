'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { KpiCard } from '@/components/charts/KpiCard';
import { RestockChart } from '@/components/charts/RestockChart';
import { CategoryDistributionChart } from '@/components/charts/CategoryDistributionChart';
import { formatCurrency, formatNumber } from '@/utils/utils';
import { PackageOpen, CircleDollarSign, AlertOctagon, TrendingDown, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, error, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error loading dashboard data: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-white tracking-tight">Command Center</h1>
          <p className="mt-2 text-sm text-slate-400">
            Real-time executive overview of your global inventory network.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total SKUs"
          value={formatNumber(data.kpis.totalSkus)}
          icon={PackageOpen}
          trend="+12%"
          trendUp={true}
        />
        <KpiCard
          title="Total Inventory Value"
          value={formatCurrency(data.kpis.totalValue)}
          icon={CircleDollarSign}
          trend="+5.4%"
          trendUp={true}
        />
        <KpiCard
          title="Out of Stock Items"
          value={formatNumber(data.kpis.outOfStock)}
          icon={AlertOctagon}
          trend="-2.1%"
          trendUp={true}
        />
        <KpiCard
          title="Low Stock Alerts"
          value={formatNumber(data.kpis.lowStock)}
          icon={TrendingDown}
          trend="+8.2%"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50 p-6 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-base font-semibold leading-6 text-white">Restock Priority (Critical)</h3>
            <p className="text-sm text-slate-400">Top 10 products with the lowest stock levels</p>
          </div>
          <RestockChart data={data.restockPriority} />
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50 p-6 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-base font-semibold leading-6 text-white">Inventory Distribution</h3>
            <p className="text-sm text-slate-400">Total value locked per product category</p>
          </div>
          <CategoryDistributionChart data={data.categoryDistribution} />
        </div>
      </div>
    </div>
  );
}
