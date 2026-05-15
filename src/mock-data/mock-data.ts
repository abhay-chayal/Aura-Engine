import { faker } from '@faker-js/faker';
import { InventoryItem } from '@/types';

// Ensure we generate the same data consistently if needed, or random is fine.
// We'll generate a random dataset but keep it in memory so it doesn't change on every request.
faker.seed(123);

const CATEGORIES = [
  'Electronics',
  'Apparel',
  'Home & Garden',
  'Automotive',
  'Health & Beauty',
  'Toys & Games',
  'Office Supplies',
  'Industrial',
];

const SUPPLIERS = [
  'GlobalTech Industries',
  'Apex Manufacturing',
  'Quantum Logistics',
  'Nexus Supply Co.',
  'Zenith Corp',
  'Titan Distributors',
];

export const generateInventory = (count: number): InventoryItem[] => {
  const items: InventoryItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: faker.string.uuid(),
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      productName: faker.commerce.productName(),
      category: faker.helpers.arrayElement(CATEGORIES),
      stock: faker.number.int({ min: 0, max: 1500 }),
      price: parseFloat(faker.commerce.price({ min: 5, max: 2000, dec: 2 })),
      supplier: faker.helpers.arrayElement(SUPPLIERS),
      lastUpdated: faker.date.recent({ days: 30 }).toISOString(),
    });
  }
  return items;
};

// Next.js API routes in dev mode can be re-instantiated. 
// We use a global variable to store the mock data so it persists across hot reloads.
declare global {
// eslint-disable-next-line no-var
  var __inventoryData: InventoryItem[] | undefined;
}

if (!global.__inventoryData) {
  console.log('Generating 50,000 mock inventory records...');
  global.__inventoryData = generateInventory(50000);
  console.log('Mock data generation complete.');
}

export const inventoryData = global.__inventoryData;
