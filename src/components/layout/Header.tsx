import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { CATEGORIES, type CategoryFilter } from "@/types/category";

export interface HeaderProps {
  activeCategory?: CategoryFilter;
  onCategoryChange?: (category: CategoryFilter) => void;
  cartCount?: number;
  onCartClick?: () => void;
}

export function Header({
  activeCategory = "todos",
  onCategoryChange,
  cartCount = 0,
  onCartClick,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function selectCategory(category: CategoryFilter) {
    onCategoryChange?.(category);
    setMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div
          className="select-none"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "1.55rem",
            letterSpacing: "0.04em",
            color: "#FFD21F",
            lineHeight: 1,
          }}
        >
          AFRO<span style={{ color: "#7A004B" }}>90s</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => selectCategory(value)}
              className="transition-colors hover:text-primary"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.16em",
                color: activeCategory === value ? "#FFD21F" : "rgba(255,248,231,0.55)",
                textTransform: "uppercase",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden md:block text-foreground/50 hover:text-primary transition-colors"
            aria-label="Buscar produtos"
          >
            <Search size={17} />
          </button>
          <button
            type="button"
            className="relative text-foreground/60 hover:text-primary transition-colors"
            onClick={onCartClick}
            aria-label={cartCount > 0 ? `Carrinho com ${cartCount} itens` : "Carrinho"}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center rounded-full"
                style={{
                  background: "#FFD21F",
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: "#0D0009",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-5 flex flex-col gap-5">
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className="text-left hover:text-primary transition-colors"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "1.1rem",
                letterSpacing: "0.06em",
                color: activeCategory === value ? "#FFD21F" : "#FFF8E7",
              }}
              onClick={() => selectCategory(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
