import { describe, expect, it, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cart.store";

const sampleItem = {
  productId: "id-1",
  name: "Produto",
  price: 49.9,
  quantity: 1,
  photo: "https://example.com/a.jpg",
  maxQuantity: 5,
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adds item to cart", () => {
    useCartStore.getState().addItem(sampleItem);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("merges quantity for same product capped at maxQuantity", () => {
    useCartStore.getState().addItem({ ...sampleItem, quantity: 2 });
    useCartStore.getState().addItem({ ...sampleItem, quantity: 3 });
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("totalQuantity sums item quantities", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem({
      ...sampleItem,
      productId: "id-2",
      quantity: 2,
    });
    expect(useCartStore.getState().totalQuantity()).toBe(3);
  });
});
