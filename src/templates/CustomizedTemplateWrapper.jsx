import { useMemo } from "react";
import { getTemplateById } from "./TemplateRegistry";

const DEFAULT_SECTION_ORDER = ["hero", "work", "skills", "timeline", "contact", "discord"];

/**
 * CustomizedTemplateWrapper
 * Injects user's customized design tokens (accent color, surface mode, card style,
 * font pairing, density scale) into the active template scope via CSS variables and classes.
 */
export const CustomizedTemplateWrapper = ({ templateId, portfolio, isPreview = false }) => {
  const template = getTemplateById(templateId);
  const Component = template.component;

  const themeSettings = portfolio?.themeSettings || {};
  const sectionSettings = portfolio?.sectionSettings || {};

  const accentColor = themeSettings.accentColor || template.accentColor || "#f5b84b";
  const surfaceMode = themeSettings.surfaceMode || "auto"; // "auto" | "dark" | "black" | "light"
  const cardStyle = themeSettings.cardStyle || "rounded"; // "sharp" | "rounded" | "glass"
  const fontPairing = themeSettings.fontPairing || "modern-sans"; // "modern-sans" | "editorial-serif" | "tech-mono" | "bold-display"
  const density = themeSettings.density || "balanced"; // "compact" | "balanced" | "spacious"
  const buttonStyle = themeSettings.buttonStyle || "solid";
  const sectionOrder = sectionSettings.sectionOrder || DEFAULT_SECTION_ORDER;

  // Convert hex color to rgb for rgba CSS variables
  const rgbAccent = useMemo(() => {
    let hex = accentColor.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(hex, 16);
    if (isNaN(num)) return "245, 184, 75";
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }, [accentColor]);

  const customStyle = useMemo(() => {
    const styleObj = {
      "--theme-accent": accentColor,
      "--theme-accent-rgb": rgbAccent,
      "--theme-accent-glow": `rgba(${rgbAccent}, 0.35)`,
      "--theme-accent-soft": `rgba(${rgbAccent}, 0.12)`,
      "--theme-accent-border": `rgba(${rgbAccent}, 0.3)`,
    };
    ["hero", "work", "skills", "timeline", "contact", "discord"].forEach((section) => {
      const index = sectionOrder.indexOf(section);
      styleObj[`--theme-order-${section}`] = index < 0 ? 99 : index + 1;
    });

    if (cardStyle === "sharp") {
      styleObj["--theme-radius"] = "0px";
      styleObj["--theme-radius-sm"] = "0px";
      styleObj["--theme-radius-lg"] = "0px";
    } else if (cardStyle === "glass") {
      styleObj["--theme-radius"] = "20px";
      styleObj["--theme-radius-sm"] = "12px";
      styleObj["--theme-radius-lg"] = "28px";
    } else {
      // rounded
      styleObj["--theme-radius"] = "14px";
      styleObj["--theme-radius-sm"] = "8px";
      styleObj["--theme-radius-lg"] = "20px";
    }

    if (fontPairing === "editorial-serif") {
      styleObj["--theme-font-family"] = "'Playfair Display', Georgia, Cambria, serif";
      styleObj["--theme-heading-font"] = "'Playfair Display', Georgia, serif";
    } else if (fontPairing === "tech-mono") {
      styleObj["--theme-font-family"] = "'JetBrains Mono', 'Fira Code', Menlo, monospace";
      styleObj["--theme-heading-font"] = "'JetBrains Mono', monospace";
    } else if (fontPairing === "bold-display") {
      styleObj["--theme-font-family"] = "'Syne', 'Impact', sans-serif";
      styleObj["--theme-heading-font"] = "'Syne', sans-serif";
    } else {
      // modern-sans
      styleObj["--theme-font-family"] = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
      styleObj["--theme-heading-font"] = "'Inter', -apple-system, sans-serif";
    }

    if (density === "compact") {
      styleObj["--theme-space-scale"] = "0.78";
      styleObj["--theme-section-padding"] = "40px 0";
    } else if (density === "spacious") {
      styleObj["--theme-space-scale"] = "1.3";
      styleObj["--theme-section-padding"] = "90px 0";
    } else {
      // balanced
      styleObj["--theme-space-scale"] = "1";
      styleObj["--theme-section-padding"] = "64px 0";
    }

    return styleObj;
  }, [accentColor, rgbAccent, cardStyle, fontPairing, density, sectionOrder]);

  return (
    <div
      className={`template-custom-scope template-${templateId} ${sectionSettings.showHero === false ? "hide-hero" : ""} ${sectionSettings.showWork === false ? "hide-work" : ""} ${sectionSettings.showSkills === false ? "hide-skills" : ""} ${sectionSettings.showTimeline === false ? "hide-timeline" : ""} ${sectionSettings.showContact === false ? "hide-contact" : ""} ${sectionSettings.showDiscord === false ? "hide-discord" : ""} surface-${surfaceMode} card-${cardStyle} cta-style-${buttonStyle} font-${fontPairing} density-${density}`}
      style={customStyle}
    >
      <Component
        portfolio={portfolio}
        isPreview={isPreview}
        customTheme={{
          accentColor,
          surfaceMode,
          cardStyle,
          fontPairing,
          density,
          sectionSettings,
        }}
      />
    </div>
  );
};
