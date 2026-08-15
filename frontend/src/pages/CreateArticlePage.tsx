import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const PRESET_IMAGES = [
  { label: "Code & Editor", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60" },
  { label: "Cloud & Network", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60" },
  { label: "Databases & Storage", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60" },
  { label: "Architecture & Hardware", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60" },
];

export default function CreateArticlePage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [source, setSource] = useState("Engineering Publication");
  const [author, setAuthor] = useState(user?.name || "");
  const [tagsInput, setTagsInput] = useState("System Design, Node.js");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [sourceUrl, setSourceUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Live estimated reading time
  const totalWords = `${title} ${description} ${body}`.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.max(1, Math.ceil(totalWords / 200));

  if (authLoading) {
    return (
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px" }}>
        <div className="skeleton" style={{ height: "36px", width: "220px", marginBottom: "24px" }} />
        <div className="skeleton" style={{ height: "400px", borderRadius: "var(--radius-lg)" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "64px 24px 80px" }}>
        <div className="feature-card" style={{ maxWidth: "560px", margin: "0 auto", padding: "56px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>✍️</div>
          <h1 className="heading-lg" style={{ color: "var(--color-ink)", marginBottom: "10px", fontSize: "26px" }}>
            Publish to OneFeed
          </h1>
          <p className="body-md" style={{ color: "var(--color-charcoal)", marginBottom: "28px", lineHeight: 1.6 }}>
            You must be signed in with a registered account to author and publish technical engineering articles to the community feed.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/login" className="btn-primary" style={{ padding: "10px 24px" }}>
              Sign In to Publish →
            </Link>
            <Link to="/register" className="btn-ghost" style={{ padding: "10px 24px" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please provide an article title", "error");
      return;
    }

    if (!description.trim()) {
      showToast("Please provide a short overview / description", "error");
      return;
    }

    if (!body.trim()) {
      showToast("Please provide the full article body content", "error");
      return;
    }

    setSubmitting(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await api.createArticle({
        title: title.trim(),
        description: description.trim(),
        body: body.trim(),
        source: source.trim() || "Community Publication",
        author: author.trim() || user.name,
        tags,
        image: imageUrl.trim() || PRESET_IMAGES[0].url,
        url: sourceUrl.trim() || `https://onefeed.dev/articles/${Date.now()}`,
      });

      showToast("Article published successfully to MongoDB Atlas!", "success");
      const newId = res.data._id || res.data.id;
      navigate(newId ? `/article/${newId}` : "/");
    } catch (err: any) {
      showToast(err.message || "Failed to publish article", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <button onClick={() => navigate(-1)} className="btn-ghost">
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
            ESTIMATED: ~{estimatedReadTime} MIN READ ({totalWords} WORDS)
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "32px", borderBottom: "1px solid var(--color-hairline)", paddingBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span className="badge-pill">AUTHOR STUDIO</span>
          <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>LIVE ON MONGODB ATLAS</span>
        </div>
        <h1 className="display-xl" style={{ color: "var(--color-ink)" }}>
          Publish New Article
        </h1>
        <p className="body-md" style={{ color: "var(--color-charcoal)", marginTop: "6px" }}>
          Share your distributed systems breakdowns, database optimizations, or engineering lessons with OneFeed readers.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Title */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "8px" }}>
            Article Title *
          </label>
          <input
            type="text"
            className="text-input"
            style={{ width: "100%", fontSize: "16px", padding: "12px 14px", fontWeight: 500 }}
            placeholder="e.g. Scaling WebSocket Connection Pools with Redis and Go"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Executive Overview */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "8px" }}>
            Executive Overview / Short Description *
          </label>
          <textarea
            className="text-input"
            style={{ width: "100%", minHeight: "80px", fontSize: "14px", padding: "10px 14px", lineHeight: 1.5, resize: "vertical" }}
            placeholder="A 2-3 sentence overview that appears on feed cards and search results..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Author & Source Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "8px" }}>
              Author Name
            </label>
            <input
              type="text"
              className="text-input"
              style={{ width: "100%" }}
              placeholder={user.name}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "8px" }}>
              Publisher / Source
            </label>
            <input
              type="text"
              className="text-input"
              style={{ width: "100%" }}
              placeholder="e.g. Stripe Engineering, Discord, Personal Blog"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
        </div>

        {/* Topic Tags & Source Link */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "8px" }}>
              Topic Tags (comma-separated)
            </label>
            <input
              type="text"
              className="text-input"
              style={{ width: "100%" }}
              placeholder="Node.js, Distributed Systems, MongoDB, Caching"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "8px" }}>
              Original Article Link (optional)
            </label>
            <input
              type="url"
              className="text-input"
              style={{ width: "100%" }}
              placeholder="https://yourblog.com/post-name"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Hero Image Selection */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", marginBottom: "8px" }}>
            Cover Image URL
          </label>
          <input
            type="url"
            className="text-input"
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span className="caption">Quick Presets:</span>
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className="sub-nav-pill"
                style={{ fontSize: "11px", borderColor: imageUrl === preset.url ? "var(--color-primary)" : "var(--color-hairline)" }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Full Article Body Content */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-ink)" }}>
              Full Technical Body Content *
            </label>
            <span className="caption" style={{ fontFamily: "var(--font-mono)" }}>
              Supports ### Headings, lists & ```code blocks
            </span>
          </div>
          <textarea
            className="text-input"
            style={{
              width: "100%",
              minHeight: "320px",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
              padding: "14px",
              lineHeight: 1.7,
              resize: "vertical",
            }}
            placeholder={`### Architectural Overview\n\nExplain the underlying problem statement and system constraints here...\n\n### Implementation Details\n\n\`\`\`typescript\n// Paste code or architecture samples here\nconst result = await processQueue();\n\`\`\`\n\n1. Step one: Explain the mechanics\n2. Step two: Analyze performance benchmarks`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        {/* Submit Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-ghost"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "12px 28px", fontSize: "14px" }}
            disabled={submitting}
          >
            {submitting ? "Publishing to Atlas..." : "🚀 Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
