# Frontend — UI/UX

**Status:** Aprovado  
**Última atualização:** 2026-07-02

## Objetivo

Requisitos de interface e experiência do usuário para o Afro90s v1.

## Responsividade

- Abordagem **mobile-first**
- Breakpoints sugeridos (Tailwind-compatible):

| Nome | Largura mínima |
|------|----------------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

- Catálogo: grid **1 coluna** (mobile) → **até 4 colunas** (desktop)
- Carrinho/checkout: **drawer lateral** — formulário em coluna única no mobile; resumo + campos no mesmo painel

## Loja pública — padrões de layout

| Área | Padrão |
|------|--------|
| Catálogo | Grid de cards + **tabs de categoria** no header (Óculos, Acessórios, Maquiagem, Todos) |
| Detalhe | **Modal** com galeria/carrossel de `photos[]` — não página dedicada |
| Carrinho | **Drawer lateral** aberto pelo ícone no header; badge com quantidade |
| Checkout | Formulário **dentro do drawer** (não rota `/checkout`) |

Clique no card → abre modal de detalhe. Rota `/produto/:id` reutiliza o mesmo modal (deep link).

## Admin — painel único com tabs

Rota `/admin` com header simplificado (logo + e-mail + logout) e **duas tabs principais**:

| Tab | UI |
|-----|-----|
| **Pedidos** | Tabs de filtro por status + cards de pedido + **drawer** de detalhe |
| **Produtos** | Grid de cards + botão "Novo produto" + **modal** de formulário |

Tab **Pedidos** é a padrão após login.

## Loading skeletons

Exibir skeletons (não spinners isolados) durante carregamento de dados da API:

| Tela | Skeleton |
|------|----------|
| Catálogo | Cards de produto (imagem + 2 linhas de texto) |
| Modal detalhe | Imagem grande + blocos de texto |
| Drawer checkout | Resumo do carrinho + campos do formulário |
| Admin — produtos | Cards placeholder |
| Admin — pedidos | Cards placeholder |

Usar `isLoading` / `isFetching` do React Query para alternar skeleton ↔ conteúdo.

## Tema anos 90

Guidelines (não design final — editável):

| Token | Valor |
|-------|-------|
| Roxo primário | `#7A004B` |
| Amarelo destaque | `#FFD21F` |
| Fundo escuro | `#0D0009` |

- Tipografia com personalidade (display para títulos; sans legível para corpo)
- Elementos visuais: padrões geométricos, gradientes, bordas estilo retro
- Fotos de produto em destaque; UI não deve competir com o catálogo

## Estados da interface

| Estado | Comportamento |
|--------|---------------|
| Loading | Skeleton |
| Empty | Mensagem amigável + CTA (ex.: "Nenhum produto encontrado") |
| Error | Mensagem clara + botão "Tentar novamente" |
| Success | Feedback visual breve (toast ou banner) |

## Acessibilidade

- Labels em todos os campos de formulário (checkout)
- Foco visível em elementos interativos
- Contraste mínimo **WCAG AA**
- Texto alternativo em imagens de produto (`alt` = nome do produto)
- Navegação por teclado no catálogo, modal e drawer
- Focus trap no modal de galeria e no drawer do carrinho

## Carrinho (v1)

- Estado **Zustand** — sem persistência em servidor
- Indicador de quantidade no header
- Persistência em `localStorage`

## Admin — upload de imagens

No modal de produto, suportar:

1. **URL** — campo de texto para colar link
2. **Arquivo** — input file → enviar como `multipart/form-data` (stream) ou converter para base64 (JSON)
3. Preview das imagens antes de salvar

Ver modos A e B em [api-routes.md](../backend/api-routes.md#post-adminproducts).

## Campos fora do escopo v1

A API expõe apenas `name`, `price`, `quantity`, `category`, `photos`. **Não** incluir na UI persistida:

- descrição longa, badge promocional, rating/reviews, variantes/opções do produto

## Referências

- [Overview](overview.md)
- [Integração](integration.md)
