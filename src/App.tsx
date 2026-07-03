import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 px-6">
      <h1
        className="text-5xl tracking-wide"
        style={{ fontFamily: "'Anton', sans-serif", color: "#FFD21F" }}
      >
        AFRO<span style={{ color: "#7A004B" }}>90s</span>
      </h1>
      <p
        className="text-muted-foreground text-center max-w-md"
        style={{ fontFamily: "'Courier Prime', monospace", letterSpacing: "0.12em", fontSize: "0.75rem" }}
      >
        Setup concluído — tema anos 90 portado do protótipo Canvas
      </p>
      <Button>Explorar catálogo</Button>
    </div>
  );
}
