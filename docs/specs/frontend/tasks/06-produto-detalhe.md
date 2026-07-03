# Task 06 — Detalhe do produto (modal + deep link)

**Fase:** 1 — Site público  
**Status:** concluída  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

**Extrair `ProductModal`** de `StorePage.tsx` para `ProductDetailModal.tsx` e conectar à API.

## Fonte visual — protótipo

| Protótipo | Destino |
|-----------|---------|
| `ProductModal` — `StorePage.tsx` **L255–564** | `src/components/product/ProductDetailModal.tsx` |
| Hash `#product/:id` L812–840 | Rota `/products/:id` + `useParams` |
| `selectedOptions` / variantes L485–510 | **Remover** — API não suporta |
| `product.description` | **Remover** — campo não existe na API |
| `product.rating` / reviews | **Remover** |

### Adaptar no modal (manter layout, trocar dados)

- [x] Props: receber `productId: string` — carregar com `useProduct(id)`
- [x] `images[]` → `photos[]`
- [x] Galeria/carrossel: **copiar JSX** do protótipo (thumbnails L375–385)
- [x] Seletor quantidade: manter lógica, limitar a `product.quantity`
- [x] `addToCart` → `cartStore.addItem({ productId, name, price, quantity, photo, maxQuantity })`
- [x] Fechar modal: `navigate('/')` em vez de `history.pushState` + hash

## O que implementar

### `src/components/product/ProductDetailModal.tsx`

- [x] **Copiar** `ProductModal` do protótipo como ponto de partida
- [x] `useProduct(id)` com React Query
- [x] Skeleton enquanto loading
- [x] `document.title = product.name` enquanto aberto
- [x] Focus trap básico (completo na task 09)

### Integração em `CatalogPage`

- [x] Abrir modal ao clicar card ou ao acessar `/products/:id`

### `src/stores/cart.store.ts` (mínimo — task 07 expande persist/drawer)

- [x] `addItem` + `totalQuantity` para badge no header

## Pré-requisitos

- Task 05 concluída

## Critérios de conclusão

- [x] Modal **visualmente igual** ao protótipo
- [x] Dados da API; sem mock
- [x] Deep link `/products/:id` funciona
- [x] Atualizar **Status** para `concluída`
