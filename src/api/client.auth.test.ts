import type { InternalAxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAdminBearerToken, handleAdminUnauthorized } = vi.hoisted(() => ({
  getAdminBearerToken: vi.fn(),
  handleAdminUnauthorized: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getAdminBearerToken,
  handleAdminUnauthorized,
}));

import { apiClient } from "@/api/client";

function captureAdapter() {
  const calls: InternalAxiosRequestConfig[] = [];

  apiClient.defaults.adapter = async (config) => {
    calls.push(config);
    return {
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };

  return calls;
}

describe("apiClient admin Authorization interceptor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds Bearer access token on /admin/* routes", async () => {
    getAdminBearerToken.mockResolvedValue("test-access-token");
    const calls = captureAdapter();

    await apiClient.get("/admin/orders");

    expect(getAdminBearerToken).toHaveBeenCalledOnce();
    expect(calls[0]?.headers.Authorization).toBe("Bearer test-access-token");
  });

  it("adds Bearer token when admin path includes query string", async () => {
    getAdminBearerToken.mockResolvedValue("test-access-token");
    const calls = captureAdapter();

    await apiClient.get("/admin/products?limit=20&cursor=abc");

    expect(getAdminBearerToken).toHaveBeenCalledOnce();
    expect(calls[0]?.headers.Authorization).toBe("Bearer test-access-token");
  });

  it("does not add Authorization on public routes", async () => {
    getAdminBearerToken.mockResolvedValue("test-access-token");
    const calls = captureAdapter();

    await apiClient.get("/products");

    expect(getAdminBearerToken).not.toHaveBeenCalled();
    expect(calls[0]?.headers.Authorization).toBeUndefined();
  });

  it("omits Authorization when no token is available", async () => {
    getAdminBearerToken.mockResolvedValue(null);
    const calls = captureAdapter();

    await apiClient.put("/admin/orders/order-1", { status: "ENVIADO" });

    expect(getAdminBearerToken).toHaveBeenCalledOnce();
    expect(calls[0]?.headers.Authorization).toBeUndefined();
  });
});
