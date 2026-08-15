interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: "latest" | "oldest";
  onSortChange: (s: "latest" | "oldest") => void;
  viewMode: "grid" | "list";
  onViewModeChange: (m: "grid" | "list") => void;
  categories: string[];
  totalArticlesCount: number;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  categories,
  totalArticlesCount,
}: HeroSectionProps) {
  return (
    <section className="hero-section atmospheric-glow-orange">
      <div className="hero-status">
        <span className="badge-pill">
          <span className="status-dot" />
          <span>LATEST POSTS</span>
        </span>
        <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
          {totalArticlesCount} {totalArticlesCount === 1 ? "ARTICLE" : "ARTICLES"}
        </span>
      </div>

      <div className="hero-content">
        <h1 className="display-xxl hero-title">
          Curated Engineering Feed
        </h1>
        <p className="body-lg hero-desc">
          Technical deep-dives, systems architecture, distributed computing, and backend engineering insights.
        </p>
      </div>

      <div className="hero-controls">
        <div className="hero-search-wrapper">
          <svg className="hero-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="text-input hero-search-input"
            placeholder="Search articles by title, topic, or source..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")} className="hero-clear-btn" aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="hero-sort-wrapper">
            <span style={{ fontSize: "12px", color: "var(--color-mute)", fontFamily: "var(--font-mono)" }}>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "latest" | "oldest")}
              className="hero-sort-select"
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`btn-icon ${viewMode === "grid" ? "active" : ""}`}
              title="Grid View"
              aria-label="Grid layout"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`btn-icon ${viewMode === "list" ? "active" : ""}`}
              title="List View"
              aria-label="List layout"
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
      </div>

      <div className="category-rail">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`sub-nav-pill ${selectedCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}
