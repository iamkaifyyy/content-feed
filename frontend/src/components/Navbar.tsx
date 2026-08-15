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
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Brand / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link to="/" style={styles.brand}>
            <span className="status-dot" />
            <span style={styles.brandTitle}>FEED</span>
            <span style={styles.brandBadge}>v1.0</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={styles.navLinks} aria-label="Main Navigation">
            <Link
              to="/"
              className={`sub-nav-pill ${isActive("/") ? "active" : ""}`}
            >
              Feed
            </Link>
            {user && (
              <Link
                to="/bookmarks"
                className={`sub-nav-pill ${isActive("/bookmarks") ? "active" : ""}`}
              >
                Bookmarks
              </Link>
            )}
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
              API Docs
            </a>
          </nav>
        </div>

        {/* Right Actions */}
        <div style={styles.rightGroup}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link
                to="/bookmarks"
                style={styles.userBadge}
                title="View your bookmarks"
              >
                <span style={styles.userDot}>●</span>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-ink)" }}>
                  {user.name}
                </span>
              </Link>

              <button onClick={handleLogout} className="btn-ghost" style={{ height: "32px", padding: "0 12px", fontSize: "12.5px" }}>
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link to="/login" style={styles.signInLink}>
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started →
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.mobileMenuBtn}
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDropdown}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
            Explore Feed
          </Link>
          {user && (
            <Link to="/bookmarks" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
              Saved Bookmarks
            </Link>
          )}
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

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: "var(--color-canvas)",
    borderBottom: "1px solid var(--color-hairline)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
  },
  container: {
    maxWidth: "var(--max-width)",
    margin: "0 auto",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "var(--color-ink)",
  },
  brandTitle: {
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "15px",
    letterSpacing: "0.08em",
  },
  brandBadge: {
    fontSize: "10px",
    fontFamily: "var(--font-mono)",
    color: "var(--color-ash)",
    border: "1px solid var(--color-hairline-strong)",
    padding: "1px 5px",
    borderRadius: "var(--radius-xs)",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  rightGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  signInLink: {
    fontSize: "13.5px",
    fontWeight: 500,
    color: "var(--color-body)",
    textDecoration: "none",
  },
  userBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 10px",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-surface-elevated)",
    border: "1px solid var(--color-hairline-strong)",
    textDecoration: "none",
  },
  userDot: {
    color: "var(--color-accent-green)",
    fontSize: "10px",
  },
  mobileMenuBtn: {
    display: "none",
    background: "transparent",
    color: "var(--color-ink)",
    padding: "6px",
  },
  mobileDropdown: {
    backgroundColor: "var(--color-surface-card)",
    borderBottom: "1px solid var(--color-hairline-strong)",
    padding: "16px 24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  mobileLink: {
    fontSize: "14px",
    color: "var(--color-body)",
    padding: "6px 0",
    borderBottom: "1px solid var(--color-hairline)",
  },
};
