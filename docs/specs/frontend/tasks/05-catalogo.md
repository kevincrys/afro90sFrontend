# Task 05 — Página de catálogo (`/`)

**Fase:** 1 — Site público  
**Status:** pendente  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`integration.md`](../integration.md)

## Objetivo

Implementar listagem pública de produtos com busca, filtro por categoria, scroll infinito e abertura do modal de detalhe.

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Paginação | Scroll infinito |
| Busca | Disparo ao Enter (não em tempo real) |
| Filtro categoria | Tabs no header (`oculos`, `acessorios`, `maquiagem`, Todos) |
| Preço | `R$ 49,90` (pt-BR) |
| `quantity=0` | Overlay "Esgotado" no card |
| Detalhe | Clique no card → `ProductDetailModal` (task 06) |

## O que implementar

### `src/pages/catalog/CatalogPage.tsx`

- [ ] Grid de `ProductCard` (1→4 colunas responsivo)
- [ ] `useProducts({ name, category, cursor })` com infinite query
- [ ] Barra de busca no Header — submit ao Enter
- [ ] Tabs de categorias no header
- [ ] Intersection Observer para carregar próxima página (`nextCursor`)
- [ ] Skeleton de cards durante loading
- [ ] Empty state: "Nenhum produto encontrado"
- [ ] Error state com botão "Tentar novamente"
- [ ] Se rota `/produto/:id` → abrir `ProductDetailModal` com `useProduct(id)`

### `src/components/product/ProductCard.tsx`

- [ ] Imagem principal (`photos[0]`), nome, preço formatado
- [ ] Badge "Esgotado" se `quantity === 0`
- [ ] Clique abre modal de detalhe (atualizar URL para `/produto/{id}` opcional)

### `src/lib/format.ts`

- [ ] `formatPrice(price: number): string` → `R$ 49,90`

## Pré-requisitos

- Tasks 00–04 concluídas
- Backend fase 1 + infra fase 1 deployados

## Critérios de conclusão

- [ ] Catálogo carrega produtos da API
- [ ] Busca por nome funciona (Enter)
- [ ] Scroll infinito carrega mais itens
- [ ] Produto esgotado exibe overlay
- [ ] Clique no card abre modal de detalhe
- [ ] Atualizar **Status** para `concluída`
