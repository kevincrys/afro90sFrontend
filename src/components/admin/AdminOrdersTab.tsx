import { useCallback, useRef, useState } from "react";
import { AlertCircle, Eye, Loader2 } from "lucide-react";
import OrderDetailDrawer from "@/components/admin/OrderDetailDrawer";
import AdminFilterCarousel from "@/components/admin/AdminFilterCarousel";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { ADMIN_FONT } from "@/components/admin/AdminLabel";
import { flattenAdminOrders, useAdminOrders } from "@/hooks/useAdminOrders";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { formatPrice } from "@/lib/format";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/order";

function filterButtonStyle(active: boolean, color?: string, bg?: string) {
  return {
    fontFamily: ADMIN_FONT.mono,
    fontSize: "0.6rem",
    letterSpacing: "0.12em",
    borderColor: active ? (color ?? "#FFD21F") : `${color ?? "rgba(255,210,31,0.2)"}`,
    color: active ? (color ?? "#FFD21F") : "#9A7085",
    background: active ? (bg ?? "rgba(255,210,31,0.08)") : "transparent",
  } as const;
}

function formatItemsPreview(items: { productId: string; selectedOption?: string }[]): string {
  if (items.length === 0) return "—";
  const preview = items
    .map((item) => item.selectedOption ?? item.productId.slice(0, 8))
    .join(", ");
  return preview.length > 30 ? `${preview.slice(0, 30)}…` : preview;
}

export default function AdminOrdersTab() {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const statusFilter = filterStatus === "ALL" ? undefined : filterStatus;
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminOrders({ status: statusFilter });

  const orders = flattenAdminOrders(data?.pages);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(loadMoreRef, loadMore, Boolean(hasNextPage));

  const activeFilterIndex =
    filterStatus === "ALL" ? 0 : STATUS_ORDER.indexOf(filterStatus) + 1;

  return (
    <div>
      <AdminFilterCarousel activeIndex={activeFilterIndex} ariaLabel="Filtros de status do pedido">
        <button
          type="button"
          onClick={() => setFilterStatus("ALL")}
          className="shrink-0 px-4 py-2 border text-xs uppercase transition-colors whitespace-nowrap"
          style={filterButtonStyle(filterStatus === "ALL")}
        >
          TODOS
        </button>
        {STATUS_ORDER.map((status) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className="shrink-0 px-4 py-2 border text-xs uppercase transition-colors whitespace-nowrap"
              style={filterButtonStyle(filterStatus === status, cfg.color, cfg.bg)}
            >
              {cfg.label}
            </button>
          );
        })}
      </AdminFilterCarousel>

      {isLoading && (
        <div
          className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
          style={{ fontFamily: ADMIN_FONT.mono, fontSize: "0.7rem", letterSpacing: "0.12em" }}
        >
          <Loader2 size={16} className="animate-spin" />
          CARREGANDO PEDIDOS…
        </div>
      )}

      {isError && (
        <div
          className="flex items-center gap-2 py-8 text-red-400"
          style={{ fontFamily: ADMIN_FONT.mono, fontSize: "0.7rem", letterSpacing: "0.1em" }}
          role="alert"
        >
          <AlertCircle size={16} />
          Não foi possível carregar os pedidos.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ fontFamily: ADMIN_FONT.body }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,210,31,0.15)" }}>
                {["PEDIDO", "CLIENTE", "ITENS", "TOTAL", "STATUS", "DATA", ""].map((header) => (
                  <th
                    key={header}
                    className="text-left pb-3 pr-4"
                    style={{
                      fontFamily: ADMIN_FONT.mono,
                      fontSize: "0.58rem",
                      letterSpacing: "0.18em",
                      color: "#7A004B",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                    style={{
                      fontFamily: ADMIN_FONT.mono,
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                    }}
                  >
                    NENHUM PEDIDO ENCONTRADO
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-card/50 transition-colors"
                    style={{ borderColor: "rgba(255,210,31,0.08)" }}
                  >
                    <td className="py-4 pr-4">
                      <div
                        style={{
                          fontFamily: ADMIN_FONT.mono,
                          fontSize: "0.7rem",
                          color: "#FFD21F",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {order.id}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-sm text-foreground">{order.customer.name}</div>
                      <div
                        style={{
                          fontFamily: ADMIN_FONT.mono,
                          fontSize: "0.58rem",
                          color: "#9A7085",
                        }}
                      >
                        {order.customer.tel}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-sm text-foreground">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </div>
                      <div
                        style={{
                          fontFamily: ADMIN_FONT.mono,
                          fontSize: "0.58rem",
                          color: "#9A7085",
                        }}
                      >
                        {formatItemsPreview(order.items)}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div
                        style={{
                          fontFamily: ADMIN_FONT.display,
                          fontSize: "1rem",
                          color: "#FFD21F",
                        }}
                      >
                        {formatPrice(order.fullPrice)}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-4 pr-4">
                      <div
                        style={{
                          fontFamily: ADMIN_FONT.mono,
                          fontSize: "0.6rem",
                          color: "#9A7085",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="flex items-center gap-1.5 px-3 py-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                        style={{
                          fontFamily: ADMIN_FONT.mono,
                          fontSize: "0.58rem",
                          letterSpacing: "0.12em",
                        }}
                      >
                        <Eye size={12} /> VER
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      )}

      {selectedOrderId !== null && (
        <OrderDetailDrawer
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
