import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";

const checkAdminAuth = vi.fn();
const adminSignIn = vi.fn();
const isCognitoConfigured = vi.fn();

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    checkAdminAuth: (...args: unknown[]) => checkAdminAuth(...args),
    adminSignIn: (...args: unknown[]) => adminSignIn(...args),
    adminConfirmNewPassword: vi.fn(),
  };
});

vi.mock("@/lib/amplify", () => ({
  isCognitoConfigured: () => isCognitoConfigured(),
}));

describe("admin auth (fase 2)", () => {
  beforeEach(() => {
    checkAdminAuth.mockReset();
    adminSignIn.mockReset();
    isCognitoConfigured.mockReturnValue(true);
  });

  it("renders login form at /admin/login", async () => {
    checkAdminAuth.mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("admin@afro90s.com")).toBeInTheDocument();
  });

  it("redirects /admin to login when unauthenticated", async () => {
    checkAdminAuth.mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin/login" element={<span data-testid="login-page">Login</span>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <span data-testid="panel">Painel admin</span>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("panel")).not.toBeInTheDocument();
  });

  it("shows error on invalid credentials", async () => {
    checkAdminAuth.mockResolvedValue(false);
    adminSignIn.mockRejectedValue(
      Object.assign(new Error("bad credentials"), { name: "NotAuthorizedException" }),
    );

    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: "Entrar" });

    fireEvent.change(screen.getByPlaceholderText("admin@afro90s.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("E-mail ou senha incorretos.");
    });
  });

  it("calls adminSignIn with credentials on submit", async () => {
    checkAdminAuth.mockResolvedValue(false);
    adminSignIn.mockResolvedValue({ step: "done" });

    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: "Entrar" });

    fireEvent.change(screen.getByPlaceholderText("admin@afro90s.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(adminSignIn).toHaveBeenCalledWith("admin@test.com", "secret");
    });
  });
});
