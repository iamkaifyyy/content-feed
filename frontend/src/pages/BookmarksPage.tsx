import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Bookmark } from "../types";
import FeedCard from "../components/FeedCard";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    api
      .getBookmarks(1, 100)
      .then((res) => setBookmarks(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleRemoveBookmark = async (contentId: string): Promise<void> => {
    try {
      await api.removeBookmark(contentId);
      setBookmarks((prev) => prev.filter((b) => b.content._id !== contentId));
      showToast("Bookmark removed", "info");
    } catch (err) {
      showToast((err as Error).message || "Failed to remove bookmark", "error");
    }
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const q = searchQuery.toLowerCase();
      return (
        q === "" ||
        b.content.title.toLowerCase().includes(q) ||
        (b.content.description && b.content.description.toLowerCase().includes(q)) ||
        (b.content.source && b.content.source.toLowerCase().includes(q))
      );
    });
  }, [bookmarks, searchQuery]);

  if (authLoading || loading) {
    return (
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "48px 24px" }}>
        <div className="skeleton" style={{ height: "36px", width: "200px", marginBottom: "24px" }} />
        <div className="feed-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="feature-card" style={{ height: "300px" }}>
              <div className="skeleton" style={{ height: "140px", marginBottom: "14px" }} />
              <div className="skeleton" style={{ height: "18px", width: "75%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap", borderBottom: "1px solid var(--color-hairline)", paddingBottom: "24px", marginBottom: "36px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span className="badge-pill">BOOKMARKS</span>
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
              {bookmarks.length} {bookmarks.length === 1 ? "SAVED ARTICLE" : "SAVED ARTICLES"}
            </span>
          </div>
          <h1 className="display-xl" style={{ color: "var(--color-ink)" }}>
            Saved Articles
          </h1>
        </div>

        {bookmarks.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="text"
              className="text-input"
              style={{ width: "220px", height: "36px", fontSize: "13px" }}
              placeholder="Search saved articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => setViewMode("grid")}
                className={`btn-icon ${viewMode === "grid" ? "active" : ""}`}
                title="Grid View"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`btn-icon ${viewMode === "list" ? "active" : ""}`}
                title="List View"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="feature-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: "var(--color-accent-red)", fontWeight: 500 }}>{error}</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="feature-card" style={{ padding: "64px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔖</div>
          <h2 className="heading-md" style={{ marginBottom: "8px" }}>No bookmarks saved yet</h2>
          <p className="body-md" style={{ color: "var(--color-charcoal)", marginBottom: "24px", maxWidth: "400px", textAlign: "center" }}>
            Explore the feed and bookmark articles to build your reading list.
          </p>
          <Link to="/" className="btn-primary">
            Explore Feed →
          </Link>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="feature-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <p className="body-md">No bookmarks match "{searchQuery}".</p>
          <button onClick={() => setSearchQuery("")} className="btn-ghost" style={{ marginTop: "12px" }}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "feed-grid" : "feed-list"}>
          {filteredBookmarks.map((b) => (
            <FeedCard
              key={b._id}
              item={b.content}
              isBookmarked={true}
              onToggleBookmark={handleRemoveBookmark}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
