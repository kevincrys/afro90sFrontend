import { useOutletContext, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogGrid } from "@/components/layout/CatalogGrid";
import type { CatalogOutletContext } from "@/components/layout/PublicLayout";

export default function CatalogPage() {
  const { id: productId } = useParams<{ id: string }>();
  const { activeCategory } = useOutletContext<CatalogOutletContext>();

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
      {productId && (
        <p
          className="text-center mb-6 border border-primary/30 px-4 py-3"
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            color: "#FFD21F",
          }}
        >
          Deep link /products/{productId} — modal na task 06
        </p>
      )}

      <p
        className="text-muted-foreground text-center mb-10"
        style={{
          fontFamily: "'Courier Prime', monospace",
          letterSpacing: "0.12em",
          fontSize: "0.75rem",
        }}
      >
        Prévia do grid — catálogo na task 05
        {activeCategory !== "todos" && ` · categoria: ${activeCategory}`}
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
  );
}
