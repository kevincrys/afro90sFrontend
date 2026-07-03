import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";
import type { ProductCategory } from "@/types/category";

export interface UseProductsFilters {
  name?: string;
  category?: ProductCategory;
  limit?: number;
}

export function productsQueryKey(filters: UseProductsFilters = {}) {
  return ["products", filters] as const;
}

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
  });
}
