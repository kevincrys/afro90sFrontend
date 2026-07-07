import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { prefetchProduct } from "@/hooks/useProduct";
import { getCategoryLabel } from "@/lib/categoryLabels";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isSoldOut = product.quantity === 0;
  const photo = product.photos[0];

  function openProduct() {
    navigate(`/products/${product.id}`);
  }

  function handlePrefetch() {
    void prefetchProduct(queryClient, product.id);
  }

  return (
    <div className="group relative bg-card border border-border hover:border-primary/40 transition-all duration-300">
      <div
        className="relative overflow-hidden aspect-[4/5] bg-muted cursor-pointer"
        onClick={openProduct}
        onMouseEnter={handlePrefetch}
        onFocus={handlePrefetch}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProduct();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        {photo ? (
          <img
            src={photo}
            alt={product.name}
            className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${isSoldOut ? "opacity-50" : ""}`}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}

        {product.photos.length > 1 && (
          <div
            className="absolute bottom-3 left-3 px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: "rgba(13,0,9,0.75)",
              fontFamily: "'Courier Prime', monospace",
              fontSize: "0.55rem",
              letterSpacing: "var(--track-badge)",
              color: "#FFD21F",
            }}
          >
            +{product.photos.length - 1} FOTOS
          </div>
        )}

        {isSoldOut && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(13,0,9,0.55)" }}
          >
            <div
              className="border border-primary px-5 py-2"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "0.9rem",
                letterSpacing: "var(--track-ui-lg)",
                color: "#FFD21F",
              }}
            >
              ESGOTADO
            </div>
          </div>
        )}

        {!isSoldOut && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(13,0,9,0.45)" }}
          >
            <div
              className="border border-primary px-5 py-2"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "0.9rem",
                letterSpacing: "var(--track-ui-lg)",
                color: "#FFD21F",
              }}
            >
              VER DETALHES
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="product-category product-category--card">
          {getCategoryLabel(product.category)}
        </div>
        <h3
          className="product-title product-title--card mb-2 cursor-pointer hover:text-primary transition-colors"
          onClick={openProduct}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
        >
          {product.name}
        </h3>
        <div className="flex items-baseline gap-3">
          <span className="product-price product-price--card">{formatPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
}
