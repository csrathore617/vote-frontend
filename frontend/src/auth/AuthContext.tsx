import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { login as loginApi } from "../api/authApi";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";
import type { AccessibleDataBlock, UserSummary } from "../types/auth";

interface AuthContextValue {
  token: string | null;
  user: UserSummary | null;
  /** From the login response -- see the plan doc; this is what populates the
   * dataset picker, with no extra round trip after login. */
  accessibleDataBlocks: AccessibleDataBlock[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Holds the token and accessible-blocks list purely in React state --
 * deliberately never persisted to localStorage/sessionStorage, so a page
 * refresh always requires logging in again. This is a deliberate tradeoff
 * (see the plan doc), not an oversight.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [accessibleDataBlocks, setAccessibleDataBlocks] = useState<AccessibleDataBlock[]>([]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAccessibleDataBlocks([]);
    setAuthToken(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginApi(email, password);
    setToken(response.token);
    setUser(response.user);
    setAccessibleDataBlocks(response.accessibleDataBlocks);
    setAuthToken(response.token);
  }, []);

  // The axios client lives outside React and can't read this state directly,
  // so it calls back through a registered handler -- this wires it up, and
  // keeps it current when `logout` is re-created.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, accessibleDataBlocks, isAuthenticated: token !== null, login, logout }),
    [token, user, accessibleDataBlocks, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
