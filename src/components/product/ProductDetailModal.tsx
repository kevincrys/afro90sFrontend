import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { ProductDetailModalSkeleton } from "@/components/product/ProductDetailModalSkeleton";
import { ProductOptionPicker } from "@/components/product/ProductOptionPicker";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useProduct } from "@/hooks/useProduct";
import { getCategoryLabel } from "@/lib/categoryLabels";
import { getClientErrorMessage } from "@/lib/errorMessages";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cart.store";
import { ApiError } from "@/types/errors";

const DEFAULT_TITLE = "Afro90s";

export interface ProductDetailModalProps {
  productId: string;
  onClose: () => void;
}

export function ProductDetailModal({ productId, onClose }: ProductDetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { data: product, isPending, isError, error } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);
  const showSkeleton = isPending && !product;

  useFocusTrap(loadingRef, showSkeleton);
  useFocusTrap(panelRef, !showSkeleton);

  const [photoIdx, setPhotoIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  const photos = product?.photos ?? [];
  const productOptions = product?.options?.length ? product.options : [];
  const maxQuantity = product?.quantity ?? 0;
  const isSoldOut = maxQuantity === 0;

  useEffect(() => {
    setPhotoIdx(0);
    setSelectedOption(undefined);
  }, [productId]);

  useEffect(() => {
    if (product?.options?.length) {
      setSelectedOption(product.options[0]);
    } else {
      setSelectedOption(undefined);
    }
  }, [product?.id, product?.options]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    if (product) document.title = `${product.name} · Afro90s`;
    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
    };
  }, [product]);

  function prevPhoto() {
    if (photos.length === 0) return;
    setPhotoIdx((index) => (index - 1 + photos.length) % photos.length);
  }

  function nextPhoto() {
    if (photos.length === 0) return;
    setPhotoIdx((index) => (index + 1) % photos.length);
  }

  function handleAddToCart() {
    if (!product || isSoldOut) return;

    if (productOptions.length > 0 && !selectedOption) {
      toast.error("Selecione uma opção do produto.");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      photo: product.photos[0] ?? "",
      maxQuantity: product.quantity,
      selectedOption: productOptions.length > 0 ? selectedOption : undefined,
    });
    toast.success("Produto adicionado ao carrinho");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      role="presentation"
    >
      {showSkeleton && (
        <div ref={loadingRef} className="relative w-full max-w-4xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center border border-border bg-background/80 hover:border-primary text-muted-foreground hover:text-primary transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
          <ProductDetailModalSkeleton />
        </div>
      )}

      {isError && !product && (
        <div
          ref={panelRef}
          className="relative w-full max-w-md p-8 text-center space-y-4"
          style={{ background: "#0D0009", border: "1px solid rgba(255,210,31,0.22)" }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="product-error-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-border bg-background/80 hover:border-primary text-muted-foreground hover:text-primary transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
          <p id="product-error-title" className="text-destructive pt-4">
            {error instanceof ApiError
              ? error.message
              : getClientErrorMessage("UNKNOWN_ERROR")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border border-border text-muted-foreground uppercase tracking-widest hover:border-primary/40 hover:text-foreground transition-colors"
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "0.65rem",
              letterSpacing: "var(--track-label-sm)",
            }}
          >
            Voltar ao catálogo
          </button>
        </div>
      )}

      {product && (
        <div
          ref={panelRef}
          className="relative w-full max-w-4xl max-h-[96vh] md:max-h-[92vh] overflow-y-auto flex flex-col md:flex-row"
          style={{ background: "#0D0009", border: "1px solid rgba(255,210,31,0.22)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center border border-border bg-background/80 hover:border-primary text-muted-foreground hover:text-primary transition-colors"
            aria-label="Fechar detalhes do produto"
          >
            <X size={16} />
          </button>

          <div className="md:w-1/2 flex flex-col flex-shrink-0">
            <div className="relative overflow-hidden bg-muted w-full h-[min(36vh,260px)] md:h-auto md:aspect-[4/5] md:max-h-none">
              {photos[photoIdx] ? (
                <img
                  key={photoIdx}
                  src={photos[photoIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  style={{ animation: "fadeIn 0.25s ease" }}
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/70 border border-border hover:border-primary hover:text-primary text-muted-foreground transition-colors"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/70 border border-border hover:border-primary hover:text-primary text-muted-foreground transition-colors"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {photos.length > 0 && (
                <div
                  className="absolute bottom-3 right-3 px-2 py-1"
                  style={{
                    background: "rgba(13,0,9,0.7)",
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "var(--track-badge)",
                    color: "#FFD21F",
                  }}
                >
                  {photoIdx + 1} / {photos.length}
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
            </div>

            {photos.length > 1 && (
              <div className="flex gap-1.5 p-2 md:gap-2 md:p-3 border-t border-border overflow-x-auto">
                {photos.map((photo, index) => (
                  <button
                    key={`${photo}-${index}`}
                    type="button"
                    onClick={() => setPhotoIdx(index)}
                    className="flex-shrink-0 overflow-hidden transition-all w-11 h-11 md:w-14 md:h-14"
                    style={{
                      border: index === photoIdx ? "2px solid #FFD21F" : "2px solid transparent",
                      opacity: index === photoIdx ? 1 : 0.5,
                    }}
                    aria-label={`Foto ${index + 1}`}
                    aria-current={index === photoIdx}
                  >
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:w-1/2 flex flex-col p-4 gap-3 md:p-7 md:gap-5 overflow-y-auto min-h-0">
            <div
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.6rem",
                letterSpacing: "var(--track-label-lg)",
                color: "#7A004B",
              }}
            >
              {getCategoryLabel(product.category)}
            </div>

            <h2
              id="product-modal-title"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(1.35rem, 4vw, 2.2rem)",
                letterSpacing: "var(--track-display-title)",
                color: "#FFF8E7",
                lineHeight: 1.1,
              }}
            >
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(1.35rem, 4vw, 2rem)",
                  color: "#FFD21F",
                  lineHeight: 1,
                }}
              >
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="border-t border-border" />

            {product.description && (
              <p className="text-foreground/65 text-sm leading-relaxed">{product.description}</p>
            )}

            {productOptions.length > 0 && (
              <ProductOptionPicker
                options={productOptions}
                value={selectedOption}
                onChange={setSelectedOption}
              />
            )}

            <div className="hidden md:block flex-1" />

            <div className="flex flex-col gap-3 pt-2 md:mt-auto">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut || (productOptions.length > 0 && !selectedOption)}
                className="w-full py-4 bg-primary text-primary-foreground uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "var(--track-ui-lg)",
                }}
              >
                <ShoppingBag size={18} />
                {isSoldOut ? "Indisponível" : "Adicionar ao carrinho"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 border border-border text-muted-foreground uppercase tracking-widest hover:border-primary/40 hover:text-foreground transition-colors"
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "var(--track-label-sm)",
                }}
              >
                Continuar navegando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
