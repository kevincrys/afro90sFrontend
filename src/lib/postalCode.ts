/** Remove tudo que não for dígito; limita a 8 caracteres (CEP BR). */
export function sanitizePostalCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

/** Exibe CEP como 00000-000 enquanto o valor armazenado permanece só numérico. */
export function formatPostalCodeDisplay(digits: string): string {
  const normalized = sanitizePostalCode(digits);
  if (normalized.length <= 5) return normalized;
  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}
