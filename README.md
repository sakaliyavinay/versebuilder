# VerseBuilder — Multi-User Portfolio Builder & Publishing Platform

VerseBuilder is a full-featured SaaS web platform where any creator can sign up, log in, create and customize multiple portfolios, choose from **8 visually distinct templates**, upload compressed photos and video reels, and publish a unique public URL (`/u/<username>` or `/p/<slug>`) that anyone on the internet can view.

---

## 🌟 Key Features

### 1. Authentication & Per-User Isolation
- **Sign Up & Log In**: Fast registration with Name, Email, Password, and custom Public Handle.
- **Session Persistence**: Sessions are saved and auto-restored on refresh. No pre-seeded default accounts.
- **Account & Ownership Protection**: Route guards ensure only the authenticated owner can access and edit their own portfolios in `/builder/:id`.
- **Zero-Data Clean Slate**: New accounts start 100% blank. Nothing renders on public URLs or live preview until added by that specific user.

### 2. Live Portfolio Builder
- **Profile & Identity**: Display Name, Role/Tagline, Headline Hook, Narrative Bio, Location, Availability Badge, and Photo/Avatar upload.
- **Skills & Technical Stack**: Add, edit, remove, and reorder skills with proficiency sliders (0–100%) and categories, plus 1-click popular skill chips.
- **Media Compression & Management**:
  - Automatic image compression (WebP / JPEG canvas optimization at ~82% quality, max 1920px width).
  - Video upload optimization (50MB size limit check, automatic video poster/thumbnail generation).
  - Processing progress bar and compression savings feedback indicator ("Original: X MB → Compressed: Y KB (Saved Z%)").
  - Video and image URLs (YouTube embeds, Vimeo, MP4 reels).
  - Built-in cinematic **Video Player Modal** and full-screen **Photo Lightbox**.
- **Contact & Discord Integration**:
  - Public Contact Email with show/hide toggle.
  - Mobile / Phone Number with country code picker, WhatsApp toggle, and privacy visibility switch.
  - Preferred contact method selector (Email, WhatsApp, Discord, Phone).
  - User-configurable Discord settings (username, copy tag button, invite URL, and Lanyard live presence).
  - **Inquiry Modal**: Visitors can submit project inquiries that dispatch directly to the creator's Discord Webhook and save to their local inbox.
- **Real-Time Live Preview**: Toggle split-screen or full preview, with live viewport switchers for **Desktop (100%)**, **Tablet (768px)**, and **Mobile (390px iPhone frame)**.

### 3. 8 Visually Distinct Templates (No Cookie-Cutter Sameness)
Switch templates in 1 click—all profile details, skills, photos, and videos dynamically re-render without losing any data:
1. **Dark Futuristic (`dark-futuristic`)**: Cyberpunk aesthetic with glowing cursor, tsparticles background, high-contrast neon accents, featured video hero spotlight, stats strip, and inquiry modal.
2. **Minimalist Editorial (`minimalist-editorial`)**: High-fashion typography, generous whitespace, ivory canvas (`#fcfbf7`), serif headlines, publication colophon, and editorial photo plates.
3. **Bento Grid (`bento-grid`)**: Apple/Vercel inspired modular card grid (`#090a0f`) grouping hero profile, live pulse status, stat badges, interactive skill tags, and video reels.
4. **Visual Masonry (`visual-masonry`)**: Multi-column staggered gallery with a sticky biographical sidebar and instant hover media overlays.
5. **Split-Screen Bold (`split-screen`)**: High-impact 50/50 dual pane anchoring bio, oversized typography, and metrics on the left with a scrolling project reel on the right.
6. **Classic Structured (`classic-structured`)**: Clean agency 3-column structured grid of project cards with category filtering, skill progress meters, and executive contact footer.
7. **Monochrome Studio (`monochrome-studio`)**: Pure black-and-white (`#000000` / `#ffffff`) brutalist art direction with monospace indices, catalog records (`[01 / WORK]`), and sharp architectural lines.
8. **Neo-Brutalist Pop (`neo-brutalist`)**: Thick black borders (`3px solid #111`), hard offset drop shadows (`5px 5px 0px #111`), vibrant pop colors, and tactile sticker badges.

### 4. Public URL & Publishing System
- **Draft vs. Published**: Keep portfolios private while editing; click **"Publish Live"** when ready.
- **Unique Shareable URLs**: Every published portfolio is accessible at `/u/:slug` (and `/p/:slug`).
- **Live Slug Validation**: Automatically validates uniqueness against existing portfolios and system routes, formatting slugs into clean lowercase alphanumeric strings.
- **1-Click Copy Public Link**: Instant clipboard copy with visual toast confirmation.
- **Read-Only Public Presentation**: Anyone can visit without logging in. Visiting a non-existent handle shows a clean "Portfolio Not Found" state.
- **Owner Bar**: If the owner visits their own public link while logged in, a top bar allows 1-click navigation back to the editor.

---

## 🏗️ Architecture & Codebase Structure

```
src/
├── components/
│   ├── builder/            # Editor tabs, header, device toggle, and publish modal
│   │   ├── BuilderHeader.jsx
│   │   ├── ProfileEditor.jsx
│   │   ├── SkillsEditor.jsx
│   │   ├── MediaManager.jsx
│   │   ├── ContactEditor.jsx
│   │   ├── TemplatePicker.jsx
│   │   └── PublishModal.jsx
│   ├── common/             # Shared interactive modals & badges
│   │   ├── DiscordPresenceBadge.jsx
│   │   ├── InquiryModal.jsx
│   │   ├── MediaLightbox.jsx
│   │   └── VideoModal.jsx
│   ├── navigation/         # Platform navigation & discovery pill
│   │   ├── PlatformNav.jsx
│   │   └── PublishedPill.jsx
│   └── preview/
│       └── LivePreviewFrame.jsx
├── context/
│   ├── AuthContext.jsx      # Multi-user auth state, sign up, login, session persistence
│   └── PortfolioContext.jsx # Portfolio CRUD, active state, draft saving, publishing
├── lib/
│   ├── defaultData.js      # Clean initial seeds (empty arrays)
│   ├── discordService.js   # Discord webhook inquiry dispatcher & Lanyard presence API
│   ├── mediaCompressor.js  # Client-side image & video compression / poster generation
│   └── storageService.js   # Client persistence engine (v3 schema normalization & isolation)
├── pages/
│   ├── LandingPage.jsx     # Clean SaaS homepage with template showcase
│   ├── DashboardPage.jsx   # Portfolios management for logged-in user
│   ├── BuilderPage.jsx     # Split-screen editor + live preview
│   ├── PublicPortfolioPage.jsx # Public read-only view (/u/:slug)
│   └── AuthPage.jsx        # Login & Sign Up screen
├── router/
│   └── Router.jsx          # Client-side router supporting both path and hash URLs
├── styles/
│   ├── builder.css         # Styles for builder workspace, tabs, inputs, and preview frame
│   ├── dashboard.css       # Styles for dashboard grid and modals
│   ├── landing.css         # Styles for homepage, navigation, and auth
│   └── templates.css       # Distinct stylesheets for all 8 templates & media modals
└── templates/
    ├── TemplateRegistry.jsx# Template registration & dynamic renderer
    ├── DarkFuturistic.jsx
    ├── MinimalistEditorial.jsx
    ├── BentoGrid.jsx
    ├── VisualMasonry.jsx
    ├── SplitScreen.jsx
    ├── ClassicStructured.jsx
    ├── MonochromeStudio.jsx
    └── NeoBrutalist.jsx
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open:
- `http://localhost:5173/` -> SaaS Platform Landing Page
- `http://localhost:5173/signup` -> Sign Up a new user
- `http://localhost:5173/login` -> Sign In
- `http://localhost:5173/dashboard` -> Creator Dashboard
- `http://localhost:5173/builder` -> Split-Screen Visual Builder
- `http://localhost:5173/u/<username>` -> Any Published Public Portfolio

---

## 📦 Building for Production

```bash
npm run build
```
Generates optimized static assets in `/dist`. Ready for deployment to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
"# versebuilder" 
