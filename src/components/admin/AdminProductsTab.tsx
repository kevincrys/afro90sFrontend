import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  Loader2,
  Minus,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { ADMIN_FONT } from "@/components/admin/AdminLabel";
import {
  flattenAdminProducts,
  useAdminProductMutations,
  useAdminProducts,
} from "@/hooks/useAdminProducts";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { AdminProductFormValues } from "@/lib/adminProductSchema";
import type { PhotoFormItem } from "@/lib/adminProductSubmit";
import { getCategoryLabel } from "@/lib/categoryLabels";
import { formatPrice } from "@/lib/format";
import { ApiError } from "@/types/errors";
import type { ProductCategory } from "@/types/category";
import type { Product } from "@/types/product";

const FILTER_CATEGORIES: ProductCategory[] = ["oculos", "acessorios", "maquiagem"];

type EditingProduct = Product | "new" | null;

function filterButtonStyle(active: boolean) {
  return {
    fontFamily: ADMIN_FONT.mono,
    fontSize: "0.6rem",
    letterSpacing: "0.12em",
    borderColor: active ? "#FFD21F" : "rgba(255,210,31,0.2)",
    color: active ? "#FFD21F" : "#9A7085",
    background: active ? "rgba(255,210,31,0.08)" : "transparent",
  } as const;
}

function getMutationErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Não foi possível concluir a operação.";
}

export default function AdminProductsTab() {
  const [filterCat, setFilterCat] = useState<ProductCategory | "ALL">("ALL");
  const [editingProduct, setEditingProduct] = useState<EditingProduct>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const categoryFilter = filterCat === "ALL" ? undefined : filterCat;
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminProducts({ category: categoryFilter });

  const { createProduct, updateProduct, deleteProduct, adjustStock } = useAdminProductMutations();

  const products = flattenAdminProducts(data?.pages);
  const isSaving = createProduct.isPending || updateProduct.isPending;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(loadMoreRef, loadMore, Boolean(hasNextPage));

  async function handleSubmit(values: AdminProductFormValues, photos: PhotoFormItem[]) {
    try {
      if (editingProduct === "new" || editingProduct === null) {
        await createProduct.mutateAsync({ values, photos });
        toast.success("Produto criado.");
      } else {
        await updateProduct.mutateAsync({ id: editingProduct.id, values, photos });
        toast.success("Produto atualizado.");
      }
      setEditingProduct(null);
    } catch (error) {
      toast.error(getMutationErrorMessage(error));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produto excluído.");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(getMutationErrorMessage(error));
    }
  }

  async function handleAdjustStock(id: string, delta: number) {
    try {
      await adjustStock.mutateAsync({ id, delta });
    } catch (error) {
      toast.error(getMutationErrorMessage(error));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterCat("ALL")}
            className="px-4 py-2 border text-xs uppercase transition-colors"
            style={filterButtonStyle(filterCat === "ALL")}
          >
            TODOS
          </button>
          {FILTER_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilterCat(category)}
              className="px-4 py-2 border text-xs uppercase transition-colors"
              style={filterButtonStyle(filterCat === category)}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setEditingProduct("new")}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90 transition-opacity"
          style={{
            fontFamily: ADMIN_FONT.display,
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
          }}
        >
          <Plus size={16} /> NOVO PRODUTO
        </button>
      </div>

      {isLoading && (
        <div
          className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
          style={{ fontFamily: ADMIN_FONT.mono, fontSize: "0.7rem", letterSpacing: "0.12em" }}
        >
          <Loader2 size={16} className="animate-spin" />
          CARREGANDO PRODUTOS…
        </div>
      )}

      {isError && (
        <div
          className="flex items-center gap-2 py-8 text-red-400"
          style={{ fontFamily: ADMIN_FONT.mono, fontSize: "0.7rem", letterSpacing: "0.1em" }}
          role="alert"
        >
          <AlertCircle size={16} />
          Não foi possível carregar os produtos.
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p
          className="text-muted-foreground py-12 text-center"
          style={{ fontFamily: ADMIN_FONT.mono, fontSize: "0.75rem", letterSpacing: "0.12em" }}
        >
          Nenhum produto encontrado.
        </p>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border hover:border-primary/30 transition-colors flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.photos[0] ? (
                    <img
                      src={product.photos[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package size={32} />
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <div
                      style={{
                        fontFamily: ADMIN_FONT.mono,
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        color: "#7A004B",
                      }}
                    >
                      {getCategoryLabel(product.category)}
                    </div>
                    <div
                      style={{
                        fontFamily: ADMIN_FONT.display,
                        fontSize: "0.95rem",
                        color: "#FFF8E7",
                        lineHeight: 1.2,
                        marginTop: "3px",
                      }}
                    >
                      {product.name}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span
                      style={{
                        fontFamily: ADMIN_FONT.display,
                        fontSize: "1.2rem",
                        color: "#FFD21F",
                      }}
                    >
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontFamily: ADMIN_FONT.mono,
                        fontSize: "0.58rem",
                        letterSpacing: "0.12em",
                        color: "#9A7085",
                      }}
                    >
                      ESTOQUE:
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(product.id, -1)}
                        disabled={product.quantity <= 0 || adjustStock.isPending}
                        className="w-6 h-6 flex items-center justify-center border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                        aria-label="Diminuir estoque"
                      >
                        <Minus size={11} />
                      </button>
                      <span
                        className="w-10 text-center text-sm font-semibold text-foreground"
                        style={{ fontFamily: ADMIN_FONT.mono }}
                      >
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(product.id, 1)}
                        disabled={adjustStock.isPending}
                        className="w-6 h-6 flex items-center justify-center border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                        aria-label="Aumentar estoque"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border mt-auto">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                      style={{
                        fontFamily: ADMIN_FONT.mono,
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      <Pencil size={11} /> EDITAR
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(product.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border hover:border-red-500/50 text-muted-foreground hover:text-red-400 transition-colors"
                      style={{
                        fontFamily: ADMIN_FONT.mono,
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      <Trash2 size={11} /> EXCLUIR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </>
      )}

      {deleteConfirm !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
          role="presentation"
          onClick={(event) =>
            event.target === event.currentTarget && !deleteProduct.isPending && setDeleteConfirm(null)
          }
        >
          <div
            className="w-full max-w-sm p-8 flex flex-col items-center gap-6"
            style={{ background: "#0D0009", border: "1px solid rgba(248,113,113,0.35)" }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
          >
            <AlertCircle size={40} color="#F87171" strokeWidth={1.5} />
            <div className="text-center">
              <div
                id="delete-product-title"
                style={{ fontFamily: ADMIN_FONT.display, fontSize: "1.2rem", color: "#FFF8E7" }}
              >
                EXCLUIR PRODUTO?
              </div>
              <div className="text-muted-foreground text-sm mt-2">Esta ação não pode ser desfeita.</div>
            </div>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteProduct.isPending}
                className="flex-1 py-3 bg-red-500/20 border border-red-500/50 text-red-400 uppercase tracking-widest hover:bg-red-500/30 transition-colors disabled:opacity-50"
                style={{
                  fontFamily: ADMIN_FONT.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                }}
              >
                {deleteProduct.isPending ? "EXCLUINDO…" : "EXCLUIR"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteProduct.isPending}
                className="flex-1 py-3 border border-border text-muted-foreground uppercase tracking-widest hover:border-primary/40 transition-colors disabled:opacity-50"
                style={{
                  fontFamily: ADMIN_FONT.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProduct !== null && (
        <ProductFormModal
          product={editingProduct === "new" ? null : editingProduct}
          onClose={() => !isSaving && setEditingProduct(null)}
          onSubmit={handleSubmit}
          isSubmitting={isSaving}
        />
      )}
    </div>
  );
}
