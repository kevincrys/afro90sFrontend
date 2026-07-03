import { describe, expect, it } from "vitest";
import { getCognitoErrorMessage } from "@/lib/auth";

describe("getCognitoErrorMessage", () => {
  it("maps NotAuthorizedException to pt-BR", () => {
    expect(
      getCognitoErrorMessage(Object.assign(new Error("x"), { name: "NotAuthorizedException" })),
    ).toBe("E-mail ou senha incorretos.");
  });

  it("maps NewPasswordRequired to pt-BR", () => {
    expect(
      getCognitoErrorMessage(Object.assign(new Error("x"), { name: "NewPasswordRequired" })),
    ).toBe("Nova senha necessária — configure no console do Cognito.");
  });

  it("falls back for unknown errors", () => {
    expect(getCognitoErrorMessage(new Error("unknown"))).toBe(
      "Não foi possível entrar. Tente novamente.",
    );
  });
});
