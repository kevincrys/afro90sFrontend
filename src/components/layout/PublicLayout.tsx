import { useState } from "react";
import { Outlet } from "react-router-dom";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useCartStore } from "@/stores/cart.store";
import type { CategoryFilter } from "@/types/category";

export interface CatalogOutletContext {
  activeCategory: CategoryFilter;
  setActiveCategory: (category: CategoryFilter) => void;
}

export function PublicLayout() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("todos");
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const isCartOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        cartCount={cartCount}
        onCartClick={openCart}
      />
      <Outlet context={{ activeCategory, setActiveCategory } satisfies CatalogOutletContext} />
      <Footer />
      {isCartOpen && <CartDrawer />}
    </div>
  );
}
