# Task 06 — Detalhe do produto (modal + deep link)

**Fase:** 1 — Site público  
**Status:** pendente  
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

- [ ] Props: receber `productId: string` — carregar com `useProduct(id)`
- [ ] `images[]` → `photos[]`
- [ ] Galeria/carrossel: **copiar JSX** do protótipo (thumbnails L375–385)
- [ ] Seletor quantidade: manter lógica, limitar a `product.quantity`
- [ ] `addToCart(product, selectedOptions)` → `cartStore.addItem({ productId, name, price, quantity, photo, maxQuantity })`
- [ ] Fechar modal: `navigate('/')` em vez de `history.pushState` + hash

## O que implementar

### `src/components/product/ProductDetailModal.tsx`

- [ ] **Copiar** `ProductModal` do protótipo como ponto de partida
- [ ] `useProduct(id)` com React Query
- [ ] Skeleton enquanto loading
- [ ] `document.title = product.name` enquanto aberto
- [ ] Focus trap (task 09)

### Integração em `CatalogPage`

- [ ] Abrir modal ao clicar card ou ao acessar `/products/:id`

## Pré-requisitos

- Task 05 concluída

## Critérios de conclusão

- [ ] Modal **visualmente igual** ao protótipo
- [ ] Dados da API; sem mock
- [ ] Deep link `/products/:id` funciona
- [ ] Atualizar **Status** para `concluída`
