# Task 22 — Busca admin de produtos (UI)

**Fase:** 3 — Painel admin (extensão)  
**Status:** concluída  
**Arquivos alvo:** [`integration.md`](../integration.md)

## Objetivo

Espelhar a busca de pedidos na tab Produtos: barra única com `q` (ID ou nome do produto).

## Checklist

- [x] Barra de busca em `AdminProductsTab` (debounce 350ms, `maxLength={120}`)
- [x] `useAdminProducts` / `getAdminProducts` passam `q` (≥ 2 chars)
- [x] Combina com filtro de categoria
- [x] Empty state com termo da busca
- [x] Documentado em `integration.md`

## Critérios de conclusão

- [x] **Status** concluída
