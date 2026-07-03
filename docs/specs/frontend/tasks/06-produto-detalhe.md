# Task 06 — Detalhe do produto (modal + deep link)

**Fase:** 1 — Site público  
**Status:** pendente  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md)

## Objetivo

Implementar **modal de detalhe** com galeria, informações e botão adicionar ao carrinho. Rota `/produto/:id` serve como deep link.

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| UI principal | **Modal** sobre o catálogo (não página dedicada) |
| Deep link | `/produto/:id` abre o mesmo modal |
| Galeria | Imagem principal + carrossel de `photos[]` no modal |
| URLs `photos[]` | Sempre absolutas (não relativas) |
| Quantidade | Seletor 1..N limitado a `product.quantity` |
| Esgotado | Botão desabilitado |
| SEO | `document.title` = nome do produto enquanto modal aberto |

## O que implementar

### `src/components/product/ProductDetailModal.tsx`

- [ ] `useProduct(id)` com React Query
- [ ] Carrossel de `photos[]` no modal
- [ ] Nome, preço formatado (BRL), categoria
- [ ] Seletor de quantidade (1 até `product.quantity`)
- [ ] Botão "Adicionar ao carrinho" → Zustand store (task 07)
- [ ] Botão desabilitado se `quantity === 0`
- [ ] Botão fechar + overlay; ao fechar, voltar para `/` (limpar deep link)
- [ ] Skeleton durante loading
- [ ] `document.title = product.name` enquanto aberto
- [ ] `alt` em imagens = `product.name`
- [ ] Focus trap no modal (task 09)

### Integração em `CatalogPage`

- [ ] Estado `selectedProductId` ou leitura de `useParams` em `/produto/:id`
- [ ] Abrir/fechar modal sincronizado com a URL

## Pré-requisitos

- Task 05 concluída

## Critérios de conclusão

- [ ] Modal carrega produto por ID via API
- [ ] Galeria/carrossel funciona
- [ ] `/produto/:id` abre o modal diretamente
- [ ] Adicionar ao carrinho atualiza badge no header
- [ ] Atualizar **Status** para `concluída`
