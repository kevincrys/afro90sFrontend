import { STATUS_CONFIG } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/order";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-block px-2.5 py-1 text-xs"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "'Courier Prime', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.12em",
        border: `1px solid ${cfg.color}33`,
      }}
    >
      {cfg.label.toUpperCase()}
    </span>
  );
}
