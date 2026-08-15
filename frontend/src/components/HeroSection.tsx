import React from "react";

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
    <section className="atmospheric-glow-orange" style={styles.heroWrapper}>
      {/* Top Status Pill */}
      <div style={styles.topStatus}>
        <span className="badge-pill">
          <span className="status-dot" />
          <span>LIVE STREAM</span>
        </span>
        <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--color-ash)" }}>
          {totalArticlesCount} VERIFIED DISPATCHES
        </span>
      </div>

      {/* Editorial Serif Headline */}
      <div style={styles.headlineWrapper}>
        <h1 className="display-xxl" style={styles.heroTitle}>
          Dispatches for developers.
        </h1>
        <p className="body-lg" style={styles.heroSub}>
          Curated technical breakdowns, system architecture deep dives, and machine intelligence logs — built for builders.
        </p>
      </div>

      {/* Search & Controls Row */}
      <div style={styles.controlsRow}>
        <div style={styles.searchWrapper}>
          <svg style={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="text-input"
            style={styles.searchInput}
            placeholder="Search articles by title, topic, or source…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")} style={styles.clearBtn} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div style={styles.rightControls}>
          <div style={styles.sortBox}>
            <span style={{ fontSize: "12px", color: "var(--color-mute)", fontFamily: "var(--font-mono)" }}>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "latest" | "oldest")}
              style={styles.sortSelect}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Earliest First</option>
            </select>
          </div>

          <div style={styles.viewToggleGroup}>
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

      {/* Sub-nav Category Pills */}
      <div style={styles.categoryPillsWrapper}>
        <div style={styles.categoryPillsRail}>
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
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heroWrapper: {
    padding: "64px 0 32px",
    borderBottom: "1px solid var(--color-hairline)",
    marginBottom: "36px",
  },
  topStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  headlineWrapper: {
    maxWidth: "880px",
    marginBottom: "40px",
  },
  heroTitle: {
    color: "var(--color-ink)",
    marginBottom: "16px",
  },
  heroSub: {
    color: "var(--color-charcoal)",
    maxWidth: "600px",
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  searchWrapper: {
    position: "relative",
    flexGrow: 1,
    maxWidth: "480px",
    minWidth: "240px",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--color-mute)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    paddingLeft: "38px",
    paddingRight: "36px",
    height: "38px",
    boxSizing: "border-box",
  },
  clearBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    color: "var(--color-mute)",
    cursor: "pointer",
  },
  rightControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sortBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid var(--color-hairline-strong)",
    borderRadius: "var(--radius-md)",
    padding: "2px 10px",
    height: "36px",
    backgroundColor: "var(--color-surface-card)",
  },
  sortSelect: {
    background: "transparent",
    fontSize: "12.5px",
    color: "var(--color-ink)",
    cursor: "pointer",
  },
  viewToggleGroup: {
    display: "flex",
    gap: "4px",
  },
  categoryPillsWrapper: {
    overflowX: "auto",
    paddingBottom: "4px",
    scrollbarWidth: "none",
  },
  categoryPillsRail: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
};
