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
    showToast("Link copied to clipboard", "info");
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark(item._id);
  };

  if (viewMode === "list") {
    return (
      <div className="feature-card feed-card-list">
        <div style={{ flexGrow: 1, paddingRight: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span className="badge-pill">{item.source || "ARTICLE"}</span>
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
              {formattedDate} · {readTimeMinutes} min read
            </span>
          </div>

          <Link to={`/article/${item._id}`}>
            <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "4px" }}>
              {item.title}
            </h3>
          </Link>

          <p className="body" style={{ margin: 0 }}>{item.description}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
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

  return (
    <div className="feature-card">
      <Link to={`/article/${item._id}`} className="feed-card-thumb">
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
              {item.source ? item.source.toUpperCase() : "ENGINEERING"}
            </span>
          </div>
        )}
      </Link>

      <div className="feed-card-meta">
        <span className="badge-pill">{item.source || "ARTICLE"}</span>
        <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
          {readTimeMinutes} min read
        </span>
      </div>

      <Link to={`/article/${item._id}`}>
        <h3 className="feed-card-title">{item.title}</h3>
      </Link>

      <p className="feed-card-desc">
        {item.description || "Read technical architecture notes and implementation details."}
      </p>

      <div className="feed-card-footer">
        <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
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
