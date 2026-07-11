import { apiClient, buildQueryString } from "@/api/client";
import type { ProductSubmitPayload } from "@/lib/adminProductSubmit";
import type {
  CreateProductInput,
  PaginatedResponse,
  Product,
  ProductsQueryParams,
  UpdateProductInput,
} from "@/types/product";

/** Admin products API — fase 3 (task 13). */

function multipartHeaders() {
  return { "Content-Type": "multipart/form-data" };
}

async function submitProductPayload(
  method: "post" | "put",
  url: string,
  payload: ProductSubmitPayload,
): Promise<Product> {
  if (payload.mode === "multipart") {
    const { data } = await apiClient[method]<Product>(url, payload.formData, {
      headers: multipartHeaders(),
    });
    return data;
  }

  const { data } = await apiClient[method]<Product>(url, payload.body);
  return data;
}

export async function getAdminProducts(
  params: ProductsQueryParams = {},
): Promise<PaginatedResponse<Product>> {
  const query = buildQueryString({
    limit: params.limit,
    cursor: params.cursor,
    q: params.q,
    name: params.q ? undefined : params.name,
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

export async function createAdminProductPayload(payload: ProductSubmitPayload): Promise<Product> {
  return submitProductPayload("post", "/admin/products", payload);
}

export async function updateAdminProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/admin/products/${id}`, input);
  return data;
}

export async function updateAdminProductPayload(
  id: string,
  payload: ProductSubmitPayload,
): Promise<Product> {
  return submitProductPayload("put", `/admin/products/${id}`, payload);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await apiClient.delete(`/admin/products/${id}`);
}

type StockUpdateResponse = {
  id: string;
  quantity?: number;
  stock?: number;
};

function normalizeStockUpdateResponse(data: StockUpdateResponse): { id: string; quantity: number } {
  const quantity = data.quantity ?? data.stock;
  if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity < 0) {
    throw new Error("InvalidStockResponse");
  }

  return { id: data.id, quantity };
}

export async function putAdminProductStock(
  id: string,
  delta: number,
): Promise<{ id: string; quantity: number }> {
  const { data } = await apiClient.put<StockUpdateResponse>(
    `/admin/products/${id}/stock`,
    { delta },
  );
  return normalizeStockUpdateResponse(data);
}
