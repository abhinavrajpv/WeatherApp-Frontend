import { createContext, useContext, useMemo, useState } from "react";
import { authApi, clearTokens, getTokens, setTokens } from "../api";

const USERNAME_KEY = "weather.username";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getTokens().accessToken));

  async function login(credentials) {
    const data = await authApi.login(credentials);
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem(USERNAME_KEY, credentials.username);
    setUsername(credentials.username);
    setIsAuthenticated(true);
  }

  async function register(payload) {
    await authApi.register(payload);
  }

  function logout() {
    clearTokens();
    localStorage.removeItem(USERNAME_KEY);
    setUsername(null);
    setIsAuthenticated(false);
  }

  const value = useMemo(
    () => ({ username, isAuthenticated, login, register, logout }),
    [username, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
