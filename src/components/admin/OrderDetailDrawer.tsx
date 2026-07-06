import { AlertCircle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLabel, ADMIN_FONT } from "@/components/admin/AdminLabel";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useAdminOrder, useAdminOrderMutations } from "@/hooks/useAdminOrders";
import { formatPrice } from "@/lib/format";
import { getAllowedTransitions, isTerminalStatus, STATUS_CONFIG } from "@/lib/orderStatus";
import { ApiError } from "@/types/errors";
import type { Order, OrderStatus } from "@/types/order";

interface OrderDetailDrawerProps {
  orderId: string;
  onClose: () => void;
}

function formatItemLine(item: Order["items"][number]): string {
  const base = `QTY ${item.quantity} × ${formatPrice(item.unitPrice)}`;
  return item.selectedOption ? `${base} · ${item.selectedOption}` : base;
}

function getStatusChangeErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "INVALID_STATUS_TRANSITION") {
      return "Transição de status não permitida.";
    }
    return error.message;
  }
  return "Não foi possível atualizar o status.";
}

export default function OrderDetailDrawer({ orderId, onClose }: OrderDetailDrawerProps) {
  const { data: order, isLoading, isError } = useAdminOrder(orderId);
  const { updateStatus } = useAdminOrderMutations();

  async function handleStatusChange(nextStatus: OrderStatus) {
    if (!order || order.status === nextStatus) return;

    try {
      await updateStatus.mutateAsync({ id: order.id, status: nextStatus });
      toast.success("Status atualizado.");
    } catch (error) {
      toast.error(getStatusChangeErrorMessage(error));
    }
  }

  const allowedTransitions = order ? getAllowedTransitions(order.status) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      role="presentation"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg h-full overflow-y-auto flex flex-col"
        style={{ background: "#0D0009", borderLeft: "1px solid rgba(255,210,31,0.18)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <div
            id="order-detail-title"
            style={{
              fontFamily: ADMIN_FONT.display,
              fontSize: "1.2rem",
              color: "#FFD21F",
              letterSpacing: "0.05em",
            }}
          >
            PEDIDO #{orderId}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Fechar detalhes do pedido"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading && (
          <div
            className="flex flex-1 items-center justify-center gap-2 text-muted-foreground"
            style={{ fontFamily: ADMIN_FONT.mono, fontSize: "0.7rem", letterSpacing: "0.12em" }}
          >
            <Loader2 size={16} className="animate-spin" />
            CARREGANDO PEDIDO…
          </div>
        )}

        {isError && (
          <div
            className="flex items-center gap-2 px-7 py-6 text-red-400"
            style={{ fontFamily: ADMIN_FONT.mono, fontSize: "0.7rem", letterSpacing: "0.1em" }}
            role="alert"
          >
            <AlertCircle size={16} />
            Não foi possível carregar o pedido.
          </div>
        )}

        {order && !isLoading && (
          <div className="flex flex-col gap-6 px-7 py-6">
            <div>
              <AdminLabel>STATUS DO PEDIDO</AdminLabel>
              <div className="mt-2 mb-3">
                <OrderStatusBadge status={order.status} />
              </div>
              {!isTerminalStatus(order.status) && (
                <div className="flex flex-col gap-2">
                  {allowedTransitions.map((status) => {
                    const cfg = STATUS_CONFIG[status];
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(status)}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-3 px-4 py-2.5 border transition-all text-left disabled:opacity-50"
                        style={{
                          borderColor: `${cfg.color}55`,
                          background: cfg.bg,
                        }}
                      >
                        <OrderStatusBadge status={status} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-border" />

            <div>
              <AdminLabel>CLIENTE</AdminLabel>
              <div className="bg-card border border-border p-4 flex flex-col gap-1">
                <div
                  style={{
                    fontFamily: ADMIN_FONT.display,
                    fontSize: "1rem",
                    color: "#FFF8E7",
                  }}
                >
                  {order.customer.name}
                </div>
                <div className="text-muted-foreground text-sm">{order.customer.address}</div>
                <div className="text-muted-foreground text-sm">{order.customer.postalCode}</div>
                <div className="text-muted-foreground text-sm">{order.customer.tel}</div>
              </div>
            </div>

            <div>
              <AdminLabel>ITENS DO PEDIDO</AdminLabel>
              <div className="flex flex-col gap-3">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}:${index}`} className="bg-card border border-border p-4">
                    <div className="flex justify-between items-start mb-1 gap-3">
                      <div className="min-w-0">
                        <div
                          style={{
                            fontFamily: ADMIN_FONT.display,
                            fontSize: "0.9rem",
                            color: "#FFF8E7",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.productName}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: ADMIN_FONT.display,
                          fontSize: "0.9rem",
                          color: "#FFD21F",
                          flexShrink: 0,
                        }}
                      >
                        {formatPrice(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: ADMIN_FONT.mono,
                        fontSize: "0.6rem",
                        color: "#9A7085",
                      }}
                    >
                      {formatItemLine(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-baseline">
              <span
                style={{
                  fontFamily: ADMIN_FONT.mono,
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "#9A7085",
                }}
              >
                TOTAL PAGO
              </span>
              <span
                style={{
                  fontFamily: ADMIN_FONT.display,
                  fontSize: "1.8rem",
                  color: "#FFD21F",
                }}
              >
                {formatPrice(order.fullPrice)}
              </span>
            </div>

            <div
              style={{
                fontFamily: ADMIN_FONT.mono,
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                color: "#9A7085",
              }}
            >
              <div>CRIADO: {new Date(order.createdAt).toLocaleString("pt-BR")}</div>
              <div>ATUALIZADO: {new Date(order.updatedAt).toLocaleString("pt-BR")}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
