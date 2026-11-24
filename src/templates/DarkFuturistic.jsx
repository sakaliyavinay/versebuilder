import { useState } from "react";
import ParticlesBg from "../components/ParticlesBg";
import CursorGlow from "../components/CursorGlow";
import { Play, ExternalLink, Mail, Phone, ArrowUpRight, Sparkles, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { VideoModal } from "../components/common/VideoModal";
import { MediaLightbox } from "../components/common/MediaLightbox";
import { DiscordPresenceBadge } from "../components/common/DiscordPresenceBadge";
import { InquiryModal } from "../components/common/InquiryModal";

export const DarkFuturistic = ({ portfolio, isPreview = false }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState("all");

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

  const activeSelectedVideo =
    videos.find((v) => v.id === selectedVideoId) || videos[0] || null;

  const filteredMedia =
    activeMediaTab === "all"
      ? media
      : activeMediaTab === "videos"
      ? videos
      : photos;

  const cleanPhone = (contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to hire you for a project.")}`
    : null;

  return (
    <div className="dark-futuristic-theme">
      {!isPreview && (
        <>
          <ParticlesBg />
          <CursorGlow />
        </>
      )}

      {/* Floating Navbar */}
      <nav className="df-navbar">
        <a href="#df-home" className="df-logo">
          <span className="df-logo-dot" />
          <strong>{profile.displayName || "Portfolio"}</strong>
        </a>
        <div className="df-nav-links">
          <a href="#df-portfolio">Work</a>
          <a href="#df-skills">Skills</a>
          <a href="#df-contact">Contact</a>
        </div>
        <button className="df-hire-btn" onClick={() => setIsInquiryOpen(true)}>
          Hire Me
        </button>
      </nav>

      {/* Hero Section */}
      <section id="df-home" className="df-hero-section">
        <div className="df-hero-grid">
          <div className="df-hero-content">
            {profile.statusBadge && (
              <div className="df-status-pill">
                <span className="df-status-dot" />
                <span>{profile.statusBadge}</span>
              </div>
            )}
            <p className="df-eyebrow">{profile.tagline || "Creative Portfolio"}</p>
            <h1 className="df-headline">{profile.headline || "Turning ideas into high-impact visuals."}</h1>
            <p className="df-bio-lead">{profile.bio}</p>

            <div className="df-hero-actions">
              <button className="df-btn df-btn-primary" onClick={() => setIsInquiryOpen(true)}>
                <Sparkles size={16} />
                <span>Get In Touch / Hire</span>
              </button>
              <a href="#df-portfolio" className="df-btn df-btn-ghost">
                <span>Explore Work</span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            {/* Discord presence banner if enabled */}
            {discord.enabled !== false && (discord.username || discord.userId) && (
              <div className="df-discord-slot">
                <DiscordPresenceBadge discord={discord} onOpenInquiry={() => setIsInquiryOpen(true)} />
              </div>
            )}

            {/* Stats Row */}
            {stats.length > 0 && (
              <div className="df-stats-strip">
                {stats.map((s, idx) => (
                  <div className="df-stat-card" key={idx}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="df-hero-visual">
            <div className="df-visual-frame">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="df-hero-image"
                />
              ) : activeSelectedVideo?.thumbnailUrl ? (
                <img
                  src={activeSelectedVideo.thumbnailUrl}
                  alt={activeSelectedVideo.title}
                  className="df-hero-image"
                />
              ) : (
                <div className="df-avatar-fallback">
                  <span>{profile.displayName?.charAt(0) || "P"}</span>
                </div>
              )}
              <div className="df-visual-glow" />
              <div className="df-visual-badge">
                <CheckCircle2 size={16} className="df-badge-icon" />
                <span>Verified Creator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Showcase & Media Reel */}
      {media.length > 0 && (
        <section id="df-portfolio" className="df-portfolio-section">
        <div className="df-section-header">
          <div>
            <p className="df-eyebrow">Selected Works</p>
            <h2>High-Impact Media & Featured Projects</h2>
          </div>
          <div className="df-filter-tabs">
            <button
              className={`df-tab ${activeMediaTab === "all" ? "active" : ""}`}
              onClick={() => setActiveMediaTab("all")}
            >
              All ({media.length})
            </button>
            <button
              className={`df-tab ${activeMediaTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveMediaTab("videos")}
            >
              Videos ({videos.length})
            </button>
            <button
              className={`df-tab ${activeMediaTab === "photos" ? "active" : ""}`}
              onClick={() => setActiveMediaTab("photos")}
            >
              Photos & Thumbnails ({photos.length})
            </button>
          </div>
        </div>

        {/* Featured Video Player Spotlight */}
        {activeSelectedVideo && (
          <div className="df-featured-video-stage">
            <div className="df-video-hero-card">
              <div
                className="df-video-poster-box"
                onClick={() => setActiveVideo(activeSelectedVideo)}
              >
                <img
                  src={activeSelectedVideo.thumbnailUrl || profile.heroImage || activeSelectedVideo.url}
                  alt={activeSelectedVideo.title}
                  className="df-video-thumb-img"
                />
                <div className="df-video-play-overlay">
                  <div className="df-play-disc">
                    <Play size={28} fill="#080808" />
                  </div>
                </div>
                <span className="df-category-tag">{activeSelectedVideo.category || "Video"}</span>
              </div>
              <div className="df-video-details">
                <span className="df-video-kicker">Featured Video Reel</span>
                <h3>{activeSelectedVideo.title}</h3>
                {activeSelectedVideo.caption && <p>{activeSelectedVideo.caption}</p>}
                <button
                  className="df-btn df-btn-sm"
                  onClick={() => setActiveVideo(activeSelectedVideo)}
                >
                  <Play size={14} /> Watch Full Video
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Grid */}
        <div className="df-media-grid">
          {filteredMedia.map((item, index) => {
            const isVid = item.type === "video";
            return (
              <div
                key={item.id || index}
                className={`df-media-card ${isVid ? "is-video" : "is-photo"}`}
                onClick={() => {
                  if (isVid) {
                    setActiveVideo(item);
                  } else {
                    const photoIdx = photos.findIndex((p) => p.id === item.id);
                    setLightboxIndex(photoIdx >= 0 ? photoIdx : 0);
                  }
                }}
              >
                <div className="df-card-image-wrap">
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className="df-card-hover-mask">
                    <span className="df-card-badge">{item.category || (isVid ? "Video" : "Photo")}</span>
                    {isVid ? (
                      <div className="df-mini-play-icon">
                        <Play size={20} fill="#fff" />
                      </div>
                    ) : (
                      <div className="df-mini-zoom-icon">
                        <ExternalLink size={20} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="df-card-caption">
                  <h4>{item.title}</h4>
                  {item.caption && <p>{item.caption}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* Skills & Timeline Section */}
      {(skills.length > 0 || timeline.length > 0) && (
        <section id="df-skills" className="df-skills-section">
          <div className="df-section-header">
            <p className="df-eyebrow">Expertise & Experience</p>
            <h2>Crafted With Technical Precision</h2>
          </div>

          <div className="df-two-col-layout">
            {skills.length > 0 && (
              <div className="df-panel-box">
                <h3 className="df-panel-title">Core Competencies</h3>
                <div className="df-skills-list">
                  {skills.map((skill) => (
                    <div className="df-skill-item" key={skill.id || skill.name}>
                      <div className="df-skill-head">
                        <span className="df-skill-name">{skill.name}</span>
                        <span className="df-skill-percentage">{skill.level}%</span>
                      </div>
                      <div className="df-progress-track">
                        <div
                          className="df-progress-bar"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timeline.length > 0 && (
              <div className="df-panel-box">
                <h3 className="df-panel-title">Journey & Highlights</h3>
                <div className="df-timeline-flow">
                  {timeline.map((step, idx) => (
                    <div className="df-timeline-node" key={idx}>
                      <div className="df-node-dot" />
                      <span className="df-node-year">{step.year}</span>
                      <h4 className="df-node-heading">{step.title}</h4>
                      <p className="df-node-desc">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section - DYNAMIC PER USER */}
      <section id="df-contact" className="df-contact-section">
        <div className="df-contact-card">
          <p className="df-eyebrow">{contact.eyebrow || "READY FOR YOUR NEXT PROJECT?"}</p>
          <h2>{contact.heading || "Let's build something unforgettable together."}</h2>
          <p className="df-contact-sub">
            {contact.subheading ||
              "Available for commissions, projects, and creator packages."}
          </p>

          <div className="df-contact-actions">
            {contact.showEmail !== false && contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="df-btn df-btn-primary"
              >
                <Mail size={16} />
                <span>{contact.email}</span>
              </a>
            )}

            {contact.showPhone && contact.isWhatsApp && whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="df-btn df-btn-ghost"
              >
                <Phone size={16} />
                <span>WhatsApp: {contact.phone}</span>
              </a>
            )}

            <button className="df-btn df-btn-ghost" onClick={() => setIsInquiryOpen(true)}>
              <Send size={16} />
              <span>{contact.buttonText || "Send Project Brief"}</span>
            </button>
          </div>

          {/* Socials & Discord */}
          <div className="df-social-links">
            {discord.enabled !== false && discord.username && (
              <span>Discord: {discord.username}</span>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer">
                Twitter / X
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {socials.website && (
              <a href={socials.website} target="_blank" rel="noreferrer">
                Website
              </a>
            )}
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
