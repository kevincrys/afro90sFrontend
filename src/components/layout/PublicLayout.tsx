import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("todos");
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const isCartOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);

  function handleCategorySelect(category: CategoryFilter) {
    setActiveCategory(category);
    navigate("/");
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.75rem" }}
      >
        Ir para o conteúdo
      </a>
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        cartCount={cartCount}
        onCartClick={openCart}
      />
      <Outlet context={{ activeCategory, setActiveCategory } satisfies CatalogOutletContext} />
      <Footer onCategorySelect={handleCategorySelect} />
      {isCartOpen && <CartDrawer />}
    </div>
  );
}
