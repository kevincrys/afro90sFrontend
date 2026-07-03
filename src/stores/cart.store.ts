import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  maxQuantity: number;
  selectedOption?: string;
}

function isSameCartLine(
  a: Pick<CartItem, "productId" | "selectedOption">,
  b: Pick<CartItem, "productId" | "selectedOption">,
): boolean {
  return a.productId === b.productId && (a.selectedOption ?? "") === (b.selectedOption ?? "");
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedOption?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((entry) => isSameCartLine(entry, item));
          if (existing) {
            return {
              items: state.items.map((entry) =>
                isSameCartLine(entry, item)
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

      removeItem: (productId, selectedOption) => {
        set((state) => ({
          items: state.items.filter(
            (entry) => !isSameCartLine(entry, { productId, selectedOption }),
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "afro90s-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
