import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isCognitoConfigured } from "@/lib/amplify";
import {
  adminSignIn,
  checkAdminAuth,
  getCognitoErrorMessage,
} from "@/lib/auth";

function AdminLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.2em",
        color: "#7A004B",
        marginBottom: "5px",
      }}
    >
      {children}
    </div>
  );
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [alreadyAuthenticated, setAlreadyAuthenticated] = useState(false);

  const cognitoConfigured = isCognitoConfigured();

  useEffect(() => {
    let cancelled = false;

    async function verifyExistingSession() {
      if (!cognitoConfigured) {
        if (!cancelled) setAuthChecked(true);
        return;
      }

      const ok = await checkAdminAuth();
      if (!cancelled) {
        setAlreadyAuthenticated(ok);
        setAuthChecked(true);
      }
    }

    void verifyExistingSession();

    return () => {
      cancelled = true;
    };
  }, [cognitoConfigured]);

  if (!authChecked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0D0009", fontFamily: "'Barlow', sans-serif" }}
      >
        <p
          className="text-muted-foreground text-sm"
          style={{ fontFamily: "'Courier Prime', monospace", letterSpacing: "0.15em" }}
        >
          CARREGANDO…
        </p>
      </div>
    );
  }

  if (alreadyAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!cognitoConfigured) {
      const message = "Cognito não configurado. Defina as variáveis VITE_COGNITO_* no ambiente.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminSignIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = getCognitoErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
              Cognito não configurado. Defina <strong>VITE_COGNITO_USER_POOL_ID</strong> e{" "}
              <strong>VITE_COGNITO_CLIENT_ID</strong> nas variáveis de ambiente.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <AdminLabel>E-MAIL</AdminLabel>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@afro90s.com"
              className="w-full px-4 py-3 bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
          <div>
            <AdminLabel>SENHA</AdminLabel>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          {error && (
            <div
              className="flex gap-2 items-start"
              role="alert"
              style={{
                color: "#F87171",
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
              }}
            >
              <AlertCircle size={13} style={{ flexShrink: 0, marginTop: "1px" }} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !cognitoConfigured}
            className="w-full py-4 bg-primary text-primary-foreground uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
            }}
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            to="/"
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "#9A7085",
            }}
            className="hover:text-primary transition-colors"
          >
            ← VOLTAR À LOJA
          </Link>
        </div>
      </div>
    </div>
  );
}
