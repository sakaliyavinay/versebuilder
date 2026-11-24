import { useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Share2,
  AtSign,
  Link,
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Radio,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { testDiscordWebhook } from "../../lib/discordService";

const COUNTRY_CODES = [
  { code: "+1", country: "US / Canada" },
  { code: "+91", country: "India" },
  { code: "+44", country: "United Kingdom" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
  { code: "+971", country: "UAE" },
  { code: "+55", country: "Brazil" },
  { code: "+65", country: "Singapore" },
  { code: "+41", country: "Switzerland" },
];

export const ContactEditor = () => {
  const { activePortfolio, updateActivePortfolio } = usePortfolio();
  if (!activePortfolio) return null;

  const { contact = {}, discord = {}, socials = {} } = activePortfolio;

  // Discord test status state
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null); // { success: boolean, msg: string }

  const updateContactField = (field, value) => {
    updateActivePortfolio((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const updateDiscordField = (field, value) => {
    updateActivePortfolio((prev) => ({
      ...prev,
      discord: {
        ...prev.discord,
        [field]: value,
      },
    }));
  };

  const updateSocialField = (field, value) => {
    updateActivePortfolio((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value,
      },
    }));
  };

  const handleTestWebhook = async () => {
    if (!discord.webhookUrl) {
      setWebhookStatus({
        success: false,
        msg: "Please paste your Discord Webhook URL first.",
      });
      return;
    }

    setTestingWebhook(true);
    setWebhookStatus(null);

    try {
      await testDiscordWebhook(
        discord.webhookUrl,
        activePortfolio.profile?.displayName || "Creator"
      );
      setWebhookStatus({
        success: true,
        msg: "Test notification sent! Check your Discord channel.",
      });
    } catch (err) {
      setWebhookStatus({
        success: false,
        msg: err.message || "Failed to reach Discord webhook.",
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="editor-tab-pane">
      <div className="editor-section-header">
        <h2>Contact, Mobile & Discord Integration</h2>
        <p>
          Configure your public contact information, phone/WhatsApp, and personal Discord webhook & live presence.
        </p>
      </div>

      {/* 0. Contact Card Section Copy */}
      <div className="editor-card">
        <h3 className="editor-card-title">
          <MessageSquare size={16} className="text-accent" /> Contact Section Headline & Call To Action
        </h3>
        <p className="editor-card-sub">
          Customize the headline, subtitle, and action button text that visitors see in your bottom contact card.
        </p>

        <div className="editor-form-group">
          <label className="editor-label">Eyebrow / Kicker Tag</label>
          <input
            type="text"
            placeholder="e.g. READY FOR YOUR NEXT PROJECT?"
            value={contact.eyebrow ?? ""}
            onChange={(e) => updateContactField("eyebrow", e.target.value)}
            className="editor-input"
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Main Headline *</label>
          <input
            type="text"
            placeholder="e.g. Let's build something unforgettable together."
            value={contact.heading ?? ""}
            onChange={(e) => updateContactField("heading", e.target.value)}
            className="editor-input"
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Subtitle / Availability Description</label>
          <textarea
            rows={3}
            placeholder="e.g. Available for commissions, video editing, and full visual creative packages."
            value={contact.subheading ?? ""}
            onChange={(e) => updateContactField("subheading", e.target.value)}
            className="editor-textarea"
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Inquiry CTA Button Label</label>
          <input
            type="text"
            placeholder="e.g. Send Project Brief"
            value={contact.buttonText ?? ""}
            onChange={(e) => updateContactField("buttonText", e.target.value)}
            className="editor-input"
          />
        </div>
      </div>

      {/* 1. Public Email & Phone Information */}
      <div className="editor-card">
        <h3 className="editor-card-title">
          <Mail size={16} className="text-accent" /> Direct Contact Details
        </h3>
        <p className="editor-card-sub">
          These details belong exclusively to your portfolio and will never be shared with other users.
        </p>

        {/* Public Email */}
        <div className="contact-row-box">
          <div className="contact-input-left">
            <label className="editor-label">Public Contact Email</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={contact.email || ""}
                onChange={(e) => updateContactField("email", e.target.value)}
                className="editor-input"
              />
            </div>
          </div>

          <div className="contact-toggle-right">
            <label className="switch-toggle-label">
              <input
                type="checkbox"
                checked={contact.showEmail !== false}
                onChange={(e) => updateContactField("showEmail", e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-text">
                {contact.showEmail !== false ? "Visible Publicly" : "Hidden"}
              </span>
            </label>
          </div>
        </div>

        {/* Mobile / Phone Number */}
        <div className="contact-row-box">
          <div className="contact-input-left">
            <label className="editor-label">Mobile / Phone Number</label>
            <div className="phone-composite-input">
              <select
                value={contact.countryCode || "+1"}
                onChange={(e) => {
                  const cc = e.target.value;
                  updateContactField("countryCode", cc);
                  updateContactField("phone", `${cc} ${contact.rawPhone || ""}`);
                }}
                className="country-code-select"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.country})
                  </option>
                ))}
              </select>

              <div className="input-with-icon phone-raw-wrap">
                <Phone size={16} />
                <input
                  type="tel"
                  placeholder="e.g. 555-0199"
                  value={contact.rawPhone || ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    updateContactField("rawPhone", raw);
                    updateContactField("phone", `${contact.countryCode || "+1"} ${raw}`);
                  }}
                  className="editor-input"
                />
              </div>
            </div>
          </div>

          <div className="contact-toggle-right">
            <label className="switch-toggle-label">
              <input
                type="checkbox"
                checked={Boolean(contact.showPhone)}
                onChange={(e) => updateContactField("showPhone", e.target.checked)}
              />
              <span className="toggle-slider" />
              <span className="toggle-text">
                {contact.showPhone ? "Visible Publicly" : "Hidden"}
              </span>
            </label>
          </div>
        </div>

        {/* WhatsApp & Preferred Method */}
        <div className="contact-sub-toggles">
          <label className="featured-checkbox-label">
            <input
              type="checkbox"
              checked={contact.isWhatsApp !== false}
              onChange={(e) => updateContactField("isWhatsApp", e.target.checked)}
            />
            <span>Enable 1-Click WhatsApp Direct Chat button on public portfolio</span>
          </label>

          <div className="preferred-method-row">
            <label className="editor-label">Preferred Contact Channel</label>
            <select
              value={contact.preferredMethod || "email"}
              onChange={(e) => updateContactField("preferredMethod", e.target.value)}
              className="editor-input compact-select"
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="discord">Discord</option>
              <option value="phone">Direct Phone Call</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Discord Webhook & Presence Integration */}
      <div className="editor-card discord-card-highlight">
        <div className="card-header-with-action">
          <div>
            <h3 className="editor-card-title">
              <MessageSquare size={16} className="text-discord" /> Discord Integration (Per-User)
            </h3>
            <p className="editor-card-sub">
              Connect your personal Discord handle, live presence status, and channel webhook for visitor inquiries.
            </p>
          </div>

          <label className="switch-toggle-label">
            <input
              type="checkbox"
              checked={discord.enabled !== false}
              onChange={(e) => updateDiscordField("enabled", e.target.checked)}
            />
            <span className="toggle-slider" />
            <span className="toggle-text">{discord.enabled !== false ? "Enabled" : "Disabled"}</span>
          </label>
        </div>

        {discord.enabled !== false && (
          <div className="discord-config-fields">
            {/* Discord Username */}
            <div className="editor-form-group">
              <label className="editor-label">Discord Username / Handle</label>
              <div className="input-with-icon">
                <AtSign size={16} />
                <input
                  type="text"
                  placeholder="e.g. alexrivera or creator#0001"
                  value={discord.username || ""}
                  onChange={(e) => updateDiscordField("username", e.target.value)}
                  className="editor-input"
                />
              </div>
              <small className="field-hint">
                Shows a "Copy Discord Tag" button on your portfolio so clients can easily add you.
              </small>
            </div>

            {/* Discord User ID for Live Presence */}
            <div className="editor-form-group">
              <div className="label-with-tooltip">
                <label className="editor-label">Discord User ID (Optional - For Live Presence)</label>
                <span className="help-chip" title="Discord Developer Mode: Right-click your profile -> Copy User ID">
                  <HelpCircle size={13} />
                </span>
              </div>
              <div className="input-with-icon">
                <Radio size={16} />
                <input
                  type="text"
                  placeholder="e.g. 100000000000000001 (18-digit ID)"
                  value={discord.userId || ""}
                  onChange={(e) => updateDiscordField("userId", e.target.value)}
                  className="editor-input"
                />
              </div>
              <label className="sub-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(discord.showPresence)}
                  onChange={(e) => updateDiscordField("showPresence", e.target.checked)}
                />
                <span>Display live Online/Idle status badge on public portfolio (via Lanyard API)</span>
              </label>
            </div>

            {/* Discord Invite / Profile Link */}
            <div className="editor-form-group">
              <label className="editor-label">Discord Server or Profile Invite Link (Optional)</label>
              <div className="input-with-icon">
                <ExternalLink size={16} />
                <input
                  type="url"
                  placeholder="https://discord.gg/yourserver"
                  value={discord.inviteUrl || ""}
                  onChange={(e) => updateDiscordField("inviteUrl", e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>

            {/* Discord Webhook URL for Inquiries */}
            <div className="editor-form-group webhook-box">
              <label className="editor-label">
                Personal Discord Webhook URL (For Direct Inquiries)
              </label>
              <div className="webhook-input-row">
                <input
                  type="password"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discord.webhookUrl || ""}
                  onChange={(e) => updateDiscordField("webhookUrl", e.target.value)}
                  className="editor-input font-mono"
                />
                <button
                  type="button"
                  className="btn-test-webhook"
                  onClick={handleTestWebhook}
                  disabled={testingWebhook || !discord.webhookUrl}
                >
                  <Send size={14} />
                  <span>{testingWebhook ? "Testing..." : "Test Webhook"}</span>
                </button>
              </div>

              {webhookStatus && (
                <div
                  className={`webhook-feedback-alert ${
                    webhookStatus.success ? "status-success" : "status-error"
                  }`}
                >
                  {webhookStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{webhookStatus.msg}</span>
                </div>
              )}

              <small className="field-hint">
                Create a webhook in your Discord channel (Channel Settings → Integrations → Webhooks). When
                visitors submit a contact message on your portfolio, it pings your channel instantly!
              </small>
            </div>
          </div>
        )}
      </div>

      {/* 3. Social & Web Connections */}
      <div className="editor-card">
        <h3 className="editor-card-title">
          <Globe size={16} className="text-accent" /> Social & Creator Links
        </h3>

        <div className="editor-form-group">
          <label className="editor-label">Personal Website / Blog</label>
          <div className="input-with-icon">
            <Globe size={16} />
            <input
              type="url"
              placeholder="https://yourname.com"
              value={socials.website || ""}
              onChange={(e) => updateSocialField("website", e.target.value)}
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-form-group">
          <label className="editor-label">YouTube Channel</label>
          <div className="input-with-icon">
            <Share2 size={16} />
            <input
              type="url"
              placeholder="https://youtube.com/@channel"
              value={socials.youtube || ""}
              onChange={(e) => updateSocialField("youtube", e.target.value)}
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Twitter / X Profile</label>
          <div className="input-with-icon">
            <AtSign size={16} />
            <input
              type="url"
              placeholder="https://x.com/username"
              value={socials.twitter || ""}
              onChange={(e) => updateSocialField("twitter", e.target.value)}
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-form-group">
          <label className="editor-label">GitHub Profile</label>
          <div className="input-with-icon">
            <Link size={16} />
            <input
              type="url"
              placeholder="https://github.com/username"
              value={socials.github || ""}
              onChange={(e) => updateSocialField("github", e.target.value)}
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-form-group">
          <label className="editor-label">LinkedIn Profile</label>
          <div className="input-with-icon">
            <Link size={16} />
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={socials.linkedin || ""}
              onChange={(e) => updateSocialField("linkedin", e.target.value)}
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Instagram Profile</label>
          <div className="input-with-icon">
            <ExternalLink size={16} />
            <input
              type="url"
              placeholder="https://instagram.com/username"
              value={socials.instagram || ""}
              onChange={(e) => updateSocialField("instagram", e.target.value)}
              className="editor-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
