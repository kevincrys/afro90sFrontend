/**
 * Mensagens exibidas ao usuário — nunca repassar `message` do JSON da API.
 * Códigos alinhados a docs/specs/backend/api-routes.md
 */
const API_ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "Verifique os dados informados.",
  NOT_FOUND: "Item não encontrado.",
  UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  INSUFFICIENT_STOCK: "Quantidade indisponível no estoque.",
  INVALID_QUERY: "Filtros de busca inválidos.",
  INVALID_CURSOR: "Não foi possível carregar mais itens. Atualize a página.",
  INVALID_IMAGE: "Imagem inválida. Use JPEG, PNG ou WebP.",
  PAYLOAD_TOO_LARGE: "Arquivo muito grande. Máximo 5 MB por imagem e 10 MB no total.",
  INVALID_STATUS_TRANSITION: "Não foi possível atualizar o status do pedido.",
  INVALID_OPTION: "Selecione uma opção válida para o produto.",
  PRODUCT_NOT_FOUND: "Um dos produtos do pedido não está mais disponível.",
  INTERNAL_ERROR: "Erro interno. Tente novamente em instantes.",

  NETWORK_ERROR: "Não foi possível conectar. Tente novamente em instantes.",
  BAD_REQUEST: "Não foi possível processar a solicitação.",
  CONFLICT: "Não foi possível concluir a operação.",
  TOO_MANY_REQUESTS: "Muitas tentativas. Aguarde um momento.",
  SERVICE_UNAVAILABLE: "Serviço indisponível. Tente novamente em instantes.",
  UNKNOWN_ERROR: "Ocorreu um erro inesperado. Tente novamente.",
};

export function getClientErrorMessage(code: string): string {
  return API_ERROR_MESSAGES[code] ?? API_ERROR_MESSAGES.UNKNOWN_ERROR;
}
