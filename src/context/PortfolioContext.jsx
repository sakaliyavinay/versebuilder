import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { storageService } from "../lib/storageService";
import {
  isSupabaseConfigured,
  getSupabasePortfoliosByUserId,
  getSupabasePortfolioById,
  getSupabasePortfolioBySlug,
  saveSupabasePortfolio,
  deleteSupabasePortfolio,
  isSupabaseSlugAvailable,
} from "../lib/supabaseService";
import { useAuth } from "./AuthContext";

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [userPortfolios, setUserPortfolios] = useState([]);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const activePortfolioRef = useRef(activePortfolio);
  activePortfolioRef.current = activePortfolio;

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Refresh user's portfolios whenever user changes
  const refreshPortfolios = useCallback(async () => {
    if (!user?.id) {
      setUserPortfolios([]);
      return [];
    }

    if (isSupabaseConfigured) {
      const ports = await getSupabasePortfoliosByUserId(user.id, accessToken);
      setUserPortfolios(ports);
      return ports;
    }

    const ports = storageService.getPortfoliosByUserId(user.id);
    setUserPortfolios(ports);
    return ports;
  }, [user?.id, accessToken]);

  useEffect(() => {
    refreshPortfolios();
  }, [refreshPortfolios]);

  // Load a portfolio for editing
  const loadPortfolio = useCallback(
    async (portfolioId) => {
      let port = null;

      if (isSupabaseConfigured) {
        port = await getSupabasePortfolioById(portfolioId, accessToken);
      } else {
        port = storageService.getPortfolioById(portfolioId);
      }

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
    [user, accessToken]
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

  // Save changes to storage (Supabase when configured, else localStorage)
  const saveDraft = useCallback(
    async (customPortfolio = null) => {
      const target = customPortfolio || activePortfolioRef.current;
      if (!target) return null;

      setIsSaving(true);
      setSaveError(null);
      try {
        let saved;
        if (isSupabaseConfigured) {
          saved = await saveSupabasePortfolio(target, accessToken);
        } else {
          saved = storageService.savePortfolio(target);
        }

        activePortfolioRef.current = saved;
        setActivePortfolio(saved);
        setIsDirty(false);
        setLastSavedAt(new Date());
        await refreshPortfolios();
        return saved;
      } catch (err) {
        console.error("saveDraft failed:", err);
        setSaveError(err.message || "Failed to save portfolio.");
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [accessToken, refreshPortfolios]
  );

  const syncAccountIdentity = useCallback(
    async (previousUser, nextUser, { syncProfile = true } = {}) => {
      const portfolios = await refreshPortfolios();
      const handlePortfolio = portfolios.find((portfolio) => portfolio.slug === previousUser.username);

      if (handlePortfolio && nextUser.username !== previousUser.username) {
        const available = isSupabaseConfigured
          ? await isSupabaseSlugAvailable(nextUser.username, handlePortfolio.id, accessToken)
          : storageService.isSlugAvailable(nextUser.username, handlePortfolio.id);
        if (!available) throw new Error("That public handle is already used by another portfolio.");
      }

      const updatedPortfolios = [];
      for (const portfolio of portfolios) {
        const oldProfile = portfolio.profile || {};
        const nextProfile = syncProfile
          ? {
              ...oldProfile,
              displayName:
                !oldProfile.displayName || oldProfile.displayName === previousUser.name
                  ? nextUser.name
                  : oldProfile.displayName,
              avatarUrl:
                !oldProfile.avatarUrl || oldProfile.avatarUrl === previousUser.avatar
                  ? nextUser.avatar
                  : oldProfile.avatarUrl,
              bio:
                !oldProfile.bio || oldProfile.bio === previousUser.bio
                  ? nextUser.bio
                  : oldProfile.bio,
            }
          : oldProfile;
        const nextPortfolio = {
          ...portfolio,
          profile: nextProfile,
          slug:
            portfolio.id === handlePortfolio?.id && nextUser.username !== previousUser.username
              ? nextUser.username
              : portfolio.slug,
        };
        const saved = isSupabaseConfigured
          ? await saveSupabasePortfolio(nextPortfolio, accessToken)
          : storageService.savePortfolio(nextPortfolio);
        updatedPortfolios.push(saved);
        if (activePortfolioRef.current?.id === saved.id) {
          activePortfolioRef.current = saved;
          setActivePortfolio(saved);
          setIsDirty(false);
        }
      }

      await refreshPortfolios();
      return updatedPortfolios;
    },
    [accessToken, refreshPortfolios]
  );

  // Toggle publish state
  const setPublishStatus = useCallback(
    async (publishState = true) => {
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

  // Create a new blank portfolio
  const createPortfolio = useCallback(
    async ({ title, templateId = "dark-futuristic" }) => {
      if (!user) throw new Error("Must be logged in to create a portfolio.");

      const baseSlug = (title || user.username || "portfolio")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 24) || "portfolio";

      let cleanSlug = baseSlug;
      let count = 1;
      if (isSupabaseConfigured) {
        while (!(await isSupabaseSlugAvailable(cleanSlug, null, accessToken))) {
          cleanSlug = `${baseSlug}-${count}`;
          count++;
        }
      } else {
        while (!storageService.isSlugAvailable(cleanSlug)) {
          cleanSlug = `${baseSlug}-${count}`;
          count++;
        }
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
          accentColor: "",
          fontStyle: "Inter",
          surfaceMode: "auto",
          cardStyle: "rounded",
          fontPairing: "modern-sans",
          density: "balanced",
          ctaText: "",
          ctaUrl: "",
          buttonStyle: "solid",
        },
        profile: {
          displayName: user.name,
          headline: "",
          tagline: "",
          bio: "",
          location: "",
          avatarUrl: user.avatar,
          heroImage: "",
          statusBadge: "",
        },
        skills: [],
        stats: [],
        timeline: [],
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
        sectionSettings: {
          showHero: true,
          showWork: true,
          showSkills: true,
          showTimeline: true,
          showContact: true,
          showDiscord: true,
          sectionOrder: ["hero", "work", "skills", "timeline", "contact", "discord"],
        },
        updatedAt: new Date().toISOString(),
      };

      let saved;
      if (isSupabaseConfigured) {
        saved = await saveSupabasePortfolio(newPortfolio, accessToken);
      } else {
        saved = storageService.savePortfolio(newPortfolio);
      }
      await refreshPortfolios();
      return saved;
    },
    [user, accessToken, refreshPortfolios]
  );

  // Delete portfolio
  const deletePortfolio = useCallback(
    async (id) => {
      if (isSupabaseConfigured) {
        await deleteSupabasePortfolio(id, accessToken);
      } else {
        storageService.deletePortfolio(id);
      }
      await refreshPortfolios();
      if (activePortfolioRef.current?.id === id) {
        activePortfolioRef.current = null;
        setActivePortfolio(null);
      }
    },
    [accessToken, refreshPortfolios]
  );

  // Duplicate portfolio
  const duplicatePortfolio = useCallback(
    async (id) => {
      if (!user) return null;
      if (isSupabaseConfigured) {
        const original = await getSupabasePortfolioById(id, accessToken);
        if (!original) return null;
        let newSlug = `${original.slug}-copy`;
        let counter = 1;
        while (!(await isSupabaseSlugAvailable(newSlug, null, accessToken))) {
          newSlug = `${original.slug}-copy-${counter}`;
          counter++;
        }
        const copy = {
          ...original,
          id: `port_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId: user.id,
          slug: newSlug,
          title: `${original.title} (Copy)`,
          isPublished: false,
          publishedAt: null,
          updatedAt: new Date().toISOString(),
        };
        const saved = await saveSupabasePortfolio(copy, accessToken);
        await refreshPortfolios();
        return saved;
      }

      const dup = storageService.duplicatePortfolio(id, user.id);
      await refreshPortfolios();
      return dup;
    },
    [user, accessToken, refreshPortfolios]
  );

  // Fetch public portfolio by slug
  const getPublicPortfolio = useCallback(
    async (slug) => {
      if (isSupabaseConfigured) {
        return getSupabasePortfolioBySlug(slug, accessToken);
      }
      return storageService.getPortfolioBySlug(slug);
    },
    [accessToken]
  );

  // Validate slug
  const validateSlug = useCallback(
    async (slug, currentPortfolioId = null) => {
      if (isSupabaseConfigured) {
        return isSupabaseSlugAvailable(slug, currentPortfolioId, accessToken);
      }
      return storageService.isSlugAvailable(slug, currentPortfolioId);
    },
    [accessToken]
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
        syncAccountIdentity,
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
