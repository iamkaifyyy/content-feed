import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  const scrollToCode = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      document.getElementById("code-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          {/* Brand & Mission */}
          <div className="site-footer-col">
            <Link to="/" className="site-brand" style={{ textDecoration: "none" }}>
              <span className="status-dot" />
              <span>ONEFEED</span>
            </Link>
            <p className="body-sm" style={{ maxWidth: "280px", marginTop: "12px", lineHeight: 1.6 }}>
              Curated engineering insights, distributed systems architecture, and database internals.
            </p>
            <div style={{ marginTop: "16px" }}>
              <a
                href="http://localhost:5001/api/v1/health"
                target="_blank"
                rel="noreferrer"
                className="badge-pill"
                style={{ textDecoration: "none", display: "inline-flex" }}
                title="Inspect API health status"
              >
                <span className="status-dot" />
                <span style={{ fontSize: "11px" }}>API Online (v1)</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="site-footer-col">
            <h4 style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)", marginBottom: "6px" }}>
              Navigation
            </h4>
            <Link to="/" className="body-sm" style={{ textDecoration: "none" }}>
              Home Feed
            </Link>
            <Link to="/bookmarks" className="body-sm" style={{ textDecoration: "none" }}>
              Saved Bookmarks
            </Link>
            <a href="/#code-section" onClick={scrollToCode} className="body-sm" style={{ textDecoration: "none" }}>
              API Reference
            </a>
          </div>

          {/* Resources & Source */}
          <div className="site-footer-col">
            <h4 style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)", marginBottom: "6px" }}>
              Resources
            </h4>
            <a
              href="https://github.com/iamkaifyyy/content-feed"
              target="_blank"
              rel="noreferrer"
              className="body-sm"
              style={{ textDecoration: "none" }}
            >
              GitHub Repository ↗
            </a>
            <a
              href="https://github.com/iamkaifyyy/content-feed#readme"
              target="_blank"
              rel="noreferrer"
              className="body-sm"
              style={{ textDecoration: "none" }}
            >
              Documentation & Setup ↗
            </a>
            <Link to="/login" className="body-sm" style={{ textDecoration: "none" }}>
              Sign In
            </Link>
            <Link to="/register" className="body-sm" style={{ textDecoration: "none" }}>
              Create Account
            </Link>
          </div>

          {/* Socials / Connect */}
          <div className="site-footer-col">
            <h4 style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)", marginBottom: "6px" }}>
              Socials
            </h4>
            <a
              href="https://github.com/iamkaifyyy"
              target="_blank"
              rel="noreferrer"
              className="body-sm"
              style={{ textDecoration: "none" }}
            >
              GitHub (@iamkaifyyy) ↗
            </a>
            <a
              href="https://linkedin.com/in/iamkaifyyy"
              target="_blank"
              rel="noreferrer"
              className="body-sm"
              style={{ textDecoration: "none" }}
            >
              LinkedIn ↗
            </a>
            <a
              href="mailto:mkaifm728@gmail.com"
              className="body-sm"
              style={{ textDecoration: "none" }}
            >
              Email (mkaifm728@gmail.com) ↗
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="site-footer-bottom" style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--color-hairline)" }}>
          <p className="caption" style={{ margin: 0 }}>
            © {new Date().getFullYear()} OneFeed. Open-source under MIT License.
          </p>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a
              href="https://github.com/iamkaifyyy/content-feed/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="caption"
              style={{ textDecoration: "none", color: "var(--color-mute)" }}
            >
              License (MIT)
            </a>
            <a
              href="https://github.com/iamkaifyyy/content-feed"
              target="_blank"
              rel="noreferrer"
              className="caption"
              style={{ textDecoration: "none", color: "var(--color-mute)" }}
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
