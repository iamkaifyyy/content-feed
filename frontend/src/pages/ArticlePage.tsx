import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FeedItem } from "../types";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [item, setItem] = useState<FeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getFeedItem(id)
      .then((res) => setItem(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));

    if (user && id) {
      api
        .getBookmarks(1, 100)
        .then((res) => {
          const isMarked = res.data.some((b) => b.content._id === id || b.content.id === id);
          setBookmarked(isMarked);
        })
        .catch(() => {});
    }
  }, [id, user]);

  const toggleBookmark = async (): Promise<void> => {
    if (!id) return;
    if (!user) {
      showToast("Please sign in to bookmark articles", "info");
      navigate("/login");
      return;
    }

    const previousState = bookmarked;
    setBookmarked(!previousState);

    try {
      if (previousState) {
        await api.removeBookmark(id);
        showToast("Bookmark removed", "info");
      } else {
        await api.addBookmark(id);
        showToast("Saved to bookmarks", "success");
      }
    } catch (err) {
      setBookmarked(previousState);
      showToast((err as Error).message || "Failed to update bookmark", "error");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard", "info");
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div className="skeleton" style={{ width: "80px", height: "28px", borderRadius: "var(--radius-md)", marginBottom: "32px" }} />
        <div className="skeleton" style={{ width: "85%", height: "44px", marginBottom: "16px" }} />
        <div className="skeleton" style={{ width: "40%", height: "18px", marginBottom: "32px" }} />
        <div className="skeleton" style={{ width: "100%", height: "360px", borderRadius: "var(--radius-lg)", marginBottom: "32px" }} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div className="feature-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <h2 className="heading-md" style={{ marginBottom: "8px", color: "var(--color-primary)" }}>
            Article not found
          </h2>
          <p className="body-md" style={{ marginBottom: "20px", color: "var(--color-mute)" }}>
            {error || "The requested article could not be found."}
          </p>
          <Link to="/" className="btn-ghost">
            ← Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(item.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Top Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
        <button onClick={() => navigate(-1)} className="btn-ghost">
          ← Back to Feed
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleShare} className="btn-icon" title="Copy link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
          <button
            onClick={toggleBookmark}
            className={`btn-icon ${bookmarked ? "active" : ""}`}
            title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <span className="badge-pill">{item.source || "ENGINEERING"}</span>
          {item.readTime && (
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
              {item.readTime}
            </span>
          )}
          <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
            • {formattedDate}
          </span>
          {item.author && (
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
              • By {item.author}
            </span>
          )}
        </div>

        <h1 className="display-xl" style={{ color: "var(--color-ink)", lineHeight: 1.15, marginBottom: "20px" }}>
          {item.title}
        </h1>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
            {item.tags.map((tag) => (
              <span key={tag} className="sub-nav-pill" style={{ fontSize: "12px", pointerEvents: "none" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hero Image */}
      {item.image && !imageError && (
        <div style={{ width: "100%", height: "380px", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "40px", backgroundColor: "var(--color-surface-deep)", border: "1px solid var(--color-hairline-strong)" }}>
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Article Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Executive Summary Card */}
        <div className="feature-card" style={{ borderLeft: "3px solid var(--color-primary)", padding: "24px 28px", backgroundColor: "var(--color-surface-deep)" }}>
          <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-primary)", marginBottom: "8px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            Executive Overview
          </h3>
          <p className="body-lg" style={{ color: "var(--color-ink)", margin: 0, lineHeight: 1.6 }}>
            {item.description}
          </p>
        </div>

        {/* Full Detailed Body Content */}
        {item.body ? (
          <div className="article-body-content" style={{ color: "var(--color-body)", fontSize: "16px", lineHeight: 1.8 }}>
            {item.body.split("\n\n").map((block, idx) => {
              if (block.startsWith("### ")) {
                return (
                  <h3 key={idx} style={{ color: "var(--color-ink)", fontSize: "20px", fontWeight: 600, marginTop: "32px", marginBottom: "12px" }}>
                    {block.replace("### ", "")}
                  </h3>
                );
              }

              if (block.startsWith("```")) {
                const codeText = block.replace(/```[a-z]*\n?/gi, "").replace(/```$/gi, "");
                return (
                  <div key={idx} className="code-window" style={{ margin: "20px 0", padding: "16px" }}>
                    <pre style={{ margin: 0, overflowX: "auto", fontSize: "13.5px", color: "var(--color-body)" }}>
                      <code className="code-font">{codeText}</code>
                    </pre>
                  </div>
                );
              }

              if (block.match(/^[0-9]\. /m) || block.match(/^[-*] /m)) {
                const lines = block.split("\n");
                return (
                  <ul key={idx} style={{ paddingLeft: "24px", margin: "16px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {lines.map((line, lIdx) => (
                      <li key={lIdx} style={{ color: "var(--color-charcoal)", lineHeight: 1.6 }}>
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/^[0-9]\.\s*|^[-*]\s*/, "").replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--color-ink)">$1</strong>').replace(/`([^`]+)`/g, '<code class="code-font" style="background:var(--color-surface-card);padding:2px 6px;border-radius:4px;font-size:13px;border:1px solid var(--color-hairline)">$1</code>') }} />
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={idx} style={{ marginBottom: "20px", color: "var(--color-charcoal)" }}>
                  <span dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--color-ink)">$1</strong>').replace(/`([^`]+)`/g, '<code class="code-font" style="background:var(--color-surface-card);padding:2px 6px;border-radius:4px;font-size:13px;border:1px solid var(--color-hairline)">$1</code>') }} />
                </p>
              );
            })}
          </div>
        ) : (
          <div style={{ color: "var(--color-body)", lineHeight: 1.75 }}>
            <p className="body-md">
              {item.description}
            </p>
          </div>
        )}

        {/* Publisher & Source Link Footer Card */}
        <div className="feature-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginTop: "24px", padding: "24px 28px" }}>
          <div>
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>ORIGINAL PUBLISHER</span>
            <h3 style={{ margin: "4px 0", fontSize: "17px", fontWeight: 500, color: "var(--color-ink)" }}>{item.source}</h3>
            <p className="caption">{item.author ? `Written by ${item.author} • ` : ""}{formattedDate}</p>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Read Full Article on {item.source} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
