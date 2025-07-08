import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import NotesPage from "./NotesPage";
import { getToken, removeToken } from "./auth";
import "./App.css";

// Accent and Primary color CSS vars for theme
const COLORS = {
  primary: "#2563EB",
  secondary: "#64748B",
  accent: "#22C55E",
};

// PUBLIC_INTERFACE
function App() {
  const [theme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  // Color tokens to root
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", COLORS.accent);
    document.documentElement.style.setProperty("--primary-color", COLORS.primary);
    document.documentElement.style.setProperty("--secondary-color", COLORS.secondary);
  }, []);

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  // PUBLIC_INTERFACE
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className={`notes-app notes-theme--${theme}`}>
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <NotesPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthPage onAuthSuccess={handleAuthSuccess} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthPage registerMode onAuthSuccess={handleAuthSuccess} />
                )
              }
            />
            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Header({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  return (
    <header className="nav-header">
      <nav className="nav">
        <span
          className="logo"
          onClick={() => navigate("/")}
          style={{ color: "var(--accent-color)", fontWeight: 700, cursor: "pointer" }}
        >
          noteflow
        </span>
        <span className="spacer" />
        {isAuthenticated ? (
          <button className="btn btn-link" onClick={onLogout}>Log out</button>
        ) : (
          <>
            <button className="btn btn-link" onClick={() => navigate("/login")}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default App;
