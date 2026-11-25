import {
  Palette,
  Type,
  Layout,
  Sliders,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Sun,
  Moon,
  Square,
  Circle,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { TEMPLATES, getTemplateById } from "../../templates/TemplateRegistry";

const PRESET_SWATCHES = [
  { name: "Cyber Gold", hex: "#f5b84b" },
  { name: "Electric Cyan", hex: "#06b6d4" },
  { name: "Neon Violet", hex: "#8b5cf6" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Sunset Coral", hex: "#f43f5e" },
  { name: "Royal Blue", hex: "#3b82f6" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Warm Amber", hex: "#d97706" },
  { name: "Hot Pink", hex: "#ec4899" },
  { name: "Neon Lime", hex: "#84cc16" },
];

const SURFACE_MODES = [
  { id: "auto", name: "Template Default", desc: "Original template backdrop & mood" },
  { id: "dark", name: "Deep Charcoal", desc: "Dark #0a0a0c surface" },
  { id: "black", name: "Pitch Black", desc: "OLED true black #000000" },
  { id: "light", name: "Editorial Ivory", desc: "Clean, high-contrast light plate" },
];

const CARD_STYLES = [
  { id: "sharp", name: "Sharp (0px)", desc: "Crisp technical borders & hard angles" },
  { id: "rounded", name: "Rounded (14px)", desc: "Sleek, balanced modern curves" },
  { id: "glass", name: "Glassmorphic", desc: "Elevated glass cards with luminous borders" },
];

const FONT_PAIRINGS = [
  { id: "modern-sans", name: "Modern Sans", sample: "Inter / Plus Jakarta", desc: "Clean, geometric, and high-readability" },
  { id: "editorial-serif", name: "Editorial Serif", sample: "Playfair / Georgia", desc: "High-fashion magazine typography" },
  { id: "tech-mono", name: "Tech Monospace", sample: "JetBrains / Fira Code", desc: "Cyberpunk, developer & motion coding vibe" },
  { id: "bold-display", name: "Bold Impact", sample: "Syne / Display", desc: "Oversized, punchy visual headline weight" },
];

const DENSITY_OPTIONS = [
  { id: "compact", name: "Compact", scale: "0.78x", desc: "Tighter margins for dense portfolios" },
  { id: "balanced", name: "Balanced", scale: "1.0x", desc: "Standard golden-ratio layout balance" },
  { id: "spacious", name: "Spacious", scale: "1.3x", desc: "Generous breathing room & whitespace" },
];

export const TemplateCustomizer = () => {
  const { activePortfolio, updateActivePortfolio } = usePortfolio();
  const [accentDraft, setAccentDraft] = useState(null);
  if (!activePortfolio) return null;

  const currentTemplate = getTemplateById(activePortfolio.templateId);
  const theme = activePortfolio.themeSettings || {};
  const sections = activePortfolio.sectionSettings || {};

  const activeAccent = theme.accentColor || currentTemplate.accentColor || "#f5b84b";
  const activeSurface = theme.surfaceMode || "auto";
  const activeCardStyle = theme.cardStyle || "rounded";
  const activeFont = theme.fontPairing || "modern-sans";
  const activeDensity = theme.density || "balanced";
  const customCtaText = theme.ctaText || "";
  const customCtaUrl = theme.ctaUrl || "";
  const buttonStyle = theme.buttonStyle || "solid";
  const sectionOrder = sections.sectionOrder || ["hero", "work", "skills", "timeline", "contact", "discord"];

  const updateTheme = (field, value) => {
    updateActivePortfolio({
      themeSettings: {
        ...theme,
        [field]: value,
      },
    });
  };

  const updateSection = (field, value) => {
    updateActivePortfolio({
      sectionSettings: {
        ...sections,
        [field]: value,
      },
    });
  };

  const handleResetToDefault = () => {
    if (confirm(`Reset styling back to "${currentTemplate.name}" original defaults?`)) {
      updateActivePortfolio({
        themeSettings: {
          accentColor: currentTemplate.accentColor,
          surfaceMode: "auto",
          cardStyle: "rounded",
          fontPairing: "modern-sans",
          density: "balanced",
          ctaText: "",
          ctaUrl: "",
          buttonStyle: "solid",
        },
        sectionSettings: {
          showHero: true,
          showWork: true,
          showSkills: true,
          showTimeline: true,
          showContact: true,
          showDiscord: true,
          sectionOrder: ["hero", "work", "skills", "timeline", "contact", "discord"],
        },
      });
    }
  };

  return (
    <div className="editor-tab-pane customizer-pane">
      {/* Header with Template Info & Reset */}
      <div className="editor-section-header">
        <div className="customizer-head-row">
          <div>
            <h2>Customize Style &amp; Theme</h2>
            <p>
              Tweak the colors, typography, card shapes, and section layout of{" "}
              <strong>{currentTemplate.name}</strong>. Updates show in real-time in the preview.
            </p>
          </div>
          <button
            type="button"
            className="customizer-reset-btn"
            onClick={handleResetToDefault}
            title="Revert back to template's original visual styling"
          >
            <RotateCcw size={14} />
            <span>Reset Styling</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Accent Color */}
      <div className="customizer-section-card">
        <div className="customizer-section-title">
          <Palette size={16} className="text-accent" />
          <h3>Accent Color &amp; Glow</h3>
        </div>
        <p className="customizer-help-text">
          Drives button highlights, glowing hover states, badge accents, and interactive links across all sections.
        </p>

        {/* Preset Palette Swatches */}
        <div className="swatch-grid">
          {PRESET_SWATCHES.map((swatch) => {
            const isSelected = activeAccent.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.hex}
                type="button"
                className={`swatch-btn ${isSelected ? "selected" : ""}`}
                style={{ backgroundColor: swatch.hex }}
                onClick={() => updateTheme("accentColor", swatch.hex)}
                title={`${swatch.name} (${swatch.hex})`}
              >
                {isSelected && (
                  <Check
                    size={14}
                    style={{
                      color: ["#ffffff", "#f5b84b", "#06b6d4", "#facc15"].includes(swatch.hex.toLowerCase())
                        ? "#000"
                        : "#fff",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Color Input with Picker */}
        <div className="custom-color-picker-row">
          <label className="custom-color-picker-box" style={{ backgroundColor: activeAccent }}>
            <input
              type="color"
              value={activeAccent.startsWith("#") && activeAccent.length === 7 ? activeAccent : "#f5b84b"}
              onChange={(e) => {
                setAccentDraft(null);
                updateTheme("accentColor", e.target.value);
              }}
              className="native-color-input"
            />
          </label>
          <div className="custom-color-input-wrap">
            <span className="hex-prefix">#</span>
            <input
              type="text"
              value={accentDraft ?? activeAccent.replace("#", "")}
              onChange={(e) => {
                const next = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                setAccentDraft(next);
                if (next.length === 6) {
                  updateTheme("accentColor", `#${next}`);
                  setAccentDraft(null);
                }
              }}
              onBlur={() => setAccentDraft(null)}
              placeholder="f5b84b"
              maxLength={6}
              className="hex-text-input"
            />
          </div>
          <span className="custom-color-label">Custom Hex Accent</span>
        </div>
      </div>

      {/* SECTION 2: Background Surface Mode */}
      <div className="customizer-section-card">
        <div className="customizer-section-title">
          <Sun size={16} className="text-accent" />
          <h3>Background &amp; Surface Mood</h3>
        </div>
        <p className="customizer-help-text">
          Control the canvas atmosphere while preserving each template’s visual rhythm.
        </p>

        <div className="pill-choice-grid surface-grid">
          {SURFACE_MODES.map((mode) => {
            const isSelected = activeSurface === mode.id;
            return (
              <button
                type="button"
                key={mode.id}
                className={`pill-choice-card ${isSelected ? "selected" : ""}`}
                onClick={() => updateTheme("surfaceMode", mode.id)}
              >
                <div className="pill-choice-head">
                  <strong>{mode.name}</strong>
                  {isSelected && <Check size={14} className="text-accent" />}
                </div>
                <small>{mode.desc}</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Card & Container Style */}
      <div className="customizer-section-card">
        <div className="customizer-section-title">
          <Square size={16} className="text-accent" />
          <h3>Card &amp; Container Architecture</h3>
        </div>
        <p className="customizer-help-text">
          Shapes media cards, skill pills, stat widgets, and interactive panels.
        </p>

        <div className="pill-choice-grid">
          {CARD_STYLES.map((style) => {
            const isSelected = activeCardStyle === style.id;
            return (
              <button
                type="button"
                key={style.id}
                className={`pill-choice-card ${isSelected ? "selected" : ""}`}
                onClick={() => updateTheme("cardStyle", style.id)}
              >
                <div className="pill-choice-head">
                  <strong>{style.name}</strong>
                  {isSelected && <Check size={14} className="text-accent" />}
                </div>
                <small>{style.desc}</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Typography Pairing */}
      <div className="customizer-section-card">
        <div className="customizer-section-title">
          <Type size={16} className="text-accent" />
          <h3>Typography Pairing</h3>
        </div>
        <p className="customizer-help-text">
          Curated typographic scales for display titles, bio text, and section headings.
        </p>

        <div className="typography-choice-list">
          {FONT_PAIRINGS.map((font) => {
            const isSelected = activeFont === font.id;
            return (
              <button
                type="button"
                key={font.id}
                className={`typography-choice-item ${isSelected ? "selected" : ""}`}
                onClick={() => updateTheme("fontPairing", font.id)}
              >
                <div className="typo-radio-circle">
                  {isSelected && <div className="typo-radio-dot" />}
                </div>
                <div className="typo-info">
                  <div className="typo-title-row">
                    <strong>{font.name}</strong>
                    <span className="typo-sample-tag">{font.sample}</span>
                  </div>
                  <p>{font.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: Layout Density & Spacing */}
      <div className="customizer-section-card">
        <div className="customizer-section-title">
          <Maximize2 size={16} className="text-accent" />
          <h3>Layout Density &amp; Spacing Scale</h3>
        </div>
        <p className="customizer-help-text">
          Controls vertical rhythm, section padding, and whitespace gaps.
        </p>

        <div className="pill-choice-grid density-grid">
          {DENSITY_OPTIONS.map((dens) => {
            const isSelected = activeDensity === dens.id;
            return (
              <button
                type="button"
                key={dens.id}
                className={`pill-choice-card ${isSelected ? "selected" : ""}`}
                onClick={() => updateTheme("density", dens.id)}
              >
                <div className="pill-choice-head">
                  <strong>{dens.name}</strong>
                  <span className="density-scale-tag">{dens.scale}</span>
                </div>
                <small>{dens.desc}</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 6: Section Visibility Toggles & CTA Customization */}
      <div className="customizer-section-card">
        <div className="customizer-section-title">
          <Layers size={16} className="text-accent" />
          <h3>Section Visibility &amp; Element Customization</h3>
        </div>
        <p className="customizer-help-text">
          Toggle which content sections appear on your live published portfolio.
        </p>

        <div className="section-toggles-list">
          <div className="section-toggle-row">
            <div className="section-toggle-label">
              <strong>Hero / Bio &amp; Avatar</strong>
              <small>Name, headline, profile avatar, and status badge</small>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${sections.showHero !== false ? "on" : "off"}`}
              aria-label="Toggle hero and profile section"
              aria-pressed={sections.showHero !== false}
              onClick={() => updateSection("showHero", sections.showHero === false)}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="section-toggle-row">
            <div className="section-toggle-label">
              <strong>Work / Photo &amp; Video Gallery</strong>
              <small>Showcase videos, thumbnails, and portfolio albums ({activePortfolio.media?.length || 0} items)</small>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${sections.showWork !== false ? "on" : "off"}`}
              aria-label="Toggle work gallery"
              aria-pressed={sections.showWork !== false}
              onClick={() => updateSection("showWork", sections.showWork === false)}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="section-toggle-row">
            <div className="section-toggle-label">
              <strong>Skills &amp; Tech Stack</strong>
              <small>Category chips and software proficiencies ({activePortfolio.skills?.length || 0} skills)</small>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${sections.showSkills !== false ? "on" : "off"}`}
              aria-label="Toggle skills section"
              aria-pressed={sections.showSkills !== false}
              onClick={() => updateSection("showSkills", sections.showSkills === false)}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="section-toggle-row">
            <div className="section-toggle-label">
              <strong>Career Milestones / Timeline</strong>
              <small>Experience history and key milestones ({activePortfolio.timeline?.length || 0} entries)</small>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${sections.showTimeline !== false ? "on" : "off"}`}
              aria-label="Toggle timeline section"
              aria-pressed={sections.showTimeline !== false}
              onClick={() => updateSection("showTimeline", sections.showTimeline === false)}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="section-toggle-row">
            <div className="section-toggle-label">
              <strong>Contact &amp; Inquiry Section</strong>
              <small>Email address, WhatsApp button, and visitor brief form</small>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${sections.showContact !== false ? "on" : "off"}`}
              aria-label="Toggle contact section"
              aria-pressed={sections.showContact !== false}
              onClick={() => updateSection("showContact", sections.showContact === false)}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="section-toggle-row">
            <div className="section-toggle-label">
              <strong>Discord Presence &amp; Inquiries</strong>
              <small>Live Discord presence badge and direct webhook integration</small>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${sections.showDiscord !== false ? "on" : "off"}`}
              aria-label="Toggle Discord section"
              aria-pressed={sections.showDiscord !== false}
              onClick={() => updateSection("showDiscord", sections.showDiscord === false)}
            >
              <span className="toggle-slider" />
            </button>
          </div>
        </div>

        <div className="section-order-editor">
          <h4>Section order</h4>
          <p>Use the arrows to change the order used by templates that support stacked sections.</p>
          {sectionOrder.map((section, index) => (
            <div className="section-order-row" key={section}>
              <span>{({ hero: "Hero & bio", work: "Work gallery", skills: "Skills", timeline: "Timeline", contact: "Contact", discord: "Discord" })[section] || section}</span>
              <div>
                <button type="button" aria-label={`Move ${section} up`} disabled={index === 0} onClick={() => {
                  const reordered = [...sectionOrder];
                  [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
                  updateSection("sectionOrder", reordered);
                }}>↑</button>
                <button type="button" aria-label={`Move ${section} down`} disabled={index === sectionOrder.length - 1} onClick={() => {
                  const reordered = [...sectionOrder];
                  [reordered[index + 1], reordered[index]] = [reordered[index], reordered[index + 1]];
                  updateSection("sectionOrder", reordered);
                }}>↓</button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom CTA Label, Link, and Style */}
        <div className="custom-cta-input-group" style={{ marginTop: "24px" }}>
          <label className="editor-label">Custom Action Button Label</label>
          <input
            type="text"
            value={customCtaText}
            onChange={(e) => updateTheme("ctaText", e.target.value)}
            placeholder={`e.g. Work With ${activePortfolio.profile?.displayName || "Me"}, Hire Alex, Request Quote`}
            className="editor-input"
          />
          <label className="editor-label" style={{ marginTop: "14px" }}>Custom Action Button Link (optional)</label>
          <input type="text" value={customCtaUrl} onChange={(e) => updateTheme("ctaUrl", e.target.value)} placeholder="https://example.com/contact, mailto:you@example.com" className="editor-input" />
          <small className="account-field-help">When set, the primary CTA opens this link. Leave it empty to open the inquiry form. HTTPS, HTTP, email, and phone links are supported.</small>

          <label className="editor-label" style={{ marginTop: "14px" }}>Button Style</label>
          <select value={buttonStyle} onChange={(e) => updateTheme("buttonStyle", e.target.value)} className="editor-input">
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
            <option value="pill">Pill</option>
          </select>
        </div>
      </div>
    </div>
  );
};
