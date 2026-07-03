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
| Deploy prod | Push em `main` → environment **`prod`** (approval) |
| Deploy | `aws s3 sync dist/` + `cloudfront:CreateInvalidation` |
| Build config (`VITE_*` fase 1) | **SSM em runtime** após OIDC |
| Deploy destino (bucket + CF ID) | **GitHub Environment variables** |
| `base` Vite | `/` (raiz do CloudFront) |
| Preview deployments | Fora de escopo v1 |
| Ordem deploy | Infra task 06 primeiro, depois este workflow |

## Roles IAM (OIDC) — provisionadas na infra

Template: [`github-oidc-roles.template.yaml`](https://github.com/kevincrys/afro90sInfra/blob/main/infra/iam/github-oidc-roles.template.yaml)

| Role AWS | Quando usar | Trust (`sub`) |
|----------|-------------|---------------|
| `afro90s-github-frontend-pr` | CI em PR (opcional) | `repo:kevincrys/afro90sFrontend:pull_request` |
| **`afro90s-github-frontend-dev`** | **`deploy-dev.yml`** | `…:environment:dev` **ou** `…:ref:refs/heads/dev` |
| **`afro90s-github-frontend-prod`** | **`deploy-prod.yml`** | `…:environment:prod` **ou** `…:ref:refs/heads/main` |

### Policy das roles dev/prod (mínimo)

Cada role `afro90s-github-frontend-{env}` permite **apenas** recursos **do seu ambiente**:

| Serviço | Ações | Recurso |
|---------|-------|---------|
| **S3** | `ListBucket`, `GetObject`, `PutObject`, `DeleteObject` | `afro90s-{env}-s3-web` e `/*` |
| **CloudFront** | `CreateInvalidation` | **Uma** distribuição: `arn:aws:cloudfront::083171867610:distribution/<ID-do-env>` |
| **SSM** | `GetParameter`, `GetParameters` | `/afro90s/{env}/*` |

> **Sem wildcard** em CloudFront — dev e prod têm distribution IDs distintos na policy IAM. O ID deve coincidir com `CLOUDFRONT_DISTRIBUTION_ID` no GitHub Environment e com o parâmetro OIDC `FrontendDevCloudFrontDistributionId` / `FrontendProdCloudFrontDistributionId`.

> Sem `s3:*` em outros buckets, sem Lambda/API/Cognito nestas roles.

## GitHub Environments e variables

Configurar em **Settings → Environments** (ver [github-pipeline-setup.md](../../../foundation/github-pipeline-setup.md)):

### Environment `dev`

| Variable | Origem |
|----------|--------|
| `AWS_ROLE_ARN` | ARN da role **`afro90s-github-frontend-dev`** |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET` | `afro90s-dev-s3-web` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront web dev (console ou CF stack `afro90s-dev-stack-frontend` → `WebDistribution`) |

**Não configurar no GitHub (fase 1):** `VITE_API_BASE_URL`, `VITE_ASSETS_CDN_URL`, `VITE_WHATSAPP_NUMBER` — lidos via SSM no workflow.

| SSM (workflow lê) | → build |
|-------------------|---------|
| `/afro90s/dev/api-base-url` | `VITE_API_BASE_URL` |
| `/afro90s/dev/assets-cdn-url` | `VITE_ASSETS_CDN_URL` |
| `/afro90s/dev/whatsapp-number` | `VITE_WHATSAPP_NUMBER` |

`VITE_COGNITO_*`: placeholder GitHub ou vazio até fase 2.

### Environment `prod`

| Variable | Valor |
|----------|-------|
| `AWS_ROLE_ARN` | ARN **`afro90s-github-frontend-prod`** |
| Demais | Mesmas chaves, valores **prod** (bucket `afro90s-prod-s3-web`, distribution ID prod, SSM `/afro90s/prod/*`) |

| Protection | Valor |
|------------|-------|
| Required reviewers | 1+ |
| Deployment branches | `main` only |

## O que implementar

### `.github/workflows/ci.yml`

- [ ] Trigger: `pull_request` + `push` (todas as branches)
- [ ] **Sem** `configure-aws-credentials` (build local apenas)
- [ ] Steps: checkout → Node 20 → `npm ci` → `npm run build` → `npm test` → `npm run lint`
- [ ] Injetar `VITE_*` com valores dummy para o build passar (sem deploy)

### `.github/workflows/deploy-dev.yml`

- [ ] Trigger: `push` em branch `dev`
- [ ] `environment: dev`
- [ ] Permissions: `id-token: write`, `contents: read`
- [ ] Steps:
  1. Checkout
  2. `aws-actions/configure-aws-credentials@v4` → **`afro90s-github-frontend-dev`**
  3. Carregar `VITE_*` do SSM (`ENV=dev`)
  4. Node 20 + `npm ci`
  5. `npm run build`
  6. `aws s3 sync dist/ s3://${{ vars.S3_BUCKET }} --delete`
  7. `aws cloudfront create-invalidation --distribution-id ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"`

### `.github/workflows/deploy-prod.yml`

- [ ] Trigger: `push` em branch `main`
- [ ] `environment: prod`
- [ ] Mesmos steps de deploy-dev com `ENV=prod` e variables do environment **`prod`**

### Snippet — carregar SSM + deploy

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: dev  # ou prod
    env:
      DEPLOY_ENV: dev   # prod no deploy-prod.yml
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - name: Load VITE_* from SSM
        run: |
          PREFIX="/afro90s/${DEPLOY_ENV}"
          echo "VITE_API_BASE_URL=$(aws ssm get-parameter --name "${PREFIX}/api-base-url" --query Parameter.Value --output text)" >> "$GITHUB_ENV"
          echo "VITE_ASSETS_CDN_URL=$(aws ssm get-parameter --name "${PREFIX}/assets-cdn-url" --query Parameter.Value --output text)" >> "$GITHUB_ENV"
          echo "VITE_WHATSAPP_NUMBER=$(aws ssm get-parameter --name "${PREFIX}/whatsapp-number" --query Parameter.Value --output text)" >> "$GITHUB_ENV"
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_COGNITO_USER_POOL_ID: ${{ vars.VITE_COGNITO_USER_POOL_ID }}
          VITE_COGNITO_CLIENT_ID: ${{ vars.VITE_COGNITO_CLIENT_ID }}
          VITE_COGNITO_REGION: ${{ vars.VITE_COGNITO_REGION || 'us-east-1' }}
      - run: aws s3 sync dist/ s3://${{ vars.S3_BUCKET }} --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## Pré-requisitos

- Task 00 concluída (`npm run build` funciona localmente)
- Infra: task 06 (S3 web + CloudFront) deployada em dev/prod
- Infra: task 10 (SSM `api-base-url`, `whatsapp-number`, etc.)
- Infra: roles **`afro90s-github-frontend-dev`** e **`afro90s-github-frontend-prod`** no template OIDC (com distribution IDs por ambiente)
- GitHub Environments `dev` e `prod` com 4 variables cada (sem `VITE_*` fase 1)

## Critérios de conclusão

- [ ] PR dispara `ci.yml` (build + test + lint) sem secrets AWS
- [ ] Push em `dev` assume role dev, lê SSM dev, sync S3 dev, invalida CloudFront **dev**
- [ ] SPA acessível em `CloudFrontWebUrl` (dev)
- [ ] Push em `main` usa role prod com approval; **não** acessa recursos dev
- [ ] Nenhum `AWS_ACCESS_KEY_ID` / secret de credencial no repo
- [ ] Atualizar **Status** para `concluída`

## Referências

- [github-pipeline-setup.md](../../../foundation/github-pipeline-setup.md) — checklist GitHub + tabela de roles
- [outputs.md (infra)](https://github.com/kevincrys/afro90sInfra/blob/main/docs/specs/infra/outputs.md) — § Frontend deploy
- [Infra task 06](../../infra/tasks/06-frontend-hosting.md) — bucket `afro90s-{env}-s3-web`
