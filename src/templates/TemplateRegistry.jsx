import React from "react";
import { DarkFuturistic } from "./DarkFuturistic";
import { MinimalistEditorial } from "./MinimalistEditorial";
import { BentoGrid } from "./BentoGrid";
import { VisualMasonry } from "./VisualMasonry";
import { SplitScreen } from "./SplitScreen";
import { ClassicStructured } from "./ClassicStructured";
import { MonochromeStudio } from "./MonochromeStudio";
import { NeoBrutalist } from "./NeoBrutalist";
import { CustomizedTemplateWrapper } from "./CustomizedTemplateWrapper";

export const TEMPLATES = [
  {
    id: "dark-futuristic",
    name: "Dark Futuristic",
    tagline: "Cyberpunk creator aesthetic with neon accents & glowing cursor",
    category: "Creator & Gaming",
    accentColor: "#f5b84b",
    badge: "Creator Signature",
    previewBg: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    component: DarkFuturistic,
    description: "Built for video editors, gaming creators, and visual artists who want high energy, dark glassmorphism, animated particle backgrounds, and glowing interactive elements.",
  },
  {
    id: "minimalist-editorial",
    name: "Minimalist Editorial",
    tagline: "High-fashion typography, generous whitespace & ivory canvas",
    category: "Design & Arts",
    accentColor: "#8b5e3c",
    badge: "Editorial Choice",
    previewBg: "linear-gradient(135deg, #fcfbf7 0%, #f4f1ea 100%)",
    component: MinimalistEditorial,
    description: "Sophisticated magazine and book art-direction format. Emphasizes typography, editorial narrative, and refined photo plates.",
  },
  {
    id: "bento-grid",
    name: "Bento Grid",
    tagline: "Modern modular card layout inspired by Apple & Vercel design",
    category: "Tech & Motion",
    accentColor: "#38bdf8",
    badge: "Trending",
    previewBg: "linear-gradient(135deg, #090a0f 0%, #111827 100%)",
    component: BentoGrid,
    description: "Dynamic asymmetric bento cards grouping stats, video showcases, interactive skill clouds, and media into an organized, responsive visual feed.",
  },
  {
    id: "visual-masonry",
    name: "Visual Masonry",
    tagline: "Pinterest / Behance multi-column staggered gallery with sticky profile",
    category: "Photography & Media",
    accentColor: "#10b981",
    badge: "Media-First",
    previewBg: "linear-gradient(135deg, #111317 0%, #1b1e24 100%)",
    component: VisualMasonry,
    description: "Ideal for heavy visual catalogs, thumbnails, and photography. Features a fixed biographical sidebar and an infinite multi-column masonry gallery with instant hover previews.",
  },
  {
    id: "split-screen",
    name: "Split-Screen Bold",
    tagline: "Sticky 50/50 dual pane with oversized typography and scrolling reel",
    category: "Branding & Directing",
    accentColor: "#6366f1",
    badge: "Bold Impact",
    previewBg: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%)",
    component: SplitScreen,
    description: "High-contrast layout anchoring your bio, metrics, and call-to-action on the left while visitors scroll through full-bleed project cards on the right.",
  },
  {
    id: "classic-structured",
    name: "Classic Structured",
    tagline: "Agency & executive 3-column cards with category filtering",
    category: "Agency & Corporate",
    accentColor: "#3b82f6",
    badge: "Executive",
    previewBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    component: ClassicStructured,
    description: "Time-tested corporate & studio layout featuring clear top navigation, organized card grids, skill progress meters, and an executive contact footer.",
  },
  {
    id: "monochrome-studio",
    name: "Monochrome Studio",
    tagline: "Stark black & white brutalist art direction with numbered records",
    category: "Architecture & Fashion",
    accentColor: "#ffffff",
    badge: "High-Contrast",
    previewBg: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    component: MonochromeStudio,
    description: "Strict black-and-white palette, monospace catalog indicators, uppercase headings, and sharp architectural dividers.",
  },
  {
    id: "neo-brutalist",
    name: "Neo-Brutalist Pop",
    tagline: "Thick black borders, hard drop shadows, playful badges & vibrant colors",
    category: "Indie Creator",
    accentColor: "#facc15",
    badge: "Playful",
    previewBg: "linear-gradient(135deg, #fef3c7 0%, #fde047 100%)",
    component: NeoBrutalist,
    description: "Vibrant and punchy web aesthetic featuring high contrast borders, tactile click states, sticker tags, and unmistakable personality.",
  },
];

export const getTemplateById = (templateId) => {
  return TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
};

export const renderTemplate = (templateId, props) => {
  return (
    <CustomizedTemplateWrapper
      templateId={templateId}
      portfolio={props.portfolio}
      isPreview={props.isPreview}
    />
  );
};
