# Task 17 — Aceite Fase 4 (Frontend v1 completo)

**Fase:** 4 — Qualidade final  
**Status:** parcial — funcional OK (BDD); **Cypress E2E** (task 16) e **SES** (cross-repo) pendentes  
**Arquivos alvo:** [`overview.md`](../overview.md)

## Objetivo

Validar frontend v1 completo com regressão de todas as fases e testes E2E.

## Checklist de aceite final

### Fase 1 — Loja pública

- [x] Catálogo, modal detalhe, carrinho drawer, checkout, WhatsApp OK

### Fase 2 — Login

- [x] Login/logout admin OK

### Fase 3 — Admin

- [x] CRUD produtos + gestão pedidos em `/admin` OK (incl. busca `q`)

### Fase 4 — Qualidade

- [ ] Cypress E2E passa contra dev — **pendente task 16**
- [x] Vitest unitários passam
- [x] Deploy automático dev e prod via CI

### Cross-repo

- [x] Frontend consome API corretamente
- [x] Imagens servidas via CloudFront assets
- [x] Cognito login com outputs da infra
- [x] Alinhado com smoke / BDD manuais (exceto SES)

### Responsividade

- [x] Mobile 375px — catálogo, modal, carrinho drawer, admin tabs
- [x] Desktop 1280px — grid 4 colunas, modais

## Pré-requisitos

- Tasks 00–15 concluídas
- Task 16 (Cypress) para fechar E2E automatizado
- SES (backend/infra) fora do escopo deste aceite de UI

## Critérios de conclusão

- [ ] Checklist completo (bloqueado em Cypress)
- [x] Critérios funcionais frontend validados via BDD
- [ ] Atualizar **Status** para `concluída` — após task 16
