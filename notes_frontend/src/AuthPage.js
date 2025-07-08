import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "./auth";

/**
 * Authentication page for login and register
 * @param {onAuthSuccess, registerMode}
 */
// PUBLIC_INTERFACE
function AuthPage({ onAuthSuccess, registerMode = false }) {
  const [isRegister, setIsRegister] = useState(registerMode);
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // PUBLIC_INTERFACE
  const doAuth = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setError("");

    if (isRegister && form.password !== form.confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const url = isRegister
        ? "/api/register"
        : "/api/login";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Authentication failed");
      } else {
        const data = await res.json();
        setToken(data.token);
        onAuthSuccess();
        navigate("/");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const toggleMode = () => {
    setIsRegister((v) => !v);
    setError("");
  };

  return (
    <div className="auth-page auth-center">
      <form className="auth-form" onSubmit={doAuth}>
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <input
          className="input"
          name="username"
          type="text"
          autoFocus
          placeholder="Username"
          autoComplete="username"
          required
          value={form.username}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />
        {isRegister && (
          <input
            className="input"
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
            value={form.confirm}
            onChange={handleChange}
            disabled={loading}
          />
        )}
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
        <div className="auth-actions">
          <span>
            {isRegister ? "Already have an account?" : "No account?"}{" "}
            <button
              type="button"
              className="btn btn-link"
              onClick={toggleMode}
              style={{ color: "var(--primary-color)", fontSize: ".96em" }}
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}

export default AuthPage;
