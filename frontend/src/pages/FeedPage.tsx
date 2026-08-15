import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FeedItem } from "../types";
import HeroSection from "../components/HeroSection";
import FeedCard from "../components/FeedCard";
import CodeSection from "../components/CodeSection";

export default function FeedPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (user) {
      api
        .getBookmarks(1, 100)
        .then((res) => {
          const ids = new Set<string>(res.data.map((b) => b.content._id));
          setBookmarkedIds(ids);
        })
        .catch(() => {});
    } else {
      setBookmarkedIds(new Set());
    }
  }, [user]);

  const loadFeed = async (pageToLoad: number, sortOrder: "latest" | "oldest"): Promise<void> => {
    try {
      setError("");
      const res = await api.getFeed(pageToLoad, 12, sortOrder);
      setItems((prev) => (pageToLoad === 1 ? res.data : [...prev, ...res.data]));
      setHasNextPage(res.pagination.hasNextPage);
      setTotalItems(res.pagination.totalItems);
      setPage(pageToLoad);
    } catch (err) {
      setError((err as Error).message || "Failed to load feed");
    }
  };

  useEffect(() => {
    setLoading(true);
    loadFeed(1, sortBy).finally(() => setLoading(false));
  }, [sortBy]);

  const handleLoadMore = async (): Promise<void> => {
    setLoadingMore(true);
    await loadFeed(page + 1, sortBy);
    setLoadingMore(false);
  };

  const toggleBookmark = async (id: string): Promise<void> => {
    if (!user) {
      showToast("Please sign in to bookmark articles", "info");
      navigate("/login");
      return;
    }

    const isCurrentlyBookmarked = bookmarkedIds.has(id);

    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    try {
      if (isCurrentlyBookmarked) {
        await api.removeBookmark(id);
        showToast("Bookmark removed", "info");
      } else {
        await api.addBookmark(id);
        showToast("Saved to bookmarks", "success");
      }
    } catch (err) {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      showToast((err as Error).message || "Failed to update bookmark", "error");
    }
  };

  const categories = useMemo(() => {
    const unique = new Set<string>();
    items.forEach((item) => {
      if (item.source) unique.add(item.source);
    });
    return ["All", ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.source && item.source.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || item.source === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 24px" }}>
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categories={categories}
        totalArticlesCount={totalItems || items.length}
      />

      {loading ? (
        <div className="feed-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="feature-card" style={{ height: "360px", gap: "14px" }}>
              <div className="skeleton" style={{ height: "170px", width: "100%", borderRadius: "var(--radius-md)" }} />
              <div className="skeleton" style={{ height: "18px", width: "35%" }} />
              <div className="skeleton" style={{ height: "26px", width: "90%" }} />
              <div className="skeleton" style={{ height: "16px", width: "100%" }} />
              <div className="skeleton" style={{ height: "16px", width: "60%", marginTop: "auto" }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="feature-card" style={{ maxWidth: "520px", margin: "40px auto", textAlign: "center", padding: "36px" }}>
          <p style={{ color: "var(--color-accent-red)", fontWeight: 600, marginBottom: "8px" }}>
            Connection Error
          </p>
          <p className="body" style={{ marginBottom: "16px" }}>
            {error}
          </p>
          <button onClick={() => loadFeed(1, sortBy)} className="btn-pill-outline">
            Try Again
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="feature-card" style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
          <h3 className="heading-md" style={{ marginBottom: "8px" }}>No articles found</h3>
          <p className="body" style={{ marginBottom: "20px" }}>
            Try adjusting your search terms or filter selection.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="btn-pill-outline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className={viewMode === "grid" ? "feed-grid" : "feed-list"}>
            {filteredItems.map((item) => (
              <FeedCard
                key={item._id}
                item={item}
                isBookmarked={bookmarkedIds.has(item._id)}
                onToggleBookmark={toggleBookmark}
                viewMode={viewMode}
              />
            ))}
          </div>

          {hasNextPage && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "56px", marginBottom: "24px" }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn-pill-outline"
                style={{ padding: "12px 36px", fontSize: "14px" }}
              >
                {loadingMore ? "Loading..." : "Load More Articles ↓"}
              </button>
            </div>
          )}
        </>
      )}

      <CodeSection />
    </div>
  );
}
