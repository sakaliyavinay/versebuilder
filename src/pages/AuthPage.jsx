import { useState } from "react";
import { Sparkles, Mail, Lock, User, AtSign, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppRouter } from "../router/Router";
import { PlatformNav } from "../components/navigation/PlatformNav";

export const AuthPage = ({ initialMode = "login" }) => {
  const { login, signup } = useAuth();
  const { navigate } = useAppRouter();

  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Please enter your name.");
        if (!email.trim()) throw new Error("Please enter your email.");
        await signup({ name, email, password, username });
      } else {
        await login({ email, password });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <PlatformNav />

      <main className="auth-main-container">
        <div className="auth-card">
          <div className="auth-card-head">
            <div className="auth-icon-badge">
              <Sparkles size={24} className="text-accent" />
            </div>
            <h2>{mode === "signup" ? "Create Your Creator Account" : "Log In to VerseBuilder"}</h2>
            <p>
              {mode === "signup"
                ? "Sign up to create, customize, and publish your own portfolio."
                : "Welcome back! Enter your details to continue to your dashboard."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tab-row">
            <button
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="auth-error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="editor-form-group">
                <label className="editor-label">Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!username && e.target.value) {
                        setUsername(
                          e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                        );
                      }
                    }}
                    className="editor-input"
                    required
                  />
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div className="editor-form-group">
                <label className="editor-label">Public Handle (/u/&lt;handle&gt;)</label>
                <div className="input-with-icon">
                  <AtSign size={16} />
                  <input
                    type="text"
                    placeholder="alex-rivera"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                    }
                    className="editor-input"
                  />
                </div>
              </div>
            )}

            <div className="editor-form-group">
              <label className="editor-label">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="editor-input"
                  required
                />
              </div>
            </div>

            <div className="editor-form-group">
              <label className="editor-label">Password</label>
              <div className="input-with-icon">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <span>{loading ? "Processing..." : mode === "signup" ? "Create Free Account" : "Sign In"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
