import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState("login");

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return authScreen === "login" ? (
    <Login onSwitchToRegister={() => setAuthScreen("register")} />
  ) : (
    <Register onSwitchToLogin={() => setAuthScreen("login")} />
  );
}
