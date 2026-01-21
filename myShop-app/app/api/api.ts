const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('⚠️ EXPO_PUBLIC_API_URL is not set in .env file');
}

// Types
export interface Product {
  id: number;
  product_name: string;
  product_category: string;
  product_description: string;
  product_price: number;
  product_stock: number;
  product_image: string;
}

export interface CreateOrderRequest {
  email: string;
  products: Array<{ product_id: number; quantity: number }>;
}

export interface Order {
  id: number;
  customer_email: string;
  total: number;
  order_date?: Date;
}

// API Error class
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function for fetch with error handling
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!API_URL) {
    throw new ApiError('API URL is not configured. Check your .env file.');
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(`Network error: ${error.message}`);
    }

    throw new ApiError('Unknown error occurred');
  }
}

// API Functions
export async function fetchProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>('/products');
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductDetails(
  productId: number
): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${productId}`);
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

export async function createOrder(
  orderData: CreateOrderRequest
): Promise<Order | null> {
  try {
    return await apiFetch<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    return await apiFetch<Order[]>('/orders');
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
