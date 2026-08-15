import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.login(form);
      login(res.data.user, res.data.token);
      showToast(`Welcome back, ${res.data.user.name}`, "success");
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div className="feature-card" style={styles.card}>
        <div style={{ textAlign: "left", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span className="status-dot" />
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14px", letterSpacing: "0.08em" }}>
              FEED
            </span>
          </div>
          <h1 className="display-xl" style={{ color: "var(--color-ink)", marginBottom: "8px", fontSize: "32px" }}>
            Sign in
          </h1>
          <p className="body-sm" style={{ color: "var(--color-charcoal)" }}>
            Access saved dispatches and developer API tokens
          </p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>✕</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              className="text-input"
              placeholder="developer@example.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: "100%", height: "40px", marginTop: "8px" }}
          >
            {submitting ? "Authenticating…" : "Sign In →"}
          </button>
        </form>

        <p style={styles.bottomText}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--color-link)", textDecoration: "underline" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: "calc(100vh - 220px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "36px 32px",
  },
  errorBanner: {
    backgroundColor: "rgba(255, 32, 71, 0.12)",
    border: "1px solid rgba(255, 32, 71, 0.3)",
    color: "var(--color-accent-red)",
    padding: "10px 14px",
    borderRadius: "var(--radius-md)",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12.5px",
    fontWeight: 500,
    color: "var(--color-charcoal)",
  },
  bottomText: {
    fontSize: "13px",
    color: "var(--color-mute)",
    textAlign: "center",
    marginTop: "24px",
  },
};
