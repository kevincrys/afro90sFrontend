import { describe, expect, it } from "vitest";
import { getCognitoErrorMessage } from "@/lib/auth";

describe("getCognitoErrorMessage", () => {
  it("maps NotAuthorizedException to pt-BR", () => {
    expect(
      getCognitoErrorMessage(Object.assign(new Error("x"), { name: "NotAuthorizedException" })),
    ).toBe("E-mail ou senha incorretos.");
  });

  it("maps InvalidPasswordException to pt-BR", () => {
    expect(
      getCognitoErrorMessage(Object.assign(new Error("x"), { name: "InvalidPasswordException" })),
    ).toBe("A senha não atende aos requisitos de segurança.");
  });

  it("falls back for unknown errors", () => {
    expect(getCognitoErrorMessage(new Error("unknown"))).toBe(
      "Não foi possível entrar. Tente novamente.",
    );
  });
});
