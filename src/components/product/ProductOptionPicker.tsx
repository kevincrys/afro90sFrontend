import { useId } from "react";

interface ProductOptionPickerProps {
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
  groupLabel?: string;
}

/** Seletor horizontal de opção — estilo protótipo StorePage L471–514; API usa `options: string[]`. */
export function ProductOptionPicker({
  options,
  value,
  onChange,
  groupLabel = "Opção",
}: ProductOptionPickerProps) {
  const labelId = useId();

  if (options.length === 0) return null;

  return (
    <div role="radiogroup" aria-labelledby={labelId}>
      <div
        id={labelId}
        className="mb-3"
        style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: "0.6rem",
          letterSpacing: "var(--track-label)",
          color: "#9A7085",
        }}
      >
        {groupLabel.toUpperCase()}
        {value && (
          <span style={{ color: "#FFD21F", marginLeft: "8px" }}>— {value}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option)}
              className="px-3 py-1.5 transition-all"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.78rem",
                border: isSelected
                  ? "2px solid #FFD21F"
                  : "1px solid rgba(255,210,31,0.2)",
                color: isSelected ? "#FFD21F" : "#9A7085",
                background: isSelected ? "rgba(255,210,31,0.08)" : "transparent",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
