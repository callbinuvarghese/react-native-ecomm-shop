import { create } from 'zustand';
import { Product, CartItem } from './types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addItem: (product: Product, quantity: number = 1) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Increment quantity by specified amount
        const updatedItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );

        return {
          items: updatedItems,
          total: state.total + product.product_price * quantity,
          itemCount: state.itemCount + quantity,
        };
      }

      // Add new item with specified quantity
      const newItems = [...state.items, { ...product, quantity }];

      return {
        items: newItems,
        total: state.total + product.product_price * quantity,
        itemCount: state.itemCount + quantity,
      };
    }),

  removeItem: (productId: number) =>
    set((state) => {
      const item = state.items.find((i) => i.id === productId);
      if (!item) return state;

      const updatedItems = state.items.filter((i) => i.id !== productId);

      return {
        items: updatedItems,
        total: Math.max(0, state.total - item.product_price * item.quantity),
        itemCount: Math.max(0, state.itemCount - item.quantity),
      };
    }),

  updateQuantity: (productId: number, quantity: number) =>
    set((state) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const item = state.items.find((i) => i.id === productId);
        if (!item) return state;

        const updatedItems = state.items.filter((i) => i.id !== productId);
        return {
          items: updatedItems,
          total: Math.max(0, state.total - item.product_price * item.quantity),
          itemCount: Math.max(0, state.itemCount - item.quantity),
        };
      }

      const item = state.items.find((i) => i.id === productId);
      if (!item) return state;

      const quantityDiff = quantity - item.quantity;
      const updatedItems = state.items.map((i) =>
        i.id === productId ? { ...i, quantity } : i
      );

      return {
        items: updatedItems,
        total: state.total + item.product_price * quantityDiff,
        itemCount: state.itemCount + quantityDiff,
      };
    }),

  clearCart: () =>
    set({
      items: [],
      total: 0,
      itemCount: 0,
    }),

  isInCart: (productId: number) => {
    return get().items.some((item) => item.id === productId);
  },

  getItemQuantity: (productId: number) => {
    const item = get().items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  },
}));
