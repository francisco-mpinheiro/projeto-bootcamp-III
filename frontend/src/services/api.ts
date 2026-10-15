import type {
  CreateMovementInput,
  CreateProductInput,
  DashboardSummary,
  Movement,
  MovementResponse,
  Product,
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Erro ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
      if (data.details) {
        const detailsStr = Array.isArray(data.details)
          ? data.details.map((d: { message: string }) => d.message).join(', ')
          : JSON.stringify(data.details);
        errorMsg += ` (${detailsStr})`;
      }
    } catch {
      // payload not JSON
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    return handleResponse<DashboardSummary>(res);
  },

  async getProducts(params?: { search?: string; category?: string; status?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);

    const url = `${API_BASE}/products${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<Product[]>(res);
  },

  async getAlerts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/alerts`);
    return handleResponse<Product[]>(res);
  },

  async createProduct(data: CreateProductInput): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: number, data: Partial<CreateProductInput>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },

  async registerMovement(data: CreateMovementInput): Promise<MovementResponse> {
    const res = await fetch(`${API_BASE}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<MovementResponse>(res);
  },

  async getMovements(params?: { productId?: number; limit?: number }): Promise<Movement[]> {
    const query = new URLSearchParams();
    if (params?.productId) query.append('productId', String(params.productId));
    if (params?.limit) query.append('limit', String(params.limit));

    const url = `${API_BASE}/movements${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<Movement[]>(res);
  },
};
