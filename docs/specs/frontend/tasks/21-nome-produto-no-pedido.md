# Task 21 — Nome do produto no pedido (admin + WhatsApp)

**Fase:** 3 — Painel admin (extensão)  
**Status:** concluída  
**Arquivos alvo:** [`integration.md`](../integration.md), [`ui-ux.md`](../ui-ux.md), [`data-models.md`](../../backend/data-models.md)

## Objetivo

Exibir nome do produto (`OrderItem.productName`) na admin de pedidos. Opcionalmente incluir nomes na mensagem WhatsApp pós-checkout.

**Prioridade:** admin (obrigatório) > WhatsApp (secundário).

## O que implementar

### Prioridade 1 — Admin (obrigatório)

- [x] `OrderItem` em `src/types/order.ts`: `productName?: string`
- [x] Helper `getOrderItemLabel(item)` em `src/lib/orderItems.ts`
- [x] `OrderDetailDrawer`: exibir nome do produto em destaque; `productId` em texto secundário quando legado
- [x] `AdminOrdersTab`: coluna ITENS / preview usa nomes (`formatOrderItemsPreview`)

### Prioridade 2 — WhatsApp (secundário)

- [x] `buildOrderSnapshot` em `CartDrawer`: mapear `productName: item.name` do carrinho
- [x] `buildWhatsAppOrderMessage`: listar itens com nome, qty e opção
- [x] Testes em `whatsapp.test.ts`

## Comportamento UX

- Pedidos novos: nome legível na listagem e no drawer
- Pedidos legados sem `productName`: fallback para `productId` truncado
- WhatsApp: lista de itens quando `productName` disponível no snapshot local

## Pré-requisitos

- Backend task 21 deployada (ou tipos toleram campo ausente com fallback)
- Task 14 (admin pedidos) funcional

## Critérios de conclusão

- [x] Listagem admin mostra nomes dos produtos
- [x] Drawer mostra nome em destaque por item
- [x] Pedidos antigos sem `productName` exibem fallback legível
- [x] WhatsApp lista nomes dos itens
- [x] Atualizar **Status** para `concluída`
