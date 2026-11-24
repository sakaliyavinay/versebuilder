import { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, MessageSquare, Radio } from "lucide-react";
import { fetchDiscordPresence } from "../../lib/discordService";

export const DiscordPresenceBadge = ({ discord = {}, onOpenInquiry = null }) => {
  const [copied, setCopied] = useState(false);
  const [presence, setPresence] = useState(null);

  const {
    username,
    userId,
    showPresence = true,
    inviteUrl,
    enabled = true,
  } = discord || {};

  useEffect(() => {
    if (!userId || !showPresence) {
      setPresence(null);
      return;
    }

    let isMounted = true;
    fetchDiscordPresence(userId).then((res) => {
      if (isMounted && res) {
        setPresence(res);
      }
    });

    const interval = setInterval(() => {
      fetchDiscordPresence(userId).then((res) => {
        if (isMounted && res) setPresence(res);
      });
    }, 30000); // 30s poll

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId, showPresence]);

  if (!enabled || (!username && !userId)) return null;

  const displayHandle = username || presence?.username || "Discord";
  const liveStatus = presence?.status || "offline";

  const handleCopyTag = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="discord-presence-card">
      <div className="discord-badge-main">
        {/* Discord Logo / Avatar */}
        <div className="discord-icon-wrapper">
          {presence?.avatarUrl ? (
            <img src={presence.avatarUrl} alt="Discord" className="discord-user-avatar" />
          ) : (
            <div className="discord-default-icon">
              <MessageSquare size={16} />
            </div>
          )}
          {showPresence && userId && (
            <span
              className={`discord-status-dot status-${liveStatus}`}
              title={presence?.statusLabel || "Status"}
            />
          )}
        </div>

        {/* User Handle & Activity */}
        <div className="discord-text-col">
          <div className="discord-handle-row">
            <strong className="discord-handle">{displayHandle}</strong>
            {showPresence && presence?.statusLabel && (
              <span className={`discord-status-pill status-${liveStatus}`}>
                {presence.statusLabel}
              </span>
            )}
          </div>
          {presence?.activity ? (
            <span className="discord-activity-line">
              <Radio size={11} className="pulse-icon" /> {presence.activity}
            </span>
          ) : (
            <span className="discord-subtext">Discord Contact</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="discord-badge-actions">
        <button
          type="button"
          className="discord-action-btn discord-copy-btn"
          onClick={handleCopyTag}
          title="Copy Discord Username"
        >
          {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
          <span>{copied ? "Copied Tag!" : "Copy Tag"}</span>
        </button>

        {inviteUrl && (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="discord-action-btn discord-server-btn"
            title="Open Discord Profile or Server"
          >
            <ExternalLink size={14} />
            <span>Join/Open</span>
          </a>
        )}

        {onOpenInquiry && (
          <button
            type="button"
            className="discord-action-btn discord-inquiry-btn"
            onClick={onOpenInquiry}
            title="Send direct message to creator's Discord channel"
          >
            <span>Send Inquiry</span>
          </button>
        )}
      </div>
    </div>
  );
};
