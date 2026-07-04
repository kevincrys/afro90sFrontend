import { describe, expect, it } from "vitest";
import type { PhotoFormItem } from "@/lib/adminProductSubmit";
import {
  adminProductFormSchema,
  validateAdminProductSubmission,
  validateProductOptionDraft,
  validateProductPhotoFile,
  validateProductPhotoUrl,
} from "@/lib/adminProductSchema";

const validBase = {
  name: "Óculos Vintage",
  description: "",
  price: 89.9,
  quantity: 12,
  category: "oculos" as const,
  options: [] as string[],
};

describe("adminProductFormSchema", () => {
  it("accepts valid product fields", () => {
    const result = adminProductFormSchema.safeParse(validBase);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(89.9);
      expect(result.data.description).toBe("");
    }
  });

  it("rejects short name", () => {
    const result = adminProductFormSchema.safeParse({ ...validBase, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects name above 120 characters", () => {
    const result = adminProductFormSchema.safeParse({ ...validBase, name: "A".repeat(121) });
    expect(result.success).toBe(false);
  });

  it("rejects description above 2000 characters", () => {
    const result = adminProductFormSchema.safeParse({
      ...validBase,
      description: "A".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive price", () => {
    const result = adminProductFormSchema.safeParse({ ...validBase, price: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects price not multiple of 0.01", () => {
    const result = adminProductFormSchema.safeParse({ ...validBase, price: 10.005 });
    expect(result.success).toBe(false);
  });

  it("rejects quantity above 99999", () => {
    const result = adminProductFormSchema.safeParse({ ...validBase, quantity: 100_000 });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate options case-insensitively", () => {
    const result = adminProductFormSchema.safeParse({
      ...validBase,
      options: ["Preto", "preto"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 5 options", () => {
    const result = adminProductFormSchema.safeParse({
      ...validBase,
      options: ["1", "2", "3", "4", "5", "6"],
    });
    expect(result.success).toBe(false);
  });
});

describe("validateProductOptionDraft", () => {
  it("rejects duplicate option", () => {
    expect(validateProductOptionDraft("Azul", ["azul"])).toMatch(/já adicionada/);
  });
});

describe("validateProductPhotoUrl", () => {
  it("accepts https URLs", () => {
    expect(validateProductPhotoUrl("https://cdn.example.com/a.jpg")).toBeNull();
  });

  it("rejects invalid URLs", () => {
    expect(validateProductPhotoUrl("not-a-url")).toBeTruthy();
  });
});

describe("validateProductPhotoFile", () => {
  it("rejects unsupported mime types", () => {
    const file = new File(["x"], "doc.pdf", { type: "application/pdf" });
    expect(validateProductPhotoFile(file, [])).toMatch(/Formato inválido/);
  });
});

describe("validateAdminProductSubmission", () => {
  it("returns photos error for invalid URL in list", () => {
    const photos: PhotoFormItem[] = [{ kind: "url", url: "ftp://invalid" }];
    const result = validateAdminProductSubmission(validBase, photos);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.photosError).toMatch(/URL inválida/);
    }
  });
});
