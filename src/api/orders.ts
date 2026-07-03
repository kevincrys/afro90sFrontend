import { apiClient } from "@/api/client";
import type { CreateOrderInput, Order } from "@/types/order";

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", input);
  return data;
}
