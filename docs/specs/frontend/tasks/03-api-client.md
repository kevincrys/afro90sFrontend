# Task 03 — Cliente API e React Query

**Fase:** 0 — Fundação  
**Status:** concluída  
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
| Erros | `ApiError` + `toApiError()`; mensagens pt-BR em `src/lib/errorMessages.ts` (nunca `message` do backend na UI) |
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
// Interceptor de resposta: axios error → toApiError() → ApiError
```

### `src/lib/errorMessages.ts`

- [x] `getClientErrorMessage(code)` — mapa pt-BR alinhado a `api-routes.md`
- [x] `toApiError()` usa só `code` da API; ignora `message` do JSON

Documentação: [integration.md — Tratamento de erros](../integration.md#tratamento-de-erros).

### Módulos por domínio

- [x] `src/api/products.ts` — `getProducts`, `getProductById`
- [x] `src/api/orders.ts` — `createOrder`
- [x] `src/api/admin/products.ts` — CRUD (stubs fase 3)
- [x] `src/api/admin/orders.ts` — list (`q?`, `status?`), get, `updateStatus` via `PUT /admin/orders/{id}`

### `src/types/` — espelhar backend (não protótipo)

- [x] `product.ts`, `order.ts`, `errors.ts`
- [x] `Category`: `oculos` \| `acessorios` \| `maquiagem` (não `Sunglasses`)

### React Query

- [x] `QueryClientProvider` em `main.tsx`
- [x] Defaults: `staleTime: 30_000`, `retry: 1`

#### Padrões de cache (catálogo v1)

- [x] `useProducts` — `placeholderData: (prev) => prev` (busca/filtro sem piscar)
- [x] `useProduct` — `placeholderData` a partir do cache do catálogo (`src/lib/product-cache.ts`)
- [x] `prefetchProduct` no hover/focus do `ProductCard`
- [x] `useCreateOrder` — `invalidateQueries` em `products` e `product/:id` após pedido (estoque)

### Hooks

- [x] `useProducts({ name, category, cursor })` — infinite query
- [x] `useProduct(id)`
- [x] `useCreateOrder()` — mutation

## Pré-requisitos

- Task 00 concluída

## Critérios de conclusão

- [x] `useProducts()` retorna dados da API dev (não array mock)
- [x] Erro 404 mapeado para `ApiError` com mensagem pt-BR (`NOT_FOUND`)
- [x] Falha de rede → `NETWORK_ERROR`; HTTP sem body → fallback por status
- [x] Testes: `client.test.ts`, `errorMessages.test.ts`
- [x] Atualizar **Status** para `concluída`
