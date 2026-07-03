import type { ReactNode } from "react";

interface CatalogGridProps {
  children: ReactNode;
}

/** Grid responsivo do catálogo: 1 col mobile → 4 cols desktop. */
export function CatalogGrid({ children }: CatalogGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{children}</div>
  );
}
