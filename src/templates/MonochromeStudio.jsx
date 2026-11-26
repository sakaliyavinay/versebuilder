import { useState } from "react";
import { Play, ArrowUpRight, Plus, Terminal, Send, Mail, Phone } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";
import { activatePortfolioCta } from "./portfolioCta";

export const MonochromeStudio = ({ portfolio, isPreview = false }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const {
    profile = {},
    skills = [],
    media = [],
    stats = [],
    timeline = [],
    socials = {},
    contact = {},
    discord = {},
    themeSettings = {},
  } = portfolio;

  const videos = media.filter((m) => m.type === "video");
  const photos = media.filter((m) => m.type === "photo");

  const cleanPhone = (contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to initiate an inquiry.")}`
    : null;

  return (
    <div className="mono-theme">
      {/* Studio Header Bar */}
      <header className="mono-header">
        <div className="mono-header-col mono-col-name">
          <span className="mono-mono-label">[PRACTICE]</span>
          <h1 className="mono-title">{profile.displayName}</h1>
        </div>
        <div className="mono-header-col mono-col-status">
          <span className="mono-mono-label">[STATUS]</span>
          <span className="mono-val">{profile.statusBadge || "OPEN TO COMMISSIONS"}</span>
        </div>
        <div className="mono-header-col mono-col-contact">
          <span className="mono-mono-label">[DISPATCH]</span>
          <button className="mono-btn-inquiry" onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}>
            [{themeSettings.ctaText || "INITIATE_INQUIRY"}]
          </button>
        </div>
      </header>

      {/* Hero Manifesto */}
      <section className="mono-manifesto">
        <div className="mono-manifesto-grid">
          <div className="mono-manifesto-left">
            <span className="mono-mono-label">// 01 STATEMENT</span>
            <h2 className="mono-statement">{profile.headline}</h2>
            <p className="mono-bio">{profile.bio}</p>

            {/* Discord node */}
            {discord.enabled !== false && (discord.username || discord.userId) && (
              <div className="mono-discord-wrapper">
                <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
              </div>
            )}
          </div>
          <div className="mono-manifesto-right">
            {profile.avatarUrl && (
              <div className="mono-portrait-box">
                <img src={profile.avatarUrl} alt={profile.displayName} className="mono-img-bw" />
                <span className="mono-img-tag">[FIG. 01 — ARCHIVE RECORD]</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      {stats.length > 0 && (
        <section className="mono-stats-strip">
          {stats.map((s, idx) => (
            <div className="mono-stat-cell" key={idx}>
              <span className="mono-stat-idx">#{idx + 1}</span>
              <strong className="mono-stat-val">{s.value}</strong>
              <span className="mono-stat-lbl">{s.label}</span>
            </div>
          ))}
        </section>
      )}

      {/* Index of Works */}
      <section className="mono-works-section">
        <div className="mono-section-bar">
          <span>// 02 REPOSITORY / WORKS INDEX</span>
          <span>COUNT: {media.length}</span>
        </div>

        <div className="mono-works-index">
          {media.map((item, idx) => {
            const isVid = item.type === "video";
            return (
              <article
                className="mono-work-row"
                key={item.id || idx}
                onClick={() => {
                  if (isVid) {
                    setActiveVideo(item);
                  } else {
                    const pIdx = photos.findIndex((p) => p.id === item.id);
                    setLightboxIndex(pIdx >= 0 ? pIdx : 0);
                  }
                }}
              >
                <div className="mono-work-idx">
                  [{(idx + 1).toString().padStart(2, "0")}]
                </div>
                <div className="mono-work-preview-thumb">
                  <img src={item.thumbnailUrl || item.url} alt={item.title} className="mono-thumb-img" data-video-poster={isVid ? "true" : undefined} />
                  {isVid && (
                    <div className="mono-play-indicator">
                      <Play size={14} fill="#000" />
                    </div>
                  )}
                </div>
                <div className="mono-work-details">
                  <div className="mono-work-title-wrap">
                    <h3>{item.title}</h3>
                    <span className="mono-format-tag">{item.category || (isVid ? "VIDEO" : "STILL")}</span>
                  </div>
                  {item.caption && <p className="mono-work-caption">{item.caption}</p>}
                </div>
                <div className="mono-work-action">
                  <ArrowUpRight size={18} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Technical Schema / Skills */}
      {skills.length > 0 && (
        <section className="mono-schema-section">
          <div className="mono-section-bar">
            <span>// 03 TECHNICAL CAPACITIES</span>
            <span>INDEXED</span>
          </div>

          <div className="mono-schema-grid">
            {skills.map((skill, idx) => (
              <div className="mono-schema-card" key={skill.id || skill.name}>
                <div className="mono-schema-header">
                  <span className="mono-schema-idx">CAP_{idx + 1}</span>
                  <span className="mono-schema-rate">{skill.level}%</span>
                </div>
                <h4>{skill.name}</h4>
                <div className="mono-schema-track">
                  <div className="mono-schema-bar" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Chronological Log / Timeline */}
      {timeline.length > 0 && (
        <section className="mono-log-section">
          <div className="mono-section-bar">
            <span>// 04 CHRONOLOGICAL LOG</span>
            <span>SYSTEM CHRONO</span>
          </div>

          <div className="mono-log-table">
            {timeline.map((step, idx) => (
              <div className="mono-log-entry" key={idx}>
                <span className="mono-log-year">[{step.year}]</span>
                <div className="mono-log-body">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Studio Terminus / Contact Footer */}
      <footer className="mono-footer">
        <div className="mono-footer-grid">
          <div>
            <span className="mono-mono-label">{contact.eyebrow || "// 05 TERMINUS"}</span>
            <h3>{contact.heading || "START COLLABORATION"}</h3>
            {contact.subheading && <p className="mono-footer-sub">{contact.subheading}</p>}
            <div className="mono-contact-actions">
              <button className="mono-email-btn" onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}>
                {contact.buttonText || "SEND DISPATCH / INQUIRY"}
              </button>

              {contact.showEmail !== false && contact.email && (
                <a href={`mailto:${contact.email}`} className="mono-link-inline">
                  MAIL: {contact.email}
                </a>
              )}

              {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mono-link-inline">
                  WHATSAPP: {contact.phone}
                </a>
              )}
            </div>
          </div>
          <div className="mono-footer-networks">
            <span className="mono-mono-label">[EXTERNAL NODES]</span>
            {discord.enabled !== false && discord.username && <span>DISCORD: {discord.username}</span>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer">TWITTER</a>}
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer">YOUTUBE</a>}
            {socials.github && <a href={socials.github} target="_blank" rel="noreferrer">GITHUB</a>}
            {socials.website && <a href={socials.website} target="_blank" rel="noreferrer">WEBSITE</a>}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isInquiryOpen && (
        <InquiryModal
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          portfolio={portfolio}
        />
      )}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      {lightboxIndex !== null && (
        <MediaLightbox
          items={photos}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </div>
  );
};
