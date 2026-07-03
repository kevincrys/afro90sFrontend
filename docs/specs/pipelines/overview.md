# Pipelines — afro90sFrontend

**Status:** Rascunho  
**Última atualização:** 2025-06-23

## Escopo deste repositório

Pipelines de **CI** (validação) e **CD** (deploy da SPA para S3 + invalidação CloudFront).

## Workflows planejados

| Workflow | Arquivo | Trigger | Ação |
|----------|---------|---------|------|
| CI | `ci.yml` | PR + push | build → test → lint |
| Deploy dev | `deploy-dev.yml` | Push `dev` | OIDC role dev → SSM → build → S3 sync + CF invalidation dev |
| Deploy prod | `deploy-prod.yml` | Push `main` | OIDC role prod → idem (environment `production`) |

## Variáveis de build

| Variável | Origem (fase 1) |
|----------|-----------------|
| `VITE_API_BASE_URL` | SSM `/afro90s/{env}/api-base-url` |
| `VITE_ASSETS_CDN_URL` | SSM `/afro90s/{env}/assets-cdn-url` |
| `VITE_WHATSAPP_NUMBER` | SSM `/afro90s/{env}/whatsapp-number` |
| `VITE_COGNITO_*` | GitHub vars ou placeholder (fase 2+) |

Detalhes: [integration.md](../frontend/integration.md) · workflow: [04-cicd-deploy.md](../frontend/tasks/04-cicd-deploy.md)

## Configuração GitHub

Guia: [github-pipeline-setup.md](../../foundation/github-pipeline-setup.md)

- **Environments:** `dev`, `production`
- **Auth:** OIDC — roles `afro90s-github-frontend-dev` / `-prod`
- **Policy deploy:** S3 bucket web do ambiente + `CreateInvalidation` na distribuição **daquele env** + SSM read
- **Variables por environment:** `AWS_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID` — **sem** `VITE_*` (fase 1)

## Tasks de implementação

| Task | Descrição | Status |
|------|-----------|--------|
| [00-setup-repo](../frontend/tasks/00-setup-repo.md) | Estrutura inicial | pendente |
| [04-cicd-deploy](../frontend/tasks/04-cicd-deploy.md) | Workflows CI/CD + roles OIDC frontend | pendente |

## Dependências

| Dependência | Repo |
|-------------|------|
| S3 bucket + CloudFront | afro90sInfra task 06 |
| SSM api-base-url, whatsapp, … | afro90sInfra task 10 |
| OIDC roles frontend | afro90sInfra — template OIDC + distribution IDs por env |

## Critérios de aceite (fase 0)

- [ ] PR dispara CI com build + test + lint
- [ ] Push em `dev` publica SPA acessível via CloudFront dev
- [ ] Push em `main` exige approval do environment production
- [ ] Role dev não invalida distribuição prod
- [ ] Nenhum secret AWS no repositório
