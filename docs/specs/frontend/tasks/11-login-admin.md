# Task 11 — Login admin (Cognito + Amplify)

**Fase:** 2 — Login admin  
**Status:** concluída  
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

- [x] Logo: Afro90s (não "DA CROWN")
- [x] `signIn` via Amplify em vez de `user.authenticateUser`
- [x] Redirect sucesso → `/admin`
- [x] Link "Voltar à loja" → `/` (já no protótipo L305–310)

## O que implementar

### `src/lib/amplify.ts`

```typescript
import { Amplify } from 'aws-amplify';
Amplify.configure({ Auth: { Cognito: { ... } } });
```

### `src/pages/admin/AdminLoginPage.tsx`

- [x] **Copiar** UI de `AdminLogin` do protótipo
- [x] Amplify `signIn({ username, password })`
- [x] Toast erro pt-BR

### `src/components/ProtectedRoute.tsx`

- [x] Proteger `/admin` — protótipo mistura login e dashboard no mesmo arquivo

### Interceptor + Logout

- [x] Bearer em `/admin/*` (task 03)
- [x] Logout no header de `AdminPage` (copiar botão L1020–1025 de `AdminDashboard`)

### Segurança da sessão (pós-implementação)

- [x] Token **não** duplicado em `sessionStorage` — só Amplify (`fetchAuthSession`)
- [x] `checkAdminAuth()` valida sessão antes de renderizar `/admin`
- [x] `401` em `/admin/*` → `signOut` + redirect `/admin/login`

## Pré-requisitos

- Fase 1 entregue (task 10)

## Critérios de conclusão

- [x] Login **visual igual** ao protótipo, auth via Amplify
- [x] `/admin` protegida
- [x] Atualizar **Status** para `concluída`
