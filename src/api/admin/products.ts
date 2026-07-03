import { apiClient, buildQueryString } from "@/api/client";
import type {
  CreateProductInput,
  PaginatedResponse,
  Product,
  ProductsQueryParams,
  UpdateProductInput,
} from "@/types/product";

/** Admin products API — fase 3 (tasks 13+). */

export async function getAdminProducts(
  params: ProductsQueryParams = {},
): Promise<PaginatedResponse<Product>> {
  const query = buildQueryString({
    limit: params.limit,
    cursor: params.cursor,
    name: params.name,
    category: params.category,
  });

  const { data } = await apiClient.get<PaginatedResponse<Product>>(`/admin/products${query}`);
  return data;
}

export async function getAdminProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/admin/products/${id}`);
  return data;
}

export async function createAdminProduct(input: CreateProductInput): Promise<Product> {
  const { data } = await apiClient.post<Product>("/admin/products", input);
  return data;
}

export async function updateAdminProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/admin/products/${id}`, input);
  return data;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await apiClient.delete(`/admin/products/${id}`);
}

export async function patchAdminProductStock(
  id: string,
  delta: number,
): Promise<{ id: string; quantity: number }> {
  const { data } = await apiClient.patch<{ id: string; quantity: number }>(
    `/admin/products/${id}/stock`,
    { delta },
  );
  return data;
}
