import { z } from 'zod';

// Zod schemas for runtime validation
export const ProductSchema = z.object({
  id: z.number(),
  product_name: z.string(),
  product_category: z.string(),
  product_description: z.string(),
  product_price: z.number(),
  product_stock: z.number(),
  // Allow both full URLs and relative paths (e.g., /images/...)
  product_image: z.string().refine(
    (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    { message: 'Must be a valid URL or path starting with /' }
  ),
});

export const OrderSchema = z.object({
  id: z.number(),
  customer_email: z.string().email(),
  total: z.number(),
  order_date: z.string().optional(),
});

export const OrderItemSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  quantity: z.number(),
  total: z.number(),
  product_name: z.string().optional(),
  product_price: z.number().optional(),
  // Allow both full URLs and relative paths
  product_image: z.string().refine(
    (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    { message: 'Must be a valid URL or path starting with /' }
  ).optional(),
});

export const OrderWithItemsSchema = OrderSchema.extend({
  items: z.array(OrderItemSchema),
});

// TypeScript types inferred from schemas
export type Product = z.infer<typeof ProductSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderWithItems = z.infer<typeof OrderWithItemsSchema>;

// Cart item type
export type CartItem = Product & { quantity: number };

// Request types
export interface CreateOrderRequest {
  email: string;
  products: Array<{
    product_id: number;
    quantity: number;
  }>;
}
