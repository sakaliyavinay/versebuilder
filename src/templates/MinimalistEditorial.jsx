import { useState } from "react";
import { Play, ArrowUpRight, Mail, Phone, Compass, MessageSquare, Send } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";
import { activatePortfolioCta } from "./portfolioCta";

export const MinimalistEditorial = ({ portfolio, isPreview = false }) => {
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

  const cleanPhone = (contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to collaborate.")}`
    : null;

  return (
    <div className="editorial-theme">
      {/* Editorial Header */}
      <header className="ed-header">
        <div className="ed-header-inner">
          <div className="ed-brand">
            <span className="ed-vol">FOLIO N° 01</span>
            <h1 className="ed-name">{profile.displayName}</h1>
          </div>
          <div className="ed-meta">
            <span className="ed-tagline">{profile.tagline || profile.headline}</span>
            {profile.location && <span className="ed-loc">{profile.location}</span>}
          </div>
        </div>
        <div className="ed-hairline" />
      </header>

      {/* Main Narrative Hero */}
      {sectionSettings.showHero !== false && (
        <section className="ed-hero">
          <div className="ed-hero-grid">
            <div className="ed-hero-statement">
              <p className="ed-kicker">Artist & Creative Practitioner</p>
              <h2 className="ed-statement-title">{profile.headline}</h2>
              <div className="ed-bio-body">
                <p>{profile.bio}</p>
              </div>
              {profile.statusBadge && (
                <div className="ed-availability">
                  <span className="ed-dot" />
                  <span>{profile.statusBadge}</span>
                </div>
              )}

              {/* Discord Badge if enabled */}
              {sectionSettings.showDiscord !== false && discord.enabled !== false && (discord.username || discord.userId) && (
                <div className="ed-discord-box">
                  <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
                </div>
              )}
            </div>

            <div className="ed-portrait-wrapper">
              {profile.avatarUrl ? (
                <div className="ed-portrait-frame">
                  <img src={profile.avatarUrl} alt={profile.displayName} className="ed-portrait-img" />
                  <span className="ed-caption-small">Studio Portrait — {profile.displayName}</span>
                </div>
              ) : profile.heroImage ? (
                <div className="ed-portrait-frame">
                  <img src={profile.heroImage} alt={profile.displayName} className="ed-portrait-img" />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* Key Metrics / Digest */}
      {stats.length > 0 && sectionSettings.showHero !== false && (
        <section className="ed-metrics-strip">
          <div className="ed-hairline" />
          <div className="ed-metrics-row">
            {stats.map((stat, i) => (
              <div className="ed-metric-col" key={i}>
                <span className="ed-metric-val">{stat.value}</span>
                <span className="ed-metric-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="ed-hairline" />
        </section>
      )}

      {/* Selected Works - Magazine Plate Style */}
      {media.length > 0 && sectionSettings.showWork !== false && (
        <section className="ed-works-section">
        <div className="ed-section-title-wrap">
          <span className="ed-sec-num">SECTION I</span>
          <h2 className="ed-sec-heading">Selected Works & Projects</h2>
        </div>

        <div className="ed-plates-grid">
          {media.map((item, idx) => {
            const isVid = item.type === "video";
            return (
              <article
                className={`ed-plate ${isVid ? "ed-plate-video" : ""}`}
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
                <div className="ed-plate-media-box">
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    className="ed-plate-img"
                    loading="lazy"
                  />
                  {isVid && (
                    <div className="ed-plate-play">
                      <Play size={20} fill="#1c1a17" />
                    </div>
                  )}
                </div>
                <div className="ed-plate-meta">
                  <div className="ed-plate-top">
                    <span className="ed-plate-index">{(idx + 1).toString().padStart(2, "0")}</span>
                    <span className="ed-plate-cat">{item.category || (isVid ? "Film" : "Visual")}</span>
                  </div>
                  <h3 className="ed-plate-title">{item.title}</h3>
                  {item.caption && <p className="ed-plate-desc">{item.caption}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      )}

      {/* Disciplines & Skills */}
      {skills.length > 0 && sectionSettings.showSkills !== false && (
        <section className="ed-skills-section">
          <div className="ed-hairline" />
          <div className="ed-section-title-wrap">
            <span className="ed-sec-num">SECTION II</span>
            <h2 className="ed-sec-heading">Practices & Technical Disciplines</h2>
          </div>

          <div className="ed-skills-cloud">
            {skills.map((skill) => (
              <div className="ed-skill-pill" key={skill.id || skill.name}>
                <span className="ed-skill-title">{skill.name}</span>
                <span className="ed-skill-score">{skill.level}% Proficiency</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Chronology / Timeline */}
      {timeline.length > 0 && sectionSettings.showTimeline !== false && (
        <section className="ed-timeline-section">
          <div className="ed-hairline" />
          <div className="ed-section-title-wrap">
            <span className="ed-sec-num">SECTION III</span>
            <h2 className="ed-sec-heading">Chronology & Milestones</h2>
          </div>

          <div className="ed-timeline-table">
            {timeline.map((item, idx) => (
              <div className="ed-timeline-row" key={idx}>
                <span className="ed-time-year">{item.year}</span>
                <div className="ed-time-content">
                  <h4 className="ed-time-title">{item.title}</h4>
                  <p className="ed-time-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Editorial Colophon / Contact Footer */}
      {sectionSettings.showContact !== false && (
        <footer className="ed-colophon">
          <div className="ed-hairline" />
          <div className="ed-colophon-inner">
            <div className="ed-colophon-left">
              <h3>{contact.heading || "Initiate a Dialogue"}</h3>
              <p>{contact.subheading || "Direct inquiries, acquisitions, and creative collaborations."}</p>

              <div className="ed-contact-row">
                {contact.showEmail !== false && contact.email && (
                  <a href={`mailto:${contact.email}`} className="ed-email-link">
                    <Mail size={16} /> {contact.email} <ArrowUpRight size={16} />
                  </a>
                )}

                {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="ed-whatsapp-link">
                    <Phone size={15} /> WhatsApp: {contact.phone}
                  </a>
                )}

                <button className="ed-inquiry-trigger" onClick={() => activatePortfolioCta(portfolio, () => setIsInquiryOpen(true))}>
                  <Send size={15} /> {themeSettings.ctaText || contact.buttonText || "Send Project Inquiry"}
                </button>
              </div>
            </div>
            <div className="ed-colophon-right">
              <span className="ed-col-title">Index / Elsewhere</span>
              <div className="ed-social-list">
                {sectionSettings.showDiscord !== false && discord.enabled !== false && discord.username && (
                  <span>Discord: {discord.username}</span>
                )}
                {socials.website && <a href={socials.website} target="_blank" rel="noreferrer">Website</a>}
                {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer">Instagram</a>}
                {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer">Twitter / X</a>}
                {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                {socials.github && <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>}
              </div>
            </div>
          </div>
        </footer>
      )}

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
