import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-col">
            <div className="site-brand">
              <span className="status-dot" />
              <span>CONTENT FEED</span>
            </div>
            <p className="body-sm" style={{ maxWidth: "280px" }}>
              Curated engineering insights, distributed systems architecture, and backend articles.
            </p>
            <div style={{ marginTop: "16px" }}>
              <span className="badge-pill">
                <span className="status-dot" />
                <span style={{ fontSize: "11px" }}>API Online</span>
              </span>
            </div>
          </div>

          <div className="site-footer-col">
            <h4 style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "4px" }}>Navigation</h4>
            <Link to="/" className="body-sm">Home Feed</Link>
            <Link to="/bookmarks" className="body-sm">Bookmarks</Link>
            <a href="#code-section" className="body-sm">API Reference</a>
            <a href="http://localhost:5001/api/v1/feed" target="_blank" rel="noreferrer" className="body-sm">Feed Endpoint</a>
          </div>

          <div className="site-footer-col">
            <h4 style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "4px" }}>Resources</h4>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="body-sm">GitHub Repository</a>
            <Link to="/login" className="body-sm">Sign In</Link>
            <Link to="/register" className="body-sm">Create Account</Link>
          </div>

          <div className="site-footer-col">
            <h4 style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "4px" }}>About</h4>
            <span className="body-sm">Architecture Overview</span>
            <span className="body-sm">REST Specifications</span>
            <span className="body-sm">System Status</span>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p className="caption">
            © {new Date().getFullYear()} Content Feed. Built with Node.js, Express, MongoDB, and React.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <span className="caption">Privacy</span>
            <span className="caption">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
