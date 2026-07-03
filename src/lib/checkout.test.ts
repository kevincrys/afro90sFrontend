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
});
