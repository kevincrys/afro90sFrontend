import type { ProductCategory } from "@/types/category";

export type { ProductCategory as Category };

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  photos: string[];
  category: ProductCategory;
  options?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface PhotoInputUrl {
  type: "url";
  value: string;
}

export interface PhotoInputBase64 {
  type: "base64";
  value: string;
  filename?: string;
  contentType?: string;
}

export interface PhotoInputStream {
  type: "stream";
  fieldName: string;
}

export type PhotoInput = PhotoInputUrl | PhotoInputBase64 | PhotoInputStream;

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: ProductCategory;
  options?: string[];
  photos?: PhotoInput[];
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: ProductCategory;
  options?: string[];
  photos?: PhotoInput[];
}

export interface ProductsQueryParams {
  limit?: number;
  cursor?: string;
  name?: string;
  category?: ProductCategory;
}
