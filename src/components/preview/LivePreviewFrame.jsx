import { renderTemplate } from "../../templates/TemplateRegistry";

export const LivePreviewFrame = ({ portfolio, device = "desktop" }) => {
  if (!portfolio) {
    return (
      <div className="preview-empty-state">
        <p>No active portfolio to preview.</p>
      </div>
    );
  }

  return (
    <div className={`preview-viewport-shell device-${device}`}>
      <div className="preview-browser-frame">
        <div className="browser-chrome-bar">
          <div className="browser-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="browser-address-bar">
            <span>https://versebuilder.site/u/{portfolio.slug}</span>
          </div>
        </div>

        <div className="preview-canvas-content">
          {renderTemplate(portfolio.templateId, {
            portfolio,
            isPreview: true,
          })}
        </div>
      </div>
    </div>
  );
};
