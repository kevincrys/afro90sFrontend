import { LogOut, Package, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminProductsTab from "@/components/admin/AdminProductsTab";
import { adminSignOut, getAdminEmail } from "@/lib/auth";

type AdminTab = "orders" | "products";

const TABS: { key: AdminTab; label: string; icon: typeof ShoppingCart; query?: string }[] = [
  { key: "orders", label: "PEDIDOS", icon: ShoppingCart },
  { key: "products", label: "PRODUTOS", icon: Package, query: "produtos" },
];

function tabFromSearchParam(value: string | null): AdminTab {
  return value === "produtos" ? "products" : "orders";
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = tabFromSearchParam(searchParams.get("tab"));
  const userEmail = getAdminEmail() ?? "admin@afro90s.com";

  function setTab(next: AdminTab) {
    if (next === "products") {
      setSearchParams({ tab: "produtos" });
    } else {
      setSearchParams({});
    }
  }

  async function handleLogout() {
    await adminSignOut();
    navigate("/", { replace: true });
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "1.3rem",
                color: "#FFD21F",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              AFRO<span style={{ color: "#7A004B" }}>90s</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <div
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "#9A7085",
              }}
            >
              PAINEL ADMIN
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "#9A7085",
              }}
            >
              {userEmail}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 border border-border px-4 py-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
              }}
            >
              <LogOut size={13} /> SAIR
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 flex">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-6 py-4 transition-colors"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "0.9rem",
                letterSpacing: "0.07em",
                color: tab === key ? "#FFD21F" : "#9A7085",
                borderBottom: tab === key ? "3px solid #FFD21F" : "3px solid transparent",
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {tab === "orders" ? (
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
            }}
          >
            Lista de pedidos — task 14
          </p>
        ) : (
          <AdminProductsTab />
        )}
      </main>
    </div>
  );
}
