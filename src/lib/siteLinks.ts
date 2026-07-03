/** Perfil oficial — override opcional via VITE_INSTAGRAM_URL */
export const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/afroo90s/";

export function getInstagramUrl(): string {
  const fromEnv = import.meta.env.VITE_INSTAGRAM_URL?.trim();
  return fromEnv || DEFAULT_INSTAGRAM_URL;
}
