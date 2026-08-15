import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function CodeSection() {
  const [activeTab, setActiveTab] = useState<"node" | "python" | "curl">("node");
  const { showToast } = useToast();

  const snippets = {
    node: `const res = await fetch("http://localhost:5001/api/v1/feed?limit=10&sort=latest");
const { data, pagination } = await res.json();

console.log(\`Page \${pagination.page} of \${pagination.totalPages}\`);
data.forEach(item => console.log(\`[\${item.source}] \${item.title}\`));`,
    python: `import requests

res = requests.get("http://localhost:5001/api/v1/feed", params={"limit": 10, "sort": "latest"})
payload = res.json()

for item in payload.get("data", []):
    print(f"[{item['source']}] {item['title']}")`,
    curl: `curl -X GET "http://localhost:5001/api/v1/feed?limit=10&sort=latest" \\
  -H "Accept: application/json"`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    showToast("Code copied to clipboard", "success");
  };

  return (
    <section id="code-section" className="atmospheric-glow-blue" style={{ margin: "80px 0 64px", paddingTop: "48px", borderTop: "1px solid var(--color-hairline)" }}>
      <div style={{ marginBottom: "36px" }}>
        <span className="badge-pill" style={{ marginBottom: "12px" }}>
          <span>REST API</span>
        </span>
        <h2 className="display-xl" style={{ color: "var(--color-ink)", marginBottom: "12px" }}>
          Simple Integration
        </h2>
        <p className="body-lg" style={{ color: "var(--color-charcoal)", maxWidth: "580px" }}>
          Query the paginated feed, inspect individual articles, and manage user bookmarks via standard REST endpoints.
        </p>
      </div>

      <div className="code-window" style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid var(--color-hairline)" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--color-accent-red)" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--color-accent-yellow)" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--color-accent-green)" }} />
          </div>

          <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--color-surface-card)", padding: "3px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-hairline)" }}>
            <button
              onClick={() => setActiveTab("node")}
              className={`sub-nav-pill ${activeTab === "node" ? "active" : ""}`}
              style={{ fontSize: "12px", fontFamily: "var(--font-mono)", padding: "4px 10px" }}
            >
              Node.js
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`sub-nav-pill ${activeTab === "python" ? "active" : ""}`}
              style={{ fontSize: "12px", fontFamily: "var(--font-mono)", padding: "4px 10px" }}
            >
              Python
            </button>
            <button
              onClick={() => setActiveTab("curl")}
              className={`sub-nav-pill ${activeTab === "curl" ? "active" : ""}`}
              style={{ fontSize: "12px", fontFamily: "var(--font-mono)", padding: "4px 10px" }}
            >
              cURL
            </button>
          </div>

          <button onClick={handleCopy} className="btn-primary" style={{ height: "28px", padding: "0 12px", fontSize: "12px" }}>
            Copy
          </button>
        </div>

        <div style={{ padding: "20px 8px 8px", overflowX: "auto" }}>
          <pre style={{ margin: 0, fontSize: "13px", lineHeight: 1.65, color: "var(--color-body)" }}>
            <code className="code-font">{snippets[activeTab]}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
