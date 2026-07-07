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
});
