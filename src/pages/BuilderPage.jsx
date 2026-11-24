import { useState, useEffect } from "react";
import {
  User,
  Zap,
  Film,
  Layout,
  Share2,
  Lock,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";
import { useAppRouter } from "../router/Router";
import { BuilderHeader } from "../components/builder/BuilderHeader";
import { ProfileEditor } from "../components/builder/ProfileEditor";
import { SkillsEditor } from "../components/builder/SkillsEditor";
import { MediaManager } from "../components/builder/MediaManager";
import { TemplatePicker } from "../components/builder/TemplatePicker";
import { ContactEditor } from "../components/builder/ContactEditor";
import { PublishModal } from "../components/builder/PublishModal";
import { LivePreviewFrame } from "../components/preview/LivePreviewFrame";

export const BuilderPage = () => {
  const { user } = useAuth();
  const { currentRoute, navigate } = useAppRouter();
  const { loadPortfolio, activePortfolio, userPortfolios } = usePortfolio();

  const [activeTab, setActiveTab] = useState("profile");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  const portfolioId = currentRoute.portfolioId;

  useEffect(() => {
    if (!user) {
      setAuthError("not_logged_in");
      setLoading(false);
      return;
    }

    let targetId = portfolioId;
    if (!targetId && userPortfolios.length > 0) {
      targetId = userPortfolios[0].id;
    }

    if (targetId) {
      // Don't re-fetch from disk if this portfolio is already the active working copy
      if (activePortfolio?.id === targetId) {
        setAuthError(null);
        setLoading(false);
        return;
      }

      const res = loadPortfolio(targetId);
      if (res?.error === "unauthorized") {
        setAuthError("unauthorized");
      } else if (!res?.portfolio) {
        setAuthError("not_found");
      } else {
        setAuthError(null);
      }
    } else {
      setAuthError("no_portfolios");
    }

    setLoading(false);
  }, [user, portfolioId, userPortfolios, loadPortfolio, activePortfolio?.id]);

  if (loading) {
    return (
      <div className="builder-loading-screen">
        <Sparkles size={32} className="animate-spin text-accent" />
        <p>Loading portfolio builder...</p>
      </div>
    );
  }

  // Protected route handling
  if (authError === "not_logged_in") {
    return (
      <div className="builder-protected-shell">
        <div className="protected-box">
          <Lock size={40} className="text-accent" />
          <h2>Authentication Required</h2>
          <p>You must be signed in to access the portfolio editor.</p>
          <div className="protected-actions">
            <button className="landing-btn landing-btn-primary" onClick={() => navigate("/login")}>
              Log In
            </button>
            <button className="landing-btn landing-btn-secondary" onClick={() => navigate("/")}>
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authError === "unauthorized") {
    return (
      <div className="builder-protected-shell">
        <div className="protected-box">
          <Lock size={40} className="text-red" />
          <h2>Protected Portfolio</h2>
          <p>
            You are signed in as <strong>{user?.name}</strong>, but this portfolio belongs to another user.
            Only the owner can edit their portfolio.
          </p>
          <div className="protected-actions">
            <button className="landing-btn landing-btn-primary" onClick={() => navigate("/dashboard")}>
              Go to My Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authError === "no_portfolios" || !activePortfolio) {
    return (
      <div className="builder-protected-shell">
        <div className="protected-box">
          <Layout size={40} className="text-accent" />
          <h2>No Portfolio Selected</h2>
          <p>Please create or select a portfolio from your dashboard.</p>
          <button className="landing-btn landing-btn-primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-app-shell">
      {/* Builder Top Bar */}
      <BuilderHeader
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        showPreviewPane={showPreviewPane}
        setShowPreviewPane={setShowPreviewPane}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="builder-workspace-layout">
        {/* Left Side: Navigation Tabs & Active Editor */}
        <div className={`builder-editor-pane ${!showPreviewPane ? "is-expanded" : ""}`}>
          <div className="builder-tabs-bar">
            <button
              className={`builder-tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={16} />
              <span>Identity & Bio</span>
            </button>

            <button
              className={`builder-tab-btn ${activeTab === "skills" ? "active" : ""}`}
              onClick={() => setActiveTab("skills")}
            >
              <Zap size={16} />
              <span>Skills & Stack</span>
            </button>

            <button
              className={`builder-tab-btn ${activeTab === "media" ? "active" : ""}`}
              onClick={() => setActiveTab("media")}
            >
              <Film size={16} />
              <span>Media ({activePortfolio.media?.length || 0})</span>
            </button>

            <button
              className={`builder-tab-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              <MessageSquare size={16} />
              <span>Contact & Discord</span>
            </button>

            <button
              className={`builder-tab-btn ${activeTab === "template" ? "active" : ""}`}
              onClick={() => setActiveTab("template")}
            >
              <Layout size={16} />
              <span>Templates (8)</span>
            </button>
          </div>

          <div className="builder-editor-scroll-area">
            {activeTab === "profile" && <ProfileEditor />}
            {activeTab === "skills" && <SkillsEditor />}
            {activeTab === "media" && <MediaManager />}
            {activeTab === "contact" && <ContactEditor />}
            {activeTab === "template" && <TemplatePicker />}
          </div>
        </div>

        {/* Right Side: Live Interactive Real-Time Preview */}
        {showPreviewPane && (
          <div className="builder-preview-pane">
            <div className="preview-pane-header">
              <span className="live-pulse-dot" />
              <span className="preview-label">Live Interactive Preview</span>
              <span className="preview-device-badge">
                Viewport: {previewDevice.toUpperCase()}
              </span>
            </div>

            <div className="preview-frame-container">
              <LivePreviewFrame portfolio={activePortfolio} device={previewDevice} />
            </div>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
};
