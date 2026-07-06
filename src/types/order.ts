export type OrderStatus =
  | "SOLICITADO"
  | "EM_ATENDIMENTO"
  | "AGUARDANDO_PAGAMENTO"
  | "EM_PREPARACAO"
  | "ENVIADO"
  | "CONCLUIDO"
  | "CANCELADO";

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  selectedOption?: string;
}

export interface Customer {
  name: string;
  address: string;
  postalCode: string;
  tel: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  fullPrice: number;
  customer: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  selectedOption?: string;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  customer: Customer;
}

export interface OrdersQueryParams {
  limit?: number;
  cursor?: string;
  status?: OrderStatus;
  q?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}
