import { LEGAL_CONFIG } from "../lib/legalConfig";
import { useAppRouter } from "../router/Router";
import { PlatformNav } from "../components/navigation/PlatformNav";
import { ArrowLeft, Mail } from "lucide-react";
import { GlobalFooter } from "../components/common/GlobalFooter";

export const TermsOfServicePage = () => {
  const { navigate } = useAppRouter();

  return (
    <div className="legal-page-shell">
      <PlatformNav />

      <main className="legal-page-main">
        <div className="legal-page-container">
          <button className="legal-back-btn" onClick={() => navigate("/")} style={{ marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          <h1>Terms of Service</h1>
          <p className="legal-last-updated">Last updated: {LEGAL_CONFIG.lastUpdated}</p>

          <p>
            Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using <strong>{LEGAL_CONFIG.platformName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;the Platform&rdquo;).
            By accessing our service, registering an account, or publishing a portfolio, you agree to be bound by these Terms.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or accessing {LEGAL_CONFIG.platformName}, you affirm that you are at least {LEGAL_CONFIG.minimumAge} years old and have the legal capacity to enter into these Terms.
            If you do not agree with any part of these Terms, you must discontinue use of the platform immediately.
          </p>

          <h2>2. Account Registration &amp; Security</h2>
          <p>
            To build and publish portfolios, you must create an account. You are responsible for:
          </p>
          <ul>
            <li>Providing accurate, truthful registration information.</li>
            <li>Maintaining the confidentiality of your login credentials and authentication tokens.</li>
            <li>All activities, updates, and uploads that occur under your account.</li>
            <li>Promptly notifying us if you suspect unauthorized access or security breaches of your account.</li>
          </ul>

          <h2>3. User Content &amp; Ownership</h2>
          <p>
            <strong>You retain 100% intellectual property ownership of all content you upload</strong> &mdash; including photographs, motion reels, showcase videos, written project descriptions, logos, and biography text.
          </p>
          <p>
            By publishing a portfolio to a public URL (such as <code>/u/yourhandle</code>), you grant {LEGAL_CONFIG.platformName} a non-exclusive, worldwide, royalty-free license to store, process, transcode, cache, and transmit your published media and content solely for the purpose of operating, hosting, and publicly displaying your portfolio as requested by you.
          </p>
          <p>
            You represent and warrant that you own or have obtained all necessary licenses, copyrights, model releases, and permissions for any media you upload.
          </p>

          <h2>4. Acceptable Use &amp; Community Guidelines</h2>
          <p>
            You agree not to use the platform for unlawful, harmful, or abusive activities.
            Prohibited behavior includes hosting copyright-infringing works, distributing malicious links, sending spam through inquiry forms or Discord webhooks, or impersonating other creators.
            For full guidelines, please review our <a onClick={() => navigate("/acceptable-use")}>Acceptable Use Policy</a>.
          </p>

          <h2>5. Platform Availability &amp; Modifications</h2>
          <p>
            We strive to provide uninterrupted uptime and fast loading speeds for all hosted portfolios.
            However, the platform is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis.
            We reserve the right to modify, update, enhance, or temporarily suspend features for maintenance or infrastructure improvements without prior notice.
          </p>

          <h2>6. Platform Intellectual Property</h2>
          <p>
            The software, visual builder interface, template designs, icons, layout architectures, branding, and platform logos are the proprietary intellectual property of {LEGAL_CONFIG.copyrightHolder}.
            You may not decompile, reverse-engineer, scrape, clone, or redistribute the platform codebase or core template system.
          </p>

          <h2>7. Account Suspension &amp; Termination</h2>
          <p>
            You may stop using our service or delete your account at any time.
            We reserve the right to suspend or permanently terminate accounts, unpublish portfolios, or remove media that violate these Terms, infringe upon third-party copyrights, or engage in abusive behavior.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {LEGAL_CONFIG.copyrightHolder} and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages &mdash; including loss of profits, data, client opportunities, or business reputation &mdash; arising from your use of or inability to use the platform.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of {LEGAL_CONFIG.companyLocation}, without regard to conflict of law principles.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please reach out to:
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
