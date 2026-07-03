import type { ProductCategory } from "@/types/category";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  oculos: "ÓCULOS",
  acessorios: "ACESSÓRIOS",
  maquiagem: "MAQUIAGEM",
};

export function getCategoryLabel(category: ProductCategory): string {
  return CATEGORY_LABELS[category];
}
