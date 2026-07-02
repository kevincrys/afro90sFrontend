# Como Contribuir — afro90sFrontend

## Fluxo de trabalho

1. Branch a partir de `main` ou `dev`: `feat/nome-curto`.
2. Siga a task em [docs/specs/frontend/tasks/](docs/specs/frontend/tasks/).
3. Atualize [integration.md](docs/specs/frontend/integration.md) se adicionar env `VITE_*`.
4. Local: `npm run build`, `npm test`, `npm run lint`.
5. PR com CI verde.

## Commits

```
feat: add catalog page with product grid
fix: cart total calculation
style: apply retro button theme
docs: update VITE vars in integration.md
```

## Documentação

| Mudança | Onde |
|---------|------|
| Nova env de build | `docs/specs/frontend/integration.md` |
| Componente/página | task correspondente em `docs/specs/frontend/tasks/` |
| Pipeline | `docs/specs/pipelines/overview.md` |

## Revisão de PR

- [ ] CI verde
- [ ] UI alinhada com `ui-ux.md` (quando aplicável)
- [ ] Nenhum secret commitado
- [ ] Variáveis `VITE_*` documentadas

## Deploy

| Branch | Resultado |
|--------|-----------|
| `dev` | Deploy automático para CloudFront dev |
| `main` | Deploy production (após approval) |

Infra (S3/CloudFront) deve estar provisionada antes do primeiro deploy.
