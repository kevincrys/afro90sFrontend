# afro90sFrontend

Repositório do **frontend** do projeto **Afro90s** — SPA React 18 + Vite + TypeScript, hospedada em S3 + CloudFront.

## Ecossistema

| Repositório | Função |
|-------------|--------|
| [afro90sInfra](https://github.com/kevincrys/afro90sInfra) | CDK, S3/CloudFront, specs centrais, outputs |
| [afro90sBackend](https://github.com/kevincrys/afro90sBackend) | API REST consumida por esta SPA |
| **afro90sFrontend** (este) | Interface web, build estático, deploy |

## Documentação

### Neste repositório

| Recurso | Descrição |
|---------|-----------|
| [Visão do repositório](docs/foundation/vision.md) | Escopo e responsabilidades |
| [Overview frontend](docs/specs/frontend/overview.md) | Stack, estrutura, convenções |
| [UI/UX](docs/specs/frontend/ui-ux.md) | Tema visual anos 90, componentes |
| [Integração API](docs/specs/frontend/integration.md) | Variáveis `VITE_*`, client HTTP |
| [Tasks de implementação](docs/specs/frontend/tasks/) | Checklist faseado |
| [**Pipeline CI/CD**](docs/specs/pipelines/overview.md) | GitHub Actions deste repo |
| [**Setup GitHub**](docs/foundation/github-pipeline-setup.md) | Environments, OIDC, deploy S3 |
| [Guia para agentes](AGENTS.md) | Instruções para assistentes de IA |
| [Como contribuir](CONTRIBUTING.md) | Fluxo de PR e commits |

### Contrato API

Rotas e payloads: [afro90sBackend — api-routes.md](https://github.com/kevincrys/afro90sBackend/blob/main/docs/specs/backend/api-routes.md) ou cópia local em `docs/specs/backend/api-routes.md`.

### Documentação central

ADRs e arquitetura global: [afro90sInfra](https://github.com/kevincrys/afro90sInfra/tree/main/docs/foundation).

## Stack

| Componente | Tecnologia |
|------------|------------|
| Framework | React 18 |
| Build | Vite |
| Linguagem | TypeScript |
| Roteamento | React Router v6 |
| Data fetching | TanStack Query |
| Auth admin | Amplify Auth / Cognito |
| Deploy | S3 sync + invalidação CloudFront |
| CI/CD | GitHub Actions (OIDC) |

## Estrutura (alvo)

```
afro90sFrontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   └── hooks/
├── .github/workflows/
│   ├── ci.yml
│   ├── deploy-dev.yml
│   └── deploy-prod.yml
└── docs/specs/frontend/
```

## Pipeline

| Evento | Ação |
|--------|------|
| PR / push | CI: build → test → lint |
| Push `dev` | Deploy para S3/CloudFront **dev** |
| Push `main` | Deploy para **`prod`** (GitHub Environment + approval) |

Detalhes: [docs/specs/pipelines/overview.md](docs/specs/pipelines/overview.md)

## Rotas SPA

Definidas em `src/routes/index.tsx`:

| Rota | Página |
|------|--------|
| `/` | Catálogo |
| `/products/:id` | Deep link produto (modal na task 06) |
| `/admin/login` | Login admin |
| `/admin` | Painel admin (protegido) |
| `*` | 404 |

Detalhes: [overview](docs/specs/frontend/overview.md) · [integration](docs/specs/frontend/integration.md)

## Status

- [x] Specs e tasks de frontend
- [x] Documentação de pipeline e setup GitHub
- [x] Roteamento e layout (task 02) — `PublicLayout`, `ProtectedRoute`, `ScrollToTop`, 404
- [ ] Catálogo conectado à API (task 05)
- [ ] Workflows GitHub Actions
- [ ] Primeiro deploy em dev

## Desenvolvimento local

```bash
npm ci
cp .env.example .env   # preencher VITE_*
npm run dev
npm run build
npm test
```

Variáveis: ver [integration.md](docs/specs/frontend/integration.md).
