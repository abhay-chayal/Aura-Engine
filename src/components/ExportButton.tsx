'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { useInventoryStore } from '@/store/inventoryStore';
import { inventoryService } from '@/services/inventoryService';
import { toast } from 'sonner';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { filters, searchQuery, sorting } = useInventoryStore();

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Preparing CSV export...', {
      description: 'Fetching large dataset from server...',
    });

    try {
      const data = await inventoryService.exportFilteredInventory(filters, searchQuery, sorting);
      
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Export Successful', {
        id: toastId,
        description: `Successfully exported ${data.length} records.`,
      });
    } catch (error) {
      console.error('Failed to export CSV', error);
      toast.error('Export Failed', {
        id: toastId,
        description: 'An error occurred while downloading your data.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-x-2 rounded-md bg-[#1e293b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#334155] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#334155] transition-colors disabled:opacity-50"
    >
      {isExporting ? (
        <Loader2 className="-ml-0.5 h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="-ml-0.5 h-4 w-4" aria-hidden="true" />
      )}
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
}
