/**
 * Supabase Multi-User Cloud Database & Authentication Service
 * Uses native fetch without heavy SDK dependencies.
 * Enabled automatically when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present.
 */

import { storageService } from "./storageService";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const PORTFOLIOS_TABLE = "portfolios";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const getHeaders = (token = null) => ({
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${token || supabaseAnonKey}`,
  "Content-Type": "application/json",
});

const buildUserObject = (sbUser, fallbackName = "", fallbackUsername = "") => {
  const email = sbUser?.email || "";
  const cleanUsername = (
    sbUser?.user_metadata?.username ||
    fallbackUsername ||
    email.split("@")[0] ||
    "creator"
  )
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  return {
    id: sbUser?.id,
    email,
    name: sbUser?.user_metadata?.name || fallbackName || cleanUsername,
    username: cleanUsername,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
    bio: "",
    createdAt: sbUser?.created_at || new Date().toISOString(),
  };
};

/**
 * Convert a snake_case Supabase row into the camelCase portfolio object used by VerseBuilder
 */
export const mapRowToPortfolio = (row) => {
  if (!row) return null;
  return storageService.normalizePortfolio({
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    title: row.title,
    isPublished: Boolean(row.is_published),
    publishedAt: row.published_at || null,
    templateId: row.template_id || "dark-futuristic",
    themeSettings: row.theme_settings || { accentColor: "#f5b84b", fontStyle: "Inter" },
    profile: row.profile || {},
    skills: Array.isArray(row.skills) ? row.skills : [],
    stats: Array.isArray(row.stats) ? row.stats : [],
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
    media: Array.isArray(row.media) ? row.media : [],
    socials: row.socials || {},
    contact: row.contact || {},
    discord: row.discord || {},
    inbox: Array.isArray(row.inbox) ? row.inbox : [],
    analytics: row.analytics || {},
    sectionSettings: row.section_settings || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
};

// ---------------------------------------------------------------------------
// 1. AUTHENTICATION (Sign Up, Sign In, Refresh, Sign Out)
// ---------------------------------------------------------------------------

export const signUpWithSupabase = async ({ email, password, name, username }) => {
  if (!isSupabaseConfigured) return null;

  const cleanEmail = email.toLowerCase().trim();
  const cleanUsername = (username || cleanEmail.split("@")[0])
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email: cleanEmail,
      password,
      data: {
        name: name.trim(),
        username: cleanUsername,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || "Failed to create account.");
  }

  // If Supabase requires email confirmation, access_token won't be returned yet
  if (!data.access_token) {
    return {
      needsEmailConfirmation: true,
      email: cleanEmail,
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    needsEmailConfirmation: false,
    user: buildUserObject(data.user, name.trim(), cleanUsername),
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
};

export const signInWithSupabase = async ({ email, password }) => {
  if (!isSupabaseConfigured) return null;

  const cleanEmail = email.toLowerCase().trim();
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email: cleanEmail,
      password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || "Invalid email or password.");
  }

  return {
    user: buildUserObject(data.user),
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
};

export const refreshSupabaseSession = async (refreshToken) => {
  if (!isSupabaseConfigured || !refreshToken) return null;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!data.access_token || !data.user) return null;

    return {
      user: buildUserObject(data.user),
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch {
    return null;
  }
};

export const signOutFromSupabase = async (accessToken) => {
  if (!isSupabaseConfigured || !accessToken) return;
  try {
    await fetch(`${supabaseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: getHeaders(accessToken),
    });
  } catch {
    // Best-effort logout
  }
};

// ---------------------------------------------------------------------------
// 2. PORTFOLIO DATABASE OPERATIONS
// ---------------------------------------------------------------------------

export const getSupabasePortfolioById = async (portfolioId, token = null) => {
  if (!isSupabaseConfigured || !portfolioId) return null;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${PORTFOLIOS_TABLE}?id=eq.${encodeURIComponent(portfolioId)}&select=*`,
    {
      method: "GET",
      headers: getHeaders(token),
    }
  );

  if (!response.ok) return null;
  const list = await response.json();
  return list[0] ? mapRowToPortfolio(list[0]) : null;
};

/**
 * Fetch a portfolio by its public slug (published portfolios are public; drafts visible to owner with token)
 */
export const getSupabasePortfolioBySlug = async (slug, token = null) => {
  if (!isSupabaseConfigured || !slug) return null;

  const cleanSlug = encodeURIComponent(slug.toLowerCase().trim());
  const response = await fetch(
    `${supabaseUrl}/rest/v1/${PORTFOLIOS_TABLE}?slug=eq.${cleanSlug}&select=*`,
    {
      method: "GET",
      headers: getHeaders(token),
    }
  );

  if (!response.ok) return null;
  const list = await response.json();
  return list[0] ? mapRowToPortfolio(list[0]) : null;
};

/**
 * Fetch all portfolios belonging to the authenticated user
 */
export const getSupabasePortfoliosByUserId = async (userId, token) => {
  if (!isSupabaseConfigured || !userId) return [];

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${PORTFOLIOS_TABLE}?user_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc&select=*`,
    {
      method: "GET",
      headers: getHeaders(token),
    }
  );

  if (!response.ok) return [];
  const rows = await response.json();
  return Array.isArray(rows) ? rows.map(mapRowToPortfolio) : [];
};

/**
 * Check if a slug is available across Supabase portfolios
 */
export const isSupabaseSlugAvailable = async (slug, excludePortfolioId = null, token = null) => {
  if (!isSupabaseConfigured || !slug) return false;
  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "");

  if (cleanSlug.length < 2 || cleanSlug.length > 40) return false;
  const reservedRoutes = ["login", "signup", "dashboard", "builder", "admin", "api", "settings", "u", "p"];
  if (reservedRoutes.includes(cleanSlug)) return false;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/${PORTFOLIOS_TABLE}?slug=eq.${encodeURIComponent(cleanSlug)}&select=id`,
      {
        method: "GET",
        headers: getHeaders(token),
      }
    );
    if (!response.ok) return true;
    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) return true;
    return rows.every((r) => r.id === excludePortfolioId);
  } catch {
    return true;
  }
};

/**
 * Save or update a portfolio in Supabase (upsert)
 */
export const saveSupabasePortfolio = async (portfolio, token = null) => {
  if (!isSupabaseConfigured) return null;

  const normalized = storageService.normalizePortfolio(portfolio);
  const row = {
    id: normalized.id,
    user_id: normalized.userId,
    slug: normalized.slug,
    title: normalized.title,
    is_published: Boolean(normalized.isPublished),
    published_at: normalized.publishedAt || null,
    template_id: normalized.templateId,
    theme_settings: normalized.themeSettings,
    profile: normalized.profile,
    skills: normalized.skills,
    stats: normalized.stats,
    timeline: normalized.timeline,
    media: normalized.media,
    socials: normalized.socials,
    contact: normalized.contact,
    discord: normalized.discord,
    inbox: normalized.inbox || [],
    analytics: normalized.analytics || {},
    section_settings: normalized.sectionSettings,
    updated_at: new Date().toISOString(),
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/${PORTFOLIOS_TABLE}`, {
    method: "POST",
    headers: {
      ...getHeaders(token),
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Supabase portfolio save error:", errorText);
    throw new Error("Failed to save portfolio to Supabase database.");
  }

  const result = await response.json();
  return result[0] ? mapRowToPortfolio(result[0]) : normalized;
};

/**
 * Delete a portfolio from Supabase
 */
export const deleteSupabasePortfolio = async (portfolioId, token = null) => {
  if (!isSupabaseConfigured || !portfolioId) return false;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${PORTFOLIOS_TABLE}?id=eq.${encodeURIComponent(portfolioId)}`,
    {
      method: "DELETE",
      headers: getHeaders(token),
    }
  );

  return response.ok;
};
