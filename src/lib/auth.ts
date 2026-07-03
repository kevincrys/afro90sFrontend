import {
  confirmSignIn,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
} from "aws-amplify/auth";
import { configureAmplify, isCognitoConfigured } from "@/lib/amplify";

const ADMIN_EMAIL_KEY = "admin_email";

let handlingUnauthorized = false;

export function getCognitoErrorMessage(error: unknown): string {
  const name =
    error !== null && typeof error === "object" && "name" in error
      ? String((error as { name: unknown }).name)
      : "";

  switch (name) {
    case "NotAuthorizedException":
    case "UserNotFoundException":
    case "UserNotFoundExceptionException":
      return "E-mail ou senha incorretos.";
    case "UserNotConfirmedException":
      return "Conta não confirmada. Verifique seu e-mail.";
    case "PasswordResetRequiredException":
      return "É necessário redefinir a senha.";
    case "InvalidPasswordException":
      return "A senha não atende aos requisitos de segurança.";
    case "TooManyRequestsException":
      return "Muitas tentativas. Aguarde um momento.";
    case "InvalidParameterException":
      return "Verifique e-mail e senha informados.";
    default:
      return "Não foi possível entrar. Tente novamente.";
  }
}

export function getAdminEmail(): string | null {
  return sessionStorage.getItem(ADMIN_EMAIL_KEY);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_EMAIL_KEY);
}

export async function getAdminBearerToken(): Promise<string | null> {
  if (!isCognitoConfigured()) return null;

  configureAmplify();

  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
}

async function syncAdminEmailFromAmplify(fallbackEmail?: string): Promise<void> {
  const token = await getAdminBearerToken();
  if (!token) {
    throw new Error("MissingAccessToken");
  }

  let email = fallbackEmail?.trim();
  if (!email) {
    const user = await getCurrentUser();
    email = user.signInDetails?.loginId ?? user.username;
  }

  if (email) {
    sessionStorage.setItem(ADMIN_EMAIL_KEY, email);
  }
}

export type AdminSignInResult =
  | { step: "done" }
  | { step: "new_password_required"; missingAttributes: string[] };

function buildUserAttributesForChallenge(
  email: string,
  missingAttributes: string[],
  name?: string,
): Record<string, string> | undefined {
  if (missingAttributes.length === 0) return undefined;

  const attrs: Record<string, string> = {};
  for (const key of missingAttributes) {
    if (key === "email") attrs.email = email.trim();
    if (key === "name" && name?.trim()) attrs.name = name.trim();
  }

  return Object.keys(attrs).length > 0 ? attrs : undefined;
}

export async function adminSignIn(email: string, password: string): Promise<AdminSignInResult> {
  if (!isCognitoConfigured()) {
    throw Object.assign(new Error("CognitoNotConfigured"), { name: "CognitoNotConfigured" });
  }

  configureAmplify();

  const result = await signIn({
    username: email.trim(),
    password,
  });

  if (result.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
    return {
      step: "new_password_required",
      missingAttributes: result.nextStep.missingAttributes ?? [],
    };
  }

  if (!result.isSignedIn) {
    throw Object.assign(new Error("SignInIncomplete"), { name: "SignInIncomplete" });
  }

  await syncAdminEmailFromAmplify(email);
  return { step: "done" };
}

export async function adminConfirmNewPassword(
  email: string,
  newPassword: string,
  options?: { missingAttributes?: string[]; name?: string },
): Promise<void> {
  if (!isCognitoConfigured()) {
    throw Object.assign(new Error("CognitoNotConfigured"), { name: "CognitoNotConfigured" });
  }

  configureAmplify();

  const userAttributes = buildUserAttributesForChallenge(
    email,
    options?.missingAttributes ?? [],
    options?.name,
  );

  const result = await confirmSignIn({
    challengeResponse: newPassword,
    options: userAttributes ? { userAttributes } : undefined,
  });

  if (!result.isSignedIn) {
    throw Object.assign(new Error("SignInIncomplete"), { name: "SignInIncomplete" });
  }

  await syncAdminEmailFromAmplify(email);
}

export async function adminSignOut(): Promise<void> {
  configureAmplify();
  try {
    if (isCognitoConfigured()) {
      await signOut();
    }
  } finally {
    clearAdminSession();
  }
}

/** Sessão expirada ou 401 em rota admin — limpa Amplify e redireciona ao login. */
export async function handleAdminUnauthorized(): Promise<void> {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  try {
    await adminSignOut();
  } finally {
    window.location.assign("/admin/login");
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  if (!isCognitoConfigured()) {
    clearAdminSession();
    return false;
  }

  configureAmplify();

  try {
    await getCurrentUser();
    await syncAdminEmailFromAmplify();
    return true;
  } catch {
    clearAdminSession();
    try {
      await signOut();
    } catch {
      // sessão já inválida
    }
    return false;
  }
}
