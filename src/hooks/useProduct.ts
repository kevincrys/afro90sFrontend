import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/api/products";

export function productQueryKey(id: string) {
  return ["product", id] as const;
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productQueryKey(id ?? ""),
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });
}
