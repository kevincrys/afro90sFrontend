import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";
import { productsQueryKey, type ProductsQueryFilters } from "@/lib/query-keys";

export { productsQueryKey, type ProductsQueryFilters } from "@/lib/query-keys";

export type UseProductsFilters = ProductsQueryFilters;

export function useProducts(filters: UseProductsFilters = {}) {
  return useInfiniteQuery({
    queryKey: productsQueryKey(filters),
    queryFn: ({ pageParam }) =>
      getProducts({
        ...filters,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    placeholderData: (previousData) => previousData,
  });
}
