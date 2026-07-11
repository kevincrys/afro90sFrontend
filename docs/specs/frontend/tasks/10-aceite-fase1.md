# Task 10 — Aceite Fase 1 (Site público)

**Fase:** 1 — Site público  
**Status:** concluída

## Objetivo

Validar que a loja pública está funcional end-to-end — sem login, sem admin.

### Automação pós-deploy

- [x] `scripts/smoke-test-api-fase1.sh` no CI backend (ver infra task 12)

## Checklist de aceite

- [x] `https://*.cloudfront.net` abre o site
- [x] Catálogo carrega e pagina (scroll infinito)
- [x] Busca por nome funciona (Enter)
- [x] Filtro por categoria funciona
- [x] Detalhe do produto abre em modal com galeria
- [x] Adicionar ao carrinho atualiza badge
- [x] Carrinho persiste após reload
- [x] Checkout cria pedido (`201`) e abre WhatsApp
- [x] Produto esgotado exibe overlay e botão desabilitado
- [x] Skeletons visíveis durante loading
- [x] Responsivo em 375px (mobile) e 1280px (desktop)
- [x] Deploy automático via CI (merge em `dev`)

## Pré-requisitos

- Tasks 00–09 concluídas
- Infra + backend fase 1 entregues

## Critérios de conclusão

- [x] Checklist completo
- [x] **Status** concluída — **fase 1 entregue**
