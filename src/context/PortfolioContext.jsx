import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { storageService } from "../lib/storageService";
import { useAuth } from "./AuthContext";

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const { user } = useAuth();
  const [userPortfolios, setUserPortfolios] = useState([]);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const activePortfolioRef = useRef(activePortfolio);
  activePortfolioRef.current = activePortfolio;

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Refresh user's portfolios whenever user changes
  const refreshPortfolios = useCallback(() => {
    if (user?.id) {
      const ports = storageService.getPortfoliosByUserId(user.id);
      setUserPortfolios(ports);
      return ports;
    } else {
      setUserPortfolios([]);
      return [];
    }
  }, [user?.id]);

  useEffect(() => {
    refreshPortfolios();
  }, [refreshPortfolios]);

  // Load a portfolio for editing
  const loadPortfolio = useCallback(
    (portfolioId) => {
      const port = storageService.getPortfolioById(portfolioId);
      if (!port) return null;

      // Ownership check: user can only edit their own portfolio
      if (user && port.userId !== user.id) {
        return { error: "unauthorized", portfolio: port };
      }

      activePortfolioRef.current = port;
      setActivePortfolio(port);
      setIsDirty(false);
      return { portfolio: port };
    },
    [user]
  );

  // Update in-memory state of active portfolio
  const updateActivePortfolio = useCallback((updates) => {
    setActivePortfolio((prev) => {
      if (!prev) return prev;
      const next = typeof updates === "function" ? updates(prev) : { ...prev, ...updates };
      activePortfolioRef.current = next;
      return next;
    });
    setIsDirty(true);
  }, []);

  // Save changes to storage
  const saveDraft = useCallback(
    (customPortfolio = null) => {
      const target = customPortfolio || activePortfolioRef.current;
      if (!target) return null;

      setIsSaving(true);
      setSaveError(null);
      try {
        const saved = storageService.savePortfolio(target);
        activePortfolioRef.current = saved;
        setActivePortfolio(saved);
        setIsDirty(false);
        const now = new Date();
        setLastSavedAt(now);
        refreshPortfolios();
        return saved;
      } catch (err) {
        console.error("saveDraft failed:", err);
        setSaveError(err.message || "Failed to save portfolio.");
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [refreshPortfolios]
  );

  // Toggle publish state
  const setPublishStatus = useCallback(
    (publishState = true) => {
      const current = activePortfolioRef.current;
      if (!current) return null;
      const updated = {
        ...current,
        isPublished: publishState,
        publishedAt: publishState ? (current.publishedAt || new Date().toISOString()) : current.publishedAt,
      };
      return saveDraft(updated);
    },
    [saveDraft]
  );

  // Create a new portfolio
  const createPortfolio = useCallback(
    ({ title, templateId = "dark-futuristic" }) => {
      if (!user) throw new Error("Must be logged in to create a portfolio.");

      const baseSlug = (title || user.username)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 24);

      let cleanSlug = baseSlug;
      let count = 1;
      while (!storageService.isSlugAvailable(cleanSlug)) {
        cleanSlug = `${baseSlug}-${count}`;
        count++;
      }

      const newPortfolio = {
        id: `port_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: user.id,
        slug: cleanSlug,
        title: title || `${user.name}'s Portfolio`,
        isPublished: false,
        publishedAt: null,
        templateId: templateId || "dark-futuristic",
        themeSettings: {
          accentColor: "#f5b84b",
          fontStyle: "Inter",
        },
        profile: {
          displayName: user.name,
          headline: "Creative professional crafting modern digital work.",
          tagline: "Creator & Designer",
          bio: "Welcome to my portfolio! I specialize in high quality media production, design, and digital experiences.",
          location: "Remote Worldwide",
          avatarUrl: user.avatar,
          heroImage: "",
          statusBadge: "Available for new projects",
        },
        skills: [
          { id: `sk-${Date.now()}-1`, name: "Visual Design", level: 90, category: "Design" },
          { id: `sk-${Date.now()}-2`, name: "Creative Direction", level: 85, category: "Direction" },
          { id: `sk-${Date.now()}-3`, name: "Project Delivery", level: 88, category: "Production" },
        ],
        stats: [
          { label: "Completed", value: "15+" },
          { label: "Clients", value: "8+" },
          { label: "Rating", value: "4.9/5" },
        ],
        timeline: [
          {
            year: "2025",
            title: "Started Creative Portfolio",
            description: "Developing visual voice and client partnerships.",
          },
          {
            year: "2026",
            title: "Expanding Independent Practice",
            description: "Delivering larger commercial and creator assets.",
          },
        ],
        media: [],
        socials: {
          email: user.email,
          twitter: "",
          youtube: "",
          discord: "",
          github: "",
          linkedin: "",
          website: "",
        },
        contact: {
          eyebrow: "READY FOR YOUR NEXT PROJECT?",
          heading: "Let's build something unforgettable together.",
          subheading: "Available for commissions, projects, and full visual packages.",
          buttonText: "Send Project Brief",
          email: user.email,
          showEmail: true,
          phone: "",
          countryCode: "+1",
          rawPhone: "",
          showPhone: false,
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
        updatedAt: new Date().toISOString(),
      };

      const saved = storageService.savePortfolio(newPortfolio);
      refreshPortfolios();
      return saved;
    },
    [user, refreshPortfolios]
  );

  // Delete portfolio
  const deletePortfolio = useCallback(
    (id) => {
      storageService.deletePortfolio(id);
      refreshPortfolios();
      if (activePortfolio?.id === id) {
        setActivePortfolio(null);
      }
    },
    [activePortfolio?.id, refreshPortfolios]
  );

  // Duplicate portfolio
  const duplicatePortfolio = useCallback(
    (id) => {
      if (!user) return null;
      const dup = storageService.duplicatePortfolio(id, user.id);
      refreshPortfolios();
      return dup;
    },
    [user, refreshPortfolios]
  );

  // Fetch public portfolio by slug
  const getPublicPortfolio = useCallback((slug) => {
    return storageService.getPortfolioBySlug(slug);
  }, []);

  // Validate slug
  const validateSlug = useCallback(
    (slug, currentPortfolioId = null) => {
      return storageService.isSlugAvailable(slug, currentPortfolioId);
    },
    []
  );

  return (
    <PortfolioContext.Provider
      value={{
        userPortfolios,
        activePortfolio,
        isDirty,
        isSaving,
        lastSavedAt,
        saveError,
        loadPortfolio,
        setActivePortfolio,
        updateActivePortfolio,
        saveDraft,
        setPublishStatus,
        createPortfolio,
        deletePortfolio,
        duplicatePortfolio,
        getPublicPortfolio,
        validateSlug,
        refreshPortfolios,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
