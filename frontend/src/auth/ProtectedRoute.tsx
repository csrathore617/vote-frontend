import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

/**
 * Cosmetic only -- the real enforcement is entirely server-side
 * (SecurityConfig's `authenticated()`/`hasRole("ADMIN")` rules and
 * DataBlockScopeResolver in the backend). This just avoids flashing
 * protected UI before redirecting to /login.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

/** Same caveat as {@link ProtectedRoute}: the backend's real 403 on
 * `/api/admin/**` is what actually matters, not this. */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.roles.includes("ADMIN")) {
    return <Navigate to="/forbidden" replace />;
  }
  return <>{children}</>;
}
