import { apiClient, buildQueryString } from "@/api/client";
import type { PaginatedResponse, Product, ProductsQueryParams } from "@/types/product";

export async function getProducts(
  params: ProductsQueryParams = {},
): Promise<PaginatedResponse<Product>> {
  const query = buildQueryString({
    limit: params.limit,
    cursor: params.cursor,
    name: params.name,
    category: params.category,
  });

  const { data } = await apiClient.get<PaginatedResponse<Product>>(`/products${query}`);
  return data;
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}
