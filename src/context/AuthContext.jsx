import { createContext, useContext, useMemo, useState } from "react";
import { authApi, clearTokens, getTokens, setTokens } from "../api";

const USERNAME_KEY = "weather.username";
const ROLE_KEY = "weather.role";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY));
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getTokens().accessToken));

  async function login(credentials) {
    const data = await authApi.login(credentials);
    console.log(data);
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem(USERNAME_KEY, credentials.username);
    localStorage.setItem(ROLE_KEY, data.role);
    setUsername(credentials.username);
    setRole(data.role);
    setIsAuthenticated(true);
  }

  async function register(payload) {
    console.log(payload);
    await authApi.register(payload);
  }

  function logout() {
    clearTokens();
    localStorage.removeItem(USERNAME_KEY);
     localStorage.removeItem(ROLE_KEY);
    setUsername(null);
     setRole(null);
    setIsAuthenticated(false);
  }

  const value = useMemo(
    () => ({ username, role, isAuthenticated, login, register, logout }),
    [username, role, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
