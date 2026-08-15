import { useState } from "react";
import { Link } from "react-router-dom";
import { FeedItem } from "../types";
import { useToast } from "../context/ToastContext";

interface FeedCardProps {
  item: FeedItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  viewMode?: "grid" | "list";
}

export default function FeedCard({
  item,
  isBookmarked,
  onToggleBookmark,
  viewMode = "grid",
}: FeedCardProps) {
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);

  const readTimeMinutes = Math.max(
    2,
    Math.ceil((item.description ? item.description.split(" ").length * 4 : 50) / 60)
  );

  const formattedDate = new Date(item.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/article/${item._id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Dispatch link copied to clipboard", "info");
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark(item._id);
  };

  if (viewMode === "list") {
    return (
      <div className="feature-card" style={listStyles.card}>
        <div style={{ flexGrow: 1, paddingRight: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span className="badge-pill">{item.source || "DISPATCH"}</span>
            <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--color-ash)" }}>
              {formattedDate} · {readTimeMinutes}m read
            </span>
          </div>

          <Link to={`/article/${item._id}`} style={{ textDecoration: "none" }}>
            <h3 style={listStyles.title}>{item.title}</h3>
          </Link>

          <p style={listStyles.desc}>{item.description}</p>
        </div>

        <div style={listStyles.actions}>
          <button
            onClick={handleBookmarkClick}
            className={`btn-icon ${isBookmarked ? "active" : ""}`}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            aria-label="Bookmark"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <button onClick={handleShare} className="btn-icon" title="Share" aria-label="Share">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ height: "32px", padding: "0 10px", fontSize: "12px" }}
          >
            Source ↗
          </a>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="feature-card">
      {/* Thumbnail */}
      <Link to={`/article/${item._id}`} style={gridStyles.thumbLink}>
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            style={gridStyles.thumbImg}
          />
        ) : (
          <div style={gridStyles.thumbFallback}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-ash)" }}>
              RESEND // {item.source ? item.source.toUpperCase() : "FEED"}
            </span>
          </div>
        )}
      </Link>

      {/* Meta Row */}
      <div style={gridStyles.metaRow}>
        <span className="badge-pill">{item.source || "DISPATCH"}</span>
        <span style={{ fontSize: "11.5px", fontFamily: "var(--font-mono)", color: "var(--color-ash)" }}>
          {readTimeMinutes}m read
        </span>
      </div>

      {/* Title */}
      <Link to={`/article/${item._id}`} style={gridStyles.titleLink}>
        <h3 style={gridStyles.title}>{item.title}</h3>
      </Link>

      {/* Excerpt */}
      <p style={gridStyles.desc}>
        {item.description || "System architecture analysis and runtime performance benchmark dispatch."}
      </p>

      {/* Footer */}
      <div style={gridStyles.cardFooter}>
        <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--color-ash)" }}>
          {formattedDate}
        </span>

        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={handleShare} className="btn-icon" title="Copy link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          <button
            onClick={handleBookmarkClick}
            className={`btn-icon ${isBookmarked ? "active" : ""}`}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const gridStyles: Record<string, React.CSSProperties> = {
  thumbLink: {
    display: "block",
    width: "100%",
    height: "160px",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
    marginBottom: "16px",
    backgroundColor: "var(--color-surface-deep)",
    border: "1px solid var(--color-hairline)",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  thumbFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-surface-deep)",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  titleLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    marginBottom: "8px",
  },
  title: {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: 1.35,
    color: "var(--color-ink)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  desc: {
    fontSize: "13.5px",
    color: "var(--color-charcoal)",
    lineHeight: 1.5,
    marginBottom: "18px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    flexGrow: 1,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "14px",
    borderTop: "1px solid var(--color-hairline)",
  },
};

const listStyles: Record<string, React.CSSProperties> = {
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
  },
  title: {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 500,
    color: "var(--color-ink)",
    marginBottom: "4px",
  },
  desc: {
    fontSize: "13.5px",
    color: "var(--color-charcoal)",
    lineHeight: 1.45,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
};
