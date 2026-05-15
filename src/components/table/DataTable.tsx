'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  OnChangeFn,
  PaginationState as TanstackPaginationState,
  SortingState as TanstackSortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInventoryStore } from '@/store/inventoryStore';
import { InventoryItem } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/utils';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Pagination } from './Pagination';

export const DataTable = React.memo(() => {
  const {
    inventory,
    totalCount,
    totalPages,
    loading,
    pagination,
    sorting,
    setPagination,
    setSorting,
    fetchInventory,
  } = useInventoryStore();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: (info) => (
          <span className="font-mono text-slate-300 text-sm">{info.getValue() as string}</span>
        ),
        size: 120,
      },
      {
        accessorKey: 'productName',
        header: 'Product Name',
        cell: (info) => <span className="font-medium text-slate-100">{info.getValue() as string}</span>,
        size: 300,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => (
          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
            {info.getValue() as string}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: (info) => {
          const val = info.getValue() as number;
          return (
            <span
              className={`font-semibold ${
                val === 0 ? 'text-red-400' : val < 50 ? 'text-yellow-400' : 'text-emerald-400'
              }`}
            >
              {formatNumber(val)}
            </span>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: (info) => <span className="text-slate-200">{formatCurrency(info.getValue() as number)}</span>,
        size: 120,
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier',
        cell: (info) => <span className="text-slate-400 text-sm">{info.getValue() as string}</span>,
        size: 200,
      },
      {
        accessorKey: 'lastUpdated',
        header: 'Last Updated',
        cell: (info) => (
          <span className="text-slate-400 text-sm">
            {format(new Date(info.getValue() as string), 'MMM d, yyyy')}
          </span>
        ),
        size: 150,
      },
    ],
    []
  );

  const handlePaginationChange = useCallback<OnChangeFn<TanstackPaginationState>>(
    (updater) => {
      if (typeof updater === 'function') {
        setPagination(updater);
      } else {
        setPagination(() => updater);
      }
    },
    [setPagination]
  );

  const handleSortingChange = useCallback<OnChangeFn<TanstackSortingState>>(
    (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater([{ id: sorting.id, desc: sorting.desc }]);
        if (newSorting.length > 0) {
          setSorting({ id: newSorting[0].id, desc: newSorting[0].desc });
        }
      }
    },
    [setSorting, sorting]
  );

  const table = useReactTable({
    data: inventory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    state: {
      pagination,
      sorting: [{ id: sorting.id, desc: sorting.desc }],
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-auto rounded-lg border border-[#334155] bg-[#0b0f19] shadow-sm custom-scrollbar relative"
      >
        {loading && inventory.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b0f19]/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 z-20 bg-[#1e293b] border-b border-[#334155] shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-4 py-3 font-semibold text-slate-300 transition-colors hover:bg-[#334155] cursor-pointer group"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp className="h-4 w-4 text-blue-400" />,
                        desc: <ChevronDown className="h-4 w-4 text-blue-400" />,
                      }[header.column.getIsSorted() as string] ?? (
                        <ChevronUp className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              display: 'block',
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  className="absolute w-full flex border-b border-[#1e293b] transition-colors hover:bg-[#1e293b]/50 group"
                  style={{
                    top: 0,
                    left: 0,
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 flex items-center"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {!loading && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <p>No inventory records found.</p>
          </div>
        )}
      </div>

      <Pagination table={table} totalCount={totalCount} totalPages={totalPages} />
    </div>
  );
});

DataTable.displayName = 'DataTable';
