import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { productQueryKey } from "@/lib/query-keys";
import type { PaginatedResponse, Product } from "@/types/product";

export function invalidateProductCatalogCaches(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ["products"] });
}

export function invalidateAdminProductCaches(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
}

export function invalidateAllProductCaches(queryClient: QueryClient, productId?: string): void {
  invalidateAdminProductCaches(queryClient);
  invalidateProductCatalogCaches(queryClient);
  if (productId) {
    void queryClient.invalidateQueries({ queryKey: productQueryKey(productId) });
  }
}

type AdminProductsInfiniteData = InfiniteData<PaginatedResponse<Product>>;

export function setAdminProductQuantityInCache(
  queryClient: QueryClient,
  productId: string,
  quantity: number,
): void {
  queryClient.setQueriesData<AdminProductsInfiniteData>({ queryKey: ["admin", "products"] }, (old) => {
    if (!old) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((product) =>
          product.id === productId ? { ...product, quantity } : product,
        ),
      })),
    };
  });
}

export function applyAdminProductQuantityDeltaInCache(
  queryClient: QueryClient,
  productId: string,
  delta: number,
): number | null {
  let nextQuantity: number | null = null;

  queryClient.setQueriesData<AdminProductsInfiniteData>({ queryKey: ["admin", "products"] }, (old) => {
    if (!old) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((product) => {
          if (product.id !== productId) return product;
          const currentQuantity = Number.isFinite(product.quantity) ? product.quantity : 0;
          nextQuantity = Math.max(0, currentQuantity + delta);
          return { ...product, quantity: nextQuantity };
        }),
      })),
    };
  });

  return nextQuantity;
}

export function snapshotAdminProductCaches(queryClient: QueryClient) {
  return queryClient.getQueriesData<AdminProductsInfiniteData>({ queryKey: ["admin", "products"] });
}

export function restoreAdminProductCaches(
  queryClient: QueryClient,
  snapshots: ReturnType<typeof snapshotAdminProductCaches>,
): void {
  for (const [key, data] of snapshots) {
    queryClient.setQueryData(key, data);
  }
}
