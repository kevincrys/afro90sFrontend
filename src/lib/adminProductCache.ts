import type { QueryClient } from "@tanstack/react-query";
import { productQueryKey } from "@/lib/query-keys";

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
