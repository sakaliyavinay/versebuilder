import { createContext, useContext, useEffect, useState } from "react";
import { storageService } from "../lib/storageService";
import {
  isSupabaseConfigured,
  signUpWithSupabase,
  signInWithSupabase,
  refreshSupabaseSession,
  signOutFromSupabase,
  updateSupabaseProfile,
  updateSupabasePassword,
} from "../lib/supabaseService";

const AuthContext = createContext(null);
const SUPABASE_SESSION_KEY = "versebuilder_supabase_session_v1";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const raw = localStorage.getItem(SUPABASE_SESSION_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.refreshToken) {
              const refreshed = await refreshSupabaseSession(parsed.refreshToken);
              if (!cancelled) {
                if (refreshed?.user && refreshed?.accessToken) {
                  setUser(refreshed.user);
                  setAccessToken(refreshed.accessToken);
                  localStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(refreshed));
                } else {
                  localStorage.removeItem(SUPABASE_SESSION_KEY);
                }
              }
            } else if (parsed?.user && parsed?.accessToken) {
              if (!cancelled) {
                setUser(parsed.user);
                setAccessToken(parsed.accessToken);
              }
            }
          }
        } catch {
          localStorage.removeItem(SUPABASE_SESSION_KEY);
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      // Offline localStorage fallback when Supabase is not configured
      const sessionUser = storageService.getCurrentSession();
      const users = storageService.getUsers();
      if (!cancelled) {
        setAllUsers(users);
        if (sessionUser) {
          setUser(sessionUser);
        }
        setLoading(false);
      }
    };

    initAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const signup = async ({ name, email, password, username }) => {
    if (isSupabaseConfigured) {
      const res = await signUpWithSupabase({ name, email, password, username });
      if (res?.needsEmailConfirmation) {
        return { needsEmailConfirmation: true, email: res.email };
      }
      if (res?.user && res?.accessToken) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        localStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(res));
        return res.user;
      }
      throw new Error("Could not complete signup.");
    }

    const newUser = storageService.createUser({ name, email, password, username });
    setUser(newUser);
    storageService.setCurrentSession(newUser);
    setAllUsers(storageService.getUsers());
    return newUser;
  };

  const login = async ({ email, password }) => {
    if (isSupabaseConfigured) {
      const res = await signInWithSupabase({ email, password });
      if (res?.user && res?.accessToken) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        localStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(res));
        return res.user;
      }
      throw new Error("Invalid login response.");
    }

    const authenticated = storageService.authenticateUser({ email, password });
    setUser(authenticated);
    storageService.setCurrentSession(authenticated);
    return authenticated;
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      signOutFromSupabase(accessToken);
      localStorage.removeItem(SUPABASE_SESSION_KEY);
      setAccessToken(null);
      setUser(null);
      return;
    }

    setUser(null);
    storageService.clearCurrentSession();
  };

  const updateProfile = async ({ name, username, avatar, bio }) => {
    if (!user) throw new Error("Must be logged in to update profile.");

    if (isSupabaseConfigured) {
      const updatedUser = await updateSupabaseProfile(accessToken, { name, username, avatar, bio });
      if (updatedUser) {
        setUser(updatedUser);
        try {
          const raw = localStorage.getItem(SUPABASE_SESSION_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            localStorage.setItem(
              SUPABASE_SESSION_KEY,
              JSON.stringify({ ...parsed, user: updatedUser })
            );
          }
        } catch (err) {
          console.warn("Could not refresh the saved account profile cache:", err);
        }
      }
      return updatedUser;
    }

    const updatedUser = storageService.updateUserProfile(user.id, { name, username, avatar, bio });
    setUser(updatedUser);
    setAllUsers(storageService.getUsers());
    return updatedUser;
  };

  const updatePassword = async (newPassword) => {
    if (!user) throw new Error("Must be logged in to update password.");

    if (isSupabaseConfigured) {
      return await updateSupabasePassword(accessToken, newPassword);
    }

    return storageService.updateUserPassword(user.id, newPassword);
  };

  const switchUser = (userId) => {
    if (isSupabaseConfigured) return;
    const targetUser = storageService.getUserById(userId);
    if (targetUser) {
      setUser(targetUser);
      storageService.setCurrentSession(targetUser);
    }
  };

  const refreshUsers = () => {
    if (isSupabaseConfigured) return;
    setAllUsers(storageService.getUsers());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        allUsers,
        isCloudAuth: isSupabaseConfigured,
        signup,
        login,
        logout,
        updateProfile,
        updatePassword,
        switchUser,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
