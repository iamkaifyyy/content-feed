import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Brand Col */}
          <div style={styles.brandCol}>
            <div style={styles.brandTitle}>
              <span className="status-dot" />
              <span>CONTENT FEED</span>
            </div>
            <p className="body-sm" style={{ color: "var(--color-mute)", maxWidth: "280px" }}>
              Email & system intelligence dispatches built for developers. High signal, zero noise.
            </p>
            <div style={{ marginTop: "16px" }}>
              <span className="badge-pill">
                <span className="status-dot" />
                <span style={{ fontSize: "11px" }}>All systems normal</span>
              </span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Product</h4>
            <Link to="/" style={styles.footerLink}>Feed Explorer</Link>
            <Link to="/bookmarks" style={styles.footerLink}>Bookmarks</Link>
            <a href="#code-section" style={styles.footerLink}>API Reference</a>
            <a href="http://localhost:5001/api/v1/feed" target="_blank" rel="noreferrer" style={styles.footerLink}>REST Endpoint</a>
          </div>

          {/* Links Column 2 */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Developers</h4>
            <a href="https://resend.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Design Reference</a>
            <span style={styles.footerLink}>Node.js SDK</span>
            <span style={styles.footerLink}>Python Library</span>
            <span style={styles.footerLink}>CLI Tools</span>
          </div>

          {/* Links Column 3 */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Company</h4>
            <span style={styles.footerLink}>Changelog</span>
            <span style={styles.footerLink}>Security & Privacy</span>
            <span style={styles.footerLink}>System Status</span>
            <span style={styles.footerLink}>Terms of Service</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={styles.bottomBar}>
          <p className="caption" style={{ color: "var(--color-ash)" }}>
            © {new Date().getFullYear()} Content Feed, Inc. Built with the Resend dark editorial design system.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <span className="caption" style={{ color: "var(--color-ash)" }}>Privacy</span>
            <span className="caption" style={{ color: "var(--color-ash)" }}>Security</span>
            <span className="caption" style={{ color: "var(--color-ash)" }}>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: "var(--color-canvas)",
    borderTop: "1px solid var(--color-hairline)",
    padding: "80px 24px 40px",
    marginTop: "80px",
  },
  container: {
    maxWidth: "var(--max-width)",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "48px",
    paddingBottom: "60px",
  },
  brandCol: {
    gridColumn: "span 1",
  },
  brandTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.08em",
    color: "var(--color-ink)",
    marginBottom: "12px",
  },
  linkCol: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  colTitle: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--color-ink)",
    marginBottom: "4px",
  },
  footerLink: {
    fontSize: "13px",
    color: "var(--color-mute)",
    textDecoration: "none",
    transition: "color 0.15s ease",
  },
  bottomBar: {
    borderTop: "1px solid var(--color-divider-soft)",
    paddingTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
};
