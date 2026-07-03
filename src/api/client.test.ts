import axios, { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { ApiError } from "@/types/errors";
import { buildQueryString, toApiError } from "@/api/client";

function axiosErrorWithResponse(
  status: number,
  data?: unknown,
  message = "Request failed",
): AxiosError {
  return new AxiosError(message, "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "Error",
    data,
    headers: {},
    config: { headers: new axios.AxiosHeaders() },
  });
}

describe("toApiError", () => {
  it("maps JSON 404 response to client message, not backend text", () => {
    const apiError = toApiError(
      axiosErrorWithResponse(404, {
        code: "NOT_FOUND",
        message: "Produto não existe",
      }),
    );

    expect(apiError).toBeInstanceOf(ApiError);
    expect(apiError.status).toBe(404);
    expect(apiError.code).toBe("NOT_FOUND");
    expect(apiError.message).toBe("Item não encontrado.");
    expect(apiError.message).not.toBe("Produto não existe");
  });

  it("maps 404 without JSON body to NOT_FOUND with client message", () => {
    const apiError = toApiError(axiosErrorWithResponse(404, { message: "Not Found" }));

    expect(apiError.code).toBe("NOT_FOUND");
    expect(apiError.message).toBe("Item não encontrado.");
  });

  it("maps network failures without response to NETWORK_ERROR", () => {
    const apiError = toApiError(
      new AxiosError("Network Error", "ERR_NETWORK", undefined, undefined, undefined),
    );

    expect(apiError.status).toBe(0);
    expect(apiError.code).toBe("NETWORK_ERROR");
    expect(apiError.message).not.toContain("VITE_");
  });
});

describe("buildQueryString", () => {
  it("encodes cursor in query string", () => {
    const query = buildQueryString({ cursor: "eyJpZCI6InRlc3QifQ==", limit: 20 });
    expect(query).toContain("cursor=");
    expect(query).toContain("limit=20");
  });
});
