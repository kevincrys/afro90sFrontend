# Task 13 — Admin — CRUD de produtos (tab Produtos)

**Fase:** 3 — Painel admin  
**Status:** pendente  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`integration.md`](../integration.md)

## Objetivo

Implementar tab **Produtos** em `/admin`: listagem, criar, editar, excluir e upload de imagens.

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Container | Tab dentro de `AdminPage` (`/admin?tab=produtos`) |
| UI listagem | Cards (não tabela) |
| Formulário | Modal |
| Upload | Multipart (preferencial) ou URL/base64 |
| Preview imagens | Sim, antes de salvar |
| Reordenar fotos | Sim, na v1 |
| Confirmação delete | Sim |
| Estoque | No mesmo modal do formulário |
| Campos API | `name`, `price`, `quantity`, `category`, `photos` apenas |

## O que implementar

### `src/pages/admin/AdminPage.tsx`

- [ ] Shell com tabs **Pedidos** | **Produtos** e header (logo, e-mail, logout)
- [ ] Renderizar `AdminProductsTab` quando tab Produtos ativa

### `src/components/admin/AdminProductsTab.tsx`

- [ ] Grid de cards com imagem, nome, preço, estoque
- [ ] `useAdminProducts()` com paginação por cursor
- [ ] Botão "Novo produto" → abre modal
- [ ] Ações por card: editar, excluir
- [ ] Filtro por categoria (tabs ou select) — opcional

### `src/components/admin/ProductFormModal.tsx`

- [ ] Campos: `name`, `price`, `quantity`, `category`
- [ ] Abas ou seções: URL de imagem + upload de arquivo
- [ ] Preview das imagens selecionadas com reordenação (drag ou botões ↑↓)
- [ ] Validação Zod
- [ ] Modo create: `POST /admin/products` (multipart)
- [ ] Modo edit: `PUT /admin/products/{id}`
- [ ] Estoque atualizado junto no PUT ou via `PATCH /admin/products/{id}/stock`

### Delete

- [ ] Dialog de confirmação "Tem certeza?"
- [ ] `DELETE /admin/products/{id}`
- [ ] Invalidar cache `['admin', 'products']`

### Skeleton e estados

- [ ] Skeleton de cards admin
- [ ] Empty: "Nenhum produto cadastrado"

## Pré-requisitos

- Fase 2 entregue (task 12)
- Backend fase 3 + infra fase 3 deployados

## Critérios de conclusão

- [ ] CRUD completo funcional com token admin na tab Produtos
- [ ] Upload de imagem → produto aparece no catálogo público
- [ ] Delete remove produto do catálogo
- [ ] Atualizar **Status** para `concluída`
