# Task 00 — Setup do repositório afro90sFrontend

**Fase:** 0 — Fundação  
**Status:** concluída  
**Repo:** `afro90sFrontend` (`kevincrys/afro90sFrontend`)

## Objetivo

Inicializar o repo **portando a base do protótipo Canvas** e adicionando dependências que o Afro90s exige (Zustand, Axios, Amplify, etc.).

> **Não** usar `npm create vite` em branco e redesenhar depois. Copiar do protótipo e complementar.

**Guia completo:** [prototype-porting.md](../prototype-porting.md)

## Fonte visual — protótipo Canvas

| Copiar de | Para |
|-----------|------|
| `Ecommerce Store Prototype (3)/src/styles/` | `src/styles/` |
| `Ecommerce Store Prototype (3)/src/app/components/ui/` | `src/components/ui/` |
| `Ecommerce Store Prototype (3)/vite.config.ts` | `vite.config.ts` (adaptar aliases `@/`) |
| `Ecommerce Store Prototype (3)/index.html` | `index.html` (título → `Afro90s`) |
| `Ecommerce Store Prototype (3)/src/main.tsx` | `src/main.tsx` (base) |

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Base UI | **Protótipo Canvas** (copiar + adaptar) |
| Framework | React 18 + Vite + TypeScript |
| CSS | Tailwind CSS (já no protótipo v4) |
| Estado carrinho | Zustand (**adicionar** — protótipo usa `useState`) |
| HTTP | Axios (**adicionar** — protótipo usa mock local) |
| Auth admin | AWS Amplify Auth SRP (**substituir** `amazon-cognito-identity-js` do protótipo) |
| Testes unitários | Vitest + Testing Library |
| Testes E2E | Cypress (fase 4) |
| Gerenciador | **npm** (protótipo usa pnpm — migrar lockfile) |

## O que implementar

### 1. Scaffold mínimo + cópia do protótipo

```bash
# Se o repo ainda não tem src/:
npm create vite@latest . -- --template react-ts
# Depois copiar (manual ou script) styles, components/ui, theme do protótipo
```

### 2. Dependências do protótipo a manter (UI)

Do `package.json` do protótipo, instalar via npm (versões compatíveis):

- `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`
- `@radix-ui/*` usados em `components/ui/`
- `sonner`, `vaul` (drawer), `tw-animate-css`

**Não instalar:** `@mui/material`, `@emotion/*` (não usados na UI portada).

### 3. Dependências Afro90s (adicionar ao protótipo)

```bash
npm install react-router-dom @tanstack/react-query axios zustand
npm install aws-amplify
npm install zod react-hook-form @hookform/resolvers
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 4. Estrutura `src/` (criar pastas vazias; páginas vêm nas tasks 05+)

```
src/
├── main.tsx
├── App.tsx
├── routes/
├── pages/
│   ├── catalog/
│   └── admin/
├── components/
│   ├── ui/                 # ← copiado do protótipo
│   ├── product/
│   ├── cart/
│   ├── admin/
│   └── layout/
├── api/
├── stores/
├── hooks/
├── types/
├── lib/
└── styles/                 # ← copiado do protótipo
```

### Configuração

- [x] `theme.css` do protótipo importado em `styles/globals.css` ou `index.css`
- [x] Alias `@/` → `src/` no `vite.config.ts` e `tsconfig`
- [x] `tsconfig.json` com `strict: true`
- [x] `.env.example`:
  ```
  VITE_API_BASE_URL=
  VITE_ASSETS_CDN_URL=
  VITE_WHATSAPP_NUMBER=
  VITE_COGNITO_USER_POOL_ID=
  VITE_COGNITO_CLIENT_ID=
  VITE_COGNITO_REGION=us-east-1
  ```
- [x] `.gitignore`: `node_modules/`, `dist/`, `.env`
- [x] ESLint + Prettier configurados

### Scripts `package.json`

- [x] `"dev": "vite"`
- [x] `"build": "tsc -b && vite build"`
- [x] `"preview": "vite preview"`
- [x] `"test": "vitest run"`
- [x] `"lint": "eslint src"`

## Pré-requisitos

- Protótipo `Ecommerce Store Prototype (3)` disponível localmente
- Nenhuma outra task do frontend

## Critérios de conclusão

- [x] `npm run dev` abre com tema anos 90 do protótipo (cores `#7A004B` / `#FFD21F`)
- [x] `components/ui/` do protótipo presente e importável
- [x] `npm run build` sem erros
- [x] Estrutura de pastas criada
- [x] Atualizar **Status** para `concluída`
