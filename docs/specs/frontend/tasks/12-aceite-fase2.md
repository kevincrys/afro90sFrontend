# Task 12 — Aceite Fase 2 (Login admin)

**Fase:** 2 — Login admin  
**Status:** concluída

## Objetivo

Validar fluxo de login admin sem as tabs de gestão ainda implementadas.

## Checklist de aceite

- [x] `/admin/login` exibe formulário
- [x] Login com credenciais válidas → redirect `/admin`
- [x] Login com credenciais inválidas → mensagem de erro
- [x] `/admin` sem sessão → redirect `/admin/login`
- [x] Logout limpa sessão e volta ao catálogo
- [x] Primeiro acesso (senha temporária) → tela de nova senha → `/admin`
- [x] Loja pública (fase 1) continua funcionando (regressão — Vitest + `App.test.tsx`)

### Automação

- [x] `src/pages/admin/admin-auth.test.tsx` — formulário, redirect, erro, submit

## Pré-requisitos

- Task 11 concluída
- Infra + backend fase 2 entregues

## Critérios de conclusão

- [x] Checklist completo
- [x] Atualizar **Status** para `concluída` — **fase 2 entregue**
