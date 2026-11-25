import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Globe,
  Layers,
  Palette,
  Play,
  Share2,
  Zap,
  Shield,
  MessageSquare,
} from "lucide-react";
import { TEMPLATES } from "../templates/TemplateRegistry";
import { useAppRouter } from "../router/Router";
import { useAuth } from "../context/AuthContext";
import { PlatformNav } from "../components/navigation/PlatformNav";
import { GlobalFooter } from "../components/common/GlobalFooter";

export const LandingPage = () => {
  const { navigate } = useAppRouter();
  const { user } = useAuth();
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState(TEMPLATES[0]);

  return (
    <div className="landing-page-shell">
      <PlatformNav />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <h1 className="landing-hero-title">
            Transform Your Work Into a <span className="highlight-text">Published Portfolio</span> Anyone Can View.
          </h1>

          <div className="landing-hero-actions">
            <button
              className="landing-btn landing-btn-primary"
              onClick={() => navigate(user ? "/dashboard" : "/signup")}
            >
              <span>{user ? "Go to My Dashboard" : "Create Your Portfolio Free"}</span>
              <ArrowRight size={18} />
            </button>

            {user && (
              <button
                className="landing-btn landing-btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                <Layers size={18} />
                <span>Manage My Portfolios</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 8 Distinct Templates Showcase */}
      <section className="landing-templates-section">
        <div className="landing-container">
          <div className="landing-section-head">
            <div className="badge-tag">8 Visual Styles</div>
            <h2>Curated Designer Templates</h2>
            <p>
              Choose from 8 distinct layout architectures, typographic styles, and visual rhythms
              tailored for creators, designers, and video editors.
            </p>
          </div>

          <div className="landing-templates-grid">
            {TEMPLATES.map((tmpl) => (
              <div
                className={`landing-template-card ${
                  selectedTemplatePreview.id === tmpl.id ? "active" : ""
                }`}
                key={tmpl.id}
                onClick={() => setSelectedTemplatePreview(tmpl)}
              >
                <div
                  className="landing-template-visual"
                  style={{ background: tmpl.previewBg }}
                >
                  <div className="tmpl-pill">{tmpl.badge}</div>
                  <div className="tmpl-category">{tmpl.category}</div>
                </div>

                <div className="landing-template-info">
                  <div className="tmpl-title-row">
                    <h3>{tmpl.name}</h3>
                    <span
                      className="tmpl-color-dot"
                      style={{ backgroundColor: tmpl.accentColor }}
                    />
                  </div>
                  <p className="tmpl-tagline">{tmpl.tagline}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="landing-template-preview-banner">
            <div className="preview-banner-text">
              <span className="preview-tag">Currently Selected:</span>
              <h3>{selectedTemplatePreview.name}</h3>
              <p>{selectedTemplatePreview.description}</p>
            </div>
            <button
              className="landing-btn landing-btn-primary"
              onClick={() => navigate(user ? "/dashboard" : "/signup")}
            >
              Start With This Template
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="landing-features-section">
        <div className="landing-container">
          <div className="landing-section-head">
            <div className="badge-tag">Platform Features</div>
            <h2>Everything You Need in a Creator SaaS</h2>
          </div>

          <div className="landing-features-grid">
            <div className="feature-card">
              <div className="feature-icon icon-yellow">
                <Globe size={24} />
              </div>
              <h3>Unique Public URL & Publishing</h3>
              <p>
                Get your own clean link like <code>/u/yourname</code>. Publish with one click, or keep your
                work in private draft mode while perfecting it.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-blue">
                <Video size={24} />
              </div>
              <h3>High-Impact Photos & Videos</h3>
              <p>
                Upload photos and videos with automatic compression. Built-in cinematic video playback and
                full-screen photo lightbox modals for visitors.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-purple">
                <Layers size={24} />
              </div>
              <h3>Real-Time Live Preview</h3>
              <p>
                Preview your edits live on Desktop, Tablet, and Mobile viewport frames as you type. No
                guessing how it will look on phones.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-green">
                <Palette size={24} />
              </div>
              <h3>Dynamic Re-Rendering</h3>
              <p>
                Switch between all 8 templates instantly. Your Name, Bio, Skills, Photos, and Videos
                re-render cleanly without ever having to re-enter content.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-red">
                <Shield size={24} />
              </div>
              <h3>Multi-User Auth & Ownership</h3>
              <p>
                Protected routes ensure only you can edit your own portfolio. Sign up, sign in, manage
                multiple portfolios, and keep your data private.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-orange">
                <MessageSquare size={24} />
              </div>
              <h3>Contact & Discord Integration</h3>
              <p>
                Per-user contact details, WhatsApp links, Discord presence badge, and visitor inquiry forms
                that dispatch directly to your Discord channel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="landing-cta-banner">
        <div className="landing-container">
          <div className="cta-box">
            <h2>Ready to publish your creator portfolio?</h2>
            <p>Join creators using VerseBuilder to stand out and win high-value clients.</p>
            <div className="cta-actions">
              <button
                className="landing-btn landing-btn-primary"
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
              >
                <span>{user ? "Open Dashboard" : "Sign Up Free"}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Compliance Footer */}
      <GlobalFooter />
    </div>
  );
};
