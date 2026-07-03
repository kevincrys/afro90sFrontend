# Pipelines — afro90sFrontend

**Status:** Rascunho  
**Última atualização:** 2025-06-23

## Escopo deste repositório

Pipelines de **CI** (validação) e **CD** (deploy da SPA para S3 + invalidação CloudFront).

## Workflows planejados

| Workflow | Arquivo | Trigger | Ação |
|----------|---------|---------|------|
| CI | `ci.yml` | PR + push | build → test → lint |
| Deploy dev | `deploy-dev.yml` | Push `dev` | OIDC role `afro90s-github-frontend-dev` → S3 sync + CF invalidation |
| Deploy prod | `deploy-prod.yml` | Push `main` | OIDC role `afro90s-github-frontend-prod` → idem (environment `production`) |

## Variáveis de build

Injetadas no CI antes de `npm run build`:

| Variável | Descrição |
|----------|-----------|
| `VITE_API_BASE_URL` | URL base da API |
| `VITE_ASSETS_CDN_URL` | CDN de imagens |
| `VITE_WHATSAPP_NUMBER` | Número wa.me |
| `VITE_COGNITO_*` | Pool/client (fase 2+) |

Detalhes: [integration.md](../frontend/integration.md)

## Configuração GitHub

Guia: [github-pipeline-setup.md](../../foundation/github-pipeline-setup.md)

- **Environments:** `dev`, `production`
- **Auth:** OIDC — roles `afro90s-github-frontend-dev` / `afro90s-github-frontend-prod`
- **Policy deploy:** S3 bucket web do ambiente + `cloudfront:CreateInvalidation`
- **Variables por environment:** `AWS_ROLE_ARN`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `VITE_*`

## Tasks de implementação

| Task | Descrição | Status |
|------|-----------|--------|
| [00-setup-repo](../frontend/tasks/00-setup-repo.md) | Estrutura inicial | pendente |
| [04-cicd-deploy](../frontend/tasks/04-cicd-deploy.md) | Workflows CI/CD + roles OIDC frontend | pendente |

## Dependências

| Dependência | Repo |
|-------------|------|
| S3 bucket + CloudFront | afro90sInfra task 06 |
| Outputs API/CDN | afro90sInfra task 11 |
| OIDC roles frontend | afro90sInfra — roles `afro90s-github-frontend-dev` / `-prod` |

## Critérios de aceite (fase 0)

- [ ] PR dispara CI com build + test + lint
- [ ] Push em `dev` publica SPA acessível via CloudFront dev
- [ ] Push em `main` exige approval do environment production
- [ ] Nenhum secret AWS no repositório
