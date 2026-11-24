/**
 * Supabase Multi-User Cloud Database & Authentication Service
 * Uses native fetch without heavy SDK dependencies.
 * Enabled automatically when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const PORTFOLIOS_TABLE = "portfolios";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const getHeaders = (token = null) => {
  const headers = {
    apikey: supabaseAnonKey,
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["Authorization"] = `Bearer ${supabaseAnonKey}`;
  }
  return headers;
};

// ---------------------------------------------------------------------------
// 1. AUTHENTICATION (Sign Up, Sign In, Sign Out)
// ---------------------------------------------------------------------------

export const signUpWithSupabase = async ({ email, password, name, username }) => {
  if (!isSupabaseConfigured) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      password,
      data: {
        name,
        username,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || "Failed to create account.");
  }

  return {
    id: data.user?.id,
    email: data.user?.email,
    name: data.user?.user_metadata?.name || name,
    username: data.user?.user_metadata?.username || username,
    accessToken: data.access_token,
  };
};

export const signInWithSupabase = async ({ email, password }) => {
  if (!isSupabaseConfigured) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || "Invalid credentials.");
  }

  return {
    id: data.user?.id,
    email: data.user?.email,
    name: data.user?.user_metadata?.name || data.user?.email?.split("@")[0],
    username: data.user?.user_metadata?.username || data.user?.email?.split("@")[0],
    accessToken: data.access_token,
  };
};

// ---------------------------------------------------------------------------
// 2. PORTFOLIO DATABASE OPERATIONS
// ---------------------------------------------------------------------------

/**
 * Fetch a published portfolio by its public slug (accessible to anyone)
 */
export const getSupabasePortfolioBySlug = async (slug) => {
  if (!isSupabaseConfigured || !slug) return null;

  const cleanSlug = encodeURIComponent(slug.toLowerCase().trim());
  const response = await fetch(
    `${supabaseUrl}/rest/v1/${PORTFOLIOS_TABLE}?slug=eq.${cleanSlug}&select=*`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) return null;
  const list = await response.json();
  return list[0] || null;
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
  return response.json();
};

/**
 * Save or update a portfolio in Supabase (upsert)
 */
export const saveSupabasePortfolio = async (portfolio, token = null) => {
  if (!isSupabaseConfigured) return null;

  const row = {
    id: portfolio.id,
    user_id: portfolio.userId,
    slug: portfolio.slug,
    title: portfolio.title,
    is_published: Boolean(portfolio.isPublished),
    published_at: portfolio.publishedAt || null,
    template_id: portfolio.templateId,
    theme_settings: portfolio.themeSettings,
    profile: portfolio.profile,
    skills: portfolio.skills,
    stats: portfolio.stats,
    timeline: portfolio.timeline,
    media: portfolio.media,
    socials: portfolio.socials,
    contact: portfolio.contact,
    discord: portfolio.discord,
    inbox: portfolio.inbox || [],
    analytics: portfolio.analytics || {},
    section_settings: portfolio.sectionSettings,
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
  return result[0];
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
