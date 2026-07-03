import { createBrowserRouter, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminPage from "@/pages/admin/AdminPage";
import CatalogPage from "@/pages/catalog/CatalogPage";
import NotFoundPage from "@/pages/NotFoundPage";

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <CatalogPage /> },
          { path: "products/:id", element: <CatalogPage /> },
        ],
      },
      { path: "admin/login", element: <AdminLoginPage /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
