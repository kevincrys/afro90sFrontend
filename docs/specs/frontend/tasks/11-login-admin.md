# Task 11 — Login admin (Cognito + Amplify)

**Fase:** 2 — Login admin  
**Status:** pendente  
**Arquivos alvo:** [`integration.md`](../integration.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

Portar tela de login do protótipo e **substituir** `amazon-cognito-identity-js` por Amplify Auth (SRP).

## Fonte visual — protótipo

| Protótipo | Destino |
|-----------|---------|
| `AdminLogin` — `AdminPage.tsx` **L220–314** | `src/pages/admin/AdminLoginPage.tsx` |
| Layout centralizado, logo, campos e-mail/senha | **Copiar JSX/estilos** |
| Fallback "qualquer login aceito" L232–236 | **Remover** — exigir Cognito |
| `getCognitoPool` L185–188 | Substituir por `src/lib/amplify.ts` |

### Adaptar

- [ ] Logo: Afro90s (não "DA CROWN")
- [ ] `signIn` via Amplify em vez de `user.authenticateUser`
- [ ] Redirect sucesso → `/admin`
- [ ] Link "Voltar à loja" → `/` (já no protótipo L305–310)

## O que implementar

### `src/lib/amplify.ts`

```typescript
import { Amplify } from 'aws-amplify';
Amplify.configure({ Auth: { Cognito: { ... } } });
```

### `src/pages/admin/AdminLoginPage.tsx`

- [ ] **Copiar** UI de `AdminLogin` do protótipo
- [ ] Amplify `signIn({ username, password })`
- [ ] Toast erro pt-BR

### `src/components/ProtectedRoute.tsx`

- [ ] Proteger `/admin` — protótipo mistura login e dashboard no mesmo arquivo

### Interceptor + Logout

- [ ] Bearer em `/admin/*` (task 03)
- [ ] Logout no header de `AdminPage` (copiar botão L1020–1025 de `AdminDashboard`)

## Pré-requisitos

- Fase 1 entregue (task 10)

## Critérios de conclusão

- [ ] Login **visual igual** ao protótipo, auth via Amplify
- [ ] `/admin` protegida
- [ ] Atualizar **Status** para `concluída`
