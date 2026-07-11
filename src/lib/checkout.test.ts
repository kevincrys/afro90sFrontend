import { describe, expect, it } from "vitest";
import { checkoutFormSchema } from "@/lib/checkout";

describe("checkoutFormSchema", () => {
  it("accepts valid customer data", () => {
    const result = checkoutFormSchema.safeParse({
      name: "Maria Silva",
      address: "Rua Exemplo, 123",
      postalCode: "01310-100",
      tel: "11999999999",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.postalCode).toBe("01310100");
    }
  });

  it("rejects CEP with fewer than 8 digits", () => {
    const result = checkoutFormSchema.safeParse({
      name: "Maria Silva",
      address: "Rua Exemplo, 123",
      postalCode: "01310",
      tel: "11999999999",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = checkoutFormSchema.safeParse({
      name: "A",
      address: "Rua Exemplo, 123",
      postalCode: "01310-100",
      tel: "11999999999",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name with digits", () => {
    const result = checkoutFormSchema.safeParse({
      name: "Maria123",
      address: "Rua Exemplo, 123",
      postalCode: "01310-100",
      tel: "11999999999",
    });
    expect(result.success).toBe(false);
  });

  it("accepts name with accents and apostrophe", () => {
    const result = checkoutFormSchema.safeParse({
      name: "José D'Avila",
      address: "Rua Exemplo, 123",
      postalCode: "01310-100",
      tel: "11999999999",
    });
    expect(result.success).toBe(true);
  });

  it("rejects phone with fewer than 10 digits", () => {
    const result = checkoutFormSchema.safeParse({
      name: "Maria Silva",
      address: "Rua Exemplo, 123",
      postalCode: "01310-100",
      tel: "11999",
    });
    expect(result.success).toBe(false);
  });

  it("accepts formatted phone and stores digits only", () => {
    const result = checkoutFormSchema.safeParse({
      name: "Maria Silva",
      address: "Rua Exemplo, 123",
      postalCode: "01310-100",
      tel: "(11) 99999-9999",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tel).toBe("11999999999");
    }
  });

  it("accepts 10-digit landline with DDD", () => {
    const result = checkoutFormSchema.safeParse({
      name: "Maria Silva",
      address: "Rua Exemplo, 123",
      postalCode: "01310-100",
      tel: "1133334444",
    });
    expect(result.success).toBe(true);
  });
});
