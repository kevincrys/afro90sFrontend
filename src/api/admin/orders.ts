import { apiClient, buildQueryString } from "@/api/client";
import type { PaginatedResponse } from "@/types/product";
import type {
  Order,
  OrdersQueryParams,
  OrderStatus,
  UpdateOrderStatusInput,
} from "@/types/order";

/** Admin orders API — fase 3 (tasks 14+). */

export async function getAdminOrders(
  params: OrdersQueryParams = {},
): Promise<PaginatedResponse<Order>> {
  const query = buildQueryString({
    limit: params.limit,
    cursor: params.cursor,
    status: params.status,
  });

  const { data } = await apiClient.get<PaginatedResponse<Order>>(`/admin/orders${query}`);
  return data;
}

export async function getAdminOrderById(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/admin/orders/${id}`);
  return data;
}

export async function updateAdminOrderStatus(
  id: string,
  input: UpdateOrderStatusInput,
): Promise<Order> {
  const { data } = await apiClient.put<Order>(`/admin/orders/${id}`, input);
  return data;
}

export type { OrderStatus };
