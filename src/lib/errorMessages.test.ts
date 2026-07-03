import { describe, expect, it } from "vitest";
import { getClientErrorMessage } from "@/lib/errorMessages";

describe("getClientErrorMessage", () => {
  it("maps known API codes to pt-BR", () => {
    expect(getClientErrorMessage("NOT_FOUND")).toBe("Item não encontrado.");
    expect(getClientErrorMessage("INSUFFICIENT_STOCK")).toBe(
      "Quantidade indisponível no estoque.",
    );
  });

  it("falls back for unknown codes", () => {
    expect(getClientErrorMessage("SOME_NEW_BACKEND_CODE")).toBe(
      "Ocorreu um erro inesperado. Tente novamente.",
    );
  });
});
