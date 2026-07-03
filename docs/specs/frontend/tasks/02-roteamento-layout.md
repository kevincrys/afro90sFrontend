# Task 02 — Roteamento e layout

**Fase:** 0 — Fundação  
**Status:** pendente  
**Arquivos alvo:** [`overview.md`](../overview.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

Configurar React Router **adaptando `routes.tsx` do protótipo** para as rotas Afro90s.

## Fonte visual — protótipo

| Protótipo | Afro90s |
|-----------|---------|
| `routes.tsx` — `/` → `StorePage`, `/admin` → `AdminPage` | Expandir rotas abaixo |
| `App.tsx` — `RouterProvider` | `src/App.tsx` ou `src/routes/index.tsx` |
| `StorePage.tsx` monolítico | Virará `CatalogPage` + componentes (tasks 05–07) |
| `AdminPage.tsx` monolítico | `AdminLoginPage` + `AdminPage` com tabs (tasks 11, 13, 14) |

### Rotas do protótipo vs Afro90s

```diff
  protótipo                    Afro90s
  /          → StorePage        /          → CatalogPage
+                              /produto/:id → CatalogPage (+ modal)
+                              /admin/login → AdminLoginPage
  /admin     → AdminPage        /admin     → AdminPage (protegida)
  *          → StorePage        *          → NotFoundPage
```

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Layout público | `PublicLayout` — Header + Footer + `<Outlet>` |
| Layout admin | Header dentro de `AdminPage` (copiar `AdminDashboard` L998) |
| Admin redirect pós-login | `/admin` (tab Pedidos) |
| Detalhe produto | Modal; `/produto/:id` deep link |
| Checkout | Drawer (sem rota) |

## O que implementar

### Rotas

| Rota | Componente | Auth | Fase |
|------|------------|------|------|
| `/` | `CatalogPage` | Não | 1 |
| `/produto/:id` | `CatalogPage` + modal | Não | 1 |
| `/admin/login` | `AdminLoginPage` | Não | 2 |
| `/admin` | `AdminPage` | Sim | 3 |
| `*` | `NotFoundPage` | Não | 0 |

### `src/routes/index.tsx`

- [ ] Partir de `prototype/routes.tsx` — trocar para `react-router-dom` v6 se necessário
- [ ] `PublicLayout` com Header/Footer (task 01)
- [ ] `ProtectedRoute` em `/admin` (placeholder → task 11)
- [ ] `ScrollToTop` em mudança de rota

### `AdminPage` (shell — copiar estrutura de `AdminDashboard`)

- [ ] Portar header + tabs **Pedidos | Produtos** de `AdminPage.tsx` L998–1055
- [ ] Tab padrão: Pedidos; `?tab=produtos` opcional

### `NotFoundPage`

- [ ] Estilo anos 90 (reutilizar tokens `theme.css`)
- [ ] Link "Voltar ao catálogo"

## Pré-requisitos

- Tasks 00, 01 concluídas

## Critérios de conclusão

- [ ] `/` e `/admin` funcionam como no protótipo (com rotas extras)
- [ ] `/produto/:id` preparado para modal (task 06)
- [ ] `/rota-inexistente` → 404
- [ ] Atualizar **Status** para `concluída`
