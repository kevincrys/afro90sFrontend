# Frontend — Integração com API e serviços

**Status:** Aprovado  
**Última atualização:** 2026-07-03

## Objetivo

Descrever como o frontend consome a API, Cognito e WhatsApp.

## Rotas SPA (React Router)

Implementação: `src/routes/index.tsx`.

| Rota | Componente | Auth | API relacionada |
|------|------------|------|-----------------|
| `/` | `CatalogPage` | — | `GET /products` |
| `/products/:id` | `CatalogPage` (+ modal task 06) | — | `GET /products/{id}` |
| `/admin/login` | `AdminLoginPage` | — | Cognito |
| `/admin` | `AdminPage` | Sim (`ProtectedRoute`) | `/admin/*` |
| `*` | `NotFoundPage` | — | — |

> Deep link de produto: **`/products/:id`** (alinhado à API). Modal na task 06; hoje `useParams().id` já está wired em `CatalogPage`.

## Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `VITE_API_BASE_URL` | Base da API REST |
| `VITE_ASSETS_CDN_URL` | Prefixo de URLs de imagens (se relativas) |
| `VITE_WHATSAPP_NUMBER` | Número da loja (somente dígitos, com DDI) — checkout e footer |
| `VITE_INSTAGRAM_URL` | URL do Instagram (opcional; padrão: perfil `@afroo90s`) |
| `VITE_COGNITO_USER_POOL_ID` | Login admin |
| `VITE_COGNITO_CLIENT_ID` | Login admin |
| `VITE_COGNITO_REGION` | Região Cognito |

## Cliente HTTP

Implementação: `src/api/client.ts` (Axios + interceptor).

```typescript
// baseURL = import.meta.env.VITE_API_BASE_URL (sem barra final; incluir stage, ex.: .../dev)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});
// Rotas /admin/* recebem Authorization: Bearer <token> via interceptor
// Erros HTTP → toApiError() → ApiError (ver seção abaixo)
```

Tipos alinhados a [data-models.md](../backend/data-models.md).

## Tratamento de erros

### Princípio

**Nunca exibir ao usuário** o campo `message` do JSON de erro da API, nem detalhes técnicos (CORS, env vars, códigos HTTP crus, texto do Axios).

O frontend usa apenas o **`code`** retornado pela API (ou inferido do status HTTP) e traduz para pt-BR via `getClientErrorMessage()` em `src/lib/errorMessages.ts`.

### Fluxo

```
Resposta de erro (4xx/5xx) ou falha de rede
        │
        ▼
  toApiError()  — src/api/client.ts
        │  extrai code (+ details, se houver)
        │  ignora message do backend
        ▼
  getClientErrorMessage(code)  — src/lib/errorMessages.ts
        │
        ▼
  ApiError { status, code, message }  — message = texto pt-BR para UI
        │
        ▼
  Componente / toast exibe só error.message (sem prefixar code)
```

### Códigos mapeados

Alinhados à tabela de [api-routes.md — Códigos de erro](../backend/api-routes.md#códigos-de-erro-code):

| `code` | Mensagem ao usuário (resumo) |
|--------|------------------------------|
| `VALIDATION_ERROR` | Verifique os dados informados. |
| `NOT_FOUND` | Item não encontrado. |
| `UNAUTHORIZED` | Sessão expirada. Faça login novamente. |
| `FORBIDDEN` | Você não tem permissão para esta ação. |
| `INSUFFICIENT_STOCK` | Quantidade indisponível no estoque. |
| `INVALID_QUERY` | Filtros de busca inválidos. |
| `INVALID_CURSOR` | Não foi possível carregar mais itens. Atualize a página. |
| `INVALID_IMAGE` | Imagem inválida. Use JPEG, PNG ou WebP. |
| `PAYLOAD_TOO_LARGE` | Arquivo muito grande. Máximo 5 MB por imagem e 10 MB no total. |
| `INVALID_STATUS_TRANSITION` | Não foi possível atualizar o status do pedido. |
| `PRODUCT_NOT_FOUND` | Um dos produtos do pedido não está mais disponível. |
| `INTERNAL_ERROR` | Erro interno. Tente novamente em instantes. |

Códigos só do cliente (sem body JSON da API):

| `code` | Quando | Mensagem |
|--------|--------|----------|
| `NETWORK_ERROR` | Sem `response` (rede, CORS, timeout) | Não foi possível conectar. Tente novamente em instantes. |
| `BAD_REQUEST`, `CONFLICT`, … | Status HTTP sem `code` no body | Fallback por status (ver `STATUS_DEFAULT_CODES` em `client.ts`) |
| `UNKNOWN_ERROR` | Código desconhecido | Ocorreu um erro inesperado. Tente novamente. |

Limites de upload (`INVALID_IMAGE`, `PAYLOAD_TOO_LARGE`) seguem [api-routes.md — Upload de imagens](../backend/api-routes.md#upload-de-imagens-produtos): MIME `image/jpeg`, `image/png`, `image/webp`; 5 MB por imagem; 10 MB payload total.

### Uso na UI

```typescript
import { getClientErrorMessage } from '@/lib/errorMessages';
import { ApiError } from '@/types/errors';

// Após query/mutation
{error instanceof ApiError ? error.message : getClientErrorMessage('UNKNOWN_ERROR')}
```

Toasts (task 09): usar `error.message` quando `instanceof ApiError`; não concatenar `code` na string visível.

### Novos códigos da API

Ao adicionar um `code` em [api-routes.md](../backend/api-routes.md), incluir entrada correspondente em `src/lib/errorMessages.ts` e teste em `src/lib/errorMessages.test.ts`.

## Endpoints consumidos (público)

| Ação | Método | Rota | Spec |
|------|--------|------|------|
| Listar produtos | `GET` | `/products?limit=&cursor=&name=` | [api-routes](../backend/api-routes.md#get-products) |
| Detalhe | `GET` | `/products/{id}` | [api-routes](../backend/api-routes.md#get-productsid) |
| Criar pedido | `POST` | `/orders` | [api-routes](../backend/api-routes.md#post-orders) |

## Endpoints consumidos (admin)

Requer token Cognito em `Authorization: Bearer <access_token>`.

| Ação | Método | Rota |
|------|--------|------|
| Listar produtos | `GET` | `/admin/products` |
| Criar produto | `POST` | `/admin/products` |
| Editar produto | `PUT` | `/admin/products/{id}` |
| Excluir produto | `DELETE` | `/admin/products/{id}` |
| Ajustar estoque | `PATCH` | `/admin/products/{id}/stock` |
| Listar pedidos | `GET` | `/admin/orders` |
| Detalhe pedido | `GET` | `/admin/orders/{id}` |
| Atualizar status | `PATCH` | `/admin/orders/{id}/status` |

Detalhes de payload: [api-routes.md](../backend/api-routes.md).

## Upload de imagens (admin)

### Opção 1 — JSON com base64

```typescript
await apiPost('/admin/products', {
  name, price, quantity, category,
  photos: [
    { type: 'url', value: 'https://...' },
    { type: 'base64', value: base64String, filename: 'foto.jpg', contentType: 'image/jpeg' },
  ],
}, adminToken);
```

### Opção 2 — Multipart com stream

```typescript
const form = new FormData();
form.append('name', name);
form.append('price', String(price));
form.append('quantity', String(quantity));
form.append('category', category);
form.append('photo_0', file);
form.append('photos', JSON.stringify([
  { type: 'stream', fieldName: 'photo_0' },
]));
await fetch(`${baseUrl}/admin/products`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});
```

## Fluxo de checkout

```
1. Usuário abre drawer do carrinho (ícone no header)
2. Preenche formulário de entrega no drawer
3. POST /orders com items + customer
4. Se 201:
   a. Exibir confirmação breve no drawer (orderId)
   b. Abrir WhatsApp (wa.me)
   c. Limpar carrinho local (Zustand + localStorage)
5. Se erro: toast com `ApiError.message` (texto pt-BR mapeado — ver [Tratamento de erros](#tratamento-de-erros))
```

## Painel admin

- Rota única `/admin` com tabs **Pedidos** | **Produtos**
- Login em `/admin/login` → redirect `/admin` (tab Pedidos)
- Rotas `/admin/*` protegidas exceto `/admin/login`

## Integração WhatsApp (v1)

Após pedido criado com sucesso ([ADR-006](../../foundation/adr/006-whatsapp-integration.md)):

```typescript
function openWhatsAppOrder(order: Order) {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER;
  const text = encodeURIComponent(
    `Olá! Novo pedido #${order.id}\n` +
    `Total: R$ ${order.fullPrice.toFixed(2)}\n` +
    `Itens: ${order.items.length}\n` +
    `Nome: ${order.customer.name}\n` +
    `Tel: ${order.customer.tel}`
  );
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}
```

## Autenticação admin (Cognito)

- Login em `/admin/login` via Amplify Auth (`signIn` SRP) — `src/lib/amplify.ts`, `src/lib/auth.ts`
- **Token de acesso:** gerenciado só pelo Amplify (`fetchAuthSession`) — **não** duplicar em `sessionStorage`
- E-mail do admin em `sessionStorage` (`admin_email`) — apenas para exibição no header
- Interceptor Axios: `getAdminBearerToken()` → `Authorization: Bearer` em rotas `/admin/*`
- `ProtectedRoute` e login: `checkAdminAuth()` valida usuário + token (inclui expiração/refresh via Amplify)
- `401` em rota admin: `handleAdminUnauthorized()` → `signOut` + redirect `/admin/login`
- Logout manual: `adminSignOut()` no header do painel

## React Query — chaves sugeridas

| Chave | Query |
|-------|-------|
| `['products', { cursor, name }]` | `GET /products` |
| `['product', id]` | `GET /products/{id}` |
| `['admin', 'products', filters]` | `GET /admin/products` |
| `['admin', 'orders', filters]` | `GET /admin/orders` |

### Cache (implementado)

| Comportamento | Onde |
|---------------|------|
| `staleTime: 30_000`, `retry: 1` | `src/lib/query-client.ts` |
| Lista anterior visível ao mudar busca/filtro | `useProducts` → `placeholderData` |
| Modal usa produto do catálogo enquanto refetch | `useProduct` + `findProductInCatalogCache` |
| Prefetch no hover/focus do card | `ProductCard` → `prefetchProduct` |
| Invalidação pós-pedido (estoque) | `useCreateOrder` → `invalidateProductCachesAfterOrder` |

## Referências

- [API routes](../backend/api-routes.md)
- [Outputs infra](../infra/outputs.md)
- [UI/UX](ui-ux.md)
