import { useState } from "react";
import { Play, Sparkles, Star, Zap, Mail, Phone, ArrowUpRight, Smile, Heart, Send } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";
import { activatePortfolioCta } from "./portfolioCta";

export const NeoBrutalist = ({ portfolio, isPreview = false }) => {
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
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your portfolio and want to work together!")}`
    : null;

  return (
    <div className="neo-theme">
      {/* Neo Banner */}
      <div className="neo-top-banner">
        <div className="neo-badge neo-badge-yellow">
          <Star size={16} fill="#000" />
          <span>PORTFOLIO PLATFORM // 2026</span>
        </div>
        {profile.statusBadge && (
          <div className="neo-badge neo-badge-pink">
            <Zap size={16} />
            <span>{profile.statusBadge}</span>
          </div>
        )}
      </div>

      {/* Neo Hero Section */}
      <section className="neo-hero">
        <div className="neo-hero-card">
          <div className="neo-hero-content">
            <span className="neo-pill-tag">{profile.tagline || "Creative Human"}</span>
            <h1 className="neo-name">{profile.displayName}</h1>
            <h2 className="neo-headline">{profile.headline}</h2>
            <p className="neo-bio">{profile.bio}</p>

            <div className="neo-actions">
              <button
                type="button"
                className="neo-btn neo-btn-main"
                onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}
              >
                <Send size={18} /> {themeSettings.ctaText || "Send Inquiry / Let's Work!"}
              </button>

              {contact.showEmail !== false && contact.email && (
                <a href={`mailto:${contact.email}`} className="neo-btn neo-btn-secondary">
                  <Mail size={18} /> Email
                </a>
              )}

              {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="neo-btn neo-btn-secondary">
                  <Phone size={18} /> WhatsApp
                </a>
              )}
            </div>

            {/* Discord Badge if enabled */}
            {discord.enabled !== false && (discord.username || discord.userId) && (
              <div className="neo-discord-slot">
                <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
              </div>
            )}
          </div>

          <div className="neo-hero-visual">
            <div className="neo-avatar-frame">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.displayName} className="neo-avatar-img" />
              ) : (
                <div className="neo-avatar-fallback">{profile.displayName?.charAt(0)}</div>
              )}
              <div className="neo-sticker">
                <Smile size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neo Stats Strip */}
      {stats.length > 0 && (
        <section className="neo-stats-strip">
          {stats.map((s, idx) => (
            <div className={`neo-stat-card neo-stat-color-${(idx % 4) + 1}`} key={idx}>
              <strong className="neo-stat-num">{s.value}</strong>
              <span className="neo-stat-txt">{s.label}</span>
            </div>
          ))}
        </section>
      )}

      {/* Neo Works Grid */}
      <section id="neo-work" className="neo-section">
        <div className="neo-sec-header">
          <h2 className="neo-sec-title">Selected Projects & Works</h2>
          <span className="neo-badge neo-badge-cyan">{media.length} ITEMS</span>
        </div>

        <div className="neo-grid">
          {media.map((item, idx) => {
            const isVid = item.type === "video";
            return (
              <div
                className="neo-work-card"
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
                <div className="neo-card-thumb">
                  <img src={item.thumbnailUrl || item.url} alt={item.title} loading="lazy" data-video-poster={isVid ? "true" : undefined} />
                  <span className="neo-thumb-badge">{item.category || (isVid ? "Video" : "Photo")}</span>
                  {isVid && (
                    <div className="neo-play-button">
                      <Play size={24} fill="#000" />
                    </div>
                  )}
                </div>
                <div className="neo-card-body">
                  <h3 className="neo-card-title">{item.title}</h3>
                  {item.caption && <p className="neo-card-desc">{item.caption}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Neo Skills Section */}
      {skills.length > 0 && (
        <section className="neo-section neo-skills-section">
          <div className="neo-sec-header">
            <h2 className="neo-sec-title">Skills & Superpowers</h2>
            <span className="neo-badge neo-badge-purple">STACK</span>
          </div>

          <div className="neo-skills-wrap">
            {skills.map((s, idx) => (
              <div className={`neo-skill-pill neo-pill-color-${(idx % 4) + 1}`} key={s.id || s.name}>
                <span className="neo-skill-name">{s.name}</span>
                <span className="neo-skill-rate">{s.level}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Neo Timeline Section */}
      {timeline.length > 0 && (
        <section className="neo-section neo-timeline-section">
          <div className="neo-sec-header">
            <h2 className="neo-sec-title">The Story So Far</h2>
          </div>

          <div className="neo-timeline">
            {timeline.map((step, idx) => (
              <div className="neo-timeline-card" key={idx}>
                <span className="neo-timeline-year">{step.year}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Neo Footer */}
      <footer className="neo-footer">
        <div className="neo-footer-card">
          <h2>{contact.heading || "Say Hello! Let's build cool things together."}</h2>
          {contact.subheading && <p className="neo-footer-sub">{contact.subheading}</p>}
          <div className="neo-footer-btns">
            <button
              type="button"
              className="neo-btn neo-btn-main neo-btn-lg"
              onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}
            >
              <Send size={20} /> {contact.buttonText || "Send Project Inquiry"}
            </button>
            {contact.showEmail !== false && contact.email && (
              <a href={`mailto:${contact.email}`} className="neo-btn neo-btn-secondary neo-btn-lg">
                <Mail size={20} /> {contact.email}
              </a>
            )}
          </div>

          <div className="neo-socials-list">
            {discord.enabled !== false && discord.username && <span>Discord: {discord.username}</span>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer">Twitter</a>}
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer">YouTube</a>}
            {socials.github && <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>}
            {socials.website && <a href={socials.website} target="_blank" rel="noreferrer">Website</a>}
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
