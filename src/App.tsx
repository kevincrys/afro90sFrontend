import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogGrid } from "@/components/layout/CatalogGrid";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { CategoryFilter } from "@/types/category";

export default function App() {
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        <p
          className="text-muted-foreground text-center mb-10"
          style={{
            fontFamily: "'Courier Prime', monospace",
            letterSpacing: "0.12em",
            fontSize: "0.75rem",
          }}
        >
          Prévia do grid — catálogo na task 05
        </p>
        <CatalogGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-border bg-card">
              <Skeleton className="aspect-[4/5] w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </CatalogGrid>
      </main>

      <Footer />
    </div>
  );
}
