# Task 14 — Admin — Gestão de pedidos (tab Pedidos)

**Fase:** 3 — Painel admin  
**Status:** concluída  
**Arquivos alvo:** [`integration.md`](../integration.md), [`prototype-porting.md`](../prototype-porting.md), [`data-models.md`](../../backend/data-models.md)

## Objetivo

**Extrair `OrdersTab` e `OrderDetailPanel`** de `AdminPage.tsx` e conectar à API com transições válidas.

## Fonte visual — protótipo

| Protótipo | Destino |
|-----------|---------|
| `OrdersTab` — **L720–831** | `src/components/admin/AdminOrdersTab.tsx` |
| `OrderDetailPanel` — **L319–410** | `src/components/admin/OrderDetailDrawer.tsx` |
| `STATUS_CONFIG` + `STATUS_ORDER` — **L77–90** | `src/lib/orderStatus.ts` |
| `StatusBadge` L207–215 | Reutilizar em `AdminOrdersTab` |
| `MOCK_ORDERS` | `useAdminOrders()` |

### O protótipo já acerta o enum de status

Copiar `STATUS_CONFIG` quase intacto — labels e cores já batem com `data-models.md`.

### Adaptar

- [x] `onStatusChange` local → `PUT /admin/orders/{id}`
- [x] Lista de **todos** os status no drawer (L342–355): mostrar só **transições válidas** (`ALLOWED_TRANSITIONS`)
- [x] `customer.postal` → `postalCode`
- [x] Paginação: adicionar cursor (protótipo lista mock fixo)
- [x] `order.fullPrice` → `formatPrice` BRL

## O que implementar

### `src/components/admin/AdminOrdersTab.tsx`

- [x] **Copiar** tabs de filtro + cards de `OrdersTab`
- [x] `useAdminOrders({ status, cursor })`
- [x] Reset cursor ao trocar tab

### `src/components/admin/OrderDetailDrawer.tsx`

- [x] **Copiar** `OrderDetailPanel` (drawer lateral direito)
- [x] Seletor de status filtrado por `ALLOWED_TRANSITIONS`
- [x] Toast em `INVALID_STATUS_TRANSITION`

### `src/lib/orderStatus.ts`

- [x] Portar `STATUS_CONFIG` do protótipo + `ALLOWED_TRANSITIONS` de `data-models.md`

## Pré-requisitos

- `AdminPage` shell (task 13)

## Critérios de conclusão

- [x] Tab Pedidos **visual igual** ao protótipo, dados da API
- [x] Transições válidas enforced
- [x] Atualizar **Status** para `concluída`

> **Extensão (task 20):** barra de busca por ID/nome do cliente — ver [20-busca-admin-pedidos.md](20-busca-admin-pedidos.md).
