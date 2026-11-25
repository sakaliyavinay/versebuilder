import { useState, useRef } from "react";
import {
  X,
  Globe,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export const PublishModal = ({ isOpen, onClose }) => {
  const { activePortfolio, updateActivePortfolio, setPublishStatus, validateSlug, saveDraft } =
    usePortfolio();

  const [slugInput, setSlugInput] = useState(activePortfolio?.slug || "");
  const [slugError, setSlugError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const slugCheckRequest = useRef(0);

  if (!isOpen || !activePortfolio) return null;

  const publicUrl = `${window.location.origin}/u/${activePortfolio.slug}`;

  const handleSlugChange = async (val) => {
    const requestId = ++slugCheckRequest.current;
    const clean = val
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");
    setSlugInput(clean);

    if (clean.length < 2 || clean.length > 40) {
      setSlugError("Handle must be between 2 and 40 characters.");
      return;
    }

    try {
      const isAvail = await validateSlug(clean, activePortfolio.id);
      if (requestId !== slugCheckRequest.current) return;
      setSlugError(isAvail ? "" : "This handle is already taken. Please pick another.");
    } catch {
      if (requestId === slugCheckRequest.current) {
        setSlugError("Could not verify this handle. Check your connection and try again.");
      }
    }
  };

  const handleSaveSlug = async () => {
    if (slugError || !slugInput) return;
    try {
      const isAvailable = await validateSlug(slugInput, activePortfolio.id);
      if (!isAvailable) {
        setSlugError("This handle is already taken. Please pick another.");
        return;
      }
      updateActivePortfolio({ slug: slugInput });
      await saveDraft({ ...activePortfolio, slug: slugInput });
      setIsSuccessMessage(true);
      setTimeout(() => setIsSuccessMessage(false), 2500);
    } catch {
      setSlugError("Could not save this handle. Check your connection and try again.");
    }
  };

  const handleTogglePublish = async () => {
    const nextStatus = !activePortfolio.isPublished;
    await setPublishStatus(nextStatus);
    if (nextStatus) {
      setIsSuccessMessage(true);
      setTimeout(() => setIsSuccessMessage(false), 3000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="publish-modal-overlay" onClick={onClose}>
      <div className="publish-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="publish-modal-header">
          <div className="publish-modal-title-row">
            <Sparkles size={20} className="text-accent" />
            <h3>Publish & Share Portfolio</h3>
          </div>
          <button className="publish-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="publish-modal-body">
          {/* Status Alert Banner */}
          <div
            className={`publish-status-banner ${
              activePortfolio.isPublished ? "banner-published" : "banner-draft"
            }`}
          >
            <div className="banner-icon-col">
              {activePortfolio.isPublished ? (
                <CheckCircle2 size={24} className="text-green" />
              ) : (
                <Lock size={24} className="text-muted" />
              )}
            </div>
            <div className="banner-content-col">
              <h4>
                {activePortfolio.isPublished
                  ? "Your Portfolio is Live on the Internet!"
                  : "Portfolio is currently in Private Draft Mode"}
              </h4>
              <p>
                {activePortfolio.isPublished
                  ? "Anyone with your link can view your portfolio, watch your videos, and inspect your work."
                  : "Only you can see this portfolio right now. Click 'Publish Now' to make it live for visitors."}
              </p>
            </div>
          </div>

          {/* Shareable Public URL Box */}
          <div className="publish-url-box">
            <label className="editor-label">Public Portfolio URL</label>
            <div className="url-copy-row">
              <div className="url-display">
                <Globe size={16} />
                <span>{publicUrl}</span>
              </div>
              <button
                type="button"
                className="url-copy-btn"
                onClick={handleCopyLink}
                disabled={!activePortfolio.isPublished}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Custom Slug Editor */}
          <div className="publish-slug-editor">
            <label className="editor-label">Customize Your Public Handle (/u/&lt;handle&gt;)</label>
            <div className="slug-edit-row">
              <span className="slug-prefix">{window.location.origin}/u/</span>
              <input
                type="text"
                value={slugInput}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="editor-input slug-input"
                placeholder="your-unique-handle"
              />
              <button
                type="button"
                className="slug-save-btn"
                onClick={handleSaveSlug}
                disabled={Boolean(slugError) || slugInput === activePortfolio.slug}
              >
                Update Handle
              </button>
            </div>
            {slugError ? (
              <span className="slug-error-msg">
                <AlertCircle size={14} /> {slugError}
              </span>
            ) : (
              <span className="slug-valid-msg">
                <CheckCircle2 size={14} /> This public handle is available.
              </span>
            )}
          </div>

          {/* Success toast inside modal */}
          {isSuccessMessage && (
            <div className="publish-success-pill">
              <Sparkles size={16} /> Changes saved successfully!
            </div>
          )}
        </div>

        <div className="publish-modal-footer">
          <div className="footer-left">
            {activePortfolio.isPublished && (
              <a
                href={`/u/${activePortfolio.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-visit-live"
              >
                <ExternalLink size={16} /> Open Live Site
              </a>
            )}
          </div>

          <div className="footer-right">
            <button
              type="button"
              className={`publish-toggle-btn ${
                activePortfolio.isPublished ? "btn-unpublish" : "btn-publish-now"
              }`}
              onClick={handleTogglePublish}
            >
              {activePortfolio.isPublished ? "Revert to Private Draft" : "Publish to Internet Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
