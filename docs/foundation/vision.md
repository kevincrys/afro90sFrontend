# Visão e Escopo — afro90sFrontend

## Objetivo

Implementar a **SPA React** do Afro90s: catálogo, checkout, integração WhatsApp e painel admin, com deploy estático em S3 + CloudFront.

## Escopo

- Código-fonte React + Vite + TypeScript
- Páginas públicas (catálogo, produto, carrinho, checkout)
- Painel admin (login Cognito, CRUD produtos/pedidos)
- Client HTTP tipado para a API
- Testes (unit + e2e na fase 4)
- Pipeline CI + deploy (GitHub Actions → S3/CloudFront)
- Specs locais de frontend

## Fora de escopo

- API e lógica server-side → **afro90sBackend**
- Provisionamento S3/CloudFront/Cognito → **afro90sInfra**
- ADRs e decisões globais → **afro90sInfra**
- Internacionalização (i18n) → **pós-v1**, task 18

## Contratos

| Documento | Uso |
|-----------|-----|
| [overview.md](../specs/frontend/overview.md) | Stack e estrutura |
| [ui-ux.md](../specs/frontend/ui-ux.md) | Tema visual, acessibilidade |
| [integration.md](../specs/frontend/integration.md) | Variáveis `VITE_*`, endpoints |
| [api-routes.md](../specs/backend/api-routes.md) | Contrato HTTP (referência) |

## Princípios

1. **Mobile-first** com estética anos 90 (ver `ui-ux.md`).
2. **Integração explícita** — toda env `VITE_*` documentada em `integration.md`.
3. **Deploy via pipeline** — nunca upload manual para S3.
4. **Infra first** — hosting deve existir (afro90sInfra task 06) antes do primeiro deploy.

## Roadmap

- [ ] Task 00 — setup repo
- [ ] Task 04 — CI/CD e deploy
- [ ] Fase 1 — catálogo, produto, carrinho, checkout
- [ ] Fase 2 — admin login + CRUD
- [ ] Fase 3 — polish, states, a11y
- [ ] Fase 4 — e2e, aceite final
- [ ] Fase 5 — i18n (pt-BR, en, es) — task 18

Tasks: [docs/specs/frontend/tasks/](../specs/frontend/tasks/)

## Referências

- [Pipeline CI/CD](../specs/pipelines/overview.md)
- [Setup GitHub](github-pipeline-setup.md)
- [Visão do produto](project-overview.md)
