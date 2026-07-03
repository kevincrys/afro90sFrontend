# Task 05 — Página de catálogo (`/`)



**Fase:** 1 — Site público  

**Status:** concluída  

**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`prototype-porting.md`](../prototype-porting.md)



## Objetivo



Portar a loja pública de `StorePage.tsx` para `CatalogPage.tsx`, **substituindo mock por API**.



## Fonte visual — protótipo



| Extrair de `StorePage.tsx` | Destino |

|----------------------------|---------|

| L801–810 — estado `activeCategory`, `filtered` | `CatalogPage` + filtros API `category` |

| L931–967 — hero | **Remover** (fora do escopo v1) |

| L980–1070 — grid de cards | `ProductCard.tsx` + grid em `CatalogPage` |

| L812–840 — hash `#product/:id` | Trocar por rota `/products/:id` (task 06) |

| `PRODUCTS` array L42+ | **Deletar** — usar `useProducts()` |



### Adaptar no grid (copiar JSX, mudar dados)



- [x] `product.images[0]` → `product.photos[0]`

- [x] `product.id` number → string UUID

- [x] `$${product.price}` → `formatPrice(product.price)`

- [x] Overlay esgotado: protótipo não tem — **adicionar** se `quantity === 0`

- [x] **Remover** wishlist/coração (L1023)

- [x] **Remover** rating/reviews nos cards (L1057–1061)

- [x] Categorias: mapear tabs do protótipo para enum API



## Configurações já definidas



| Decisão | Valor |

|---------|-------|

| Paginação | Scroll infinito (`nextCursor`) — protótipo lista tudo local |

| Busca | Enter → `?name=` — protótipo tem ícone sem função |

| Filtro categoria | Tabs no header (já no protótipo) |



## O que implementar



### `src/pages/catalog/CatalogPage.tsx`



- [x] Copiar estrutura do grid + filtros do `StorePage` (sem hero/ticker/testimonials)

- [x] `useInfiniteQuery` com `useProducts` — **substituir** `filtered = PRODUCTS.filter(...)`

- [x] Intersection Observer no fim do grid

- [x] Skeleton durante loading (estilo cards do protótipo)

- [x] Empty/error states

- [ ] `/products/:id` → abrir modal (task 06)



### `src/components/product/ProductCard.tsx`



- [x] Extrair card do loop do grid (L~1000–1070)

- [x] Clique → navegar `/products/{id}` ou abrir modal
- [x] Prefetch do detalhe no hover/focus (`prefetchProduct`)


### `src/lib/format.ts`



- [x] `formatPrice(price: number): string` → `R$ 49,90`



## Pré-requisitos



- Tasks 00–04 concluídas

- Backend fase 1 deployado



## Critérios de conclusão



- [x] Visual do grid **igual ao protótipo**, dados da API

- [x] Busca, filtro, scroll infinito funcionam

- [x] Atualizar **Status** para `concluída`

