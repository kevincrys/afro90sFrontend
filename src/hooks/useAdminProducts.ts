import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminProductPayload,
  deleteAdminProduct,
  getAdminProducts,
  putAdminProductStock,
  updateAdminProductPayload,
} from "@/api/admin/products";
import { invalidateAllProductCaches, invalidateProductCatalogCaches, applyAdminProductQuantityDeltaInCache, restoreAdminProductCaches, setAdminProductQuantityInCache, snapshotAdminProductCaches } from "@/lib/adminProductCache";
import type { PhotoFormItem } from "@/lib/adminProductSubmit";
import { buildProductSubmitPayload } from "@/lib/adminProductSubmit";
import type { AdminProductFormValues } from "@/lib/adminProductSchema";
import { adminProductsQueryKey, type AdminProductsQueryFilters } from "@/lib/query-keys";
import type { Product } from "@/types/product";

export { adminProductsQueryKey, type AdminProductsQueryFilters };

const ADMIN_PAGE_SIZE = 20;

export function useAdminProducts(filters: AdminProductsQueryFilters = {}) {
  return useInfiniteQuery({
    queryKey: adminProductsQueryKey(filters),
    queryFn: ({ pageParam }) =>
      getAdminProducts({
        ...filters,
        limit: ADMIN_PAGE_SIZE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

export function useAdminProductMutations() {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async ({
      values,
      photos,
    }: {
      values: AdminProductFormValues;
      photos: PhotoFormItem[];
    }) => {
      const payload = buildProductSubmitPayload(values, photos);
      return createAdminProductPayload(payload);
    },
    onSuccess: (product) => {
      invalidateAllProductCaches(queryClient, product.id);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      values,
      photos,
    }: {
      id: string;
      values: AdminProductFormValues;
      photos: PhotoFormItem[];
    }) => {
      const payload = buildProductSubmitPayload(values, photos);
      return updateAdminProductPayload(id, payload);
    },
    onSuccess: (product) => {
      invalidateAllProductCaches(queryClient, product.id);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: (_data, id) => {
      invalidateAllProductCaches(queryClient, id);
    },
  });

  const adjustStock = useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) => putAdminProductStock(id, delta),
    onMutate: async ({ id, delta }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });
      const snapshots = snapshotAdminProductCaches(queryClient);
      applyAdminProductQuantityDeltaInCache(queryClient, id, delta);
      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      if (context?.snapshots) {
        restoreAdminProductCaches(queryClient, context.snapshots);
      }
    },
    onSuccess: (data) => {
      setAdminProductQuantityInCache(queryClient, data.id, data.quantity);
      invalidateProductCatalogCaches(queryClient);
    },
    onSettled: (_data, error, { id }) => {
      if (error) {
        invalidateAllProductCaches(queryClient, id);
      }
    },
  });

  return { createProduct, updateProduct, deleteProduct, adjustStock };
}

export function flattenAdminProducts(
  pages: { items: Product[] }[] | undefined,
): Product[] {
  if (!pages) return [];
  return pages.flatMap((page) => page.items);
}
