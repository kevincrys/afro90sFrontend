import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAdminAuth } from "@/lib/auth";
import { isCognitoConfigured } from "@/lib/amplify";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!isCognitoConfigured()) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }

      const ok = await checkAdminAuth();
      if (!cancelled) {
        setStatus(ok ? "authenticated" : "unauthenticated");
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0D0009", fontFamily: "'Courier Prime', monospace" }}
      >
        <p className="text-muted-foreground text-sm tracking-widest">CARREGANDO…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
