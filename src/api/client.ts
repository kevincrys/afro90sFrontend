import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getClientErrorMessage } from "@/lib/errorMessages";
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

function parseErrorBody(data: unknown): ApiErrorBody | undefined {
  if (data === null || data === undefined) return undefined;

  if (typeof data === "object" && "code" in data && "message" in data) {
    const body = data as Record<string, unknown>;
    if (typeof body.code === "string" && typeof body.message === "string") {
      return {
        code: body.code,
        message: body.message,
        details:
          body.details && typeof body.details === "object"
            ? (body.details as Record<string, unknown>)
            : undefined,
      };
    }
  }

  if (typeof data === "string" && data.trim()) {
    try {
      return parseErrorBody(JSON.parse(data) as unknown);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

const STATUS_DEFAULT_CODES: Partial<Record<number, string>> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  413: "PAYLOAD_TOO_LARGE",
  422: "VALIDATION_ERROR",
  429: "TOO_MANY_REQUESTS",
  500: "INTERNAL_ERROR",
  503: "SERVICE_UNAVAILABLE",
};

export function toApiError(error: AxiosError): ApiError {
  if (!error.response) {
    return new ApiError(0, {
      code: "NETWORK_ERROR",
      message: getClientErrorMessage("NETWORK_ERROR"),
    });
  }

  const status = error.response.status;
  const data = parseErrorBody(error.response.data);
  const code = data?.code ?? STATUS_DEFAULT_CODES[status] ?? "UNKNOWN_ERROR";

  return new ApiError(status, {
    code,
    message: getClientErrorMessage(code),
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
