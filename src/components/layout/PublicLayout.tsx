import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { CategoryFilter } from "@/types/category";

export interface CatalogOutletContext {
  activeCategory: CategoryFilter;
  setActiveCategory: (category: CategoryFilter) => void;
}

export function PublicLayout() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("todos");

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        cartCount={0}
      />
      <Outlet context={{ activeCategory, setActiveCategory } satisfies CatalogOutletContext} />
      <Footer />
    </div>
  );
}
