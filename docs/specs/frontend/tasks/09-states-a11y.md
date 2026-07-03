# Task 09 — Estados de UI e acessibilidade

**Fase:** 1 — Site público  
**Status:** concluída  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

Ligar skeletons/toasts do protótipo à API e completar a11y **sem alterar o visual**.

## Fonte visual — protótipo

| Protótipo | Uso |
|-----------|-----|
| `components/ui/sonner.tsx` | Copiado na task 00 — montar `<Toaster />` em `App.tsx` |
| `components/ui/skeleton.tsx` | Base para `CatalogSkeleton`, `ProductDetailModalSkeleton` |
| Labels inline no `CheckoutPanel` (`FieldLabel` L618–624) | Já existem — validar em todos os inputs |
| Focus trap | **Adicionar** — protótipo não implementa |

## O que implementar

### Toasts (Sonner)

- [x] `<Toaster />` em `App.tsx` — componente já copiado do protótipo
- [x] Sucesso/erro de pedido e API

### `src/lib/errorMessages.ts`

- [x] Mapear códigos API para pt-BR *(implementado na task 03 — ver [integration.md](../integration.md#tratamento-de-erros))*
- [x] Revisar mensagens ao adicionar novos `code` em `api-routes.md`

### Skeletons

- [x] `CatalogSkeleton` — imitar layout do grid de cards do protótipo
- [x] `ProductDetailModalSkeleton` — imitar modal L255+

### Acessibilidade (incremental sobre protótipo)

- [x] Skip link "Ir para o conteúdo"
- [x] `aria-live="polite"` na confirmação do drawer
- [x] Focus trap em `ProductDetailModal` e `CartDrawer`

## Pré-requisitos

- Tasks 05–08 concluídas

## Critérios de conclusão

- [x] Loading/empty/error no catálogo e modal
- [x] Toasts funcionam
- [x] Atualizar **Status** para `concluída`
