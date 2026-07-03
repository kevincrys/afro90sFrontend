import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ADMIN_SESSION_KEY = "admin_email";

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) !== null;
}

export function setAdminSession(email: string): void {
  sessionStorage.setItem(ADMIN_SESSION_KEY, email);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getAdminEmail(): string | null {
  return sessionStorage.getItem(ADMIN_SESSION_KEY);
}

interface ProtectedRouteProps {
  children: ReactNode;
}

/** Placeholder de auth — substituído por Amplify Cognito na task 11. */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
