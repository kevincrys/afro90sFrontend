# Configuração de Pipelines — afro90sFrontend

Guia para configurar **GitHub Actions**, **Environments**, **OIDC AWS** e **branch protection** neste repositório.

> OIDC provider e conta AWS: [afro90sInfra — github-pipeline-setup.md](https://github.com/kevincrys/afro90sInfra/blob/main/docs/foundation/github-pipeline-setup.md).

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
| `main` | Automático → **production** (com approval) |

## Workflows

| Arquivo | Trigger | Environment |
|---------|---------|-------------|
| `ci.yml` | PR + push | — |
| `deploy-dev.yml` | Push `dev` | `dev` |
| `deploy-prod.yml` | Push `main` | `production` |

Spec: [frontend/tasks/04-cicd-deploy.md](../specs/frontend/tasks/04-cicd-deploy.md)

### Steps deploy (resumo)

1. Checkout → Node 20 → `npm ci`
2. Injetar `VITE_*` (variables do environment ou artifact da infra)
3. `npm run build`
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

| Role | Trigger |
|------|---------|
| `afro90s-github-frontend-pr` | `repo:kevincrys/afro90sFrontend:pull_request` |
| `afro90s-github-frontend-dev` | `repo:kevincrys/afro90sFrontend:ref:refs/heads/dev` |
| `afro90s-github-frontend-prod` | `repo:kevincrys/afro90sFrontend:ref:refs/heads/main` |

Policy dev/prod: S3 no bucket web do ambiente + `cloudfront:CreateInvalidation`.

## GitHub Environments

### `dev`

| Variable | Origem |
|----------|--------|
| `AWS_ROLE_ARN` | Role `afro90s-github-frontend-dev` |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET` | Output infra `WebBucketName` (dev) |
| `CLOUDFRONT_DISTRIBUTION_ID` | Output infra (dev) |
| `VITE_API_BASE_URL` | Output `ApiBaseUrl` |
| `VITE_ASSETS_CDN_URL` | Output `AssetsCdnUrl` |
| `VITE_WHATSAPP_NUMBER` | SSM `/afro90s/dev/whatsapp-number` |

### `production`

Mesmas variables com valores de prod.

| Protection | Valor |
|------------|-------|
| Required reviewers | 1+ |
| Deployment branches | `main` only |

## Branch protection — `main`

| Opção | Valor |
|-------|-------|
| Require PR | ✅ · 1 approval |
| Require status checks | ✅ · `ci` |
| Block force push | ✅ |

## Pré-requisitos

- [ ] Infra task 07 (frontend hosting) deployada
- [ ] Infra task 04 (CI/CD base) ou outputs disponíveis
- [ ] Roles IAM frontend criadas

## Checklist

- [ ] Branch `dev` criada
- [ ] Environments `dev` e `production` com variables
- [ ] Workflows commitados
- [ ] Push em `dev` publica SPA no CloudFront dev
- [ ] Nenhum `AWS_ACCESS_KEY_ID` no repo

## Referências

- [Pipeline overview](../specs/pipelines/overview.md)
- [integration.md](../specs/frontend/integration.md)
- [Guia completo (infra)](https://github.com/kevincrys/afro90sInfra/blob/main/docs/foundation/github-pipeline-setup.md)
