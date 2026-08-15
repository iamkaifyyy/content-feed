import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.register({ name, email, password });
      login(res.data.user, res.data.token);
      showToast(`Welcome, ${res.data.user.name}`, "success");
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="feature-card auth-card">
        <div style={{ textAlign: "left", marginBottom: "28px" }}>
          <div className="site-brand" style={{ marginBottom: "12px" }}>
            <span className="status-dot" />
            <span>CONTENT FEED</span>
          </div>
          <h1 className="display-xl" style={{ color: "var(--color-ink)", marginBottom: "8px", fontSize: "32px" }}>
            Create account
          </h1>
          <p className="body-sm">
            Save articles and customize your developer reading list
          </p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span>✕</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              className="text-input"
              placeholder="Alex Johnson"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className="text-input"
              placeholder="alex@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="At least 6 characters"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: "100%", height: "40px", marginTop: "8px" }}
          >
            {submitting ? "Creating account..." : "Sign Up →"}
          </button>
        </form>

        <p className="body-sm" style={{ textAlign: "center", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-link)", textDecoration: "underline" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
