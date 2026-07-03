# Task 08 — Fluxo WhatsApp pós-pedido

**Fase:** 1 — Site público  
**Status:** pendente  
**Arquivos alvo:** [`integration.md`](../integration.md), [`prototype-porting.md`](../prototype-porting.md)

## Objetivo

Integrar abertura do WhatsApp após pedido — **feature ausente no protótipo** (só confirmação local).

## Fonte visual — protótipo

O protótipo termina em `setDone(true)` no `CheckoutPanel` (L598) com tela "ORDER PLACED" — **sem WhatsApp**.

### O que reutilizar do protótipo

- [ ] Manter tela de confirmação do drawer (L645–668) como passo **antes** de abrir WhatsApp
- [ ] Adaptar copy para pt-BR e Afro90s

## O que implementar

### `src/lib/whatsapp.ts`

```typescript
export function openWhatsAppOrder(order: { id: string; fullPrice: number; customer: { name: string; tel: string } }): void {
  // Ver integration.md
}
```

- [ ] Validar `VITE_WHATSAPP_NUMBER` no boot
- [ ] Chamar após `201` em `CartDrawer` (substituir fim do fluxo mock)
- [ ] Fallback se popup bloqueado

## Pré-requisitos

- Task 07 concluída

## Critérios de conclusão

- [ ] Confirmação visual (estilo protótipo) + WhatsApp abre com `orderId`
- [ ] Atualizar **Status** para `concluída`
