# Task 09 — Estados de UI e acessibilidade

**Fase:** 1 — Site público  
**Status:** pendente  
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

- [ ] `<Toaster />` em `App.tsx` — componente já copiado do protótipo
- [ ] Sucesso/erro de pedido e API

### `src/lib/errorMessages.ts`

- [ ] Mapear códigos API para pt-BR

### Skeletons

- [ ] `CatalogSkeleton` — imitar layout do grid de cards do protótipo
- [ ] `ProductDetailModalSkeleton` — imitar modal L255+

### Acessibilidade (incremental sobre protótipo)

- [ ] Skip link "Ir para o conteúdo"
- [ ] `aria-live="polite"` na confirmação do drawer
- [ ] Focus trap em `ProductDetailModal` e `CartDrawer`

## Pré-requisitos

- Tasks 05–08 concluídas

## Critérios de conclusão

- [ ] Loading/empty/error no catálogo e modal
- [ ] Toasts funcionam
- [ ] Atualizar **Status** para `concluída`
