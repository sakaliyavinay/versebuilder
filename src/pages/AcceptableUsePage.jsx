import { LEGAL_CONFIG } from "../lib/legalConfig";
import { useAppRouter } from "../router/Router";
import { PlatformNav } from "../components/navigation/PlatformNav";
import { ArrowLeft, AlertTriangle, ShieldAlert, Mail } from "lucide-react";
import { GlobalFooter } from "../components/common/GlobalFooter";

export const AcceptableUsePage = () => {
  const { navigate } = useAppRouter();

  return (
    <div className="legal-page-shell">
      <PlatformNav />

      <main className="legal-page-main">
        <div className="legal-page-container">
          <button className="legal-back-btn" onClick={() => navigate("/")} style={{ marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          <h1>Acceptable Use &amp; Content Policy</h1>
          <p className="legal-last-updated">Last updated: {LEGAL_CONFIG.lastUpdated}</p>

          <p>
            <strong>{LEGAL_CONFIG.platformName}</strong> is designed to empower digital creators, designers, videographers, and developers to showcase their creative portfolios professionally.
            To maintain a safe, trustworthy, and high-quality environment for all users and visitors, every member must adhere to this Acceptable Use &amp; Content Policy.
          </p>

          <h2>1. Prohibited Content</h2>
          <p>You may not upload, embed, host, or publish any portfolio containing:</p>
          <ul>
            <li><strong>Illegal Material:</strong> Content promoting criminal activity, illicit goods, fraud, financial scams, or money laundering schemes.</li>
            <li><strong>Copyright Infringement:</strong> Photos, showcase videos, music, artwork, or branding for which you do not hold valid intellectual property rights, licenses, or explicit creator permissions.</li>
            <li><strong>Malware &amp; Phishing:</strong> Deceptive URLs, disguised download links, credential harvesting portals, or links directing visitors to harmful exploit kits or malware.</li>
            <li><strong>Explicit or Adult Content:</strong> Sexually explicit imagery, pornography, or non-consensual sexual depictions.</li>
            <li><strong>Hate Speech &amp; Harassment:</strong> Content that threatens, defames, bullies, harasses, or promotes violence or discrimination against individuals or groups based on race, ethnicity, religion, disability, age, nationality, or sexual orientation.</li>
            <li><strong>Impersonation:</strong> Creating portfolios that fraudulently pose as another person, agency, or corporation without authorized consent.</li>
          </ul>

          <h2>2. Prohibited Platform Behavior</h2>
          <p>Users must not engage in abusive platform actions, including:</p>
          <ul>
            <li>Configuring Discord webhooks or inquiry forms to spam external channels or harass third parties.</li>
            <li>Using automated crawlers, scrapers, or bot scripts to flood platform endpoints or inflate visit analytics.</li>
            <li>Attempting to bypass database row-level security (RLS), probe server vulnerabilities, or access other users&rsquo; private drafts.</li>
            <li>Hoarding or squatting public portfolio slugs (e.g. reserving hundreds of unused brand slugs for resale).</li>
          </ul>

          <h2>3. DMCA &amp; Copyright Infringement Claims</h2>
          <p>
            {LEGAL_CONFIG.platformName} complies with copyright protection standards and promptly investigates notices of alleged infringement.
            If you are a copyright owner or authorized agent and believe content on a published portfolio violates your rights, please submit a formal takedown notice to:
          </p>
          <p>
            <a href={`mailto:${LEGAL_CONFIG.reportAbuseEmail}?subject=DMCA%20Takedown%20Notice`} style={{ fontWeight: "600" }}>
              {LEGAL_CONFIG.reportAbuseEmail}
            </a>
          </p>
          <p>Your notification must include:</p>
          <ul>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>The exact public portfolio URL (e.g., <code>https://versebuilder.vercel.app/u/username</code>) where the infringing material is located.</li>
            <li>Your full name, address, telephone number, and email address.</li>
            <li>A statement of good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement made under penalty of perjury that the information in your notice is accurate and that you are authorized to act on behalf of the owner.</li>
          </ul>

          <h2>4. Reporting Violations &amp; Abusive Portfolios</h2>
          <p>
            If you encounter a public portfolio that violates our content standards (such as phishing links, hate speech, or harassment), please report it immediately to our moderation team:
          </p>
          <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "10px", padding: "16px 20px", margin: "20px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f87171", fontWeight: "600", marginBottom: "6px" }}>
              <ShieldAlert size={18} /> Abuse &amp; Safety Desk
            </div>
            <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem" }}>
              Email: <a href={`mailto:${LEGAL_CONFIG.reportAbuseEmail}?subject=Report%20Abusive%20Portfolio`} style={{ color: "#f87171" }}>{LEGAL_CONFIG.reportAbuseEmail}</a>
              <br />
              Please include the public portfolio link and a brief explanation of the violation. Reports are reviewed within 24&ndash;48 hours.
            </p>
          </div>

          <h2>5. Enforcement &amp; Penalties</h2>
          <p>
            We investigate reports promptly. In cases of verified violations, we reserve the right to:
          </p>
          <ul>
            <li>Issue a written warning requiring prompt removal of violating assets.</li>
            <li>Immediately unpublish or disable public access to the offending portfolio.</li>
            <li>Permanently ban the user account and delete all associated hosted media without refund or compensation.</li>
            <li>Refer severe violations (e.g., child exploitation, terror threats, active cybercrime) to relevant law enforcement agencies.</li>
          </ul>

          <button className="legal-back-btn" onClick={() => navigate("/")} style={{ marginTop: "40px" }}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};
