import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import CatalogPage from "@/pages/catalog/CatalogPage";
import NotFoundPage from "@/pages/NotFoundPage";

function renderWithProviders(router: ReturnType<typeof createMemoryRouter>) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("routing", () => {
  it("renders catalog with Afro90s header", () => {
    const router = createMemoryRouter(
      [
        {
          element: <PublicLayout />,
          children: [{ index: true, element: <CatalogPage /> }],
        },
      ],
      { initialEntries: ["/"] },
    );

    renderWithProviders(router);
    expect(screen.getByRole("navigation").querySelector('img[alt="Afro90s"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Óculos" }).length).toBeGreaterThanOrEqual(1);
  });

  it("renders catalog at product deep link /products/:id", () => {
    const productId = "550e8400-e29b-41d4-a716-446655440000";
    const router = createMemoryRouter(
      [
        {
          element: <PublicLayout />,
          children: [{ path: "products/:id", element: <CatalogPage /> }],
        },
      ],
      { initialEntries: [`/products/${productId}`] },
    );

    renderWithProviders(router);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("renders 404 page", () => {
    const router = createMemoryRouter([{ path: "*", element: <NotFoundPage /> }], {
      initialEntries: ["/rota-inexistente"],
    });

    renderWithProviders(router);
    expect(screen.getByRole("link", { name: "Voltar ao catálogo" })).toBeInTheDocument();
  });
});
