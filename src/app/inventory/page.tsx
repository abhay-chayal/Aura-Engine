import { DataTable } from '@/components/table/DataTable';
import { TableFilters } from '@/components/table/TableFilters';
import { ExportButton } from '@/components/ExportButton';

export default function InventoryPage() {
  return (
    <div className="flex h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-white tracking-tight">Inventory Management</h1>
          <p className="mt-2 text-sm text-slate-400">
            A comprehensive overview of your warehouse inventory, stock levels, and product distribution.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <ExportButton />
        </div>
      </div>
      
      <div className="mt-6">
        <TableFilters />
      </div>

      <div className="mt-6 flex-1 min-h-0">
        <DataTable />
      </div>
    </div>
  );
}
