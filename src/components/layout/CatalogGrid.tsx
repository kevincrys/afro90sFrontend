import type { ReactNode } from "react";

interface CatalogGridProps {
  children: ReactNode;
}

/** Grid responsivo do catálogo — alinhado ao protótipo (3 cols desktop). */
export function CatalogGrid({ children }: CatalogGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
  );
}
