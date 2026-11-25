import { LEGAL_CONFIG } from "../lib/legalConfig";
import { useAppRouter } from "../router/Router";
import { PlatformNav } from "../components/navigation/PlatformNav";
import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { GlobalFooter } from "../components/common/GlobalFooter";

export const PrivacyPolicyPage = () => {
  const { navigate } = useAppRouter();

  return (
    <div className="legal-page-shell">
      <PlatformNav />

      <main className="legal-page-main">
        <div className="legal-page-container">
          <button className="legal-back-btn" onClick={() => navigate("/")} style={{ marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          <h1>Privacy Policy</h1>
          <p className="legal-last-updated">Last updated: {LEGAL_CONFIG.lastUpdated}</p>

          <p>
            Welcome to <strong>{LEGAL_CONFIG.platformName}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Platform&rdquo;).
            We respect your privacy and are committed to protecting the personal information you share with us.
            This Privacy Policy explains how your data is collected, stored, used, and safeguarded when you use our multi-user portfolio builder and publishing service.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information necessary to provide our portfolio creation and hosting services:</p>
          <ul>
            <li><strong>Account Information:</strong> When you register, we collect your name, username (used for your custom URL <code>/u/yourname</code>), email address, and an encrypted password hash managed securely via authentication services.</li>
            <li><strong>Profile & Portfolio Content:</strong> Information you choose to add to your portfolios, including bio headlines, skills, career timelines, project titles, external links (GitHub, LinkedIn, Twitter/X, YouTube), and custom layout settings.</li>
            <li><strong>Uploaded Media:</strong> Images (avatars, portfolio hero banners, project screenshots) and videos (showreels, motion designs) uploaded to our secure content delivery partner (Cloudinary).</li>
            <li><strong>Contact & Integration Settings:</strong> Optional contact email addresses, phone numbers, WhatsApp indicators, and Discord webhook configurations that enable visitors to send inquiries to your Discord or inbox.</li>
            <li><strong>Usage & Device Data:</strong> Minimal, privacy-focused telemetry such as anonymous page visits, browser types, and referrer URLs via Vercel Analytics. We do not sell or track your browsing activity across other websites.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information solely to deliver and enhance the platform experience:</p>
          <ul>
            <li>To authenticate your identity and keep your account secure across sessions.</li>
            <li>To render, host, and display your public portfolio pages at <code>/u/yourname</code> when you choose to publish them.</li>
            <li>To route visitor inquiries to your specified Discord webhook or contact channel.</li>
            <li>To store your draft progress so you can return and edit your designs at any time.</li>
            <li>To maintain platform performance, troubleshoot bugs, and enforce our Acceptable Use Policy.</li>
          </ul>

          <h2>3. How Your Data Is Stored & Protected</h2>
          <p>
            Your account credentials, portfolio data, and settings are stored in high-reliability cloud databases with encrypted Row-Level Security (RLS).
            Uploaded media is hosted on globally distributed CDNs (Cloudinary) with optimized compression.
            Session tokens are kept in secure local browser storage to keep you logged in between sessions.
          </p>

          <h2>4. Data Sharing & Disclosure</h2>
          <p>
            <strong>We do not sell, rent, or monetize your personal data, contact information, or webhook URLs to third parties or advertisers under any circumstances.</strong>
          </p>
          <p>Your data is only shared in the following situations:</p>
          <ul>
            <li><strong>Public Portfolios:</strong> Content in published portfolios (your public display name, public bio, uploaded photos, videos, and public links) is intentionally viewable by anyone who visits your public link <code>/u/yourname</code>. Private drafts are restricted to your authenticated account.</li>
            <li><strong>Infrastructure Partners:</strong> Trusted service providers (database hosting, authentication, media CDN, and hosting infrastructure) strictly as needed to operate the service.</li>
            <li><strong>Legal Compliance:</strong> When required by valid law enforcement requests, court orders, or applicable regulations.</li>
          </ul>

          <h2>5. Your Rights & Data Control</h2>
          <p>You have full autonomy over your portfolio and account information:</p>
          <ul>
            <li><strong>Edit or Update:</strong> You can edit any portfolio field, change visual templates, replace media, or modify contact information directly in the Builder at any time.</li>
            <li><strong>Unpublish or Delete:</strong> You can unpublish your portfolio back to private draft status or delete a portfolio completely from your dashboard.</li>
            <li><strong>Account Deletion:</strong> You can request full deletion of your user account and all associated portfolios by contacting us at <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a>.</li>
          </ul>

          <h2>6. Cookies & Local Storage</h2>
          <p>
            We use essential local storage and session tokens for login authentication, and optional preference/analytics tokens.
            For detailed information on how cookies are used and how to customize your preferences, please see our dedicated <a onClick={() => navigate("/cookies")}>Cookie Policy</a>.
          </p>

          <h2>7. Children&rsquo;s Privacy</h2>
          <p>
            {LEGAL_CONFIG.platformName} is intended for creators and professionals aged {LEGAL_CONFIG.minimumAge} and older.
            We do not knowingly collect personal data from children under {LEGAL_CONFIG.minimumAge}. If you believe a child under this age has registered an account, please reach out to us for prompt removal.
          </p>

          <h2>8. Updates to This Policy</h2>
          <p>
            We may periodically update this Privacy Policy to reflect platform features or regulatory changes.
            The revised date will always be visible at the top of this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions, feedback, or data privacy requests regarding this policy, please reach out to our team at:
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
