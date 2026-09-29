import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Banner from "./Banner";

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ username, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Weather Station</h1>
        <p className="subtitle">Sign in to check conditions for your saved cities.</p>
        <Banner message={error} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="switch-line">
          New here? <button onClick={onSwitchToRegister}>Create an account</button>
        </div>
      </div>
    </div>
  );
}
