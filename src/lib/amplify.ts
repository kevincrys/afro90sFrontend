import { Amplify } from "aws-amplify";

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

  configured = true;
}
