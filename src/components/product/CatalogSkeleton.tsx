import { CatalogGrid } from "@/components/layout/CatalogGrid";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

interface CatalogSkeletonProps {
  count?: number;
}

export function CatalogSkeleton({ count = 6 }: CatalogSkeletonProps) {
  return (
    <CatalogGrid>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </CatalogGrid>
  );
}
