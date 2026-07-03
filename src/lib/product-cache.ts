import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { productQueryKey } from "@/lib/query-keys";
import type { PaginatedResponse, Product } from "@/types/product";

export function findProductInCatalogCache(
  queryClient: QueryClient,
  id: string,
): Product | undefined {
  const queries = queryClient.getQueriesData<InfiniteData<PaginatedResponse<Product>>>({
    queryKey: ["products"],
  });

  for (const [, data] of queries) {
    if (!data) continue;
    const found = data.pages.flatMap((page) => page.items).find((item) => item.id === id);
    if (found) return found;
  }

  return undefined;
}

export function invalidateProductCachesAfterOrder(
  queryClient: QueryClient,
  productIds: string[],
): void {
  void queryClient.invalidateQueries({ queryKey: ["products"] });
  for (const id of productIds) {
    void queryClient.invalidateQueries({ queryKey: productQueryKey(id) });
  }
}
