# Task 07 — Carrinho e checkout (drawer)

**Fase:** 1 — Site público  
**Status:** concluída  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

**Extrair `CheckoutPanel`** do protótipo para `CartDrawer.tsx` e substituir estado local por Zustand + `POST /orders`.

## Fonte visual — protótipo

| Protótipo | Destino |
|-----------|---------|
| `CheckoutPanel` — `StorePage.tsx` **L569–796** | `src/components/cart/CartDrawer.tsx` |
| `checkoutOpen` / ícone carrinho L803, L903 | Header + estado global Zustand |
| `cart` `useState<CartItem[]>` L802 | `src/stores/cart.store.ts` |
| `setDone(true)` L598 — confirmação fake | Tela de confirmação **após** `201` da API |
| `SHIPPING`, subtotal+frete L583–584 | **Remover** — total vem de `order.fullPrice` |
| `selectedOptions` nos itens L691–694 | **Remover** |
| Campos `postal`, `phone` L578 | Mapear para `postalCode`, `tel` no POST |

### Copiar do protótipo (manter visual)

- [x] Drawer lateral direito, fundo `#0D0009`, borda amarela
- [x] Lista de itens com imagem, nome, qty, preço (L679–709)
- [x] Formulário "DELIVERY DETAILS" (L746–778)
- [x] Tela "ORDER PLACED" / confirmação (L645–668) — adaptar textos pt-BR + Afro90s

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Estado | Zustand + `localStorage` (protótipo: `useState` sem persistência) |
| Validação | Zod + react-hook-form (protótipo: validate manual L586–594) |
| Total | Da resposta API `fullPrice` |

## O que implementar

### `src/stores/cart.store.ts` (novo — substitui useState do protótipo)

```typescript
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  maxQuantity: number;
}
// persist middleware localStorage
```

- [x] `addItem`, `removeItem`, `clearCart`, `openCart` / `closeCart`
- [x] Persistência `localStorage` (`afro90s-cart`)

### `src/components/cart/CartDrawer.tsx`

- [x] **Copiar** JSX/estilos de `CheckoutPanel`
- [x] Conectar `useCartStore()` em vez de props `cart`/`onRemove`
- [x] `useCreateOrder()` no submit — substituir `setDone(true)`
- [x] Erros API em toast — usar `ApiError.message` ([integration.md](../integration.md#tratamento-de-erros))
- [x] Após `201`: limpar carrinho + confirmação → task 08 WhatsApp

### `src/lib/checkout.ts`

- [x] Schema Zod do formulário de entrega

## Pré-requisitos

- Tasks 03, 06 concluídas

## Critérios de conclusão

- [x] Drawer **igual ao protótipo**, com Zustand + API
- [x] Carrinho persiste após reload
- [x] `POST /orders` retorna `201`
- [x] Atualizar **Status** para `concluída`
