import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function CodeSection() {
  const [activeTab, setActiveTab] = useState<"node" | "python" | "curl">("node");
  const { showToast } = useToast();

  const snippets = {
    node: `import { ResendFeed } from 'content-feed';

const feed = new ResendFeed({ apiKey: process.env.FEED_API_KEY });

const { data, error } = await feed.dispatches.list({
  limit: 10,
  sort: 'latest',
});

console.log(data);`,
    python: `from content_feed import Client

client = Client(api_key="FEED_API_KEY")

dispatches = client.feed.list(
    page=1,
    limit=10,
    sort="latest"
)

for item in dispatches.data:
    print(f"[{item.source}] {item.title}")`,
    curl: `curl -X GET "http://localhost:5001/api/v1/feed?limit=10&sort=latest" \\
  -H "Authorization: Bearer re_123456789" \\
  -H "Content-Type: application/json"`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    showToast("SDK code copied to clipboard", "success");
  };

  return (
    <section id="code-section" className="atmospheric-glow-blue" style={styles.wrapper}>
      <div style={styles.header}>
        <span className="badge-pill" style={{ marginBottom: "12px" }}>
          <span>FIRST-CLASS DEVELOPER EXPERIENCE</span>
        </span>
        <h2 className="display-xl" style={{ color: "var(--color-ink)", marginBottom: "12px" }}>
          Integrate this weekend.
        </h2>
        <p className="body-lg" style={{ color: "var(--color-charcoal)", maxWidth: "580px" }}>
          Clean SDKs, end-to-end type safety, and instant REST endpoints designed to fit seamlessly into modern applications.
        </p>
      </div>

      {/* Resend Code Window */}
      <div className="code-window" style={styles.windowWrapper}>
        {/* Top Traffic Lights Chrome */}
        <div style={styles.chromeRow}>
          <div style={styles.dotsRow}>
            <span style={{ ...styles.dot, backgroundColor: "var(--color-accent-red)" }} />
            <span style={{ ...styles.dot, backgroundColor: "var(--color-accent-yellow)" }} />
            <span style={{ ...styles.dot, backgroundColor: "var(--color-accent-green)" }} />
          </div>

          <div style={styles.tabGroup}>
            <button
              onClick={() => setActiveTab("node")}
              style={{
                ...styles.tabBtn,
                ...(activeTab === "node" ? styles.tabActive : {}),
              }}
            >
              Node.js
            </button>
            <button
              onClick={() => setActiveTab("python")}
              style={{
                ...styles.tabBtn,
                ...(activeTab === "python" ? styles.tabActive : {}),
              }}
            >
              Python
            </button>
            <button
              onClick={() => setActiveTab("curl")}
              style={{
                ...styles.tabBtn,
                ...(activeTab === "curl" ? styles.tabActive : {}),
              }}
            >
              cURL
            </button>
          </div>

          <button onClick={handleCopy} className="btn-primary" style={{ height: "28px", padding: "0 12px", fontSize: "12px" }}>
            Copy
          </button>
        </div>

        {/* Code Content */}
        <div style={styles.codeBody}>
          <pre style={styles.preCode}>
            <code className="code-font">{snippets[activeTab]}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    margin: "80px 0 64px",
    paddingTop: "48px",
    borderTop: "1px solid var(--color-hairline)",
  },
  header: {
    marginBottom: "36px",
  },
  windowWrapper: {
    maxWidth: "860px",
    margin: "0 auto",
  },
  chromeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "16px",
    borderBottom: "1px solid var(--color-hairline)",
  },
  dotsRow: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  tabGroup: {
    display: "flex",
    gap: "4px",
    backgroundColor: "var(--color-surface-card)",
    padding: "3px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-hairline)",
  },
  tabBtn: {
    background: "transparent",
    color: "var(--color-mute)",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    padding: "4px 10px",
    borderRadius: "var(--radius-xs)",
    cursor: "pointer",
  },
  tabActive: {
    backgroundColor: "var(--color-surface-elevated)",
    color: "var(--color-ink)",
  },
  codeBody: {
    padding: "20px 8px 8px",
    overflowX: "auto",
  },
  preCode: {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.65,
    color: "var(--color-body)",
  },
};
