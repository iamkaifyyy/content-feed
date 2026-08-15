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
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Filter & View State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load user's bookmarks initially if logged in
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

  // Load Feed Data
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
      showToast("Please sign in to bookmark dispatches", "info");
      navigate("/login");
      return;
    }

    const isCurrentlyBookmarked = bookmarkedIds.has(id);

    // Optimistic UI update
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
        showToast("Removed from bookmarks", "info");
      } else {
        await api.addBookmark(id);
        showToast("Saved to your bookmarks", "success");
      }
    } catch (err) {
      // Revert on error
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

  // Derive unique categories/sources
  const categories = useMemo(() => {
    const unique = new Set<string>();
    items.forEach((item) => {
      if (item.source) unique.add(item.source);
    });
    return ["All", ...Array.from(unique)];
  }, [items]);

  // Filtered items based on search query and category
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
      {/* Cohere Editorial Hero Section */}
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

      {/* Loading Skeleton */}
      {loading ? (
        <div className="feed-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="media-card" style={{ height: "360px", gap: "14px" }}>
              <div className="skeleton" style={{ height: "170px", width: "100%", borderRadius: "var(--radius-md)" }} />
              <div className="skeleton" style={{ height: "18px", width: "35%" }} />
              <div className="skeleton" style={{ height: "26px", width: "90%" }} />
              <div className="skeleton" style={{ height: "16px", width: "100%" }} />
              <div className="skeleton" style={{ height: "16px", width: "60%", marginTop: "auto" }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={styles.errorBox}>
          <p style={{ color: "var(--color-error)", fontWeight: 600, marginBottom: "8px" }}>
            Feed Connection Error
          </p>
          <p className="body" style={{ marginBottom: "16px" }}>
            {error}
          </p>
          <button onClick={() => loadFeed(1, sortBy)} className="btn-pill-outline">
            Retry Connection
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <h3 className="card-heading" style={{ marginBottom: "8px" }}>No matching dispatches located</h3>
          <p className="body" style={{ marginBottom: "20px" }}>
            Adjust your search keywords or select another research taxonomy filter.
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
          {/* Active Cards Grid / Table */}
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

          {/* Load More Button */}
          {hasNextPage && (
            <div style={styles.loadMoreWrapper}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn-pill-outline"
                style={{ padding: "12px 36px", fontSize: "14px" }}
              >
                {loadingMore ? "Retrieving dispatches…" : "Load More Dispatches ↓"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Cohere Dark Feature Band / Console Section */}
      <CodeSection />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  errorBox: {
    backgroundColor: "var(--color-canvas)",
    border: "1px solid var(--color-hairline)",
    borderRadius: "var(--radius-lg)",
    padding: "36px",
    textAlign: "center",
    maxWidth: "520px",
    margin: "40px auto",
  },
  emptyState: {
    backgroundColor: "var(--color-canvas)",
    border: "1px solid var(--color-hairline)",
    borderRadius: "var(--radius-lg)",
    padding: "48px 24px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "40px auto",
  },
  emptyIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  loadMoreWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "56px",
    marginBottom: "24px",
  },
};
