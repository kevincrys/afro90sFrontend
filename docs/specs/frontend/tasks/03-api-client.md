# Task 03 — Cliente API e React Query

**Fase:** 0 — Fundação  
**Status:** pendente  
**Arquivos alvo:** [`integration.md`](../integration.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

Implementar camada HTTP tipada — **substituir todos os mocks do protótipo** (`PRODUCTS`, `MOCK_ORDERS`, arrays locais) por chamadas à API.

> Esta task **não existe no protótipo** — é código novo. As tasks 05–14 **removem** `const PRODUCTS = [...]` e `useState` local ao integrar.

## O que o protótipo usa hoje (remover na integração)

| Mock no protótipo | Substituir por |
|-------------------|----------------|
| `PRODUCTS` em `StorePage.tsx` | `useProducts()` / `useProduct(id)` |
| `cart` `useState` | `useCartStore()` (task 07) |
| `MOCK_ORDERS` / `MOCK_PRODUCTS` em `AdminPage.tsx` | `useAdminOrders()` / `useAdminProducts()` |
| `onSave` local no CRUD | mutations `POST/PUT/DELETE` |
| `setDone(true)` no checkout | `useCreateOrder()` → `201` |

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Cliente | Axios com wrapper `apiClient` |
| Erros | Classe `ApiError` com `code` e `message` |
| Tipos | Espelhar `data-models.md` (não tipos do protótipo) |
| Auth admin | Interceptor Bearer (fase 2) |
| Cursor | `encodeURIComponent` nas query strings |

## O que implementar

### `src/api/client.ts`

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

### Módulos por domínio

- [ ] `src/api/products.ts` — `getProducts`, `getProductById`
- [ ] `src/api/orders.ts` — `createOrder`
- [ ] `src/api/admin/products.ts` — CRUD (stubs fase 3)
- [ ] `src/api/admin/orders.ts` — list, get, updateStatus (stubs fase 3)

### `src/types/` — espelhar backend (não protótipo)

- [ ] `product.ts`, `order.ts`, `errors.ts`
- [ ] `Category`: `oculos` \| `acessorios` \| `maquiagem` (não `Sunglasses`)

### React Query

- [ ] `QueryClientProvider` em `main.tsx`
- [ ] Defaults: `staleTime: 30_000`, `retry: 1`

### Hooks

- [ ] `useProducts({ name, category, cursor })` — infinite query
- [ ] `useProduct(id)`
- [ ] `useCreateOrder()` — mutation

## Pré-requisitos

- Task 00 concluída

## Critérios de conclusão

- [ ] `useProducts()` retorna dados da API dev (não array mock)
- [ ] Erro 404 mapeado para `ApiError`
- [ ] Atualizar **Status** para `concluída`
