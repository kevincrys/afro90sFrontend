import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOrderById,
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/api/admin/orders";
import { adminOrderQueryKey, adminOrdersQueryKey, type AdminOrdersQueryFilters } from "@/lib/query-keys";
import type { OrderStatus } from "@/types/order";

export { adminOrdersQueryKey, type AdminOrdersQueryFilters };

const ADMIN_ORDERS_PAGE_SIZE = 20;

export function useAdminOrders(filters: AdminOrdersQueryFilters = {}) {
  return useInfiniteQuery({
    queryKey: adminOrdersQueryKey(filters),
    queryFn: ({ pageParam }) =>
      getAdminOrders({
        ...filters,
        limit: ADMIN_ORDERS_PAGE_SIZE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

export function useAdminOrder(id: string | null) {
  return useQuery({
    queryKey: adminOrderQueryKey(id ?? ""),
    queryFn: () => getAdminOrderById(id!),
    enabled: id !== null,
  });
}

export function useAdminOrderMutations() {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateAdminOrderStatus(id, { status }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.setQueryData(adminOrderQueryKey(order.id), order);
    },
  });

  return { updateStatus };
}

export function flattenAdminOrders(pages: { items: import("@/types/order").Order[] }[] | undefined) {
  if (!pages) return [];
  return pages.flatMap((page) => page.items);
}
