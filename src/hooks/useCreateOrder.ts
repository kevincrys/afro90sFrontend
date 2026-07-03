import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/api/orders";
import { invalidateProductCachesAfterOrder } from "@/lib/product-cache";
import type { CreateOrderInput } from "@/types/order";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onSuccess: (_data, variables) => {
      const productIds = [...new Set(variables.items.map((item) => item.productId))];
      invalidateProductCachesAfterOrder(queryClient, productIds);
    },
  });
}
