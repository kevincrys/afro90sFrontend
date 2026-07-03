/** Formata valor monetário em BRL (ex.: R$ 49,90). */
export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
