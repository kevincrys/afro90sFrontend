import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 text-center gap-6"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      <p
        style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          color: "#7A004B",
        }}
      >
        ★ ERRO 404 ★
      </p>
      <h1
        className="uppercase leading-none"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(4rem, 12vw, 8rem)",
          color: "#FFD21F",
          letterSpacing: "0.02em",
        }}
      >
        PÁGINA
        <br />
        <span style={{ color: "#7A004B" }}>NÃO ENCONTRADA</span>
      </h1>
      <p className="text-muted-foreground max-w-md">
        Essa rota não existe no Afro90s. Volte ao catálogo e continue explorando.
      </p>
      <Button asChild>
        <Link to="/">Voltar ao catálogo</Link>
      </Button>
    </div>
  );
}
