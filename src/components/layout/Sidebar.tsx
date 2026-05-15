'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Settings, Users, Box } from 'lucide-react';
import { cn } from '@/utils/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Suppliers', href: '#', icon: Users },
  { name: 'Settings', href: '#', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#0b0f19] border-r border-[#1e293b]">
      <div className="flex h-16 items-center px-6 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Box className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Aura Engine</span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-3">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-blue-600/10 text-blue-500'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200',
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">Admin User</span>
            <span className="text-xs text-slate-500">Logistics Dept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
