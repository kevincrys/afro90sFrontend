import { useCallback, useRef } from "react";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { CatalogGrid } from "@/components/layout/CatalogGrid";
import type { CatalogOutletContext } from "@/components/layout/PublicLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { ProductDetailModal } from "@/components/product/ProductDetailModal";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useProducts } from "@/hooks/useProducts";
import { getClientErrorMessage } from "@/lib/errorMessages";
import { ApiError } from "@/types/errors";

export default function CatalogPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeCategory } = useOutletContext<CatalogOutletContext>();
  const [searchParams] = useSearchParams();
  const searchName = searchParams.get("name")?.trim() || undefined;

  function closeProductModal() {
    const query = searchParams.toString();
    navigate({ pathname: "/", search: query ? `?${query}` : "" });
  }

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    category: activeCategory === "todos" ? undefined : activeCategory,
    name: searchName,
  });

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(loadMoreRef, loadMore, Boolean(hasNextPage));

  const hasActiveFilters = activeCategory !== "todos" || Boolean(searchName);

  return (
    <>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
      {!isLoading && !isError && (
        <div
          className="mb-8 flex justify-end"
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            color: "#9A7085",
          }}
        >
          {products.length} {products.length === 1 ? "ITEM" : "ITENS"}
        </div>
      )}

      {isError && (
        <div className="text-center mb-10 space-y-4" role="alert">
          <p className="text-destructive">
            {error instanceof ApiError
              ? error.message
              : getClientErrorMessage("UNKNOWN_ERROR")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="border border-border px-6 py-2 text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            style={{
              fontFamily: "'Courier Prime', monospace",
              letterSpacing: "0.12em",
              fontSize: "0.65rem",
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {isLoading && (
        <CatalogGrid>
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </CatalogGrid>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center space-y-2 py-12">
          <p
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "1.25rem",
              letterSpacing: "0.06em",
              color: "#FFF8E7",
            }}
          >
            Nenhum produto encontrado
          </p>
          {hasActiveFilters && (
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: "'Courier Prime', monospace",
                letterSpacing: "0.12em",
                fontSize: "0.75rem",
              }}
            >
              {searchName && `Busca: “${searchName}”`}
              {searchName && activeCategory !== "todos" && " · "}
              {activeCategory !== "todos" && `Categoria: ${activeCategory}`}
            </p>
          )}
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
          <CatalogGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: 3 }).map((_, index) => (
                <ProductCardSkeleton key={`loading-${index}`} />
              ))}
          </CatalogGrid>

          {hasNextPage && <div ref={loadMoreRef} className="h-8" aria-hidden />}
        </>
      )}
      </main>

      {productId && (
        <ProductDetailModal productId={productId} onClose={closeProductModal} />
      )}
    </>
  );
}
