import { useState } from "react";
import { Play, ExternalLink, Mail, Phone, ArrowRight, Check, Sparkles, Send } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";

export const SplitScreen = ({ portfolio, isPreview = false }) => {
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
  } = portfolio;

  const videos = media.filter((m) => m.type === "video");
  const photos = media.filter((m) => m.type === "photo");

  const cleanPhone = (contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to get in touch.")}`
    : null;

  return (
    <div className="split-theme">
      <div className="split-container">
        {/* Left Sticky Half */}
        <section className="split-left-pane">
          <div className="split-left-content">
            {profile.statusBadge && (
              <div className="split-status-badge">
                <span className="split-dot" />
                <span>{profile.statusBadge}</span>
              </div>
            )}

            <div className="split-author-head">
              <span className="split-tagline">{profile.tagline || "Creator Portfolio"}</span>
              <h1 className="split-name">{profile.displayName}</h1>
              <h2 className="split-headline">{profile.headline}</h2>
            </div>

            <p className="split-bio">{profile.bio}</p>

            {/* Discord Presence */}
            {discord.enabled !== false && (discord.username || discord.userId) && (
              <div className="split-discord-slot">
                <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
              </div>
            )}

            {/* Metrics */}
            {stats.length > 0 && (
              <div className="split-metrics-grid">
                {stats.map((s, idx) => (
                  <div className="split-metric-card" key={idx}>
                    <span className="split-metric-value">{s.value}</span>
                    <span className="split-metric-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Pills */}
            {skills.length > 0 && (
              <div className="split-skills-block">
                <span className="split-skills-heading">Core Skills</span>
                <div className="split-skills-pills">
                  {skills.map((s) => (
                    <span className="split-skill-pill" key={s.id || s.name}>
                      {s.name} <small>{s.level}%</small>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Actions */}
            <div className="split-cta-group">
              <button
                type="button"
                className="split-btn split-btn-primary"
                onClick={() => setIsInquiryOpen(true)}
              >
                <Send size={16} /> {contact.buttonText || "Send Inquiry / Brief"}
              </button>

              {contact.showEmail !== false && contact.email && (
                <a href={`mailto:${contact.email}`} className="split-btn split-btn-ghost">
                  <Mail size={16} /> Email
                </a>
              )}

              {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="split-btn split-btn-ghost">
                  <Phone size={16} /> WhatsApp
                </a>
              )}
            </div>

            {/* Socials Footnote */}
            <div className="split-socials-row">
              {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer">Twitter/X</a>}
              {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer">YouTube</a>}
              {socials.github && <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>}
              {socials.website && <a href={socials.website} target="_blank" rel="noreferrer">Website</a>}
            </div>
          </div>
        </section>

        {/* Right Scrollable Media Feed */}
        <section className="split-right-pane">
          <div className="split-feed-header">
            <h3>Selected Visual Projects ({media.length})</h3>
            <span className="split-feed-sub">Scroll through recent work</span>
          </div>

          <div className="split-feed-cards">
            {media.map((item, idx) => {
              const isVid = item.type === "video";
              return (
                <article
                  className="split-project-card"
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
                  <div className="split-card-media-box">
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      loading="lazy"
                    />
                    <div className="split-card-overlay">
                      <span className="split-card-type">{item.category || (isVid ? "Video" : "Photo")}</span>
                      {isVid ? (
                        <div className="split-card-play-btn">
                          <Play size={24} fill="#fff" />
                        </div>
                      ) : (
                        <div className="split-card-zoom-btn">
                          <ExternalLink size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="split-card-caption">
                    <div className="split-card-title-row">
                      <h4>{item.title}</h4>
                      <span className="split-card-idx">#{(idx + 1).toString().padStart(2, "0")}</span>
                    </div>
                    {item.caption && <p>{item.caption}</p>}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Timeline in right feed */}
          {timeline.length > 0 && (
            <div className="split-timeline-box">
              <h3>Career Milestones</h3>
              <div className="split-timeline-items">
                {timeline.map((item, idx) => (
                  <div className="split-time-item" key={idx}>
                    <span className="split-year-tag">{item.year}</span>
                    <div className="split-time-body">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

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
