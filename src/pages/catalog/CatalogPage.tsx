import { useOutletContext, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogGrid } from "@/components/layout/CatalogGrid";
import type { CatalogOutletContext } from "@/components/layout/PublicLayout";
import { getClientErrorMessage } from "@/lib/errorMessages";
import { useProducts } from "@/hooks/useProducts";
import { ApiError } from "@/types/errors";

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CatalogPage() {
  const { id: productId } = useParams<{ id: string }>();
  const { activeCategory } = useOutletContext<CatalogOutletContext>();

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts({
      category: activeCategory === "todos" ? undefined : activeCategory,
    });

  const products = data?.pages.flatMap((page) => page.items) ?? [];

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

      {isError && (
        <p className="text-center text-destructive mb-6" role="alert">
          {error instanceof ApiError
            ? error.message
            : getClientErrorMessage("UNKNOWN_ERROR")}
        </p>
      )}

      {isLoading && (
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
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p
          className="text-muted-foreground text-center"
          style={{
            fontFamily: "'Courier Prime', monospace",
            letterSpacing: "0.12em",
            fontSize: "0.75rem",
          }}
        >
          Nenhum produto encontrado
          {activeCategory !== "todos" && ` · categoria: ${activeCategory}`}
        </p>
      )}

      {!isLoading && products.length > 0 && (
        <>
          <CatalogGrid>
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden border-border bg-card">
                <div className="aspect-[4/5] bg-muted overflow-hidden">
                  {product.photos[0] ? (
                    <img
                      src={product.photos[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <Skeleton className="w-full h-full rounded-none" />
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-medium text-sm leading-tight">{product.name}</p>
                  <p
                    style={{
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: "0.75rem",
                      color: "#FFD21F",
                    }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Card>
            ))}
          </CatalogGrid>

          {hasNextPage && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="border border-border px-6 py-2 text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  letterSpacing: "0.12em",
                  fontSize: "0.65rem",
                }}
              >
                {isFetchingNextPage ? "Carregando…" : "Carregar mais"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
