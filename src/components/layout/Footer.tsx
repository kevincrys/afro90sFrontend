import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { getInstagramUrl } from "@/lib/siteLinks";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";
import { CATEGORIES, type CategoryFilter } from "@/types/category";

const linkClassName =
  "text-muted-foreground hover:text-primary transition-colors text-sm text-left bg-transparent border-0 p-0 cursor-pointer";

const socialLinkStyle = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: "0.58rem",
  letterSpacing: "var(--track-nav)",
} as const;
export interface FooterProps {
  onCategorySelect?: (category: CategoryFilter) => void;
}

export function Footer({ onCategorySelect }: FooterProps) {
  const year = new Date().getFullYear();
  const whatsAppUrl = buildWhatsAppContactUrl();

  return (
    <footer className="bg-card border-t border-border px-6 py-14 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link
            to="/"
            className="inline-block hover:opacity-90 transition-opacity mb-2.5"
            aria-label="Afro90s — ir para o início"
          >
            <BrandLogo size="footer" />
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Moda e acessórios com alma anos 90.
          </p>
          <div
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "0.58rem",
              letterSpacing: "var(--track-label-sm)",
              color: "#7A004B",
            }}
          >
            EST. ANOS 90 — CULTURA & ESTILO
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "0.88rem",
              color: "#FFD21F",
              letterSpacing: "var(--track-ui-lg)",
              marginBottom: "18px",
            }}
          >
            LOJA
          </div>
          <ul className="flex flex-col gap-3">
            {CATEGORIES.map(({ label, value }) => (
              <li key={value}>
                <button
                  type="button"
                  className={linkClassName}
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                  onClick={() => onCategorySelect?.(value)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "0.88rem",
              color: "#FFD21F",
              letterSpacing: "var(--track-ui-lg)",
              marginBottom: "18px",
            }}
          >
            CONTATO
          </div>
          <ul className="flex flex-col gap-3">
            <li>
              {whatsAppUrl ? (
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                  style={{ fontFamily: "'Barlow', sans-serif", display: "inline-block" }}
                >
                  WhatsApp
                </a>
              ) : (
                <span className="text-muted-foreground text-sm">WhatsApp</span>
              )}
            </li>
            <li>
              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
                style={{ fontFamily: "'Barlow', sans-serif", display: "inline-block" }}
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "0.88rem",
              color: "#FFD21F",
              letterSpacing: "var(--track-ui-lg)",
              marginBottom: "18px",
            }}
          >
            SOBRE
          </div>
          <ul className="flex flex-col gap-3">
            <li>
              <span className="text-muted-foreground text-sm cursor-default">Nossa história</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "0.6rem",
            letterSpacing: "var(--track-caption)",
            color: "#9A7085",
          }}
        >
          © {year} AFRO90S. TODOS OS DIREITOS RESERVADOS.
        </div>
        <div className="flex gap-8">
          <a
            href={getInstagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            style={socialLinkStyle}
          >
            INSTAGRAM
          </a>
        </div>
      </div>
    </footer>
  );
}
