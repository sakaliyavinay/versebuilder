import { Check, Sparkles, Layout, Palette } from "lucide-react";
import { TEMPLATES } from "../../templates/TemplateRegistry";
import { usePortfolio } from "../../context/PortfolioContext";

export const TemplatePicker = () => {
  const { activePortfolio, updateActivePortfolio } = usePortfolio();
  if (!activePortfolio) return null;

  const currentTemplateId = activePortfolio.templateId || "dark-futuristic";

  const handleSelectTemplate = (templateId) => {
    updateActivePortfolio({
      templateId: templateId,
    });
  };

  return (
    <div className="editor-tab-pane">
      <div className="editor-section-header">
        <h2>Choose Your Template</h2>
        <p>
          Switch between 8 visually distinct styles. Your existing profile, skills, photos, and videos will
          dynamically adapt without losing any data.
        </p>
      </div>

      <div className="templates-showcase-grid">
        {TEMPLATES.map((tmpl) => {
          const isSelected = tmpl.id === currentTemplateId;
          return (
            <div
              key={tmpl.id}
              className={`template-card-choice ${isSelected ? "is-selected" : ""}`}
              onClick={() => handleSelectTemplate(tmpl.id)}
            >
              <div
                className="template-card-preview-banner"
                style={{ background: tmpl.previewBg }}
              >
                <div className="template-card-mockup-elements">
                  <div className="mock-header" />
                  <div className="mock-grid">
                    <div className="mock-col" />
                    <div className="mock-col" />
                  </div>
                </div>

                <span className="template-badge-pill">{tmpl.badge}</span>
                {isSelected && (
                  <div className="template-selected-chip">
                    <Check size={14} /> Active
                  </div>
                )}
              </div>

              <div className="template-card-body">
                <div className="template-head-row">
                  <h3 className="template-name">{tmpl.name}</h3>
                  <span
                    className="template-color-dot"
                    style={{ backgroundColor: tmpl.accentColor }}
                    title={`Accent: ${tmpl.accentColor}`}
                  />
                </div>
                <p className="template-tagline">{tmpl.tagline}</p>
                <p className="template-description">{tmpl.description}</p>

                <div className="template-card-footer">
                  <span className="template-category-tag">{tmpl.category}</span>
                  <button
                    type="button"
                    className={`template-apply-btn ${isSelected ? "selected" : ""}`}
                  >
                    {isSelected ? "Currently Applied" : "Apply Template"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
