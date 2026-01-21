import { create } from 'zustand';
import { Product } from '@/api/api';

export type CartProduct = Product & { quantity: number };

export interface CartState {
  products: CartProduct[];
  total: number;
  addProduct: (product: Product) => void;
  reduceProduct: (product: Product) => void;
  clearCart: () => void;
  itemCount: number;
}

const useCartStore = create<CartState>((set) => ({
  products: [],
  total: 0,
  itemCount: 0,

  addProduct: (product: Product) =>
    set((state) => {
      const existingProduct = state.products.find((p) => p.id === product.id);
      const newTotal = state.total + product.product_price;

      if (existingProduct) {
        // Update existing product quantity
        const updatedProducts = state.products.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );

        return {
          products: updatedProducts,
          total: newTotal,
          itemCount: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
        };
      }

      // Add new product
      const updatedProducts = [...state.products, { ...product, quantity: 1 }];

      return {
        products: updatedProducts,
        total: newTotal,
        itemCount: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
      };
    }),

  reduceProduct: (product: Product) =>
    set((state) => {
      const newTotal = state.total - product.product_price;

      const updatedProducts = state.products
        .map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0);

      return {
        products: updatedProducts,
        total: Math.max(0, newTotal), // Prevent negative totals
        itemCount: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
      };
    }),

  clearCart: () =>
    set({
      products: [],
      total: 0,
      itemCount: 0,
    }),
}));

export default useCartStore;
