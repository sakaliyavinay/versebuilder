import { useEffect, useState } from "react";
import { renderTemplate } from "../templates/TemplateRegistry";
import { storageService } from "../lib/storageService";
import { useAuth } from "../context/AuthContext";
import { useAppRouter } from "../router/Router";
import { PublishedPill } from "../components/navigation/PublishedPill";
import { Lock, Sparkles, ArrowLeft, Edit3, Globe, Copy, Check } from "lucide-react";

export const PublicPortfolioPage = () => {
  const { currentRoute, navigate } = useAppRouter();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = currentRoute.slug;

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const found = storageService.getPortfolioBySlug(slug);
    setPortfolio(found);
    setLoading(false);

    // Record analytics view if portfolio exists and is published
    if (found && found.isPublished) {
      storageService.recordAnalyticsView(slug);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="public-loading-screen">
        <Sparkles size={32} className="animate-spin text-accent" />
        <p>Loading creator portfolio...</p>
      </div>
    );
  }

  // Not found — clean error, no fallback to any default user
  if (!portfolio) {
    return (
      <div className="public-error-screen">
        <div className="error-card-center">
          <Globe size={48} className="text-muted" />
          <h1>Portfolio Not Found</h1>
          <p>
            We could not find a portfolio at <strong>/u/{slug}</strong>. The handle might have been changed or
            the portfolio does not exist yet.
          </p>
          <div className="error-btn-row">
            <button className="landing-btn landing-btn-primary" onClick={() => navigate("/")}>
              <ArrowLeft size={16} /> Return to Home
            </button>
            <button className="landing-btn landing-btn-secondary" onClick={() => navigate("/signup")}>
              Create Your Own Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === portfolio.userId;

  // If unpublished & visitor is not the owner
  if (!portfolio.isPublished && !isOwner) {
    return (
      <div className="public-error-screen">
        <div className="error-card-center">
          <Lock size={48} className="text-accent" />
          <h1>Private Portfolio</h1>
          <p>
            This portfolio is currently in private draft mode and has not been published yet.
          </p>
          <div className="error-btn-row">
            <button className="landing-btn landing-btn-primary" onClick={() => navigate("/")}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="public-portfolio-wrapper">
      {/* If owner is viewing their own portfolio, show management bar */}
      {isOwner && (
        <div className="owner-top-bar">
          <div className="owner-bar-left">
            <span className="owner-badge">Owner Preview</span>
            <span className="owner-status">
              Status: <strong>{portfolio.isPublished ? "Live Published" : "Private Draft"}</strong>
            </span>
          </div>

          <div className="owner-bar-right">
            <button
              className="owner-btn owner-copy-btn"
              onClick={handleCopyLink}
            >
              {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              <span>{copied ? "Link Copied" : "Copy Link"}</span>
            </button>

            <button
              className="owner-btn owner-edit-btn"
              onClick={() => navigate(`/builder/${portfolio.id}`)}
            >
              <Edit3 size={14} />
              <span>Edit in Builder</span>
            </button>
          </div>
        </div>
      )}

      {/* Render the clean chosen template */}
      <div className="public-template-canvas">
        {renderTemplate(portfolio.templateId, {
          portfolio,
          isPreview: false,
        })}
      </div>

      {/* Subtle bottom badge for platform discovery */}
      <PublishedPill portfolio={portfolio} />
    </div>
  );
};
