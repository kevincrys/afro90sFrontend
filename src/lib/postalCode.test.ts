import { describe, expect, it } from "vitest";
import { formatPostalCodeDisplay, sanitizePostalCode } from "@/lib/postalCode";

describe("postalCode", () => {
  it("strips non-digits and limits to 8 characters", () => {
    expect(sanitizePostalCode("01310-100")).toBe("01310100");
    expect(sanitizePostalCode("01310100123")).toBe("01310100");
  });

  it("formats display as 00000-000", () => {
    expect(formatPostalCodeDisplay("01310100")).toBe("01310-100");
    expect(formatPostalCodeDisplay("01310")).toBe("01310");
  });
});
