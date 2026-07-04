# Task 13 — Admin — CRUD de produtos (tab Produtos)

**Fase:** 3 — Painel admin  
**Status:** concluída  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

**Extrair `ProductsTab` e `ProductFormModal`** de `AdminPage.tsx` e conectar à API admin.

## Fonte visual — protótipo

| Protótipo | Destino |
|-----------|---------|
| `AdminDashboard` shell L998–1055 | `src/pages/admin/AdminPage.tsx` (tabs + header) |
| `ProductsTab` — **L833–991** | `src/components/admin/AdminProductsTab.tsx` |
| `ProductFormModal` — **L421–717** | `src/components/admin/ProductFormModal.tsx` |
| `MOCK_PRODUCTS` / estado local | `useAdminProducts()` + mutations |

### Campos do modal — copiar UI, podar dados

| Manter (API) | Remover do protótipo |
|--------------|----------------------|
| `name`, `price`, `stock`→`quantity`, `category`, `description`, `options` | `badge`, `badgeColor` |
| `images` → `photos` (URL + upload L608–660) | `rating`, `reviews`, `originalPrice` |
| Upload URL + arquivo | `options` / variantes L664–673 |

### Adaptar

- [x] `saveProduct` local → `POST/PUT /admin/products` multipart
- [x] `DELETE` com dialog (protótipo já tem confirmação — manter)
- [x] Categorias select → enum `oculos`, `acessorios`, `maquiagem`
- [x] Preço USD → BRL `formatPrice`

## O que implementar

### `src/pages/admin/AdminPage.tsx`

- [x] **Copiar** `AdminDashboard` (header + tabs Pedidos/Produtos)
- [x] Renderizar `AdminProductsTab` na tab Produtos

### `src/components/admin/AdminProductsTab.tsx`

- [x] **Copiar** grid de cards de `ProductsTab`
- [x] Paginação cursor API

### `src/components/admin/ProductFormModal.tsx`

- [x] **Copiar** `ProductFormModal` do protótipo
- [x] Remover campos fora da API
- [x] Zod + validação de formato (nome, preço, estoque, URLs e imagens)

## Pré-requisitos

- Fase 2 entregue (task 12)

## Critérios de conclusão

- [x] Tab Produtos **visual igual** ao protótipo, dados da API
- [x] Upload → produto no catálogo público (invalidação cache catálogo pós-mutation)
- [x] Atualizar **Status** para `concluída`
