const SHOP_LINKS = ["Todos", "Óculos", "Acessórios", "Maquiagem"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border px-6 py-14 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "1.7rem",
              color: "#FFD21F",
              letterSpacing: "var(--track-logo)",
              marginBottom: "10px",
              lineHeight: 1,
            }}
          >
            AFRO<span style={{ color: "#7A004B" }}>90s</span>
          </div>
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
            {SHOP_LINKS.map((link) => (
              <li key={link}>
                <span className="text-muted-foreground text-sm">{link}</span>
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
              <span className="text-muted-foreground text-sm">WhatsApp</span>
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
              <span className="text-muted-foreground text-sm">Nossa história</span>
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
          {["INSTAGRAM", "TIKTOK"].map((social) => (
            <span
              key={social}
              className="text-muted-foreground"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.58rem",
                letterSpacing: "var(--track-nav)",
              }}
            >
              {social}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
