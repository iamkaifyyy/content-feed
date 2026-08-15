import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast("Signed out successfully", "info");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link to="/" className="site-brand">
            <span className="status-dot" />
            <span>ONEFEED</span>
          </Link>

          <nav className="site-nav" aria-label="Main Navigation">
            <Link
              to="/"
              className={`sub-nav-pill ${isActive("/") ? "active" : ""}`}
            >
              Feed
            </Link>
            <Link
              to="/bookmarks"
              className={`sub-nav-pill ${isActive("/bookmarks") ? "active" : ""}`}
            >
              Bookmarks
            </Link>
            <a
              href="#code-section"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  document.getElementById("code-section")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="sub-nav-pill"
            >
              API Reference
            </a>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <>
              <Link to="/publish" className="btn-primary" style={{ padding: "7px 14px", fontSize: "13px" }}>
                + Write
              </Link>
              <Link to="/bookmarks" className="site-user-badge" title="View your bookmarks">
                <span style={{ color: "var(--color-accent-green)", fontSize: "10px" }}>●</span>
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="site-mobile-btn"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="site-mobile-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: "6px 0" }}>
            Feed
          </Link>
          <Link to="/bookmarks" onClick={() => setMobileMenuOpen(false)} style={{ padding: "6px 0" }}>
            Bookmarks
          </Link>
          <Link to="/publish" onClick={() => setMobileMenuOpen(false)} style={{ padding: "6px 0" }}>
            + Write Article
          </Link>
          {!user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-ghost" style={{ justifyContent: "center" }}>
                Sign in
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ justifyContent: "center" }}>
                Get started
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="btn-ghost"
              style={{ width: "100%", marginTop: "8px", justifyContent: "center" }}
            >
              Sign out ({user.name})
            </button>
          )}
        </div>
      )}
    </header>
  );
}
