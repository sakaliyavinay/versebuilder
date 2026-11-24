import { useState } from "react";
import { Play, ExternalLink, Mail, Phone, CheckCircle, ArrowRight, User, Award, Send } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";

export const ClassicStructured = ({ portfolio, isPreview = false }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [filter, setFilter] = useState("all");
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

  const filteredItems =
    filter === "all"
      ? media
      : filter === "videos"
      ? videos
      : photos;

  const cleanPhone = (contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to collaborate.")}`
    : null;

  return (
    <div className="classic-theme">
      {/* Top Navbar */}
      <header className="classic-navbar">
        <div className="classic-nav-container">
          <div className="classic-nav-brand">
            <strong>{profile.displayName}</strong>
            <span className="classic-brand-badge">{profile.tagline || "Portfolio"}</span>
          </div>
          <nav className="classic-nav-links">
            <a href="#classic-work">Work</a>
            <a href="#classic-skills">Skills</a>
            <a href="#classic-experience">Experience</a>
            <a href="#classic-contact">Contact</a>
          </nav>
          <button className="classic-nav-cta" onClick={() => setIsInquiryOpen(true)}>
            Get in Touch
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="classic-hero">
        <div className="classic-container">
          <div className="classic-hero-row">
            <div className="classic-hero-text">
              {profile.statusBadge && (
                <div className="classic-badge">
                  <CheckCircle size={14} className="classic-badge-icon" />
                  <span>{profile.statusBadge}</span>
                </div>
              )}
              <h1 className="classic-hero-title">{profile.headline}</h1>
              <p className="classic-hero-bio">{profile.bio}</p>

              <div className="classic-hero-ctas">
                <a href="#classic-work" className="classic-btn classic-btn-primary">
                  View Projects <ArrowRight size={16} />
                </a>
                <button
                  className="classic-btn classic-btn-secondary"
                  onClick={() => setIsInquiryOpen(true)}
                >
                  <Send size={16} /> Send Inquiry
                </button>
              </div>

              {/* Discord slot in hero */}
              {discord.enabled !== false && (discord.username || discord.userId) && (
                <div className="classic-discord-slot">
                  <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
                </div>
              )}

              {/* Stats Bar */}
              {stats.length > 0 && (
                <div className="classic-hero-stats">
                  {stats.map((s, idx) => (
                    <div className="classic-stat-block" key={idx}>
                      <span className="classic-stat-num">{s.value}</span>
                      <span className="classic-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="classic-hero-media">
              {profile.avatarUrl ? (
                <div className="classic-avatar-card">
                  <img src={profile.avatarUrl} alt={profile.displayName} className="classic-avatar-img" />
                  <div className="classic-avatar-card-info">
                    <strong>{profile.displayName}</strong>
                    <span>{profile.tagline || "Creative Professional"}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Structured Portfolio Grid */}
      <section id="classic-work" className="classic-section classic-work-section">
        <div className="classic-container">
          <div className="classic-section-head">
            <div>
              <span className="classic-section-sub">Portfolio Showcase</span>
              <h2 className="classic-section-title">Selected Works & Case Studies</h2>
            </div>
            <div className="classic-filter-group">
              <button
                className={`classic-filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All ({media.length})
              </button>
              <button
                className={`classic-filter-btn ${filter === "videos" ? "active" : ""}`}
                onClick={() => setFilter("videos")}
              >
                Videos ({videos.length})
              </button>
              <button
                className={`classic-filter-btn ${filter === "photos" ? "active" : ""}`}
                onClick={() => setFilter("photos")}
              >
                Photos ({photos.length})
              </button>
            </div>
          </div>

          <div className="classic-cards-grid">
            {filteredItems.map((item, idx) => {
              const isVid = item.type === "video";
              return (
                <div
                  className="classic-project-card"
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
                  <div className="classic-card-thumbnail">
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      loading="lazy"
                    />
                    <span className="classic-card-tag">{item.category || (isVid ? "Video" : "Photo")}</span>
                    {isVid ? (
                      <div className="classic-play-badge">
                        <Play size={20} fill="#fff" />
                      </div>
                    ) : (
                      <div className="classic-zoom-badge">
                        <ExternalLink size={18} />
                      </div>
                    )}
                  </div>
                  <div className="classic-card-body">
                    <h3 className="classic-card-title">{item.title}</h3>
                    {item.caption && <p className="classic-card-desc">{item.caption}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills & Capabilities */}
      {skills.length > 0 && (
        <section id="classic-skills" className="classic-section classic-skills-section">
          <div className="classic-container">
            <div className="classic-section-head">
              <div>
                <span className="classic-section-sub">Capabilities</span>
                <h2 className="classic-section-title">Skills & Industry Expertise</h2>
              </div>
            </div>

            <div className="classic-skills-grid">
              {skills.map((skill) => (
                <div className="classic-skill-card" key={skill.id || skill.name}>
                  <div className="classic-skill-header">
                    <span className="classic-skill-name">{skill.name}</span>
                    <span className="classic-skill-pct">{skill.level}%</span>
                  </div>
                  <div className="classic-bar-track">
                    <div className="classic-bar-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                  {skill.category && <span className="classic-skill-cat">{skill.category}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {timeline.length > 0 && (
        <section id="classic-experience" className="classic-section classic-exp-section">
          <div className="classic-container">
            <div className="classic-section-head">
              <div>
                <span className="classic-section-sub">Track Record</span>
                <h2 className="classic-section-title">Experience & Milestones</h2>
              </div>
            </div>

            <div className="classic-timeline-list">
              {timeline.map((item, idx) => (
                <div className="classic-timeline-card" key={idx}>
                  <div className="classic-time-badge">{item.year}</div>
                  <div className="classic-time-body">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="classic-contact" className="classic-section classic-contact-section">
        <div className="classic-container">
          <div className="classic-contact-card">
            <h2>{contact.heading || "Ready to start your next creative project?"}</h2>
            <p>
              {contact.subheading ||
                "I am open to discuss new opportunities, creative collaborations, and long-term partnerships."}
            </p>

            <div className="classic-contact-btns">
              <button
                className="classic-btn classic-btn-primary classic-btn-lg"
                onClick={() => setIsInquiryOpen(true)}
              >
                <Send size={18} /> {contact.buttonText || "Send Direct Project Inquiry"}
              </button>

              {contact.showEmail !== false && contact.email && (
                <a href={`mailto:${contact.email}`} className="classic-btn classic-btn-secondary classic-btn-lg">
                  <Mail size={18} /> Email Me
                </a>
              )}

              {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="classic-btn classic-btn-secondary classic-btn-lg">
                  <Phone size={18} /> WhatsApp: {contact.phone}
                </a>
              )}
            </div>

            <div className="classic-social-footer">
              {discord.enabled !== false && discord.username && (
                <span>Discord: {discord.username}</span>
              )}
              {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer">Twitter / X</a>}
              {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer">YouTube</a>}
              {socials.github && <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>}
              {socials.website && <a href={socials.website} target="_blank" rel="noreferrer">Website</a>}
            </div>
          </div>
        </div>
      </section>

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
