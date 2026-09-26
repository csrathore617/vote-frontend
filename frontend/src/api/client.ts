import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// The token lives only in AuthContext's React state (never localStorage --
// see the plan doc), so this module can't read it directly; AuthContext
// pushes it here whenever it changes instead.
let currentToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  currentToken = token;
}

/** AuthContext registers its logout() here, so any 401 (e.g. the 15-minute
 * token expiring mid-session) forces a clean logout from a single place. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

client.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.set("Authorization", `Bearer ${currentToken}`);
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export default client;
