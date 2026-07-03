# Frontend — Integração com API e serviços

**Status:** Aprovado  
**Última atualização:** 2026-07-02

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
| `VITE_WHATSAPP_NUMBER` | Número da loja (somente dígitos, com DDI) |
| `VITE_COGNITO_USER_POOL_ID` | Login admin |
| `VITE_COGNITO_CLIENT_ID` | Login admin |
| `VITE_COGNITO_REGION` | Região Cognito |

## Cliente HTTP

```typescript
// src/api/client.ts — esboço
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const headers: HeadersInit = { Accept: 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, { headers });
  if (!res.ok) throw await res.json();
  return res.json();
}
```

Tipos alinhados a [data-models.md](../backend/data-models.md).

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
5. Se erro: exibir mensagem da API (code + message) em toast
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

- Login em `/admin/login`
- Armazenar `accessToken` em memória (ou sessionStorage)
- Interceptor adiciona header em rotas `/admin/*`
- Redirect para login se `401` em rota protegida

## React Query — chaves sugeridas

| Chave | Query |
|-------|-------|
| `['products', { cursor, name }]` | `GET /products` |
| `['product', id]` | `GET /products/{id}` |
| `['admin', 'products', filters]` | `GET /admin/products` |
| `['admin', 'orders', filters]` | `GET /admin/orders` |

## Referências

- [API routes](../backend/api-routes.md)
- [Outputs infra](../infra/outputs.md)
- [UI/UX](ui-ux.md)
