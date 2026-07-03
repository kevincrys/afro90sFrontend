# Task 01 — Tema visual anos 90

**Fase:** 0 — Fundação  
**Status:** concluída  
**Arquivos alvo:** [`ui-ux.md`](../ui-ux.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

Garantir design system Afro90s **copiando o tema do protótipo** e extrair Header/Footer de `StorePage.tsx`.

> O protótipo **já implementa** paleta, tipografia e componentes shadcn — **não** recriar `Button`/`Card` do zero se existirem em `components/ui/`.

## Fonte visual — protótipo

| Copiar / extrair de | Para |
|---------------------|------|
| `src/styles/theme.css` | `src/styles/theme.css` (já na task 00) |
| `src/styles/fonts.css` | `src/styles/fonts.css` |
| `StorePage.tsx` L883–929 (nav) | `src/components/layout/Header.tsx` |
| `StorePage.tsx` L1168–1195 (footer) | `src/components/layout/Footer.tsx` |
| `components/ui/button.tsx`, `input.tsx`, `card.tsx`, `badge.tsx`, `skeleton.tsx` | já em `src/components/ui/` |

### Adaptar no Header (extraído do protótipo)

- [x] Logo/texto: **Afro90s** (substituir "DA CROWN")
- [x] Categorias: `Todos`, `Óculos`, `Acessórios`, `Maquiagem` → valores API `oculos`, `acessorios`, `maquiagem`
- [x] Manter ícone carrinho + badge (wire com Zustand na task 07)
- [ ] Busca: transformar ícone decorativo em input funcional (task 05)
- [x] **Remover** links "New Drops", "Sale" se não existirem na API

## Configurações já definidas

| Decisão | Valor |
|---------|-------|
| Cores primárias | `#7A004B` (roxo), `#FFD21F` (amarelo) — **já em `theme.css` do protótipo** |
| Fontes | Anton (display), Courier Prime (mono), Barlow (body) — `fonts.css` |
| Tema | Único (sem dark mode) |
| Grid catálogo | Até 4 colunas no desktop |

## O que implementar

### Tokens (já no protótipo — validar)

- [x] `--primary: #FFD21F`, `--secondary/#accent: #7A004B`, `--background: #0D0009`
- [x] Grid responsivo no catálogo: classes do protótipo `grid-cols-1 … lg:grid-cols-4`

### Componentes base

- [x] Usar `components/ui/` copiados — **não duplicar** se shadcn já atende
- [x] `Badge` para "Esgotado" — reutilizar `badge.tsx` + estilo inline do protótipo

### Layout

- [x] `Header.tsx` — extraído do nav do `StorePage`
- [x] `Footer.tsx` — extraído do footer do `StorePage` (simplificar links)

### Meta

- [x] `index.html`: favicon, `<title>Afro90s</title>`, meta viewport, fonts do protótipo

## Pré-requisitos

- Task 00 concluída

## Critérios de conclusão

- [x] Header/Footer renderizam com visual idêntico ao protótipo (cores e tipografia)
- [x] Grid responsivo: 1 col mobile → 4 cols desktop
- [x] Atualizar **Status** para `concluída`
