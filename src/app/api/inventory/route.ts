import { NextRequest, NextResponse } from 'next/server';
import { inventoryData } from '@/mock-data/mock-data';
import { InventoryResponse } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  
  // Search
  const search = searchParams.get('search')?.toLowerCase() || '';
  
  // Filters
  const category = searchParams.get('category') || '';
  const minStock = searchParams.get('minStock');
  const maxStock = searchParams.get('maxStock');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  // Sorting
  const sort = searchParams.get('sort') || '';
  const order = searchParams.get('order') || 'asc';

  // Apply filters and search
  const filteredData = inventoryData.filter((item) => {
    let match = true;
    
    if (search) {
      match = match && (
        item.productName.toLowerCase().includes(search) || 
        item.sku.toLowerCase().includes(search)
      );
    }
    
    if (category && category !== 'All') {
      match = match && item.category === category;
    }
    
    if (minStock !== null) {
      match = match && item.stock >= parseInt(minStock, 10);
    }
    
    if (maxStock !== null) {
      match = match && item.stock <= parseInt(maxStock, 10);
    }

    if (minPrice !== null) {
      match = match && item.price >= parseFloat(minPrice);
    }

    if (maxPrice !== null) {
      match = match && item.price <= parseFloat(maxPrice);
    }

    return match;
  });

  // Apply sorting
  if (sort) {
    filteredData.sort((a, b) => {
      const aVal = a[sort as keyof typeof a];
      const bVal = b[sort as keyof typeof b];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  }

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  const response: InventoryResponse = {
    data: paginatedData,
    totalCount,
    totalPages,
    currentPage: page,
  };

  // Simulate network delay to make loading states visible
  await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json(response);
}
