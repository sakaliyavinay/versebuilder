import { LEGAL_CONFIG } from "../../lib/legalConfig";
import { useAppRouter } from "../../router/Router";
import { openCookiePreferences } from "./CookieConsentBanner";

export const GlobalFooter = () => {
  const { navigate } = useAppRouter();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-footer">
      <div className="global-footer-inner">
        <div className="global-footer-brand">
          <strong>{LEGAL_CONFIG.platformName}</strong> &mdash; &copy; {currentYear}{" "}
          {LEGAL_CONFIG.copyrightHolder}. All rights reserved.
        </div>

        <div className="global-footer-links">
          <button onClick={() => navigate("/privacy")}>Privacy Policy</button>
          <button onClick={() => navigate("/terms")}>Terms of Service</button>
          <button onClick={() => navigate("/cookies")}>Cookie Policy</button>
          <button onClick={() => navigate("/acceptable-use")}>Acceptable Use</button>
          <button onClick={() => openCookiePreferences()} title="Customize your cookie consent settings">
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
};

export const PublicPortfolioFooter = () => {
  const { navigate } = useAppRouter();

  return (
    <div className="public-portfolio-footer">
      <span>Built with {LEGAL_CONFIG.platformName}</span>
      <span className="pf-sep">&middot;</span>
      <a
        href={`mailto:${LEGAL_CONFIG.reportAbuseEmail}?subject=Report%20Abuse`}
        title="Report copyright infringement or policy violation"
      >
        Report
      </a>
      <span className="pf-sep">&middot;</span>
      <button onClick={() => navigate("/privacy")}>Privacy</button>
      <span className="pf-sep">&middot;</span>
      <button onClick={() => navigate("/terms")}>Terms</button>
    </div>
  );
};
