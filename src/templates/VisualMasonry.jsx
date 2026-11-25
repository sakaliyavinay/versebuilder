import { useState } from "react";
import { Play, ExternalLink, Mail, Phone, MapPin, Sparkles, Filter, Send } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";
import { activatePortfolioCta } from "./portfolioCta";

export const VisualMasonry = ({ portfolio, isPreview = false }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
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
    sectionSettings = {},
  } = portfolio;

  const videos = media.filter((m) => m.type === "video");
  const photos = media.filter((m) => m.type === "photo");

  const displayedMedia =
    activeFilter === "all"
      ? media
      : activeFilter === "videos"
      ? videos
      : photos;

  const cleanPhone = (contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to hire you.")}`
    : null;

  return (
    <div className="masonry-theme">
      <div className="masonry-layout">
        {/* Sticky Left Sidebar Profile */}
        <aside className="masonry-sidebar">
          <div className="masonry-sidebar-inner">
            {sectionSettings.showHero !== false && (
              <>
                <div className="masonry-avatar-box">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.displayName} className="masonry-avatar-img" />
                  ) : (
                    <div className="masonry-avatar-blank">{profile.displayName?.charAt(0)}</div>
                  )}
                </div>

                <div className="masonry-author-meta">
                  <h1 className="masonry-name">{profile.displayName}</h1>
                  <p className="masonry-role">{profile.tagline || profile.headline}</p>
                  {profile.location && (
                    <span className="masonry-loc">
                      <MapPin size={13} /> {profile.location}
                    </span>
                  )}
                </div>

                {profile.statusBadge && (
                  <div className="masonry-status-badge">
                    <span className="masonry-dot" />
                    <span>{profile.statusBadge}</span>
                  </div>
                )}

                <p className="masonry-bio">{profile.bio}</p>
              </>
            )}

            {/* Discord Presence */}
            {sectionSettings.showDiscord !== false && discord.enabled !== false && (discord.username || discord.userId) && (
              <div className="masonry-discord-slot">
                <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
              </div>
            )}

            {/* Quick Metrics */}
            {stats.length > 0 && sectionSettings.showHero !== false && (
              <div className="masonry-stats-row">
                {stats.slice(0, 3).map((s, idx) => (
                  <div className="masonry-stat-unit" key={idx}>
                    <strong>{s.value}</strong>
                    <small>{s.label}</small>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Tags */}
            {skills.length > 0 && sectionSettings.showSkills !== false && (
              <div className="masonry-skills-wrap">
                <span className="masonry-section-label">Disciplines & Tools</span>
                <div className="masonry-skill-pills">
                  {skills.map((s) => (
                    <span className="masonry-skill-pill" key={s.id || s.name}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Action */}
            {sectionSettings.showContact !== false && (
              <div className="masonry-contact-box">
                <button
                  type="button"
                  className="masonry-email-btn"
                  onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}
                >
                  <Send size={15} /> {themeSettings.ctaText || contact.buttonText || "Send Project Inquiry"}
                </button>

                <div className="masonry-quick-contacts">
                  {contact.showEmail !== false && contact.email && (
                    <a href={`mailto:${contact.email}`} className="masonry-sub-btn">
                      <Mail size={14} /> Email
                    </a>
                  )}
                  {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="masonry-sub-btn">
                      <Phone size={14} /> WhatsApp
                    </a>
                  )}
                </div>

                <div className="masonry-social-links">
                  {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer">X</a>}
                  {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer">YT</a>}
                  {socials.github && <a href={socials.github} target="_blank" rel="noreferrer">GH</a>}
                  {socials.website && <a href={socials.website} target="_blank" rel="noreferrer">WEB</a>}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Gallery Stage */}
        {sectionSettings.showWork !== false && (
          <main className="masonry-main-stage">
          {/* Top Filter Bar */}
          <div className="masonry-filter-header">
            <div className="masonry-filter-tabs">
              <button
                className={`masonry-tab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Works ({media.length})
              </button>
              <button
                className={`masonry-tab ${activeFilter === "videos" ? "active" : ""}`}
                onClick={() => setActiveFilter("videos")}
              >
                Videos ({videos.length})
              </button>
              <button
                className={`masonry-tab ${activeFilter === "photos" ? "active" : ""}`}
                onClick={() => setActiveFilter("photos")}
              >
                Photos ({photos.length})
              </button>
            </div>
            <span className="masonry-counter-note">{displayedMedia.length} visual items</span>
          </div>

          {/* Staggered Masonry Columns */}
          <div className="masonry-columns">
            {displayedMedia.map((item, idx) => {
              const isVid = item.type === "video";
              return (
                <div
                  className={`masonry-brick ${isVid ? "brick-video" : "brick-photo"}`}
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
                  <div className="brick-media-wrap">
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="brick-image"
                      loading="lazy"
                    />
                    <div className="brick-overlay">
                      <div className="brick-top-info">
                        <span className="brick-badge">{item.category || (isVid ? "Video" : "Photo")}</span>
                        {isVid ? (
                          <div className="brick-play-circle">
                            <Play size={18} fill="#fff" />
                          </div>
                        ) : (
                          <div className="brick-zoom-circle">
                            <ExternalLink size={16} />
                          </div>
                        )}
                      </div>
                      <div className="brick-bottom-info">
                        <h3 className="brick-title">{item.title}</h3>
                        {item.caption && <p className="brick-caption">{item.caption}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        )}
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
