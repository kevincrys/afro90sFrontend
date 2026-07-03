# Frontend — Overview

**Status:** Aprovado  
**Última atualização:** 2026-07-02

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
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx
│   │       └── AdminPage.tsx    # painel único com tabs
│   ├── stores/                  # Zustand (carrinho)
│   ├── hooks/
│   ├── types/                   # espelham data-models.md
│   └── styles/
├── public/
├── index.html
└── vite.config.ts
```

## Páginas v1

| Rota | Página / UI | Auth |
|------|-------------|------|
| `/` | Catálogo (grid + filtros) | Pública |
| `/produto/:id` | Deep link — abre `ProductDetailModal` sobre o catálogo | Pública |
| `/admin/login` | Login Cognito | — |
| `/admin` | Painel admin com tabs **Pedidos** \| **Produtos** | Admin |

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

Refinamento incremental das specs: **[tasks/README.md](tasks/README.md)** (backlog por tarefa).

## Referências

- [UI/UX](ui-ux.md)
- [Integração](integration.md)
- [Visão do produto](../../foundation/project-overview.md)
