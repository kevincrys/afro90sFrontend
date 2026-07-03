# Task 07 — Carrinho e checkout (drawer)

**Fase:** 1 — Site público  
**Status:** pendente  
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

- [ ] Drawer lateral direito, fundo `#0D0009`, borda amarela
- [ ] Lista de itens com imagem, nome, qty, preço (L679–709)
- [ ] Formulário "DELIVERY DETAILS" (L746–778)
- [ ] Tela "ORDER PLACED" / confirmação (L645–668) — adaptar textos pt-BR + Afro90s

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

### `src/components/cart/CartDrawer.tsx`

- [ ] **Copiar** JSX/estilos de `CheckoutPanel`
- [ ] Conectar `useCartStore()` em vez de props `cart`/`onRemove`
- [ ] `useCreateOrder()` no submit — substituir `setDone(true)`
- [ ] Erros API em toast — usar `ApiError.message` ([integration.md](../integration.md#tratamento-de-erros))
- [ ] Após `201`: limpar carrinho → task 08 WhatsApp

## Pré-requisitos

- Tasks 03, 06 concluídas

## Critérios de conclusão

- [ ] Drawer **igual ao protótipo**, com Zustand + API
- [ ] Carrinho persiste após reload
- [ ] `POST /orders` retorna `201`
- [ ] Atualizar **Status** para `concluída`
