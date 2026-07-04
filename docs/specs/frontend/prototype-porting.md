# Frontend — Portar do protótipo Canvas

**Status:** Aprovado  
**Última atualização:** 2026-07-02

## Objetivo

Este documento é a **fonte de verdade** para implementar o frontend **copiando e adaptando** o protótipo gerado no Cursor Canvas — **não** reescrever UI do zero.

## Local do protótipo

Pasta local (fora deste repo):

```
Ecommerce Store Prototype (3)/
├── src/app/
│   ├── StorePage.tsx      # ~1.200 linhas — loja pública
│   ├── AdminPage.tsx      # ~1.000 linhas — login + admin
│   ├── App.tsx
│   └── routes.tsx
├── src/styles/
│   ├── theme.css          # tokens #7A004B / #FFD21F
│   ├── fonts.css
│   ├── index.css
│   └── tailwind.css
├── src/app/components/ui/ # shadcn/ui (copiar pasta inteira)
├── vite.config.ts
├── index.html
└── package.json           # referência de deps UI (lucide, radix, etc.)
```

> O protótipo **não** deve ser commitado em `afro90sFrontend`. Copiar arquivos na implementação.

## Estratégia geral

1. **Copiar** assets visuais (CSS, `components/ui/`, JSX relevante).
2. **Extrair** funções monolíticas do protótipo para arquivos da estrutura `overview.md`.
3. **Substituir** dados mock (`PRODUCTS`, `MOCK_ORDERS`) por hooks React Query (task 03).
4. **Remover** features fora da API (wishlist, hero marketing, reviews, variantes, frete USD).
5. **Adaptar** textos/moeda para pt-BR e contratos do backend.

## Mapa protótipo → afro90sFrontend

| Protótipo | Destino | Task |
|-----------|---------|------|
| `src/styles/*` | `src/styles/` | 00, 01 |
| `src/app/components/ui/*` | `src/components/ui/` | 00, 01 |
| `StorePage.tsx` — nav + footer | `Header.tsx`, `Footer.tsx`, trechos de `CatalogPage` | 01, 05 |
| `StorePage.tsx` — grid cards | `ProductCard.tsx`, `CatalogPage.tsx` | 05 |
| `ProductModal` (L255) | `ProductDetailModal.tsx` | 06 |
| `CheckoutPanel` (L569) | `CartDrawer.tsx` | 07 |
| `StorePage` — estado carrinho | `stores/cart.store.ts` (Zustand) | 07 |
| `components/ui/sonner.tsx` | `App.tsx` + toasts | 09 |
| `AdminPage.tsx` — `AdminLogin` (L220) | `AdminLoginPage.tsx` | 11 |
| `AdminDashboard` (L998) | `AdminPage.tsx` shell + tabs | 02, 13, 14 |
| `OrdersTab` (L720) | `AdminOrdersTab.tsx` | 14 |
| `OrderDetailPanel` (L319) | `OrderDetailDrawer.tsx` | 14 |
| `ProductsTab` (L833) | `AdminProductsTab.tsx` | 13 |
| `ProductFormModal` (L421) | `ProductFormModal.tsx` | 13 |
| `STATUS_CONFIG` (L77) | `lib/orderStatus.ts` | 14 |
| `routes.tsx` | `src/routes/index.tsx` | 02 |

## O que copiar vs adaptar vs remover

### Copiar com mínimas mudanças

- `theme.css`, `fonts.css`, animações (`ticker`, `fadeIn`)
- Pasta `components/ui/` (shadcn)
- Layout visual de nav, grid, drawers, modais
- `STATUS_CONFIG` / labels de pedido (já alinhados ao backend)

### Adaptar obrigatoriamente

| Protótipo | Afro90s |
|-----------|---------|
| `PRODUCTS` array local | `useProducts()` / `useProduct(id)` |
| `MOCK_ORDERS` | `useAdminOrders()` |
| `id: number` | `id: string` (UUID) |
| `images[]` | `photos[]` |
| `stock` | `quantity` |
| `postal` | `postalCode` |
| `phone` | `tel` |
| Preço `$` | `formatPrice()` → `R$` |
| Categorias EN (`Sunglasses`) | enum `oculos` \| `acessorios` \| `maquiagem` |
| `#product/:id` hash | rota `/products/:id` (React Router) |
| `/admin` único | `/admin` + `/admin/login` + `ProtectedRoute` |
| `amazon-cognito-identity-js` | **Amplify Auth SRP** (task 11) |
| `setDone(true)` no checkout | `POST /orders` → 201 |
| CRUD local `onSave` | `POST/PUT/DELETE /admin/products` |
| Status change local | `PUT /admin/orders/{id}` |
| Login fallback sem Cognito | Remover — exigir env Cognito em prod |

### Remover do protótipo (não portar)

- `wishlist`, ícone coração nos cards
- Seções hero, ticker marketing, testimonials, newsletter
- Campos `description`, `badge`, `rating`, `reviews`, `options`, `originalPrice`
- Cálculo de frete (`SHIPPING`, free above $80)
- `@mui/*` — protótipo lista mas não é necessário; usar só Radix/shadcn já copiados

## Ordem recomendada de port

```
00 → copiar styles + ui + vite base
01 → Header/Footer extraídos do StorePage
02 → rotas (adaptar routes.tsx)
03 → API (substituir mocks — paralelo com 05+)
05 → CatalogPage (grid + filtros do StorePage)
06 → ProductDetailModal (extrair ProductModal)
07 → CartDrawer (extrair CheckoutPanel) + Zustand
08 → whatsapp.ts integrado ao drawer
09 → sonner + skeletons + a11y
11 → AdminLogin (trocar auth lib)
13+14 → AdminPage + tabs (extrair AdminPage.tsx)
```

## Referências

- [Overview](overview.md)
- [UI/UX](ui-ux.md)
- [Tasks](tasks/README.md)
