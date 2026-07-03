import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { findProductInCatalogCache, invalidateProductCachesAfterOrder } from "@/lib/product-cache";
import { productQueryKey, productsQueryKey } from "@/lib/query-keys";
import type { Product } from "@/types/product";

const sampleProduct: Product = {
  id: "prod-1",
  name: "Óculos Retro",
  price: 99.9,
  quantity: 5,
  photos: ["https://example.com/photo.jpg"],
  category: "oculos",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("product-cache", () => {
  it("findProductInCatalogCache returns product from infinite query pages", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(productsQueryKey({ category: "oculos" }), {
      pages: [{ items: [sampleProduct], hasMore: false }],
      pageParams: [undefined],
    });

    expect(findProductInCatalogCache(queryClient, "prod-1")).toEqual(sampleProduct);
    expect(findProductInCatalogCache(queryClient, "missing")).toBeUndefined();
  });

  it("invalidateProductCachesAfterOrder marks product queries stale", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(productsQueryKey({}), {
      pages: [{ items: [sampleProduct], hasMore: false }],
      pageParams: [undefined],
    });
    queryClient.setQueryData(productQueryKey("prod-1"), sampleProduct);

    invalidateProductCachesAfterOrder(queryClient, ["prod-1"]);

    expect(queryClient.getQueryState(productsQueryKey({}))?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(productQueryKey("prod-1"))?.isInvalidated).toBe(true);
  });
});
