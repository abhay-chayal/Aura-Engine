import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function KpiCard({ title, value, icon: Icon, trend, trendUp }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#1e293b]/60 border border-[#334155] p-6 shadow-sm backdrop-blur-md transition-all hover:bg-[#1e293b] hover:shadow-md group">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0f172a] border border-[#334155] shadow-inner">
          <Icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend}
          </span>
          <span className="ml-2 text-slate-500">from last month</span>
        </div>
      )}
    </div>
  );
}
