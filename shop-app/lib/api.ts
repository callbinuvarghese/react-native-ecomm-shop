import axios from 'axios';
import { z } from 'zod';
import { config } from './config';
import {
  Product,
  ProductSchema,
  Order,
  OrderSchema,
  OrderWithItems,
  OrderWithItemsSchema,
  CreateOrderRequest,
} from './types';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 API Error Details:');
    console.error('  Config:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
    });

    if (error.response) {
      // Server responded with error
      console.error('  Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
      const message = error.response.data?.error || error.response.statusText;
      throw new Error(`API Error: ${message}`);
    } else if (error.request) {
      // Request made but no response
      console.error('  No response received from server');
      console.error('  Request config:', error.config);
      throw new Error('Network Error: Unable to reach server. Please check your connection and API URL.');
    } else {
      // Something else went wrong
      console.error('  Error:', error.message);
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

// API Functions with validation

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get('/products');
  return z.array(ProductSchema).parse(data);
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await api.get(`/products/${id}`);
  return ProductSchema.parse(data);
}

export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  const { data} = await api.post('/orders', orderData);
  return OrderSchema.parse(data);
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await api.get('/orders');
  return z.array(OrderSchema).parse(data);
}

export async function fetchOrderById(id: number): Promise<OrderWithItems> {
  const { data } = await api.get(`/orders/${id}`);
  return OrderWithItemsSchema.parse(data);
}

// Export API instance for custom requests
export { api };
