import { useState } from "react";
import {
  Plus,
  Edit3,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  CopyPlus,
  Sparkles,
  Globe,
  Clock,
  CheckCircle2,
  Layout,
  Film,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";
import { useAppRouter } from "../router/Router";
import { TEMPLATES, getTemplateById } from "../templates/TemplateRegistry";
import { PlatformNav } from "../components/navigation/PlatformNav";
import { GlobalFooter } from "../components/common/GlobalFooter";
import { openAccountSettings } from "../components/common/accountSettingsEvents";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { userPortfolios, createPortfolio, deletePortfolio, duplicatePortfolio } = usePortfolio();
  const { navigate } = useAppRouter();

  const [copiedId, setCopiedId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("dark-futuristic");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  if (!user) {
    return (
      <div className="landing-page-shell">
        <PlatformNav />
        <div className="auth-required-box">
          <Sparkles size={36} className="text-accent" />
          <h2>Sign In to Access Your Dashboard</h2>
          <p>Please log in or create an account to manage your portfolios.</p>
          <button className="landing-btn landing-btn-primary" onClick={() => navigate("/login")}>
            Log In Now
          </button>
        </div>
      </div>
    );
  }

  const handleCopy = (portfolio) => {
    const url = `${window.location.origin}/u/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(portfolio.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const created = await createPortfolio({
        title: newTitle || `${user.name}'s Portfolio`,
        templateId: selectedTemplate,
      });
      if (created?.id) {
        setIsCreateModalOpen(false);
        setNewTitle("");
        navigate(`/builder/${created.id}`);
      } else {
        setCreateError("Portfolio created but could not open it. Please refresh the page.");
      }
    } catch (err) {
      setCreateError(err.message || "Failed to create portfolio. Check your connection or Supabase setup.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePortfolio(id);
    }
  };

  return (
    <div className="dashboard-shell">
      <PlatformNav />

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Dashboard Header */}
          <div className="dashboard-header-row">
            <div>
              <span className="dash-eyebrow">Creator Dashboard</span>
              <h1 className="dash-title">Welcome back, {user.name}</h1>
              <p className="dash-subtitle">
                Manage your portfolios, edit media items, change templates, and share your public links.
              </p>
            </div>

            <div className="dash-header-action-group">
              <button
                className="dash-btn dash-btn-settings"
                onClick={() => openAccountSettings()}
                title="Edit account profile, avatar, and password"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="dash-user-avatar-sm" />
                ) : (
                  <Edit3 size={16} />
                )}
                <span>Edit Profile</span>
              </button>

              <button
                className="dash-create-btn"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={18} />
                <span>Create New Portfolio</span>
              </button>
            </div>
          </div>

          {/* User Portfolio Cards Grid */}
          <div className="dash-portfolios-section">
            <div className="dash-section-bar">
              <h2>My Portfolios ({userPortfolios.length})</h2>
            </div>

            {userPortfolios.length === 0 ? (
              <div className="dash-empty-state">
                <Layout size={40} />
                <h3>No portfolios created yet</h3>
                <p>Click the button below to create your very first portfolio in seconds.</p>
                <button
                  className="dash-create-btn"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus size={16} /> Create My First Portfolio
                </button>
              </div>
            ) : (
              <div className="dash-portfolios-grid">
                {userPortfolios.map((portfolio) => {
                  const tmpl = getTemplateById(portfolio.templateId);
                  const isCopied = copiedId === portfolio.id;
                  const publicUrl = `${window.location.origin}/u/${portfolio.slug}`;

                  return (
                    <div className="dash-portfolio-card" key={portfolio.id}>
                      <div className="dash-card-header">
                        <div className="dash-card-badge-row">
                          <span
                            className={`dash-status-pill ${
                              portfolio.isPublished ? "published" : "draft"
                            }`}
                          >
                            {portfolio.isPublished ? (
                              <>
                                <CheckCircle2 size={12} /> Published
                              </>
                            ) : (
                              <>
                                <Clock size={12} /> Draft
                              </>
                            )}
                          </span>

                          <span className="dash-template-badge" style={{ borderColor: tmpl.accentColor }}>
                            {tmpl.name}
                          </span>
                        </div>

                        <h3 className="dash-card-title">{portfolio.title}</h3>
                        <p className="dash-card-headline">{portfolio.profile?.headline}</p>
                      </div>

                      <div className="dash-card-meta">
                        <div className="dash-slug-row">
                          <Globe size={14} />
                          <span className="dash-slug-text">/u/{portfolio.slug}</span>
                        </div>

                        <div className="dash-stats-row">
                          <span>{portfolio.media?.length || 0} Media Items</span>
                          <span>•</span>
                          <span>{portfolio.skills?.length || 0} Skills</span>
                        </div>
                      </div>

                      <div className="dash-card-actions">
                        <button
                          className="dash-btn dash-btn-edit"
                          onClick={() => navigate(`/builder/${portfolio.id}`)}
                        >
                          <Edit3 size={15} />
                          <span>Edit in Builder</span>
                        </button>

                        {portfolio.isPublished && (
                          <a
                            href={`/u/${portfolio.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="dash-btn dash-btn-live"
                            title="Open live site in new tab"
                          >
                            <ExternalLink size={15} />
                            <span>View Live</span>
                          </a>
                        )}

                        <button
                          className="dash-btn dash-btn-copy"
                          onClick={() => handleCopy(portfolio)}
                          disabled={!portfolio.isPublished}
                          title={portfolio.isPublished ? "Copy Public Link" : "Publish to copy link"}
                        >
                          {isCopied ? <Check size={15} className="text-green" /> : <Copy size={15} />}
                        </button>

                        <button
                          className="dash-btn dash-btn-dup"
                          onClick={() => duplicatePortfolio(portfolio.id)}
                          title="Duplicate Portfolio"
                        >
                          <CopyPlus size={15} />
                        </button>

                        <button
                          className="dash-btn dash-btn-del"
                          onClick={() => handleDelete(portfolio.id, portfolio.title)}
                          title="Delete Portfolio"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <GlobalFooter />

      {/* Create New Portfolio Modal */}
      {isCreateModalOpen && (
        <div className="create-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="create-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="create-modal-head">
              <h2>Create New Portfolio</h2>
              <p>Give your portfolio a title and choose a starting visual template.</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="create-modal-form">
              <div className="editor-form-group">
                <label className="editor-label">Portfolio Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Creator Showcase 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="editor-input"
                  required
                />
              </div>

              <div className="editor-form-group">
                <label className="editor-label">Select Starting Template</label>
                <div className="create-template-selector">
                  {TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className={`create-tmpl-option ${
                        selectedTemplate === tmpl.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                    >
                      <span
                        className="tmpl-dot"
                        style={{ backgroundColor: tmpl.accentColor }}
                      />
                      <strong>{tmpl.name}</strong>
                      <small>{tmpl.category}</small>
                    </div>
                  ))}
                </div>
              </div>

              {createError && (
                <div className="create-modal-error">
                  ⚠️ {createError}
                </div>
              )}

              <div className="create-modal-actions">
                <button
                  type="button"
                  className="dash-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button type="submit" className="dash-create-btn" disabled={creating}>
                  {creating ? "Creating…" : "Create & Open Builder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
