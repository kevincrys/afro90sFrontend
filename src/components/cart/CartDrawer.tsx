import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle, MessageCircle, Trash2, X } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/checkout";
import { getClientErrorMessage } from "@/lib/errorMessages";
import { formatPrice } from "@/lib/format";
import {
  isWhatsAppConfigured,
  openWhatsAppOrder,
} from "@/lib/whatsapp";
import { useCartStore } from "@/stores/cart.store";
import { ApiError } from "@/types/errors";
import type { Order } from "@/types/order";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: "0.58rem",
        letterSpacing: "var(--track-label)",
        color: "#7A004B",
        marginBottom: "6px",
      }}
    >
      {children}
    </div>
  );
}

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const subtotal = useCartStore((state) => state.subtotal());

  const createOrder = useCreateOrder();
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [whatsAppBlocked, setWhatsAppBlocked] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      address: "",
      postalCode: "",
      tel: "",
    },
  });

  const handleClose = useCallback(() => {
    setCompletedOrder(null);
    setWhatsAppBlocked(false);
    reset();
    closeCart();
  }, [closeCart, reset]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  async function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) return;

    try {
      const order = await createOrder.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customer: {
          name: values.name,
          address: values.address,
          postalCode: values.postalCode,
          tel: values.tel,
        },
      });
      clearCart();
      setCompletedOrder(order);
      if (isWhatsAppConfigured()) {
        setWhatsAppBlocked(!openWhatsAppOrder(order));
      } else {
        setWhatsAppBlocked(false);
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : getClientErrorMessage("UNKNOWN_ERROR"),
      );
    }
  }

  const customerSnapshot = completedOrder?.customer ?? getValues();
  const isDone = completedOrder !== null;

  return (
    <>
      <Toaster theme="dark" position="top-center" richColors />
      <div
        className="fixed inset-0 z-50 flex justify-end"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(3px)" }}
        onClick={(event) => event.target === event.currentTarget && handleClose()}
        role="presentation"
      >
        <div
          className="relative flex flex-col w-full max-w-xl h-full overflow-y-auto"
          style={{ background: "#0D0009", borderLeft: "1px solid rgba(255,210,31,0.18)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
        >
          <div className="flex items-center justify-between px-7 py-5 border-b border-border">
            <div
              id="cart-drawer-title"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "1.4rem",
                color: "#FFD21F",
                letterSpacing: "var(--track-heading)",
              }}
            >
              {isDone ? "PEDIDO CONFIRMADO ★" : "SEU CARRINHO"}
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Fechar carrinho"
            >
              <X size={20} />
            </button>
          </div>

          {isDone && completedOrder ? (
            <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-6">
              <CheckCircle size={64} color="#FFD21F" strokeWidth={1.5} />
              <h2
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "2.2rem",
                  color: "#FFF8E7",
                  letterSpacing: "var(--track-display-title)",
                  lineHeight: 1,
                }}
              >
                PEDIDO
                <br />
                <span style={{ color: "#FFD21F" }}>REGISTRADO!</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Pedido <span className="text-foreground">{completedOrder.id}</span> registrado com
                sucesso.
                {isWhatsAppConfigured()
                  ? whatsAppBlocked
                    ? " O navegador bloqueou a abertura automática — use o botão abaixo para abrir o WhatsApp e enviar o resumo à loja."
                    : " Abrimos o WhatsApp para você enviar o resumo à loja e concluir a compra."
                  : " Não foi possível abrir o WhatsApp. Entre em contato com a loja e informe o número do pedido acima para concluir a compra."}
              </p>
              <div className="border border-border px-6 py-4 text-left w-full max-w-xs">
                <div
                  style={{
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "var(--track-label-sm)",
                    color: "#7A004B",
                    marginBottom: "8px",
                  }}
                >
                  ENTREGA
                </div>
                <div className="text-foreground text-sm">{customerSnapshot.name}</div>
                <div className="text-muted-foreground text-xs mt-1">{customerSnapshot.address}</div>
                <div className="text-muted-foreground text-xs">{customerSnapshot.postalCode}</div>
                <div className="text-muted-foreground text-xs">{customerSnapshot.tel}</div>
              </div>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.5rem", color: "#FFD21F" }}>
                TOTAL: {formatPrice(completedOrder.fullPrice)}
              </div>
              {isWhatsAppConfigured() && whatsAppBlocked && (
                <button
                  type="button"
                  onClick={() => openWhatsAppOrder(completedOrder)}
                  className="w-full max-w-xs py-3 bg-primary text-primary-foreground uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "0.9rem",
                    letterSpacing: "var(--track-ui-lg)",
                  }}
                >
                  <MessageCircle size={18} />
                  Abrir WhatsApp
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="border border-primary text-primary px-8 py-3 uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "var(--track-label-sm)",
                }}
              >
                Continuar comprando →
              </button>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className="px-7 py-5 flex flex-col gap-4">
                {items.length === 0 ? (
                  <div
                    className="text-center py-16 text-muted-foreground"
                    style={{
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "var(--track-caption)",
                    }}
                  >
                    SEU CARRINHO ESTÁ VAZIO.
                    <br />
                    EXPLORE O CATÁLOGO.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 border-b pb-4"
                      style={{ borderColor: "rgba(255,210,31,0.1)" }}
                    >
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-muted">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="truncate"
                          style={{
                            fontFamily: "'Anton', sans-serif",
                            fontSize: "1rem",
                            color: "#FFF8E7",
                          }}
                        >
                          {item.name}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              fontSize: "1.05rem",
                              color: "#FFD21F",
                            }}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              style={{
                                fontFamily: "'Courier Prime', monospace",
                                fontSize: "0.65rem",
                                color: "#9A7085",
                              }}
                            >
                              QTD {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-muted-foreground hover:text-accent transition-colors"
                              aria-label={`Remover ${item.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div
                  className="mx-7 mb-5 border p-5"
                  style={{ borderColor: "rgba(255,210,31,0.18)" }}
                >
                  <div
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "0.85rem",
                      color: "#FFD21F",
                      letterSpacing: "var(--track-ui)",
                      marginBottom: "14px",
                    }}
                  >
                    RESUMO
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[180px]">
                          {item.name} × {item.quantity}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Courier Prime', monospace",
                            color: "#FFF8E7",
                            fontSize: "0.82rem",
                          }}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div
                      className="border-t pt-3 mt-1 flex justify-between items-baseline"
                      style={{ borderColor: "rgba(255,210,31,0.18)" }}
                    >
                      <span
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          fontSize: "0.9rem",
                          color: "#FFF8E7",
                          letterSpacing: "var(--track-heading)",
                        }}
                      >
                        TOTAL
                      </span>
                      <span
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          fontSize: "1.6rem",
                          color: "#FFD21F",
                        }}
                      >
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {items.length > 0 && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="px-7 pb-8 flex flex-col gap-5"
                  noValidate
                >
                  <div
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "0.88rem",
                      color: "#FFD21F",
                      letterSpacing: "var(--track-ui)",
                    }}
                  >
                    DADOS DE ENTREGA
                  </div>

                  <div>
                    <FieldLabel>NOME COMPLETO *</FieldLabel>
                    <input
                      className={`w-full px-4 py-3 bg-muted border text-foreground placeholder:text-muted-foreground outline-none transition-colors text-sm ${errors.name ? "border-red-500" : "border-border focus:border-primary"}`}
                      placeholder="Seu nome completo"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p
                        className="text-red-400 text-xs mt-1"
                        style={{ fontFamily: "'Courier Prime', monospace" }}
                      >
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel>ENDEREÇO *</FieldLabel>
                    <input
                      className={`w-full px-4 py-3 bg-muted border text-foreground placeholder:text-muted-foreground outline-none transition-colors text-sm ${errors.address ? "border-red-500" : "border-border focus:border-primary"}`}
                      placeholder="Rua, número, complemento"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                      {...register("address")}
                    />
                    {errors.address && (
                      <p
                        className="text-red-400 text-xs mt-1"
                        style={{ fontFamily: "'Courier Prime', monospace" }}
                      >
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>CEP *</FieldLabel>
                      <input
                        className={`w-full px-4 py-3 bg-muted border text-foreground placeholder:text-muted-foreground outline-none transition-colors text-sm ${errors.postalCode ? "border-red-500" : "border-border focus:border-primary"}`}
                        placeholder="00000-000"
                        style={{ fontFamily: "'Barlow', sans-serif" }}
                        {...register("postalCode")}
                      />
                      {errors.postalCode && (
                        <p
                          className="text-red-400 text-xs mt-1"
                          style={{ fontFamily: "'Courier Prime', monospace" }}
                        >
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <FieldLabel>TELEFONE *</FieldLabel>
                      <input
                        type="tel"
                        className={`w-full px-4 py-3 bg-muted border text-foreground placeholder:text-muted-foreground outline-none transition-colors text-sm ${errors.tel ? "border-red-500" : "border-border focus:border-primary"}`}
                        placeholder="(11) 99999-9999"
                        style={{ fontFamily: "'Barlow', sans-serif" }}
                        {...register("tel")}
                      />
                      {errors.tel && (
                        <p
                          className="text-red-400 text-xs mt-1"
                          style={{ fontFamily: "'Courier Prime', monospace" }}
                        >
                          {errors.tel.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || createOrder.isPending}
                    className="w-full py-4 bg-primary text-primary-foreground uppercase tracking-widest hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-3 disabled:opacity-60"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "1.1rem",
                      letterSpacing: "var(--track-ui-lg)",
                    }}
                  >
                    Finalizar pedido — {formatPrice(subtotal)}{" "}
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
