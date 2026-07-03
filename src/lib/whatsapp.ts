import { formatPrice } from "@/lib/format";
import type { Order } from "@/types/order";

export function getWhatsAppNumber(): string | undefined {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits || undefined;
}

export function isWhatsAppConfigured(): boolean {
  return getWhatsAppNumber() !== undefined;
}

/** Aviso no boot quando checkout público depende do número da loja. */
export function warnIfWhatsAppNumberMissing(): void {
  if (!isWhatsAppConfigured()) {
    console.warn(
      "[afro90s] VITE_WHATSAPP_NUMBER não configurado — o WhatsApp não abrirá após o pedido.",
    );
  }
}

export function buildWhatsAppOrderMessage(
  order: Pick<Order, "id" | "fullPrice"> & Partial<Pick<Order, "items" | "customer">>,
): string {
  return [
    `Olá! Novo pedido #${order.id}`,
    `Total: ${formatPrice(order.fullPrice)}`,
    `Itens: ${order.items?.length ?? 0}`,
    `Nome: ${order.customer?.name ?? ""}`,
    `Tel: ${order.customer?.tel ?? ""}`,
  ].join("\n");
}

export function buildWhatsAppOrderUrl(
  order: Pick<Order, "id" | "fullPrice"> & Partial<Pick<Order, "items" | "customer">>,
): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) return null;
  const text = encodeURIComponent(buildWhatsAppOrderMessage(order));
  return `https://wa.me/${phone}?text=${text}`;
}

/**
 * Abre WhatsApp com resumo do pedido. Retorna false se popup bloqueado ou número ausente.
 */
export function openWhatsAppOrder(
  order: Pick<Order, "id" | "fullPrice"> & Partial<Pick<Order, "items" | "customer">>,
): boolean {
  const url = buildWhatsAppOrderUrl(order);
  if (!url) return false;

  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (popup) return true;

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}
