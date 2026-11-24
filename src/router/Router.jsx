import { createContext, useContext, useEffect, useState, useCallback } from "react";

const RouterContext = createContext(null);

export const parseLocation = () => {
  const pathname = window.location.pathname || "/";
  const hash = window.location.hash || "";

  // Check hash-based routing first (e.g. #/u/username or #builder/xxx)
  let cleanRoute = pathname;
  if (hash.startsWith("#/")) {
    cleanRoute = hash.substring(1);
  } else if (hash.startsWith("#u/") || hash.startsWith("#p/")) {
    cleanRoute = "/" + hash.substring(1);
  } else if (hash.startsWith("#builder") || hash.startsWith("#dashboard") || hash.startsWith("#login") || hash.startsWith("#signup")) {
    cleanRoute = "/" + hash.substring(1);
  }

  // Parse path
  const segments = cleanRoute.split("/").filter(Boolean);

  // 1. Public portfolio route: /u/:slug or /p/:slug
  if (segments[0] === "u" || segments[0] === "p") {
    return {
      name: "public-portfolio",
      slug: segments[1] || "",
      path: cleanRoute,
    };
  }

  // 2. Builder route: /builder or /builder/:id
  if (segments[0] === "builder") {
    return {
      name: "builder",
      portfolioId: segments[1] || null,
      path: cleanRoute,
    };
  }

  // 3. Dashboard: /dashboard
  if (segments[0] === "dashboard") {
    return {
      name: "dashboard",
      path: cleanRoute,
    };
  }

  // 4. Auth: /login or /signup
  if (segments[0] === "login" || segments[0] === "signup") {
    return {
      name: "auth",
      mode: segments[0],
      path: cleanRoute,
    };
  }

  // 5. Default to landing page
  return {
    name: "landing",
    path: "/",
  };
};

export const AppRouterProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState(parseLocation());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(parseLocation());
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const navigate = useCallback((path) => {
    if (!path) return;

    // Use pushState
    try {
      window.history.pushState({}, "", path);
      setCurrentRoute(parseLocation());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // Fallback for strict environments
      window.location.hash = path.startsWith("/") ? path : `/${path}`;
    }
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useAppRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useAppRouter must be used within an AppRouterProvider");
  }
  return context;
};
