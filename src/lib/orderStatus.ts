import type { OrderStatus } from "@/types/order";

export const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  SOLICITADO: { label: "Solicitado", bg: "#2A1E00", color: "#FFD21F" },
  EM_ATENDIMENTO: { label: "Em Atendimento", bg: "#001A2E", color: "#60B4FF" },
  AGUARDANDO_PAGAMENTO: { label: "Aguardando Pagamento", bg: "#2A1000", color: "#FF8C40" },
  EM_PREPARACAO: { label: "Em Preparação", bg: "#1A0028", color: "#C084FC" },
  ENVIADO: { label: "Enviado", bg: "#001A1A", color: "#34D399" },
  CONCLUIDO: { label: "Concluído", bg: "#00200A", color: "#4ADE80" },
  CANCELADO: { label: "Cancelado", bg: "#200005", color: "#F87171" },
};

export const STATUS_ORDER: OrderStatus[] = [
  "SOLICITADO",
  "EM_ATENDIMENTO",
  "AGUARDANDO_PAGAMENTO",
  "EM_PREPARACAO",
  "ENVIADO",
  "CONCLUIDO",
  "CANCELADO",
];

/** Transições válidas — ver docs/specs/backend/data-models.md */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  SOLICITADO: ["EM_ATENDIMENTO", "CANCELADO"],
  EM_ATENDIMENTO: ["AGUARDANDO_PAGAMENTO", "CANCELADO"],
  AGUARDANDO_PAGAMENTO: ["EM_PREPARACAO", "CANCELADO"],
  EM_PREPARACAO: ["ENVIADO", "CANCELADO"],
  ENVIADO: ["CONCLUIDO", "CANCELADO"],
  CONCLUIDO: [],
  CANCELADO: [],
};

export function getAllowedTransitions(status: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[status];
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[status].length === 0;
}
