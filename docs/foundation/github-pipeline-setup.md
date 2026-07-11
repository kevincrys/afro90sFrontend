# Configuração de Pipelines — afro90sFrontend

Guia para configurar **GitHub Actions**, **Environments**, **OIDC AWS** e **branch protection** neste repositório.

> OIDC provider, roles e parâmetros CloudFront: [afro90sInfra — github-pipeline-setup.md](https://github.com/kevincrys/afro90sInfra/blob/main/docs/foundation/github-pipeline-setup.md).

## Repositório

| Campo | Valor |
|-------|-------|
| GitHub | `kevincrys/afro90sFrontend` |
| Pipeline | CI + deploy S3/CloudFront |
| Auth AWS | OIDC — sem access keys |

## Branches

| Branch | Deploy |
|--------|--------|
| `dev` | Automático → ambiente **dev** |
| `main` | Automático → **`prod`** (com approval) |

## Workflows

| Arquivo | Trigger | Environment |
|---------|---------|-------------|
| `ci.yml` | PR + push | — |
| `deploy-dev.yml` | Push `dev` | `dev` |
| `deploy-prod.yml` | Push `main` | `prod` |

Spec: [frontend/tasks/04-cicd-deploy.md](../specs/frontend/tasks/04-cicd-deploy.md)

### Steps deploy (resumo)

1. Checkout → OIDC (`configure-aws-credentials`)
2. Ler `VITE_*` do **SSM** (`/afro90s/{env}/…`)
3. Node 24 → `npm ci` → `npm run build`
4. `aws s3 sync dist/ s3://$S3_BUCKET --delete`
5. `aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"`

### Snippet OIDC

```yaml
permissions:
  id-token: write
  contents: read

- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ vars.AWS_ROLE_ARN }}
    aws-region: ${{ vars.AWS_REGION }}
```

## AWS — Roles IAM

Provisionadas em [`github-oidc-roles.template.yaml`](https://github.com/kevincrys/afro90sInfra/blob/main/infra/iam/github-oidc-roles.template.yaml).

| Role | Trigger (`sub`) |
|------|-----------------|
| `afro90s-github-frontend-pr` | `repo:kevincrys/afro90sFrontend:pull_request` |
| `afro90s-github-frontend-dev` | `…:environment:dev` ou `…:ref:refs/heads/dev` |
| `afro90s-github-frontend-prod` | `…:environment:prod` ou `…:ref:refs/heads/main` |

Policy dev/prod (isoladas por ambiente):

- S3: `afro90s-{env}-s3-web`
- CloudFront: `CreateInvalidation` **somente** na distribuição web daquele env (ID fixo na policy — sem wildcard)
- SSM: `GetParameter` em `/afro90s/{env}/*`

Parâmetros OIDC obrigatórios ao aplicar o template: `FrontendDevCloudFrontDistributionId`, `FrontendProdCloudFrontDistributionId` (mesmos IDs do GitHub).

> GitHub Environment de produção: nome **`prod`** (não `production`) — alinhado a backend e infra.

## GitHub Environments

### `dev`

| Variable | Origem |
|----------|--------|
| `AWS_ROLE_ARN` | Role `afro90s-github-frontend-dev` |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET` | `afro90s-dev-s3-web` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront web dev (console) |

**SSM (workflow, não GitHub):** `api-base-url`, `assets-cdn-url`, `whatsapp-number`, `cognito-user-pool-id`, `cognito-client-id`, `cognito-region` em `/afro90s/dev/*`.

### `prod`

Mesmas 4 variables com valores prod (bucket `afro90s-prod-s3-web`, distribution ID prod, SSM `/afro90s/prod/*`).

| Protection | Valor |
|------------|-------|
| Required reviewers | 1+ |
| Deployment branches | `main` only |

> Nome do Environment: **`prod`** (não criar `production`).

## Branch protection — `main`

| Opção | Valor |
|-------|-------|
| Require PR | ✅ · 1 approval |
| Require status checks | ✅ · `ci` |
| Block force push | ✅ |

## Pré-requisitos

- [x] Infra task 06 (frontend hosting) deployada
- [x] Infra: task 09–13 (SSM incl. `cognito-*` após AuthStack)
- [x] Roles IAM frontend criadas/atualizadas no stack OIDC (IDs CloudFront por env)
- [x] Distribution ID dev ≠ prod na policy IAM e no GitHub

## Checklist

- [x] Branch `dev` criada
- [x] Environments `dev` e `prod` com **4 variables** cada
- [x] Workflows commitados
- [x] Push em `dev` publica SPA no CloudFront dev
- [x] Nenhum `AWS_ACCESS_KEY_ID` no repo

## Referências

- [Pipeline overview](../specs/pipelines/overview.md)
- [integration.md](../specs/frontend/integration.md)
- [outputs.md (infra)](https://github.com/kevincrys/afro90sInfra/blob/main/docs/specs/infra/outputs.md) — § Frontend deploy
- [Guia completo (infra)](https://github.com/kevincrys/afro90sInfra/blob/main/docs/foundation/github-pipeline-setup.md)
