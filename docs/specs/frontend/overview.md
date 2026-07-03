# Frontend — Overview

**Status:** Aprovado  
**Última atualização:** 2026-07-03

## Objetivo

Guia de implementação do frontend Afro90s no repositório **afro90sFrontend**.

## Stack

| Componente | Tecnologia |
|------------|------------|
| Framework | **React 18** |
| Build | **Vite** |
| Linguagem | **TypeScript** |
| Roteamento | React Router v6 |
| Data fetching | TanStack Query (React Query) |
| HTTP | fetch ou axios (tipado) |
| Auth admin | AWS Amplify Auth (SRP) |
| Deploy | Build estático → S3 + CloudFront |

## Estrutura sugerida

```
afro90sFrontend/
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   ├── components/
│   │   ├── ui/                  # botões, inputs, skeletons
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductDetailModal.tsx
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx
│   │   ├── admin/
│   │   │   ├── AdminOrdersTab.tsx
│   │   │   ├── AdminProductsTab.tsx
│   │   │   ├── OrderDetailDrawer.tsx
│   │   │   └── ProductFormModal.tsx
│   │   └── layout/              # Header, Footer
│   ├── pages/
│   │   ├── catalog/
│   │   │   └── CatalogPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminLoginPage.tsx
│   │   │   └── AdminPage.tsx    # painel único com tabs
│   │   └── NotFoundPage.tsx
│   ├── routes/
│   │   └── index.tsx            # createBrowserRouter
│   ├── stores/                  # Zustand (carrinho)
│   ├── hooks/
│   ├── types/                   # espelham data-models.md
│   └── styles/
├── public/
├── index.html
└── vite.config.ts
```

## Rotas v1 (`src/routes/index.tsx`)

| Rota | Página / UI | Auth | Status |
|------|-------------|------|--------|
| `/` | Catálogo (grid + filtros) | Pública | Implementado (shell task 02/05) |
| `/products/:id` | Deep link — abre `ProductDetailModal` sobre o catálogo | Pública | Rota + `useParams`; modal task 06 |
| `/admin/login` | Login Cognito (placeholder local) | — | Implementado (shell) |
| `/admin` | Painel admin com tabs **Pedidos** \| **Produtos** | Admin | Implementado (shell + `ProtectedRoute`) |
| `*` | `NotFoundPage` | — | Implementado |

> Checkout e detalhe do produto **não são rotas separadas**: formulário de pedido no **drawer** do carrinho; detalhe no **modal** com galeria.

### Admin — tabs internas

| Tab | Conteúdo |
|-----|----------|
| **Pedidos** (padrão) | Tabs de status + lista de cards + drawer de detalhe |
| **Produtos** | Grid de cards + modal CRUD + upload de imagens |

Tab ativa pode ser controlada por estado local ou query `?tab=produtos` (opcional, para bookmark).

## Contrato com a API

Rotas e payloads: **[api-routes.md](../backend/api-routes.md)**.

Variáveis de ambiente: **[outputs da infra](../infra/outputs.md)**.

## Implementação

A UI v1 é portada do **protótipo Canvas** (`Ecommerce Store Prototype (3)`). Ver **[prototype-porting.md](prototype-porting.md)** para mapa de cópia e adaptação.

Refinamento incremental das specs: **[tasks/README.md](tasks/README.md)** (backlog por tarefa).

## Referências

- [Portar do protótipo](prototype-porting.md)
- [UI/UX](ui-ux.md)
- [Integração](integration.md)
- [Visão do produto](../../foundation/project-overview.md)
