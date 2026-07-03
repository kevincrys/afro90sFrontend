# Guia para Agentes de IA — afro90sFrontend

Este repositório contém a **SPA React** do Afro90s.

## Antes de implementar

1. Leia [docs/foundation/vision.md](docs/foundation/vision.md).
2. Consulte [docs/specs/frontend/overview.md](docs/specs/frontend/overview.md), [ui-ux.md](docs/specs/frontend/ui-ux.md), [prototype-porting.md](docs/specs/frontend/prototype-porting.md) e [integration.md](docs/specs/frontend/integration.md).
3. Para contratos HTTP, veja [docs/specs/backend/api-routes.md](docs/specs/backend/api-routes.md).
4. Verifique a task em [docs/specs/frontend/tasks/](docs/specs/frontend/tasks/).
5. Siga [.cursor/rules/](.cursor/rules/).

## Onde encontrar o quê

| Tipo | Local |
|------|-------|
| Escopo deste repo | `docs/foundation/vision.md` |
| UI/UX | `docs/specs/frontend/ui-ux.md` |
| Portar protótipo Canvas | `docs/specs/frontend/prototype-porting.md` |
| Integração API / VITE_* | `docs/specs/frontend/integration.md` |
| Tasks | `docs/specs/frontend/tasks/` |
| Pipeline CI/CD | `docs/specs/pipelines/overview.md` |
| Setup GitHub | `docs/foundation/github-pipeline-setup.md` |
| Regras Cursor | `.cursor/rules/` |

## Stack deste repo

| Componente | Decisão |
|------------|---------|
| UI | React 18 + Vite + TypeScript |
| Roteamento | React Router v6 |
| Data | TanStack Query |
| Auth admin | Cognito (Amplify ou SDK) |
| Deploy | GitHub Actions → S3 + CloudFront |

## Princípios

- UI v1: **copiar e adaptar** o protótipo Canvas — ver `prototype-porting.md`; não redesenhar do zero.
- Toda nova env `VITE_*` documentar em `integration.md`.
- Deploy só via pipeline — não instruir upload manual S3.

## O que não fazer

- Não commitar secrets ou `.env`.
- Não implementar lógica de API aqui.
- Não provisionar AWS (afro90sInfra).
- Não usar access keys nos workflows — OIDC only.
