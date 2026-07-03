import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getProductById } from "@/api/products";
import { findProductInCatalogCache } from "@/lib/product-cache";
import { productQueryKey } from "@/lib/query-keys";

export { productQueryKey } from "@/lib/query-keys";

export function prefetchProduct(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery({
    queryKey: productQueryKey(id),
    queryFn: () => getProductById(id),
  });
}

export function useProduct(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: productQueryKey(id ?? ""),
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
    placeholderData: () => (id ? findProductInCatalogCache(queryClient, id) : undefined),
  });
}
