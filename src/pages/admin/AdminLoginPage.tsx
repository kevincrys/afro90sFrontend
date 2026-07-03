import type { FormEvent } from "react";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminAuthenticated, setAdminSession } from "@/components/layout/ProtectedRoute";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cognitoConfigured = Boolean(
    import.meta.env.VITE_COGNITO_USER_POOL_ID && import.meta.env.VITE_COGNITO_CLIENT_ID,
  );

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    // Placeholder até task 11 (Amplify SRP)
    window.setTimeout(() => {
      setLoading(false);
      setAdminSession(email);
      navigate(from, { replace: true });
    }, 600);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0D0009", fontFamily: "'Barlow', sans-serif" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "2rem",
              color: "#FFD21F",
              letterSpacing: "0.05em",
            }}
          >
            AFRO<span style={{ color: "#7A004B" }}>90s</span>
          </div>
          <div
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              color: "#9A7085",
              marginTop: "6px",
            }}
          >
            PAINEL ADMINISTRATIVO
          </div>
        </div>

        {!cognitoConfigured && (
          <div
            className="flex gap-3 p-4 mb-6 border"
            style={{ borderColor: "#FFD21F44", background: "#2A1E00" }}
          >
            <AlertCircle size={16} style={{ color: "#FFD21F", flexShrink: 0, marginTop: "1px" }} />
            <div
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                color: "#FFD21F",
                lineHeight: 1.6,
              }}
            >
              Cognito não configurado. Login placeholder até a task 11.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
