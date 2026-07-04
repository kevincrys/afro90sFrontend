export function AdminLabel({ children }: { children: React.ReactNode }) {
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

export const ADMIN_FONT = {
  display: "'Anton', sans-serif",
  mono: "'Courier Prime', monospace",
  body: "'Barlow', sans-serif",
} as const;
