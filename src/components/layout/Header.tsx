import { useCallback, useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { CATEGORIES, type CategoryFilter } from "@/types/category";

const SEARCH_DEBOUNCE_MS = 350;

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("name") ?? "");

  useEffect(() => {
    setSearchQuery(searchParams.get("name") ?? "");
  }, [searchParams]);

  function selectCategory(category: CategoryFilter) {
    onCategoryChange?.(category);
    setMenuOpen(false);
  }

  const applySearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      const current = (searchParams.get("name") ?? "").trim();
      if (trimmed === current) return;

      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set("name", trimmed);
      else next.delete("name");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const submitSearch = useCallback(() => {
    applySearch(searchQuery);
    setSearchOpen(false);
    setMenuOpen(false);
  }, [applySearch, searchQuery]);

  useEffect(() => {
    const current = searchParams.get("name") ?? "";
    if (searchQuery.trim() === current.trim()) return;

    const timer = window.setTimeout(() => applySearch(searchQuery), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [applySearch, searchQuery, searchParams]);

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch();
    }
    if (event.key === "Escape") {
      setSearchOpen(false);
      setMenuOpen(false);
      setSearchQuery(searchParams.get("name") ?? "");
    }
  }

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    submitSearch();
  }

  function clearSearch() {
    setSearchQuery("");
    applySearch("");
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link
          to="/"
          className="select-none hover:opacity-90 transition-opacity"
          aria-label="Afro90s — ir para o início"
        >
          <BrandLogo size="header" />
        </Link>

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
                letterSpacing: "var(--track-nav)",
                color: activeCategory === value ? "#FFD21F" : "rgba(255,248,231,0.55)",
                textTransform: "uppercase",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2"
                role="search"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  enterKeyHint="search"
                  onBlur={() => {
                    if (!searchQuery.trim() && !searchParams.get("name")) setSearchOpen(false);
                  }}
                  placeholder="Buscar produtos…"
                  autoFocus
                  className="w-44 bg-transparent border-b border-primary/50 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  style={{
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "var(--track-ui)",
                  }}
                  aria-label="Buscar produtos"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Limpar busca"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
            ) : (
              <button
                type="button"
                className="text-foreground/50 hover:text-primary transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar produtos"
              >
                <Search size={17} />
              </button>
            )}
          </div>
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
          <form
            onSubmit={handleSearchSubmit}
            className="flex gap-2 items-center"
            role="search"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              enterKeyHint="search"
              placeholder="Buscar produtos…"
              className="flex-1 bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "0.65rem",
                letterSpacing: "var(--track-ui)",
              }}
              aria-label="Buscar produtos"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpar busca"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="border border-primary px-3 text-primary"
              aria-label="Buscar"
            >
              <Search size={16} />
            </button>
          </form>
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className="text-left hover:text-primary transition-colors"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "1.1rem",
                letterSpacing: "var(--track-heading)",
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
