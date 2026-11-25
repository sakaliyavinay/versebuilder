import { INITIAL_USERS, INITIAL_PORTFOLIOS } from "./defaultData";

const USERS_STORAGE_KEY = "versebuilder_users_v1";
const PORTFOLIOS_STORAGE_KEY = "versebuilder_portfolios_v1";
const SESSION_STORAGE_KEY = "versebuilder_active_session_v1";

const LEGACY_USERS_KEY = "foliocraft_users_v3";
const LEGACY_PORTFOLIOS_KEY = "foliocraft_portfolios_v3";
const LEGACY_SESSION_KEY = "foliocraft_active_session_v3";

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    try {
      // Seamlessly migrate any existing user data from previous session
      if (!localStorage.getItem(USERS_STORAGE_KEY) && localStorage.getItem(LEGACY_USERS_KEY)) {
        localStorage.setItem(USERS_STORAGE_KEY, localStorage.getItem(LEGACY_USERS_KEY));
      }
      if (!localStorage.getItem(PORTFOLIOS_STORAGE_KEY) && localStorage.getItem(LEGACY_PORTFOLIOS_KEY)) {
        localStorage.setItem(PORTFOLIOS_STORAGE_KEY, localStorage.getItem(LEGACY_PORTFOLIOS_KEY));
      }
      if (!localStorage.getItem(SESSION_STORAGE_KEY) && localStorage.getItem(LEGACY_SESSION_KEY)) {
        localStorage.setItem(SESSION_STORAGE_KEY, localStorage.getItem(LEGACY_SESSION_KEY));
      }

      if (!localStorage.getItem(USERS_STORAGE_KEY)) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }
      if (!localStorage.getItem(PORTFOLIOS_STORAGE_KEY)) {
        localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(INITIAL_PORTFOLIOS));
      }
    } catch (err) {
      console.error("Failed to initialize storage", err);
    }
  }

  // Normalization helper ensures every portfolio has complete contact & discord shapes
  normalizePortfolio(p) {
    if (!p) return null;
    return {
      ...p,
      contact: {
        ...p.contact,
        heading:
          p.contact?.heading !== undefined
            ? p.contact.heading
            : "Let's build something unforgettable together.",
        subheading:
          p.contact?.subheading !== undefined
            ? p.contact.subheading
            : "Available for commissions, projects, and full visual packages.",
        eyebrow:
          p.contact?.eyebrow !== undefined
            ? p.contact.eyebrow
            : "READY FOR YOUR NEXT PROJECT?",
        buttonText:
          p.contact?.buttonText !== undefined
            ? p.contact.buttonText
            : "Send Project Brief",
        email:
          p.contact?.email !== undefined
            ? p.contact.email
            : (p.socials?.email || ""),
        showEmail: p.contact?.showEmail !== false,
        phone: p.contact?.phone || "",
        countryCode: p.contact?.countryCode || "+1",
        rawPhone: p.contact?.rawPhone || "",
        showPhone: Boolean(p.contact?.showPhone),
        isWhatsApp: Boolean(p.contact?.isWhatsApp),
        preferredMethod: p.contact?.preferredMethod || "email",
      },
      discord: {
        enabled: Boolean(p.discord?.enabled),
        username: p.discord?.username || "",
        userId: p.discord?.userId || "",
        inviteUrl: p.discord?.inviteUrl || "",
        webhookUrl: p.discord?.webhookUrl || "",
        showPresence: Boolean(p.discord?.showPresence),
        allowInquiries: p.discord?.allowInquiries !== false,
      },
      inbox: Array.isArray(p.inbox) ? p.inbox : [],
      analytics: {
        views: p.analytics?.views || 0,
        uniqueVisitors: p.analytics?.uniqueVisitors || 0,
        clicks: {
          discord: p.analytics?.clicks?.discord || 0,
          email: p.analytics?.clicks?.email || 0,
          whatsapp: p.analytics?.clicks?.whatsapp || 0,
        },
      },
      themeSettings: {
        accentColor: p.themeSettings?.accentColor || "",
        surfaceMode: p.themeSettings?.surfaceMode || "auto",
        cardStyle: p.themeSettings?.cardStyle || "rounded",
        fontPairing: p.themeSettings?.fontPairing || "modern-sans",
        density: p.themeSettings?.density || "balanced",
        ctaText: p.themeSettings?.ctaText || "",
        ctaUrl: p.themeSettings?.ctaUrl || "",
        buttonStyle: p.themeSettings?.buttonStyle || "solid",
        ...p.themeSettings,
      },
      sectionSettings: {
        showHero: p.sectionSettings?.showHero !== false,
        showWork: p.sectionSettings?.showWork !== false,
        showSkills: p.sectionSettings?.showSkills !== false,
        showTimeline: p.sectionSettings?.showTimeline !== false,
        showContact: p.sectionSettings?.showContact !== false,
        showDiscord: p.sectionSettings?.showDiscord !== false,
        sectionOrder: Array.isArray(p.sectionSettings?.sectionOrder)
          ? p.sectionSettings.sectionOrder
          : ["hero", "work", "skills", "timeline", "contact", "discord"],
        ...p.sectionSettings,
      },
    };
  }

  // User methods
  getUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
      console.error("Failed to save users", err);
    }
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  getUserByUsername(username) {
    const users = this.getUsers();
    return users.find((u) => u.username.toLowerCase() === username.toLowerCase().trim()) || null;
  }

  isUsernameAvailable(username, currentUserId = null) {
    if (!username) return false;
    const cleanUsername = username.toLowerCase().trim();
    const existing = this.getUserByUsername(cleanUsername);
    if (!existing) return true;
    return existing.id === currentUserId;
  }

  updateUserProfile(userId, updates = {}) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error("User not found.");
    }

    if (updates.username) {
      const cleanUsername = updates.username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
      const existingUser = this.getUserByUsername(cleanUsername);
      if (existingUser && existingUser.id !== userId) {
        throw new Error("Username is already taken by another creator.");
      }
      updates.username = cleanUsername;
    }

    const updatedUser = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    this.saveUsers(users);

    // If current session is this user, update session as well
    const session = this.getCurrentSession();
    if (session && session.id === userId) {
      this.setCurrentSession(updatedUser);
    }

    return updatedUser;
  }

  updateUserPassword(userId, newPassword) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error("User not found.");
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    users[index].password = newPassword;
    this.saveUsers(users);
    return true;
  }

  createUser({ name, email, password, username, phone }) {
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = (username || cleanEmail.split("@")[0])
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");

    if (this.getUserByEmail(cleanEmail)) {
      throw new Error("An account with this email already exists.");
    }

    if (this.getUserByUsername(cleanUsername)) {
      throw new Error("This username is already taken. Please choose another.");
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      username: cleanUsername,
      password: password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
      bio: "",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Create a completely blank starter portfolio — user fills everything themselves
    const starterPortfolio = {
      id: `port_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: newUser.id,
      slug: cleanUsername,
      title: `${newUser.name}'s Portfolio`,
      isPublished: false,
      publishedAt: null,
      templateId: "dark-futuristic",
      themeSettings: {
        accentColor: "#f5b84b",
        fontStyle: "Inter",
      },
      profile: {
        displayName: newUser.name,
        headline: "",
        tagline: "",
        bio: "",
        location: "",
        avatarUrl: newUser.avatar,
        heroImage: "",
        statusBadge: "",
      },
      contact: {
        heading: "Let's build something unforgettable together.",
        subheading: "Available for commissions, projects, and creator packages.",
        eyebrow: "READY FOR YOUR NEXT PROJECT?",
        buttonText: "Send Project Brief",
        email: cleanEmail,
        showEmail: true,
        phone: phone ? phone.trim() : "",
        countryCode: "+1",
        rawPhone: phone ? phone.trim() : "",
        showPhone: Boolean(phone),
        isWhatsApp: false,
        preferredMethod: "email",
      },
      discord: {
        enabled: false,
        username: "",
        userId: "",
        inviteUrl: "",
        webhookUrl: "",
        showPresence: false,
        allowInquiries: true,
      },
      inbox: [],
      analytics: {
        views: 0,
        uniqueVisitors: 0,
        clicks: { discord: 0, email: 0, whatsapp: 0 },
      },
      sectionSettings: {
        showHero: true,
        showWork: true,
        showSkills: true,
        showTimeline: true,
        showContact: true,
        showDiscord: true,
      },
      skills: [],
      stats: [],
      timeline: [],
      media: [],
      socials: {
        email: cleanEmail,
        website: "",
        twitter: "",
        youtube: "",
        discord: "",
        github: "",
      },
      updatedAt: new Date().toISOString(),
    };

    this.savePortfolio(starterPortfolio);
    return newUser;
  }

  authenticateUser({ email, password }) {
    const cleanEmail = email.toLowerCase().trim();
    const user = this.getUserByEmail(cleanEmail);
    if (!user) {
      throw new Error("No user found with this email address.");
    }
    if (user.password && password && user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }
    return user;
  }

  // Session
  getCurrentSession() {
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!data) return null;
      const session = JSON.parse(data);
      // Validate the session user still exists
      const userExists = this.getUserById(session.id);
      if (!userExists) {
        this.clearCurrentSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  setCurrentSession(user) {
    try {
      if (!user) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } else {
        // Never store password in session
        const { password, ...safeUser } = user;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));
      }
    } catch (err) {
      console.error("Failed to set session", err);
    }
  }

  clearCurrentSession() {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear session", err);
    }
  }

  // Portfolio methods
  getPortfolios() {
    try {
      const data = localStorage.getItem(PORTFOLIOS_STORAGE_KEY);
      const list = data ? JSON.parse(data) : [];
      return list.map((p) => this.normalizePortfolio(p));
    } catch {
      return [];
    }
  }

  savePortfolios(portfolios) {
    try {
      localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(portfolios));
    } catch (err) {
      console.error("Failed to save portfolios to localStorage", err);
      if (err.name === "QuotaExceededError" || err.code === 22) {
        throw new Error(
          "Browser storage quota exceeded. Large uploaded photos or videos cannot fit in local storage. Please remove or compress large media files."
        );
      }
      throw err;
    }
  }

  getPortfolioById(id) {
    const portfolios = this.getPortfolios();
    const found = portfolios.find((p) => p.id === id);
    return found ? this.normalizePortfolio(found) : null;
  }

  getPortfolioBySlug(slug) {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    const portfolios = this.getPortfolios();
    const found = portfolios.find((p) => p.slug && p.slug.toLowerCase() === cleanSlug);
    return found ? this.normalizePortfolio(found) : null;
  }

  getPortfoliosByUserId(userId) {
    const portfolios = this.getPortfolios();
    return portfolios.filter((p) => p.userId === userId);
  }

  isSlugAvailable(slug, excludePortfolioId = null) {
    if (!slug) return false;
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "");

    if (cleanSlug.length < 2 || cleanSlug.length > 40) return false;

    const reservedRoutes = ["login", "signup", "dashboard", "builder", "admin", "api", "settings", "u", "p"];
    if (reservedRoutes.includes(cleanSlug)) return false;

    const portfolios = this.getPortfolios();
    const existing = portfolios.find(
      (p) => p.slug && p.slug.toLowerCase() === cleanSlug && p.id !== excludePortfolioId
    );
    return !existing;
  }

  savePortfolio(portfolio) {
    const portfolios = this.getPortfolios();
    const normalized = this.normalizePortfolio(portfolio);
    const index = portfolios.findIndex((p) => p.id === normalized.id);
    const updated = {
      ...normalized,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      portfolios[index] = updated;
    } else {
      portfolios.push(updated);
    }

    this.savePortfolios(portfolios);
    return updated;
  }

  deletePortfolio(id) {
    const portfolios = this.getPortfolios();
    const filtered = portfolios.filter((p) => p.id !== id);
    this.savePortfolios(filtered);
    return true;
  }

  publishPortfolio(id, isPublished = true) {
    const portfolio = this.getPortfolioById(id);
    if (!portfolio) throw new Error("Portfolio not found.");
    portfolio.isPublished = isPublished;
    if (isPublished && !portfolio.publishedAt) {
      portfolio.publishedAt = new Date().toISOString();
    }
    if (!isPublished) {
      portfolio.publishedAt = null;
    }
    return this.savePortfolio(portfolio);
  }

  duplicatePortfolio(id, userId) {
    const original = this.getPortfolioById(id);
    if (!original) throw new Error("Original portfolio not found.");

    const newSlugBase = `${original.slug}-copy`;
    let newSlug = newSlugBase;
    let counter = 1;
    while (!this.isSlugAvailable(newSlug)) {
      newSlug = `${newSlugBase}-${counter}`;
      counter++;
    }

    const copy = {
      ...JSON.parse(JSON.stringify(original)),
      id: `port_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: userId || original.userId,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      isPublished: false,
      publishedAt: null,
      inbox: [],
      analytics: { views: 0, uniqueVisitors: 0, clicks: { discord: 0, email: 0, whatsapp: 0 } },
      updatedAt: new Date().toISOString(),
    };

    return this.savePortfolio(copy);
  }

  // Inbox & Analytics Methods
  addInquiry(portfolioId, inquiry) {
    const port = this.getPortfolioById(portfolioId);
    if (!port) return null;
    port.inbox = [inquiry, ...(port.inbox || [])];
    return this.savePortfolio(port);
  }

  markInquiryRead(portfolioId, inquiryId) {
    const port = this.getPortfolioById(portfolioId);
    if (!port) return null;
    port.inbox = (port.inbox || []).map((inq) =>
      inq.id === inquiryId ? { ...inq, read: true } : inq
    );
    return this.savePortfolio(port);
  }

  deleteInquiry(portfolioId, inquiryId) {
    const port = this.getPortfolioById(portfolioId);
    if (!port) return null;
    port.inbox = (port.inbox || []).filter((inq) => inq.id !== inquiryId);
    return this.savePortfolio(port);
  }

  recordAnalyticsView(slug) {
    const port = this.getPortfolioBySlug(slug);
    if (!port) return;
    const views = (port.analytics?.views || 0) + 1;
    const unique = (port.analytics?.uniqueVisitors || 0) + 1;
    port.analytics = {
      ...(port.analytics || {}),
      views,
      uniqueVisitors: unique,
    };
    this.savePortfolio(port);
  }

  recordAnalyticsClick(slug, clickType) {
    const port = this.getPortfolioBySlug(slug);
    if (!port) return;
    const clicks = port.analytics?.clicks || { discord: 0, email: 0, whatsapp: 0 };
    clicks[clickType] = (clicks[clickType] || 0) + 1;
    port.analytics = {
      ...(port.analytics || {}),
      clicks,
    };
    this.savePortfolio(port);
  }

  resetToDefaults() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(PORTFOLIOS_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.init();
    return { users: [], portfolios: [] };
  }
}

export const storageService = new StorageService();
