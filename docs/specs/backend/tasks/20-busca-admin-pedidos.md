# Task 20 — Busca admin de pedidos (backend)

**Fase:** 3 — Rotas admin (extensão)  
**Status:** concluída  
**Arquivos alvo:** [`api-routes.md`](../api-routes.md), [`data-models.md`](../data-models.md)

Espelho de [`afro90sBackend/docs/specs/backend/tasks/20-busca-admin-pedidos.md`](../../../../afro90sBackend/docs/specs/backend/tasks/20-busca-admin-pedidos.md).

## Resumo

- `GET /admin/orders?q=` — busca por ID ou prefixo de nome do cliente
- `POST /orders` grava `customerNameLower` (padrão `nameLower` de produtos)
- Resposta admin omite `customerNameLower` via `toPublicOrder()`
- Sem mudança de infra/CDK

## Critérios de conclusão

- [x] Implementado no `afro90sBackend`
- [x] Testes unitários + smoke fase 3
- [x] Atualizar **Status** para `concluída`
