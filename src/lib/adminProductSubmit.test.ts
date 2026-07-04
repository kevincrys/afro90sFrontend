import { describe, expect, it } from "vitest";
import { buildProductSubmitPayload } from "@/lib/adminProductSubmit";

describe("buildProductSubmitPayload", () => {
  const values = {
    name: "Óculos Teste",
    description: "",
    price: 99.9,
    quantity: 5,
    category: "oculos" as const,
    options: [] as string[],
  };

  it("uses JSON when photos are URLs only", () => {
    const result = buildProductSubmitPayload(values, [
      { kind: "url", url: "https://cdn.example.com/a.jpg" },
    ]);

    expect(result.mode).toBe("json");
    if (result.mode === "json") {
      expect(result.body.photos).toEqual([{ type: "url", value: "https://cdn.example.com/a.jpg" }]);
    }
  });

  it("uses multipart when photos include files", () => {
    const file = new File(["x"], "foto.jpg", { type: "image/jpeg" });
    const result = buildProductSubmitPayload(values, [
      { kind: "url", url: "https://cdn.example.com/a.jpg" },
      { kind: "file", file, preview: "blob:preview" },
    ]);

    expect(result.mode).toBe("multipart");
    if (result.mode === "multipart") {
      expect(result.formData.get("name")).toBe("Óculos Teste");
      expect(result.formData.get("photos")).toBe(
        JSON.stringify([
          { type: "url", value: "https://cdn.example.com/a.jpg" },
          { type: "stream", fieldName: "photo_0" },
        ]),
      );
      expect(result.formData.get("photo_0")).toBe(file);
    }
  });
});
