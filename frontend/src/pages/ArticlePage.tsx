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
          const isMarked = res.data.some((b) => b.content._id === id);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
        <button onClick={() => navigate(-1)} className="btn-ghost">
          ← Back
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

      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span className="badge-pill">{item.source || "ARTICLE"}</span>
          <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
            {formattedDate}
          </span>
        </div>

        <h1 className="display-xl" style={{ color: "var(--color-ink)", lineHeight: 1.15 }}>
          {item.title}
        </h1>
      </div>

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

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <div className="feature-card" style={{ borderLeft: "2px solid var(--color-primary)", padding: "24px 28px" }}>
          <p className="body-lg" style={{ color: "var(--color-ink)", margin: 0 }}>
            {item.description}
          </p>
        </div>

        <div style={{ color: "var(--color-body)", lineHeight: 1.7 }}>
          <p className="body-md">
            This article explores technical architecture concepts, operational considerations, and trade-offs in modern software engineering. Review the original source below for full discussions, benchmarks, and referenced code repositories.
          </p>
        </div>

        <div className="feature-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginTop: "20px", padding: "24px 28px" }}>
          <div>
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>PUBLISHED BY</span>
            <h3 style={{ margin: "4px 0", fontSize: "17px", fontWeight: 500 }}>{item.source}</h3>
            <p className="caption">{formattedDate}</p>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Read Full Article ↗
          </a>
        </div>
      </div>
    </div>
  );
}
