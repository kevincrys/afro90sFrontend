# Task 04 — CI/CD e deploy (S3 + CloudFront)

**Fase:** 0 — Fundação  
**Status:** pendente  
**Arquivos alvo:** [`integration.md`](../integration.md), [`github-pipeline-setup.md`](../../../foundation/github-pipeline-setup.md), [`pipelines/overview.md`](../../pipelines/overview.md)

## Objetivo

Criar workflows GitHub Actions que fazem **build da SPA** e **deploy** no bucket web S3 + invalidação CloudFront, autenticando via **OIDC** (sem access keys).

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| CI | GitHub Actions no repo `kevincrys/afro90sFrontend` |
| Auth AWS | OIDC — roles IAM abaixo |
| Deploy dev | Push em `dev` → environment `dev` |
| Deploy prod | Push em `main` → environment `production` (approval) |
| Deploy | `aws s3 sync dist/` + `cloudfront:CreateInvalidation` |
| `base` Vite | `/` (raiz do CloudFront) |
| Preview deployments | Fora de escopo v1 |
| Ordem deploy | Infra task 06 primeiro, depois este workflow |

## Roles IAM (OIDC) — provisionadas na infra

| Role AWS | Quando usar | Trust (subject) |
|----------|-------------|-----------------|
| `afro90s-github-frontend-pr` | CI em PR (se precisar AWS; build/lint geralmente **não** assume role) | `repo:kevincrys/afro90sFrontend:pull_request` |
| **`afro90s-github-frontend-dev`** | **`deploy-dev.yml`** | `repo:kevincrys/afro90sFrontend:ref:refs/heads/dev` |
| **`afro90s-github-frontend-prod`** | **`deploy-prod.yml`** | `repo:kevincrys/afro90sFrontend:ref:refs/heads/main` |

### Policy das roles dev/prod (mínimo)

Cada role `afro90s-github-frontend-{env}` deve permitir **apenas**:

| Serviço | Ações | Recurso |
|---------|-------|---------|
| **S3** | `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `s3:GetObject` | Bucket web do ambiente: `afro90s-{env}-s3-web` e objetos `/*` |
| **CloudFront** | `cloudfront:CreateInvalidation` | Distribution ID do ambiente (web) |

> Sem `s3:*` em outros buckets, sem permissões de Lambda/API/Cognito nestas roles.

## GitHub Environments e variables

Configurar em **Settings → Environments** (ver [github-pipeline-setup.md](../../../foundation/github-pipeline-setup.md)):

### Environment `dev`

| Variable | Valor |
|----------|-------|
| `AWS_ROLE_ARN` | ARN da role **`afro90s-github-frontend-dev`** |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET` | `afro90s-dev-s3-web` (output infra `WebBucketName`) |
| `CLOUDFRONT_DISTRIBUTION_ID` | Output infra (distribuição web dev) |
| `VITE_API_BASE_URL` | Output `ApiBaseUrl` (dev) |
| `VITE_ASSETS_CDN_URL` | Output `AssetsCdnUrl` (dev) |
| `VITE_WHATSAPP_NUMBER` | SSM `/afro90s/dev/whatsapp-number` |
| `VITE_COGNITO_*` | Outputs infra (fase 2+) |

### Environment `production`

| Variable | Valor |
|----------|-------|
| `AWS_ROLE_ARN` | ARN da role **`afro90s-github-frontend-prod`** |
| Demais | Mesmas chaves, valores de **prod** |

| Protection | Valor |
|------------|-------|
| Required reviewers | 1+ |
| Deployment branches | `main` only |

## O que implementar

### `.github/workflows/ci.yml`

- [ ] Trigger: `pull_request` + `push` (todas as branches)
- [ ] **Sem** `configure-aws-credentials` (build local apenas)
- [ ] Steps: checkout → Node 20 → `npm ci` → `npm run build` → `npm test` → `npm run lint`
- [ ] Injetar `VITE_*` com valores dummy ou vars do repo para o build passar (sem deploy)

### `.github/workflows/deploy-dev.yml`

- [ ] Trigger: `push` em branch `dev`
- [ ] `environment: dev`
- [ ] Permissions: `id-token: write`, `contents: read`
- [ ] Steps:
  1. Checkout
  2. `aws-actions/configure-aws-credentials@v4` com `role-to-assume: ${{ vars.AWS_ROLE_ARN }}` → **`afro90s-github-frontend-dev`**
  3. Node 20 + `npm ci`
  4. Exportar `VITE_*` de `${{ vars.* }}` do environment
  5. `npm run build`
  6. `aws s3 sync dist/ s3://${{ vars.S3_BUCKET }} --delete`
  7. `aws cloudfront create-invalidation --distribution-id ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"`

### `.github/workflows/deploy-prod.yml`

- [ ] Trigger: `push` em branch `main`
- [ ] `environment: production`
- [ ] Mesmos steps de deploy-dev, com variables do environment **production**
- [ ] Role assumida: **`afro90s-github-frontend-prod`**

### Snippet OIDC (deploy workflows)

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: dev  # ou production
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_BASE_URL: ${{ vars.VITE_API_BASE_URL }}
          VITE_ASSETS_CDN_URL: ${{ vars.VITE_ASSETS_CDN_URL }}
          VITE_WHATSAPP_NUMBER: ${{ vars.VITE_WHATSAPP_NUMBER }}
          VITE_COGNITO_USER_POOL_ID: ${{ vars.VITE_COGNITO_USER_POOL_ID }}
          VITE_COGNITO_CLIENT_ID: ${{ vars.VITE_COGNITO_CLIENT_ID }}
          VITE_COGNITO_REGION: ${{ vars.VITE_COGNITO_REGION }}
      - run: aws s3 sync dist/ s3://${{ vars.S3_BUCKET }} --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## Pré-requisitos

- Task 00 concluída (`npm run build` funciona localmente)
- Infra: task 06 (S3 web + CloudFront) deployada em dev/prod
- Infra: roles **`afro90s-github-frontend-dev`** e **`afro90s-github-frontend-prod`** criadas com policy S3 + `CreateInvalidation`
- GitHub Environments `dev` e `production` configurados com variables

## Critérios de conclusão

- [ ] PR dispara `ci.yml` (build + test + lint) sem secrets AWS
- [ ] Push em `dev` assume **`afro90s-github-frontend-dev`**, sync S3 dev, invalida CloudFront dev
- [ ] SPA acessível em `CloudFrontWebUrl` (dev)
- [ ] Push em `main` usa **`afro90s-github-frontend-prod`** com approval do environment
- [ ] Nenhum `AWS_ACCESS_KEY_ID` / secret de credencial no repo
- [ ] Atualizar **Status** para `concluída`

## Referências

- [github-pipeline-setup.md](../../../foundation/github-pipeline-setup.md) — checklist GitHub + tabela de roles
- [Infra task 06](../../infra/tasks/06-frontend-hosting.md) — bucket `afro90s-{env}-s3-web`
