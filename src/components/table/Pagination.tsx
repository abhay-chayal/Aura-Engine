import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { InventoryItem } from '@/types';

interface PaginationProps {
  table: Table<InventoryItem>;
  totalCount: number;
  totalPages: number;
}

export const Pagination = React.memo(({ table, totalCount, totalPages }: PaginationProps) => {
  const state = table.getState();
  const pageIndex = state.pagination.pageIndex;
  const pageSize = state.pagination.pageSize;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b]/50 border border-[#334155] rounded-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="relative inline-flex items-center rounded-md border border-[#334155] bg-[#0f172a] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#1e293b] disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="relative ml-3 inline-flex items-center rounded-md border border-[#334155] bg-[#0f172a] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#1e293b] disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Showing <span className="font-medium text-slate-200">{pageIndex * pageSize + 1}</span> to{' '}
            <span className="font-medium text-slate-200">
              {Math.min((pageIndex + 1) * pageSize, totalCount)}
            </span>{' '}
            of <span className="font-medium text-slate-200">{totalCount}</span> results
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-[#334155] hover:bg-[#1e293b] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronUp className="h-5 w-5 -rotate-90" aria-hidden="true" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-[#334155] hover:bg-[#1e293b] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronUp className="h-5 w-5 rotate-90" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';
