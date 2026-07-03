# Task 14 — Admin — Gestão de pedidos (tab Pedidos)

**Fase:** 3 — Painel admin  
**Status:** pendente  
**Arquivos alvo:** [`integration.md`](../integration.md), [`ui-ux.md`](../ui-ux.md), [`data-models.md`](../../backend/data-models.md)

## Objetivo

Implementar tab **Pedidos** em `/admin`: listagem com filtros, paginação e atualização de status via drawer.

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Container | Tab padrão em `AdminPage` (`/admin`) |
| Filtro status | Tabs secundárias (enum completo do backend) |
| Ordenação | Mais recentes primeiro |
| Detalhe | Drawer lateral |
| Transições status | Apenas válidas — ver `data-models.md` |
| Dados customer | Exibir no drawer |
| Paginação | Cursor (`nextCursor` + scroll ou "Carregar mais") |

## O que implementar

### `src/components/admin/AdminOrdersTab.tsx`

- [ ] Tabs de status: **Todos**, Solicitado, Em Atendimento, Aguardando Pagamento, Em Preparação, Enviado, Concluído, Cancelado
- [ ] `useAdminOrders({ status, cursor })` com paginação por cursor
- [ ] Ao trocar tab de status → resetar cursor e refetch
- [ ] Lista de cards: `id`, `customer.name`, `fullPrice`, `status`, `createdAt`
- [ ] Clique no card → abre drawer de detalhe

### `src/components/admin/OrderDetailDrawer.tsx`

- [ ] Dados do `customer` (nome, endereço, `postalCode`, `tel`)
- [ ] Lista de itens com `productId`, quantidade, `unitPrice`
- [ ] Seletor de status com **apenas transições válidas** a partir do status atual
- [ ] `PATCH /admin/orders/{id}/status` ao mudar status
- [ ] Toast de sucesso/erro (`INVALID_STATUS_TRANSITION` em pt-BR)

### `src/lib/orderStatus.ts`

```typescript
import type { OrderStatus } from '@/types';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  SOLICITADO: 'Solicitado',
  EM_ATENDIMENTO: 'Em Atendimento',
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  EM_PREPARACAO: 'Em Preparação',
  ENVIADO: 'Enviado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

/** Transições permitidas — espelha data-models.md */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  SOLICITADO: ['EM_ATENDIMENTO', 'CANCELADO'],
  EM_ATENDIMENTO: ['AGUARDANDO_PAGAMENTO', 'CANCELADO'],
  AGUARDANDO_PAGAMENTO: ['EM_PREPARACAO', 'CANCELADO'],
  EM_PREPARACAO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['CONCLUIDO', 'CANCELADO'],
  CONCLUIDO: [],
  CANCELADO: [],
};
```

## Pré-requisitos

- Task 13 concluída (ou `AdminPage` shell já existente da task 13)

## Critérios de conclusão

- [ ] Pedido criado no checkout aparece na tab Pedidos
- [ ] Filtro por status (tabs) funciona com paginação
- [ ] Mudança de status funciona com transições válidas
- [ ] Drawer exibe dados completos do pedido
- [ ] Atualizar **Status** para `concluída`
