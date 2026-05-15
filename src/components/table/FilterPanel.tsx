import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Electronics',
  'Apparel',
  'Home & Garden',
  'Automotive',
  'Health & Beauty',
  'Toys & Games',
  'Office Supplies',
  'Industrial',
];

interface FilterPanelProps {
  category: string;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}

export const FilterPanel = React.memo(({ category, onCategoryChange, onReset }: FilterPanelProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <select
          className="block w-full rounded-md border-0 bg-[#0f172a] py-1.5 pl-3 pr-10 text-slate-200 ring-1 ring-inset ring-[#334155] focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-[#334155] transition-colors"
        >
          <X className="-ml-0.5 h-4 w-4" aria-hidden="true" />
          Reset
        </button>
        <button className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
          <SlidersHorizontal className="-ml-0.5 h-4 w-4" aria-hidden="true" />
          More Filters
        </button>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';
