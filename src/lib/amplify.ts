import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { sessionStorage } from "aws-amplify/utils";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID?.trim();
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID?.trim();

let configured = false;

export function isCognitoConfigured(): boolean {
  return Boolean(userPoolId && userPoolClientId);
}

export function configureAmplify(): void {
  if (!isCognitoConfigured() || configured) return;

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: userPoolId!,
        userPoolClientId: userPoolClientId!,
      },
    },
  });

  // Tokens Cognito no sessionStorage (somem ao fechar a aba); default Amplify é localStorage.
  cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

  configured = true;
}
