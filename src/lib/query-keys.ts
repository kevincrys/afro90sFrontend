import type { ProductCategory } from "@/types/category";
import type { OrderStatus } from "@/types/order";

export function productQueryKey(id: string) {
  return ["product", id] as const;
}

export interface ProductsQueryFilters {
  name?: string;
  category?: ProductCategory;
  limit?: number;
}

export function productsQueryKey(filters: ProductsQueryFilters = {}) {
  return ["products", filters] as const;
}

export interface AdminProductsQueryFilters {
  category?: ProductCategory;
  limit?: number;
}

export function adminProductsQueryKey(filters: AdminProductsQueryFilters = {}) {
  return ["admin", "products", filters] as const;
}

export interface AdminOrdersQueryFilters {
  status?: OrderStatus;
  limit?: number;
}

export function adminOrdersQueryKey(filters: AdminOrdersQueryFilters = {}) {
  return ["admin", "orders", filters] as const;
}

export function adminOrderQueryKey(id: string) {
  return ["admin", "orders", "detail", id] as const;
}
