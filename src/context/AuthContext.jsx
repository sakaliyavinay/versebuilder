import { createContext, useContext, useEffect, useState } from "react";
import { storageService } from "../lib/storageService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Restore session ONLY if one was explicitly saved — never auto-login
    const sessionUser = storageService.getCurrentSession();
    const users = storageService.getUsers();
    setAllUsers(users);

    if (sessionUser) {
      setUser(sessionUser);
    }
    // No default fallback — visitor stays logged out until they sign in
    setLoading(false);
  }, []);

  const signup = async ({ name, email, password, username }) => {
    const newUser = storageService.createUser({ name, email, password, username });
    setUser(newUser);
    storageService.setCurrentSession(newUser);
    setAllUsers(storageService.getUsers());
    return newUser;
  };

  const login = async ({ email, password }) => {
    const authenticated = storageService.authenticateUser({ email, password });
    setUser(authenticated);
    storageService.setCurrentSession(authenticated);
    return authenticated;
  };

  const logout = () => {
    setUser(null);
    storageService.clearCurrentSession();
  };

  const switchUser = (userId) => {
    const targetUser = storageService.getUserById(userId);
    if (targetUser) {
      setUser(targetUser);
      storageService.setCurrentSession(targetUser);
    }
  };

  const refreshUsers = () => {
    setAllUsers(storageService.getUsers());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        allUsers,
        signup,
        login,
        logout,
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
