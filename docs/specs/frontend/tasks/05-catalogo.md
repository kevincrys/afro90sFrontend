# Task 05 — Página de catálogo (`/`)

**Fase:** 1 — Site público  
**Status:** pendente  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

Portar a loja pública de `StorePage.tsx` para `CatalogPage.tsx`, **substituindo mock por API**.

## Fonte visual — protótipo

| Extrair de `StorePage.tsx` | Destino |
|----------------------------|---------|
| L801–810 — estado `activeCategory`, `filtered` | `CatalogPage` + filtros API `category` |
| L931–967 — hero | **Remover** (fora do escopo v1) |
| L980–1070 — grid de cards | `ProductCard.tsx` + grid em `CatalogPage` |
| L812–840 — hash `#product/:id` | Trocar por rota `/produto/:id` (task 06) |
| `PRODUCTS` array L42+ | **Deletar** — usar `useProducts()` |

### Adaptar no grid (copiar JSX, mudar dados)

- [ ] `product.images[0]` → `product.photos[0]`
- [ ] `product.id` number → string UUID
- [ ] `$${product.price}` → `formatPrice(product.price)`
- [ ] Overlay esgotado: protótipo não tem — **adicionar** se `quantity === 0`
- [ ] **Remover** wishlist/coração (L1023)
- [ ] **Remover** rating/reviews nos cards (L1057–1061)
- [ ] Categorias: mapear tabs do protótipo para enum API

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Paginação | Scroll infinito (`nextCursor`) — protótipo lista tudo local |
| Busca | Enter → `?name=` — protótipo tem ícone sem função |
| Filtro categoria | Tabs no header (já no protótipo) |

## O que implementar

### `src/pages/catalog/CatalogPage.tsx`

- [ ] Copiar estrutura do grid + filtros do `StorePage` (sem hero/ticker/testimonials)
- [ ] `useInfiniteQuery` com `useProducts` — **substituir** `filtered = PRODUCTS.filter(...)`
- [ ] Intersection Observer no fim do grid
- [ ] Skeleton durante loading (estilo cards do protótipo)
- [ ] Empty/error states
- [ ] `/produto/:id` → abrir modal (task 06)

### `src/components/product/ProductCard.tsx`

- [ ] Extrair card do loop do grid (L~1000–1070)
- [ ] Clique → navegar `/produto/{id}` ou abrir modal

### `src/lib/format.ts`

- [ ] `formatPrice(price: number): string` → `R$ 49,90`

## Pré-requisitos

- Tasks 00–04 concluídas
- Backend fase 1 deployado

## Critérios de conclusão

- [ ] Visual do grid **igual ao protótipo**, dados da API
- [ ] Busca, filtro, scroll infinito funcionam
- [ ] Atualizar **Status** para `concluída`
