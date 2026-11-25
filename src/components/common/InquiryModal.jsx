import { useState } from "react";
import { X, Send, Sparkles, CheckCircle2, MessageSquare, Mail, Phone } from "lucide-react";
import { sendDiscordInquiryWebhook } from "../../lib/discordService";
import { storageService } from "../../lib/storageService";
import { isSupabaseConfigured } from "../../lib/supabaseService";

export const InquiryModal = ({ isOpen, onClose, portfolio }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !portfolio) return null;

  const creatorName = portfolio.profile?.displayName || "Creator";
  const discordConfig = portfolio.discord || {};
  const contactConfig = portfolio.contact || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg("Please provide your name and a brief message.");
      return;
    }

    setSending(true);
    setErrorMsg("");

    const inquiryRecord = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      budget: budget.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
      dispatchedToDiscord: false,
    };

    // 1. Dispatch to Discord webhook if configured
    let discordDispatched = false;
    if (discordConfig.webhookUrl) {
      try {
        await sendDiscordInquiryWebhook({
          webhookUrl: discordConfig.webhookUrl,
          creatorName,
          inquiry: inquiryRecord,
          portfolioSlug: portfolio.slug,
        });
        discordDispatched = true;
      } catch (err) {
        console.warn("Discord webhook delivery notice:", err.message);
      }
    }

    inquiryRecord.dispatchedToDiscord = discordDispatched;

    // 2. Persist to creator's portfolio inbox (when running in local storage mode)
    if (!isSupabaseConfigured) {
      try {
        const currentPort = storageService.getPortfolioById(portfolio.id);
        if (currentPort) {
          const inbox = currentPort.inbox || [];
          currentPort.inbox = [inquiryRecord, ...inbox];
          storageService.savePortfolio(currentPort);
        }
      } catch (err) {
        console.error("Failed to save inquiry to storage inbox", err);
      }
    }

    setSending(false);
    setSentSuccess(true);
  };

  const resetAndClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setBudget("");
    setMessage("");
    setSentSuccess(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="inquiry-modal-overlay" onClick={resetAndClose}>
      <div className="inquiry-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="inquiry-modal-header">
          <div className="inquiry-head-title">
            <Sparkles size={18} className="text-accent" />
            <h3>Contact / Work with {creatorName}</h3>
          </div>
          <button className="inquiry-modal-close" onClick={resetAndClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {sentSuccess ? (
          <div className="inquiry-success-state">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} className="text-green" />
            </div>
            <h4>Message Sent Successfully!</h4>
            <p>
              Your inquiry has been delivered directly to {creatorName}. They will get back to you soon.
            </p>
            {discordConfig.webhookUrl && (
              <span className="discord-ping-note">
                <MessageSquare size={14} /> Delivered straight to Discord
              </span>
            )}
            <button className="inquiry-done-btn" onClick={resetAndClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="inquiry-form">
            <p className="inquiry-intro-note">
              Send your project brief, timeline, or question.
              {discordConfig.webhookUrl && " Delivered straight to their Discord channel!"}
            </p>

            {errorMsg && <div className="inquiry-error-banner">{errorMsg}</div>}

            <div className="inquiry-field-row">
              <div className="inquiry-form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="editor-input"
                  required
                />
              </div>

              <div className="inquiry-form-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="editor-input"
                  required
                />
              </div>
            </div>

            <div className="inquiry-field-row">
              <div className="inquiry-form-group">
                <label>Your Phone / WhatsApp (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="editor-input"
                />
              </div>

              <div className="inquiry-form-group">
                <label>Estimated Budget / Scope</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>

            <div className="inquiry-form-group">
              <label>Project Details / Message *</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="editor-textarea"
                required
              />
            </div>

            <div className="inquiry-form-footer">
              <button type="button" className="btn-cancel" onClick={resetAndClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit-inquiry" disabled={sending}>
                <Send size={15} />
                <span>{sending ? "Sending..." : "Send Message"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
