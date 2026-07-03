import axios, { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { ApiError } from "@/types/errors";

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 500;
  const data = error.response?.data as { code?: string; message?: string } | undefined;

  return new ApiError(status, {
    code: data?.code ?? "UNKNOWN_ERROR",
    message: data?.message ?? error.message,
  });
}

describe("ApiError", () => {
  it("maps 404 response to NOT_FOUND", () => {
    const axiosError = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 404,
        statusText: "Not Found",
        data: { code: "NOT_FOUND", message: "Produto não existe" },
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      },
    );

    const apiError = toApiError(axiosError);

    expect(apiError).toBeInstanceOf(ApiError);
    expect(apiError.status).toBe(404);
    expect(apiError.code).toBe("NOT_FOUND");
    expect(apiError.message).toBe("Produto não existe");
  });
});

describe("buildQueryString", () => {
  it("encodes cursor in query string", async () => {
    const { buildQueryString } = await import("@/api/client");
    const query = buildQueryString({ cursor: "eyJpZCI6InRlc3QifQ==", limit: 20 });
    expect(query).toContain("cursor=");
    expect(query).toContain("limit=20");
  });
});
