import { useState } from "react";
import { Play, ExternalLink, Sparkles, MapPin, Mail, Phone, ArrowUpRight, Award, Zap, Code, Layers, Send } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";
import { activatePortfolioCta } from "./portfolioCta";

export const BentoGrid = ({ portfolio, isPreview = false }) => {
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
    sectionSettings = {},
  } = portfolio;

  const videos = media.filter((m) => m.type === "video");
  const photos = media.filter((m) => m.type === "photo");
  const featuredVideo = videos.find((v) => v.featured) || videos[0] || null;

  const cleanPhone = (contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your Bento portfolio and want to talk.")}`
    : null;

  return (
    <div className="bento-theme">
      {/* Top Banner Bar */}
      <div className="bento-top-bar">
        <div className="bento-status-chip">
          <span className="bento-pulse-dot" />
          <span>{profile.statusBadge || "Available for collaboration"}</span>
        </div>
        <div className="bento-top-actions">
          <button className="bento-contact-pill" onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}>
            <Send size={13} /> {themeSettings.ctaText || contact.buttonText || "Send Inquiry"}
          </button>
          {contact.showEmail !== false && contact.email && (
            <a href={`mailto:${contact.email}`} className="bento-btn bento-btn-subtle">
              <Mail size={13} /> Email
            </a>
          )}
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="bento-grid-container">
        {/* Tile 1: Hero Profile (Spans 8 columns on desktop) */}
        {sectionSettings.showHero !== false && (
          <div className="bento-card bento-card-hero">
            <div className="bento-card-bg-glow" />
            <div className="bento-hero-head">
              <div className="bento-avatar-wrap">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.displayName} className="bento-avatar" />
                ) : (
                  <div className="bento-avatar-placeholder">{profile.displayName?.charAt(0)}</div>
                )}
              </div>
              <div>
                <span className="bento-tagline">{profile.tagline || "Creative Specialist"}</span>
                <h1 className="bento-title">{profile.displayName}</h1>
                {profile.location && (
                  <span className="bento-location">
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
              </div>
            </div>
            <h2 className="bento-headline">{profile.headline}</h2>
            <p className="bento-bio">{profile.bio}</p>

            <div className="bento-hero-links">
              <button className="bento-btn bento-btn-primary" onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}>
                <Send size={14} /> {themeSettings.ctaText || contact.buttonText || "Send Inquiry / Brief"}
              </button>
              {contact.showEmail !== false && contact.email && (
                <a href={`mailto:${contact.email}`} className="bento-btn bento-btn-subtle">
                  <Mail size={14} /> Email
                </a>
              )}
              {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="bento-btn bento-btn-subtle">
                  <Phone size={14} /> WhatsApp
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noreferrer" className="bento-btn bento-btn-subtle">
                  Twitter/X
                </a>
              )}
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noreferrer" className="bento-btn bento-btn-subtle">
                  GitHub
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tile 2: Metric Badges Tile (Spans 4 columns) */}
        {stats.length > 0 && sectionSettings.showHero !== false && (
          <div className="bento-card bento-card-stats">
            <div className="bento-card-title-row">
              <Sparkles size={16} className="bento-icon-accent" />
              <span>Highlights & Metrics</span>
            </div>
            <div className="bento-stats-grid">
              {stats.map((s, idx) => (
                <div className="bento-stat-box" key={idx}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tile: Discord Presence Tile (Spans 4 columns) */}
        {sectionSettings.showDiscord !== false && discord.enabled !== false && (discord.username || discord.userId) && (
          <div className="bento-card bento-card-discord">
            <div className="bento-card-title-row">
              <span className="text-discord">⚡ Discord Connection</span>
            </div>
            <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
          </div>
        )}

        {/* Tile 3: Skills & Tech Stack Tile (Spans 4 columns) */}
        {skills.length > 0 && sectionSettings.showSkills !== false && (
          <div className="bento-card bento-card-skills">
            <div className="bento-card-title-row">
              <Zap size={16} className="bento-icon-accent" />
              <span>Tech & Skills</span>
            </div>
            <div className="bento-skills-tags">
              {skills.map((skill) => (
                <div className="bento-skill-badge" key={skill.id || skill.name}>
                  <span className="bento-skill-name">{skill.name}</span>
                  <span className="bento-skill-level">{skill.level}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tile 4: Featured Video Showcase Tile (Spans 8 columns) */}
        {featuredVideo && sectionSettings.showWork !== false && (
          <div
            className="bento-card bento-card-video"
            onClick={() => setActiveVideo(featuredVideo)}
          >
            <div className="bento-video-cover">
              <img
                src={featuredVideo.thumbnailUrl || featuredVideo.url}
                alt={featuredVideo.title}
                className="bento-video-img"
              />
              <div className="bento-video-hover">
                <div className="bento-play-btn">
                  <Play size={24} fill="#fff" />
                </div>
                <span>Play Showcase</span>
              </div>
              <span className="bento-cat-tag">{featuredVideo.category || "Video"}</span>
            </div>
            <div className="bento-video-info">
              <h3>{featuredVideo.title}</h3>
              {featuredVideo.caption && <p>{featuredVideo.caption}</p>}
            </div>
          </div>
        )}

        {/* Photo Gallery Tiles */}
        {sectionSettings.showWork !== false && photos.map((photo, pIdx) => (
          <div
            className="bento-card bento-card-photo"
            key={photo.id || pIdx}
            onClick={() => setLightboxIndex(pIdx)}
          >
            <div className="bento-photo-wrap">
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={photo.title}
                className="bento-photo-img"
                loading="lazy"
              />
              <div className="bento-photo-overlay">
                <ExternalLink size={20} />
              </div>
            </div>
            <div className="bento-photo-footer">
              <span className="bento-photo-cat">{photo.category || "Work"}</span>
              <h4>{photo.title}</h4>
            </div>
          </div>
        ))}

        {/* Other videos */}
        {sectionSettings.showWork !== false && videos.filter((v) => v.id !== featuredVideo?.id).map((vid) => (
          <div
            className="bento-card bento-card-extra-video"
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
          >
            <div className="bento-video-cover compact">
              <img src={vid.thumbnailUrl || vid.url} alt={vid.title} />
              <div className="bento-mini-play">
                <Play size={18} fill="#fff" />
              </div>
            </div>
            <div className="bento-extra-video-meta">
              <span className="bento-cat-tag">{vid.category || "Video"}</span>
              <h4>{vid.title}</h4>
            </div>
          </div>
        ))}

        {/* Timeline */}
        {timeline.length > 0 && sectionSettings.showTimeline !== false && (
          <div className="bento-card bento-card-timeline">
            <div className="bento-card-title-row">
              <Award size={16} className="bento-icon-accent" />
              <span>Milestones & Timeline</span>
            </div>
            <div className="bento-timeline-list">
              {timeline.map((step, idx) => (
                <div className="bento-timeline-entry" key={idx}>
                  <span className="bento-time-year">{step.year}</span>
                  <div>
                    <h5>{step.title}</h5>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Channels & Networks */}
        {sectionSettings.showContact !== false && (
          <div className="bento-card bento-card-socials">
          <div className="bento-card-title-row">
            <Layers size={16} className="bento-icon-accent" />
            <span>Channels & Inquiries</span>
          </div>
          <div className="bento-socials-grid">
            <button
              type="button"
              className="bento-social-tile"
              onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}
            >
              <Send size={18} />
              <span>{themeSettings.ctaText || "Inquiry"}</span>
            </button>

            {contact.showEmail !== false && contact.email && (
              <a href={`mailto:${contact.email}`} className="bento-social-tile">
                <Mail size={18} />
                <span>Email</span>
              </a>
            )}

            {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="bento-social-tile">
                <Phone size={18} />
                <span>WhatsApp</span>
              </a>
            )}

            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" className="bento-social-tile">
                <span>Twitter / X</span>
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noreferrer" className="bento-social-tile">
                <span>YouTube</span>
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="bento-social-tile">
                <span>GitHub</span>
              </a>
            )}
            {socials.website && (
              <a href={socials.website} target="_blank" rel="noreferrer" className="bento-social-tile">
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
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
