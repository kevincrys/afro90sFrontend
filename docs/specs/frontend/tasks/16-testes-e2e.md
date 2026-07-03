# Task 16 — Testes E2E (Cypress)

**Fase:** 4 — Qualidade final  
**Status:** pendente

## Objetivo

Implementar testes end-to-end com Cypress cobrindo os fluxos críticos de todas as fases.

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Framework E2E | Cypress |
| Unit tests | Vitest (componentes críticos) |
| Mock API | Não — dev é ambiente funcional |
| Ambiente | Apontar para `dev` deployado |

## O que implementar

### Setup Cypress

```bash
npm install -D cypress
```

- [ ] `cypress.config.ts` com `baseUrl` apontando para CloudFront dev
- [ ] `cypress/e2e/` com specs por fase

### Specs E2E

**`cypress/e2e/public-store.cy.ts`** (fase 1):
- [ ] Visitar `/` → catálogo carrega
- [ ] Clicar produto → modal de detalhe abre
- [ ] Adicionar ao carrinho → badge atualiza
- [ ] Abrir drawer → checkout com dados válidos → pedido criado

**`cypress/e2e/admin-auth.cy.ts`** (fase 2):
- [ ] `/admin` sem login → redirect `/admin/login`
- [ ] Login com credenciais → redirect `/admin`

**`cypress/e2e/admin-crud.cy.ts`** (fase 3):
- [ ] Tab Produtos: criar produto → aparece no catálogo
- [ ] Tab Pedidos: alterar status de pedido

### Testes unitários (Vitest)

- [x] `formatPrice()` — formatação BRL (`src/lib/format.test.ts`)
- [x] `cart.store` — add/remove/clear + persist (`src/stores/cart.store.test.ts`)
- [x] `errorMessages` — mapeamento pt-BR (`src/lib/errorMessages.test.ts`)

### CI

- [ ] Adicionar step Cypress no workflow CI (opcional: só em merge para `dev`)

## Pré-requisitos

- Fases 1–3 entregues
- Ambiente `dev` funcional

## Critérios de conclusão

- [ ] Specs E2E passam contra ambiente dev
- [ ] Testes unitários passam
- [ ] Atualizar **Status** para `concluída`
