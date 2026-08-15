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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

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
      showToast("Please sign in to save bookmarks", "info");
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
        showToast("Saved to your bookmarks", "success");
      }
    } catch (err) {
      setBookmarked(previousState);
      showToast((err as Error).message || "Failed to update bookmark", "error");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Dispatch URL copied to clipboard", "info");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div className="skeleton" style={{ width: "80px", height: "28px", borderRadius: "var(--radius-md)", marginBottom: "32px" }} />
        <div className="skeleton" style={{ width: "85%", height: "44px", marginBottom: "16px" }} />
        <div className="skeleton" style={{ width: "40%", height: "18px", marginBottom: "32px" }} />
        <div className="skeleton" style={{ width: "100%", height: "360px", borderRadius: "var(--radius-lg)", marginBottom: "32px" }} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={styles.container}>
        <div className="feature-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <h2 className="heading-md" style={{ marginBottom: "8px", color: "var(--color-primary)" }}>
            Dispatch not found
          </h2>
          <p className="body-md" style={{ marginBottom: "20px", color: "var(--color-mute)" }}>
            {error || "The requested dispatch could not be found."}
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
    <div style={styles.container}>
      {/* Top Nav */}
      <div style={styles.topNavRow}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ height: "32px", padding: "0 12px", fontSize: "12.5px" }}>
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

      {/* Meta Header */}
      <div style={styles.metaHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span className="badge-pill">{item.source || "DISPATCH"}</span>
          <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--color-ash)" }}>
            {formattedDate}
          </span>
        </div>

        <h1 className="display-xl" style={styles.articleTitle}>
          {item.title}
        </h1>
      </div>

      {/* Hero Image */}
      {item.image && !imageError && (
        <div style={styles.imageWrapper}>
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            style={styles.heroImg}
          />
        </div>
      )}

      {/* Body Content */}
      <div style={styles.contentBody}>
        <div className="feature-card" style={styles.quoteBlock}>
          <p className="body-lg" style={{ color: "var(--color-ink)", fontWeight: 400 }}>
            {item.description}
          </p>
        </div>

        <div style={styles.prose}>
          <p className="body-md">
            This technical dispatch explores foundational concepts, trade-offs, and operational best practices in modern backend systems and distributed services. Resend's architecture pairs low-latency email pipelines with high-throughput event processing and strict delivery guarantees.
          </p>
          <p className="body-md" style={{ marginTop: "16px" }}>
            For in-depth analysis, benchmark figures, and comprehensive code samples referenced in this dispatch, please review the complete source publication provided directly by <strong>{item.source}</strong>.
          </p>
        </div>

        {/* Source CTA Callout */}
        <div className="feature-card" style={styles.sourceCallout}>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-ash)" }}>PUBLISHED BY</span>
            <h3 style={{ margin: "4px 0", fontSize: "17px", fontWeight: 500 }}>{item.source}</h3>
            <p className="caption" style={{ color: "var(--color-mute)" }}>{formattedDate}</p>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Visit Original Source ↗
          </a>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  topNavRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "36px",
  },
  metaHeader: {
    marginBottom: "36px",
  },
  articleTitle: {
    color: "var(--color-ink)",
    lineHeight: 1.05,
  },
  imageWrapper: {
    width: "100%",
    height: "380px",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    marginBottom: "40px",
    backgroundColor: "var(--color-surface-deep)",
    border: "1px solid var(--color-hairline-strong)",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  contentBody: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  quoteBlock: {
    backgroundColor: "var(--color-surface-card)",
    borderLeft: "2px solid var(--color-primary)",
    padding: "24px 28px",
  },
  prose: {
    color: "var(--color-body)",
    lineHeight: 1.7,
  },
  sourceCallout: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginTop: "20px",
    padding: "24px 28px",
  },
};
