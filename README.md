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
- [x] Cliente API + React Query (task 03)
- [x] Workflows GitHub Actions (task 04)
- [ ] Primeiro deploy em dev

## Desenvolvimento local

### Pré-requisitos

- **Node.js** 24+ (LTS ativa — ver `.nvmrc`)
- **npm** (incluído com o Node)
- API rodando localmente (`afro90sBackend`) **ou** URL da API **dev** na AWS

### 1. Instalar dependências

```bash
npm ci
```

No **PowerShell**, se `npm` falhar por política de execução, use `npm.cmd` (ex.: `npm.cmd ci`).

### 2. Configurar variáveis de ambiente

O frontend lê variáveis `VITE_*` do arquivo **`.env`** na raiz do projeto. Esse arquivo **não vai para o Git** (está no `.gitignore`).

**Windows (PowerShell):**

```powershell
copy .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

Edite `.env` conforme o cenário:

| Cenário | `VITE_API_BASE_URL` |
|---------|---------------------|
| API local (`afro90sBackend`) | `http://localhost:3000` |
| API **dev** na AWS | URL do SSM `/afro90s/dev/api-base-url` |

Exemplo para obter URLs **dev** na AWS (região `us-east-1`):

```bash
aws ssm get-parameter --name "/afro90s/dev/api-base-url" --query Parameter.Value --output text
aws ssm get-parameter --name "/afro90s/dev/assets-cdn-url" --query Parameter.Value --output text
```

Referência de todas as variáveis: [`.env.example`](.env.example) e [integration.md](docs/specs/frontend/integration.md).

> **Importante:** após mudar `.env`, pare o Vite (`Ctrl+C`) e rode `npm run dev` de novo.

### 3. Subir o frontend

```bash
npm run dev
```

Abra **http://localhost:5173/** no navegador.

| URL local | O que é |
|-----------|---------|
| http://localhost:5173/ | Catálogo |
| http://localhost:5173/products/{id} | Deep link produto |
| http://localhost:5173/admin/login | Login admin |
| http://localhost:5173/admin | Painel admin |

As chamadas à API usam `VITE_API_BASE_URL` (ex.: `http://localhost:3000/products`). Não há proxy no Vite — o browser fala direto com a API. Se usar API local, o backend precisa permitir CORS para `http://localhost:5173`.

### 4. Outros comandos

```bash
npm run build    # build de produção (dist/)
npm run preview  # serve o dist/ localmente
npm test         # testes (Vitest)
npm run lint     # ESLint
```

### Troubleshooting

| Problema | Solução |
|----------|---------|
| `npm` bloqueado no PowerShell | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ou use `npm.cmd` |
| Catálogo com erro de rede | Confira `VITE_API_BASE_URL` no `.env` e se a API está no ar |
| Mudou `.env` e nada alterou | Reinicie `npm run dev` |
