import { useState, useEffect } from "react";
import { LEGAL_CONFIG } from "../../lib/legalConfig";
import { useAppRouter } from "../../router/Router";
import { Cookie, X, Check, ShieldCheck, Sliders } from "lucide-react";

export const COOKIE_CONSENT_KEY = "versebuilder_cookie_consent_v1";

export const openCookiePreferences = () => {
  window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
};

export const CookieConsentBanner = () => {
  const { navigate } = useAppRouter();
  const [showBanner, setShowBanner] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [preferences, setPreferences] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) {
        setShowBanner(true);
      } else {
        const parsed = JSON.parse(stored);
        if (parsed) {
          setPreferences(Boolean(parsed.preferences));
          setAnalytics(Boolean(parsed.analytics));
        }
      }
    } catch {
      setShowBanner(true);
    }

    const handleOpenPrefs = () => {
      setShowPrefs(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenPrefs);
    return () => {
      window.removeEventListener("open-cookie-preferences", handleOpenPrefs);
    };
  }, []);

  const saveConsent = (prefVal, analyticsVal) => {
    try {
      const consentData = {
        essential: true,
        preferences: Boolean(prefVal),
        analytics: Boolean(analyticsVal),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    } catch {
      // Ignore localStorage write failures
    }
    setPreferences(prefVal);
    setAnalytics(analyticsVal);
    setShowBanner(false);
    setShowPrefs(false);
  };

  return (
    <>
      {/* Non-intrusive Cookie Consent Banner on First Visit */}
      {showBanner && !showPrefs && (
        <div className="cookie-banner" role="region" aria-label="Cookie consent">
          <div className="cookie-banner-inner">
            <div className="cookie-banner-text">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#f5b84b", fontWeight: "600", marginRight: "8px" }}>
                <Cookie size={16} /> Cookie Notice:
              </span>
              <span>
                {LEGAL_CONFIG.platformName} uses essential cookies to keep you signed in, along with optional analytics to improve performance.{" "}
                <button
                  onClick={() => navigate("/cookies")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f5b84b",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  Learn more in our Cookie Policy
                </button>.
              </span>
            </div>

            <div className="cookie-banner-actions">
              <button
                className="cookie-btn cookie-btn-accept"
                onClick={() => saveConsent(true, true)}
              >
                Accept All
              </button>
              <button
                className="cookie-btn cookie-btn-reject"
                onClick={() => saveConsent(false, false)}
              >
                Essential Only
              </button>
              <button
                className="cookie-btn cookie-btn-customize"
                onClick={() => setShowPrefs(true)}
              >
                Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Manager Modal */}
      {showPrefs && (
        <div className="cookie-prefs-modal-overlay" onClick={() => setShowPrefs(false)}>
          <div className="cookie-prefs-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2>Cookie Preferences</h2>
              <button
                onClick={() => setShowPrefs(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p>
              Customize your cookie choices on {LEGAL_CONFIG.platformName}. Essential cookies cannot be turned off as they are required for security and authentication.
            </p>

            <div className="cookie-pref-row">
              <div className="cookie-pref-info">
                <h3>Essential Cookies &amp; Storage</h3>
                <p>Required for account login, security sessions, and saving your drafts. Always active.</p>
                <span className="cookie-always-on">Always Active</span>
              </div>
              <label className="cookie-toggle">
                <input type="checkbox" checked disabled />
                <span className="cookie-toggle-slider" />
              </label>
            </div>

            <div className="cookie-pref-row">
              <div className="cookie-pref-info">
                <h3>Preference Cookies</h3>
                <p>Remembers your builder layout choices, template previews, and UI preferences.</p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                />
                <span className="cookie-toggle-slider" />
              </label>
            </div>

            <div className="cookie-pref-row">
              <div className="cookie-pref-info">
                <h3>Performance &amp; Analytics</h3>
                <p>Collects anonymous, cookieless telemetry via Vercel Analytics to help us diagnose performance bottlenecks.</p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span className="cookie-toggle-slider" />
              </label>
            </div>

            <div className="cookie-prefs-actions">
              <button
                className="cookie-btn cookie-btn-reject"
                onClick={() => setShowPrefs(false)}
              >
                Cancel
              </button>
              <button
                className="cookie-btn cookie-btn-accept"
                onClick={() => saveConsent(preferences, analytics)}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
