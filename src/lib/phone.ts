/** Remove não-dígitos; limita a 11 (DDD + celular BR). */
export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Exibe (00) 0000-0000 ou (00) 00000-0000; valor armazenado só numérico. */
export function formatPhoneDisplay(digits: string): string {
  const normalized = sanitizePhone(digits);
  if (normalized.length === 0) return "";
  if (normalized.length <= 2) return `(${normalized}`;
  if (normalized.length <= 6) {
    return `(${normalized.slice(0, 2)}) ${normalized.slice(2)}`;
  }
  if (normalized.length <= 10) {
    return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 6)}-${normalized.slice(6)}`;
  }
  return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 7)}-${normalized.slice(7)}`;
}
