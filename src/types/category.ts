export type ProductCategory = "oculos" | "acessorios" | "maquiagem";

export const CATEGORY_ALL = "todos" as const;

export type CategoryFilter = ProductCategory | typeof CATEGORY_ALL;

export const CATEGORIES: { label: string; value: CategoryFilter }[] = [
  { label: "Todos", value: CATEGORY_ALL },
  { label: "Óculos", value: "oculos" },
  { label: "Acessórios", value: "acessorios" },
  { label: "Maquiagem", value: "maquiagem" },
];
