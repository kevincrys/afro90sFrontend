import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats BRL currency", () => {
    expect(formatPrice(49.9)).toMatch(/R\$\s*49,90/);
    expect(formatPrice(1200)).toMatch(/R\$\s*1\.200,00/);
  });
});
