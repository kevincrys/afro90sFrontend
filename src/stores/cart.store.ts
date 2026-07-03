import { create } from "zustand";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  maxQuantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  totalQuantity: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((entry) => entry.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((entry) =>
            entry.productId === item.productId
              ? {
                  ...entry,
                  quantity: Math.min(entry.quantity + item.quantity, entry.maxQuantity),
                }
              : entry,
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },

  totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
