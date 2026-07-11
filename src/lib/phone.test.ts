import { describe, expect, it } from "vitest";
import { formatPhoneDisplay, sanitizePhone } from "@/lib/phone";

describe("sanitizePhone", () => {
  it("strips non-digits and caps at 11", () => {
    expect(sanitizePhone("(11) 99999-9999")).toBe("11999999999");
    expect(sanitizePhone("11999")).toBe("11999");
    expect(sanitizePhone("11 99999 99999 extra")).toBe("11999999999");
  });
});

describe("formatPhoneDisplay", () => {
  it("formats mobile and landline patterns", () => {
    expect(formatPhoneDisplay("11999999999")).toBe("(11) 99999-9999");
    expect(formatPhoneDisplay("1133334444")).toBe("(11) 3333-4444");
    expect(formatPhoneDisplay("11")).toBe("(11");
  });
});
