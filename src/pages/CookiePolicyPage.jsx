import { LEGAL_CONFIG } from "../lib/legalConfig";
import { useAppRouter } from "../router/Router";
import { PlatformNav } from "../components/navigation/PlatformNav";
import { ArrowLeft, Cookie, Mail, Sliders } from "lucide-react";
import { GlobalFooter } from "../components/common/GlobalFooter";
import { openCookiePreferences } from "../components/common/CookieConsentBanner";

export const CookiePolicyPage = () => {
  const { navigate } = useAppRouter();

  return (
    <div className="legal-page-shell">
      <PlatformNav />

      <main className="legal-page-main">
        <div className="legal-page-container">
          <button className="legal-back-btn" onClick={() => navigate("/")} style={{ marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          <h1>Cookie Policy</h1>
          <p className="legal-last-updated">Last updated: {LEGAL_CONFIG.lastUpdated}</p>

          <p>
            This Cookie Policy explains how <strong>{LEGAL_CONFIG.platformName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;) uses cookies and similar storage technologies (such as browser <code>localStorage</code>) to recognize you when you visit our website and portfolio builder.
          </p>

          <h2>1. What Are Cookies &amp; Browser Storage?</h2>
          <p>
            Cookies and browser local storage are small text files or key-value entries placed on your computer or mobile device when you interact with web applications.
            They are widely used to make websites work efficiently, remember your signed-in state, and maintain user preferences across page reloads.
          </p>

          <h2>2. Categories of Cookies We Use</h2>
          <p>
            We classify the cookies and storage technologies used on {LEGAL_CONFIG.platformName} into three simple categories:
          </p>

          <table className="legal-cookie-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Storage Name / Provider</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Essential / Necessary</strong></td>
                <td>
                  <code>versebuilder_supabase_session_v1</code><br />
                  <code>versebuilder_active_session_v1</code>
                </td>
                <td>
                  Maintains your secure authentication session, security tokens, and active user profile across builder navigations.
                </td>
                <td><span style={{ color: "#22c55e", fontWeight: "600" }}>Always Active</span></td>
              </tr>
              <tr>
                <td><strong>Preferences &amp; Consent</strong></td>
                <td>
                  <code>versebuilder_cookie_consent_v1</code>
                </td>
                <td>
                  Remembers your cookie consent choices so you are not repeatedly prompted on returning visits.
                </td>
                <td><span style={{ color: "#f5b84b", fontWeight: "600" }}>Customizable</span></td>
              </tr>
              <tr>
                <td><strong>Performance &amp; Analytics</strong></td>
                <td>
                  Vercel Analytics (cookieless telemetry)
                </td>
                <td>
                  Measures aggregated platform traffic, popular template usage, and page load performance without recording personal identifiers.
                </td>
                <td><span style={{ color: "#f5b84b", fontWeight: "600" }}>Customizable</span></td>
              </tr>
            </tbody>
          </table>

          <h2>3. Third-Party Integrations</h2>
          <p>We work with trusted infrastructure providers that may place technical session cookies or tokens:</p>
          <ul>
            <li><strong>Supabase:</strong> Provides secure authentication token management and encrypted cloud storage for your portfolio documents.</li>
            <li><strong>Cloudinary:</strong> Delivers global content delivery network (CDN) caching for optimized image and video asset streaming.</li>
            <li><strong>Vercel:</strong> Hosts platform static bundles, serverless routing, and anonymous performance analytics.</li>
          </ul>

          <h2>4. Managing Your Cookie Preferences</h2>
          <p>
            You can modify or withdraw your cookie consent at any time directly on this website:
          </p>
          <div style={{ margin: "20px 0" }}>
            <button
              className="cookie-btn cookie-btn-customize"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
              onClick={() => openCookiePreferences()}
            >
              <Sliders size={16} /> Open Cookie Preferences Manager
            </button>
          </div>
          <p>
            Alternatively, most web browsers allow you to control cookies through their browser settings.
            Please note that disabling essential cookies or clearing <code>localStorage</code> may sign you out of your account and disrupt portfolio saving.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions regarding our use of cookies or local storage, please reach out to:
          </p>
          <p>
            <a href={`mailto:${LEGAL_CONFIG.supportEmail}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Mail size={16} /> {LEGAL_CONFIG.supportEmail}
            </a>
          </p>

          <button className="legal-back-btn" onClick={() => navigate("/")} style={{ marginTop: "40px" }}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};
