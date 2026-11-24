import { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Eye,
  Check,
  Copy,
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Sparkles,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  Share2,
  AlertCircle,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { useAppRouter } from "../../router/Router";

export const BuilderHeader = ({
  previewDevice,
  setPreviewDevice,
  showPreviewPane,
  setShowPreviewPane,
  onOpenPublishModal,
  activeTab,
  setActiveTab,
}) => {
  const { activePortfolio, isDirty, isSaving, saveDraft, setPublishStatus } = usePortfolio();
  const { navigate } = useAppRouter();
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [saveErrorMsg, setSaveErrorMsg] = useState("");

  if (!activePortfolio) return null;

  const publicUrl = `${window.location.origin}/u/${activePortfolio.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = useCallback(async () => {
    try {
      setSaveErrorMsg("");
      await saveDraft();
      setJustSaved(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setSaveSuccessMsg(`Draft saved to storage at ${timeStr}`);
      setTimeout(() => {
        setJustSaved(false);
        setSaveSuccessMsg("");
      }, 3500);
    } catch (err) {
      setSaveErrorMsg(err.message || "Failed to save draft.");
      setTimeout(() => setSaveErrorMsg(""), 6000);
    }
  }, [saveDraft]);

  // Support Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSaveDraft]);

  return (
    <>
      <header className="builder-header">
        <div className="builder-header-left">
          <button
            className="builder-back-btn"
            onClick={() => navigate("/dashboard")}
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="builder-title-block">
            <h1 className="builder-portfolio-title">{activePortfolio.title}</h1>
            <div className="builder-meta-row">
              <span
                className={`builder-status-badge ${
                  activePortfolio.isPublished ? "is-published" : "is-draft"
                }`}
              >
                {activePortfolio.isPublished ? (
                  <>
                    <CheckCircle2 size={12} /> Published
                  </>
                ) : (
                  <>
                    <Clock size={12} /> Draft
                  </>
                )}
              </span>

              <span className="builder-slug-preview">
                <Globe size={12} />
                /u/<strong>{activePortfolio.slug}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Center Device & Preview Switchers */}
        <div className="builder-header-center">
          <div className="builder-device-selector">
            <button
              className={`device-btn ${previewDevice === "desktop" ? "active" : ""}`}
              onClick={() => setPreviewDevice("desktop")}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
            <button
              className={`device-btn ${previewDevice === "tablet" ? "active" : ""}`}
              onClick={() => setPreviewDevice("tablet")}
              title="Tablet View"
            >
              <Tablet size={16} />
            </button>
            <button
              className={`device-btn ${previewDevice === "mobile" ? "active" : ""}`}
              onClick={() => setPreviewDevice("mobile")}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
          </div>

          <button
            className={`builder-toggle-preview-btn ${showPreviewPane ? "active" : ""}`}
            onClick={() => setShowPreviewPane(!showPreviewPane)}
          >
            <Eye size={15} />
            <span>{showPreviewPane ? "Hide Preview" : "Show Preview"}</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="builder-header-right">
          {activePortfolio.isPublished && (
            <button
              className="builder-action-btn builder-copy-btn"
              onClick={handleCopyLink}
              title="Copy Public Link"
            >
              {copied ? <Check size={15} className="text-green" /> : <Copy size={15} />}
              <span>{copied ? "Link Copied!" : "Copy Link"}</span>
            </button>
          )}

          {activePortfolio.isPublished && (
            <a
              href={`/u/${activePortfolio.slug}`}
              target="_blank"
              rel="noreferrer"
              className="builder-action-btn builder-visit-btn"
              title="Open Live Portfolio in new tab"
            >
              <ExternalLink size={15} />
              <span>View Live</span>
            </a>
          )}

          <button
            className={`builder-action-btn builder-save-btn ${
              justSaved ? "just-saved" : isDirty ? "needs-save" : ""
            }`}
            onClick={handleSaveDraft}
            disabled={isSaving}
            title="Save draft changes (Ctrl+S)"
          >
            {justSaved ? (
              <CheckCircle2 size={15} className="text-green" />
            ) : (
              <Save size={15} />
            )}
            <span>
              {isSaving
                ? "Saving..."
                : justSaved
                ? "Saved!"
                : isDirty
                ? "Save Draft *"
                : "Saved"}
            </span>
          </button>

          <button
            className="builder-publish-btn"
            onClick={onOpenPublishModal}
          >
            <Sparkles size={16} />
            <span>{activePortfolio.isPublished ? "Publishing Settings" : "Publish Live"}</span>
          </button>
        </div>
      </header>

      {/* Floating Save Toast Notifications */}
      {saveSuccessMsg && (
        <div className="builder-save-toast save-toast-success">
          <CheckCircle2 size={18} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="builder-save-toast save-toast-error">
          <AlertCircle size={18} />
          <span>{saveErrorMsg}</span>
        </div>
      )}
    </>
  );
};
