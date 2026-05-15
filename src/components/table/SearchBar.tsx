import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = React.memo(({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-sm flex-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full rounded-md border-0 bg-[#0f172a] py-1.5 pl-10 pr-3 text-slate-200 shadow-sm ring-1 ring-inset ring-[#334155] focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
        placeholder="Search SKU or Product Name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
