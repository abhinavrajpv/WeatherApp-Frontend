import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Banner from "./Banner";

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await register({ username, password, role });
      setSuccess("Account created. You can sign in now.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p className="subtitle">Register to add cities and check the weather.</p>
        <Banner message={error} />
        <Banner type="success" message={success} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="register-password">Password (6 characters)</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              maxLength={6}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="register-role">Role</label>
            <select id="register-role" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div className="switch-line">
          Already registered? <button onClick={onSwitchToLogin}>Sign in</button>
        </div>
      </div>
    </div>
  );
}
