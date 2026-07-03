import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import CatalogPage from "@/pages/catalog/CatalogPage";
import NotFoundPage from "@/pages/NotFoundPage";

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

    render(<RouterProvider router={router} />);
    expect(screen.getByRole("navigation")).toHaveTextContent("AFRO90s");
    expect(screen.getByRole("button", { name: "Óculos" })).toBeInTheDocument();
  });

  it("renders product deep link at /products/:id", () => {
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

    render(<RouterProvider router={router} />);
    expect(screen.getByText(new RegExp(`/products/${productId}`))).toBeInTheDocument();
  });

  it("renders 404 page", () => {
    const router = createMemoryRouter([{ path: "*", element: <NotFoundPage /> }], {
      initialEntries: ["/rota-inexistente"],
    });

    render(<RouterProvider router={router} />);
    expect(screen.getByRole("link", { name: "Voltar ao catálogo" })).toBeInTheDocument();
  });
});
