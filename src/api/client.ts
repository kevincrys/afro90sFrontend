import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ApiError, type ApiErrorBody } from "@/types/errors";

const ADMIN_TOKEN_KEY = "admin_access_token";

export function getAdminAccessToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminAccessToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminAccessToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 500;
  const data = error.response?.data as ApiErrorBody | undefined;

  return new ApiError(status, {
    code: data?.code ?? "UNKNOWN_ERROR",
    message: data?.message ?? error.message,
    details: data?.details,
  });
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isAdminRoute = config.url?.startsWith("/admin");
  if (isAdminRoute) {
    const token = getAdminAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      throw toApiError(error);
    }
    throw error;
  },
);

export function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}
