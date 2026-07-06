import type { OrderItem } from "@/types/order";

export function formatOrderItemsPreview(items: OrderItem[]): string {
  if (items.length === 0) return "—";
  const preview = items
    .map((item) =>
      item.selectedOption ? `${item.productName} (${item.selectedOption})` : item.productName,
    )
    .join(", ");
  return preview.length > 30 ? `${preview.slice(0, 30)}…` : preview;
}
