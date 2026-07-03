# Task 02 — Roteamento e layout

**Fase:** 0 — Fundação  
**Status:** pendente  
**Arquivos alvo:** [`overview.md`](../overview.md)

## Objetivo

Configurar React Router com rotas públicas e admin, layout compartilhado e página 404.

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Layout público | `PublicLayout` — Header + Footer + `<Outlet>` |
| Layout admin | Header simplificado dentro de `AdminPage` (logo + logout) |
| Header público | Logo, carrinho, busca, categorias |
| Admin redirect pós-login | `/admin` (tab Pedidos) |
| Detalhe produto | Modal sobre catálogo; `/produto/:id` como deep link |
| Checkout | Drawer (sem rota `/checkout`) |
| 404 | Página customizada com tema anos 90 |
| Scroll to top | Sim, em mudança de rota |

## O que implementar

### Rotas

| Rota | Componente | Auth | Fase |
|------|------------|------|------|
| `/` | `CatalogPage` | Não | 1 |
| `/produto/:id` | `CatalogPage` (abre `ProductDetailModal`) | Não | 1 |
| `/admin/login` | `AdminLoginPage` | Não | 2 |
| `/admin` | `AdminPage` (tabs Pedidos \| Produtos) | Sim | 3 |
| `*` | `NotFoundPage` | Não | 0 |

### `src/routes/index.tsx`

- [ ] `BrowserRouter` com `Routes` e `Route`
- [ ] `PublicLayout` wrapping rotas públicas (Header + Footer + `<Outlet>`)
- [ ] `ProtectedRoute` em `/admin` (implementado na task 11 — fase 2; placeholder que redireciona para `/admin/login`)
- [ ] `ScrollToTop` component

### `AdminPage` (shell — implementação completa na fase 3)

- [ ] Tabs principais: **Pedidos** | **Produtos**
- [ ] Tab padrão: Pedidos
- [ ] Query opcional `?tab=produtos` para abrir tab Produtos (bookmark)

### `NotFoundPage`

- [ ] Mensagem temática anos 90
- [ ] Link "Voltar ao catálogo"

## Pré-requisitos

- Tasks 00, 01 concluídas

## Critérios de conclusão

- [ ] Navegação entre rotas sem reload
- [ ] `/rota-inexistente` → página 404
- [ ] `/produto/:id` abre modal de detalhe sem sair do catálogo
- [ ] Scroll to top funciona
- [ ] `overview.md` tabela de rotas atualizada
- [ ] Atualizar **Status** para `concluída`
