# Task 15 — Aceite Fase 3 (Painel admin)

**Fase:** 3 — Painel admin  
**Status:** concluída

## Objetivo

Validar painel admin completo em `/admin`: CRUD produtos + gestão de pedidos.

## Checklist de aceite

### Produtos (tab Produtos)

- [x] Criar produto com imagem → aparece no catálogo público
- [x] Editar nome/preço/estoque
- [x] Excluir produto → some do catálogo
- [x] Upload multipart funciona
- [x] Buscar por ID ou nome do produto (`q`, task 22)

### Pedidos (tab Pedidos)

- [x] Pedido do checkout aparece na tab Pedidos de `/admin`
- [x] Filtrar por status (tabs)
- [x] Alterar status com transição válida
- [x] Drawer exibe customer e itens
- [x] Paginação por cursor funciona
- [x] Buscar por ID de pedido (completo ou prefixo)
- [x] Buscar por prefixo do nome do cliente
- [x] Limpar busca restaura listagem padrão
- [x] Busca combina com filtro de status (tabs)

### Regressão

- [x] Login/logout funciona
- [x] Loja pública (catálogo, modal, carrinho drawer) continua OK

## Pré-requisitos

- Tasks 13, 14, 20 (backend), 22 concluídas
- Backend + infra fase 3 entregues

## Critérios de conclusão

- [x] Checklist completo
- [x] **Status** concluída — **fase 3 entregue**
