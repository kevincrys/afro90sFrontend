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
    localStorage.clear();
    useCartStore.setState({ items: [], isOpen: false });
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

  it("removes item from cart", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().removeItem(sampleItem.productId);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("increases item quantity up to maxQuantity", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().updateItemQuantity(sampleItem.productId, 2);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
    useCartStore.getState().updateItemQuantity(sampleItem.productId, 10);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("decreases item quantity and removes at zero", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().updateItemQuantity(sampleItem.productId, -1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("updates quantity for matching selectedOption only", () => {
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Preto", quantity: 2 });
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Dourado", quantity: 1 });
    useCartStore.getState().updateItemQuantity(sampleItem.productId, 1, "Preto");
    expect(useCartStore.getState().items.find((i) => i.selectedOption === "Preto")?.quantity).toBe(
      3,
    );
    expect(useCartStore.getState().items.find((i) => i.selectedOption === "Dourado")?.quantity).toBe(
      1,
    );
  });

  it("keeps separate lines for same product with different options", () => {
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Preto" });
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Dourado" });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("merges quantity for same product and selectedOption", () => {
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Preto", quantity: 1 });
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Preto", quantity: 2 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("removes item matching productId and selectedOption", () => {
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Preto" });
    useCartStore.getState().addItem({ ...sampleItem, selectedOption: "Dourado" });
    useCartStore.getState().removeItem(sampleItem.productId, "Preto");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].selectedOption).toBe("Dourado");
  });

  it("clears cart", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates subtotal", () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem({
      ...sampleItem,
      productId: "id-2",
      price: 10,
      quantity: 2,
    });
    expect(useCartStore.getState().subtotal()).toBeCloseTo(69.9);
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
