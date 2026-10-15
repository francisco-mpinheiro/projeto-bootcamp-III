export type StockStatus = 'NORMAL' | 'LOW' | 'CRITICAL';

export interface Product {
  id: number;
  name: string;
  category: string;
  sku?: string | null;
  unit: string;
  currentStock: number;
  minStock: number;
  price?: number | null;
  status: StockStatus;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    movements: number;
  };
}

export type MovementType = 'ENTRY' | 'EXIT';

export interface Movement {
  id: number;
  productId: number;
  type: MovementType;
  quantity: number;
  reason?: string | null;
  createdAt: string;
  product?: {
    id: number;
    name: string;
    unit: string;
    category?: string;
    minStock?: number;
  };
}

export interface DashboardMetrics {
  totalProducts: number;
  totalStockUnits: number;
  outOfStockCount: number;
  lowStockCount: number;
  normalStockCount: number;
  totalAlerts: number;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  alertProducts: Product[];
  recentMovements: Movement[];
}

export interface CreateProductInput {
  name: string;
  category: string;
  sku?: string;
  unit?: string;
  currentStock: number;
  minStock: number;
  price?: number;
}

export interface CreateMovementInput {
  productId: number;
  type: MovementType;
  quantity: number;
  reason?: string;
}

export interface MovementResponse {
  movement: Movement;
  product: Product;
  alertTriggered: boolean;
}
